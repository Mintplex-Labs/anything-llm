const fs = require("fs");
const path = require("path");
const { spawn, execFile } = require("child_process");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const {
  LEMOND_VERSION,
  LLAMACPP_VERSION,
  CDN_BASE,
  lemondPlatform,
  isEnabled,
  port,
  paths,
} = require("./config");

/**
 * Installs and runs the embedded lemond server inside this process' container.
 * - Downloads the pinned lemond build into STORAGE_DIR on first boot (or when the pin changes).
 * - Pins the llama.cpp release lemond downloads for its cpu/vulkan backends.
 * - Spawns lemond on 127.0.0.1 only - it is never exposed outside the container.
 *
 * lemond manages its own llama.cpp backends: on first model load it downloads the best one it can use into its
 * cache - CUDA for NVIDIA GPUs (lemonade-sdk builds per GPU architecture), Vulkan for AMD/Intel GPUs, otherwise CPU.
 * EMBEDDED_LEMONADE_LLAMACPP_BACKEND forces a backend.
 */
class EmbeddedLemonadeEngine {
  /** @type {import("child_process").ChildProcess|null} */
  static process = null;
  /** @type {Promise<boolean>|null} The install or boot in flight, so concurrent callers share it. */
  static #pending = null;
  /** @type {{state: 'idle'|'installing'|'starting'|'ready'|'error', message: string|null, progress: number|null}} */
  static status = { state: "idle", message: null, progress: null };

  static log(text, ...args) {
    console.log(`\x1b[32m[EmbeddedLemonade]\x1b[0m ${text}`, ...args);
  }

  static #setStatus(state, message = null, progress = null) {
    this.status = { state, message, progress };
  }

  static get baseUrl() {
    return `http://127.0.0.1:${port()}`;
  }

  static get binPath() {
    return path.join(paths().lemond, "lemond");
  }

  /** Whether the lemond HTTP API is up. */
  static async isRunning() {
    return await fetch(`${this.baseUrl}/api/v1/health`)
      .then((res) => res.ok)
      .catch(() => false);
  }

  /**
   * Installs lemond if needed, starts it if it is not running, and waits for its API.
   * @returns {Promise<boolean>} True if lemond is reachable.
   */
  static async bootOrContinue() {
    if (!isEnabled()) return false;
    if (await this.isRunning()) return true;
    if (!this.#pending)
      this.#pending = this.#boot().finally(() => (this.#pending = null));
    return await this.#pending;
  }

  /**
   * Called once at server boot so a fresh container downloads the engine while the user is onboarding.
   * Never throws - a failed install is retried on the next bootOrContinue.
   */
  static prepareInBackground() {
    if (!isEnabled()) return;
    this.bootOrContinue().catch((e) =>
      this.log(`Background boot failed: ${e.message}`)
    );
  }

  static async #boot() {
    try {
      await this.#install();
      this.#writeConfig();
      this.#pinLlamaCpp();
      this.#spawn();

      this.#setStatus("starting", "Starting the local LLM engine...");
      for (let attempt = 0; attempt < 60; attempt++) {
        if (await this.isRunning()) {
          this.#setStatus("ready");
          return true;
        }
        if (!this.process) break; // exited during startup
        await new Promise((r) => setTimeout(r, 500));
      }
      throw new Error("lemond did not come online after starting.");
    } catch (e) {
      this.log(`Boot failed: ${e.message}`);
      this.#setStatus("error", e.message);
      return false;
    }
  }

  /** Downloads and unpacks the pinned lemond build unless it is already installed. */
  static async #install() {
    const { lemond: dest } = paths();
    const marker = path.join(dest, ".lemond-version");
    if (
      fs.existsSync(this.binPath) &&
      fs.existsSync(marker) &&
      fs.readFileSync(marker, "utf8").trim() === LEMOND_VERSION
    )
      return;

    const archive = `lemond-${LEMOND_VERSION}-${lemondPlatform()}.tar.gz`;
    const staging = `${dest}.new`;
    fs.rmSync(staging, { recursive: true, force: true });
    fs.mkdirSync(staging, { recursive: true });

    this.log(`Downloading lemond v${LEMOND_VERSION} (${lemondPlatform()})...`);
    this.#setStatus("installing", "Downloading the local LLM engine...", 0);
    const archivePath = path.join(staging, archive);
    await this.#download(`${CDN_BASE}/${archive}`, archivePath);

    // The archive has a single top-level folder - strip it so lemond lands directly in the engine dir.
    await new Promise((resolve, reject) =>
      execFile(
        "tar",
        ["-xzf", archivePath, "-C", staging, "--strip-components=1"],
        (error) => (error ? reject(error) : resolve())
      )
    );
    fs.rmSync(archivePath, { force: true });
    if (!fs.existsSync(path.join(staging, "lemond")))
      throw new Error(`${archive} did not contain a lemond executable.`);
    fs.chmodSync(path.join(staging, "lemond"), 0o755);
    fs.writeFileSync(path.join(staging, ".lemond-version"), LEMOND_VERSION);

    // Swap the new engine in, keeping the old one until the new one is in place.
    const old = `${dest}.old`;
    fs.rmSync(old, { recursive: true, force: true });
    if (fs.existsSync(dest)) fs.renameSync(dest, old);
    try {
      fs.renameSync(staging, dest);
    } catch (e) {
      if (fs.existsSync(old)) fs.renameSync(old, dest);
      throw e;
    }
    fs.rmSync(old, { recursive: true, force: true });
    this.log(`lemond v${LEMOND_VERSION} installed.`);
  }

  static async #download(url, destination) {
    const response = await fetch(url);
    if (!response.ok || !response.body)
      throw new Error(`Download of ${url} failed: ${response.status}`);
    const total = Number(response.headers.get("content-length")) || 0;
    let received = 0;
    const body = Readable.fromWeb(response.body);
    body.on("data", (chunk) => {
      received += chunk.length;
      if (total) this.status.progress = Math.floor((received / total) * 100);
    });
    await pipeline(body, fs.createWriteStream(destination));
  }

  /**
   * lemond only reads these from config.json, so merge them in before every boot. Anything else in config.json is
   * left as lemond wrote it - it fills missing keys from its own defaults.
   */
  static #writeConfig() {
    const { config: configDir, cache, models } = paths();
    for (const folder of [configDir, cache, models])
      fs.mkdirSync(folder, { recursive: true });

    const configPath = path.join(configDir, "config.json");
    let config = {};
    try {
      if (fs.existsSync(configPath))
        config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (e) {
      this.log(`Could not parse ${configPath} - rewriting it. ${e.message}`);
    }

    config.models_dir = models;
    // lemond downloads and manages its own llama.cpp backends.
    config.no_fetch_executables = false;
    // Show every model, not only the ones lemond thinks fit in this machine's memory - the user picks what to run.
    config.disable_model_filtering = true;
    // Never pick up a llama.cpp that happens to be on the system.
    config.llamacpp = { ...config.llamacpp, prefer_system: false };
    if (process.env.EMBEDDED_LEMONADE_LLAMACPP_BACKEND)
      config.llamacpp.backend = process.env.EMBEDDED_LEMONADE_LLAMACPP_BACKEND;
    else delete config.llamacpp.backend;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  /** Points lemond's cpu/vulkan llama.cpp downloads at our pinned release. */
  static #pinLlamaCpp() {
    const file = path.join(
      paths().lemond,
      "resources",
      "backend_versions.json"
    );
    try {
      const versions = JSON.parse(fs.readFileSync(file, "utf8"));
      versions.llamacpp = {
        ...versions.llamacpp,
        cpu: LLAMACPP_VERSION,
        vulkan: LLAMACPP_VERSION,
      };
      fs.writeFileSync(file, JSON.stringify(versions, null, 2));
    } catch (e) {
      this.log(`Could not pin llama.cpp in ${file}: ${e.message}`);
    }
  }

  static #spawn() {
    if (this.process) this.kill();
    const { cache, config } = paths();
    const child = spawn(
      this.binPath,
      [
        cache,
        config,
        "--port",
        String(port()),
        "--host",
        "127.0.0.1",
        "--no-broadcast",
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );
    this.process = child;
    this.log(`lemond started on port ${port()}. PID ${child.pid}.`);

    if (process.env.NODE_ENV === "development") {
      child.stdout.on("data", (d) => this.log(`[stdout] ${d}`));
      child.stderr.on("data", (d) => this.log(`[stderr] ${d}`));
    } else {
      child.stdout.resume();
      child.stderr.resume();
    }

    child.on("exit", (code, signal) => {
      this.log(`lemond ${child.pid} exited. Code ${code}. Signal ${signal}.`);
      if (this.process === child) {
        this.process = null;
        this.#setStatus("idle");
      }
    });
  }

  /**
   * Stops lemond. Only called on server exit (the container goes down with it) or before a respawn, so the
   * llama.cpp backends lemond started are not tracked separately.
   */
  static kill() {
    if (!this.process) return;
    this.process.kill();
    this.process = null;
    this.#setStatus("idle");
  }
}

process.on("exit", () => EmbeddedLemonadeEngine.kill());

module.exports = { EmbeddedLemonadeEngine };
