const fs = require("fs");
const path = require("path");
const readline = require("readline");
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
 * lemond manages its own llama.cpp backends: on first model load it downloads the one it picked into its cache -
 * Vulkan for AMD/Intel GPUs, otherwise CPU. Its pick never downloads CUDA, so when it reports an NVIDIA GPU we select
 * CUDA (lemonade-sdk builds per GPU architecture). EMBEDDED_LEMONADE_LLAMACPP_BACKEND forces a backend.
 */
class EmbeddedLemonadeEngine {
  /** @type {import("child_process").ChildProcess|null} */
  static process = null;
  /** @type {Promise<boolean>|null} The install or boot in flight, so concurrent callers share it. */
  static #pending = null;
  /** @type {Promise<void>|null} The stop in flight, so a boot waits for it instead of racing it. */
  static #stopping = null;
  /** @type {string|null} Why the last spawned lemond could not start (eg: EACCES on a noexec volume). */
  static #spawnError = null;
  /** @type {string[]} The last lines lemond and llama-server wrote, so a failure can say why it happened. */
  static #recentOutput = [];
  /** @type {Promise<void>|null} Resolves once the spawned lemond's output streams have closed. */
  static #outputClosed = null;
  /** @type {{state: 'idle'|'installing'|'starting'|'ready'|'error', message: string|null, progress: number|null}} */
  static status = { state: "idle", message: null, progress: null };

  static log(text, ...args) {
    console.log(`\x1b[32m[EmbeddedLemonade]\x1b[0m ${text}`, ...args);
  }

  /** One line of lemond or llama-server output, tagged so it can be filtered with `grep '\[lemond\]'`. */
  static #logEngine(line) {
    console.log(`\x1b[35m[lemond]\x1b[0m ${line}`);
    this.#recentOutput.push(line.trim());
    if (this.#recentOutput.length > 50) this.#recentOutput.shift();
  }

  /**
   * The reason lemond or llama-server gave for its last failure: the error lines among its recent output, otherwise
   * its last line. llama.cpp ends a failed load with a generic line (eg: "exiting due to model loading error") after
   * the line that says why, so error lines are preferred over the last line.
   * @returns {string|null}
   */
  static failureReason() {
    const errors = this.#recentOutput.filter((line) =>
      /error|fail|out of memory|abort|not found|denied/i.test(line)
    );
    if (errors.length) return errors.slice(-3).join(" | ");
    return this.#recentOutput.at(-1) ?? null;
  }

  /**
   * Boots the engine, throwing why it could not start (eg: the download failed, lemond crashed) instead of a generic
   * error, so chats, agents and downloads can show it.
   * @returns {Promise<void>}
   */
  static async ensureRunning() {
    if (await this.bootOrContinue()) return;
    if (!isEnabled())
      throw new Error("The built-in LLM engine is not enabled.");
    throw new Error(
      `The built-in LLM engine could not be started: ${this.status.message ?? "unknown error"}`
    );
  }

  /**
   * Explains a request to lemond that failed without a response (eg: the connection was refused or reset).
   * When lemond is no longer running, it crashed - its output says why.
   * @param {Error} error - the fetch error
   * @returns {Promise<Error>}
   */
  static async connectionError(error) {
    if (await this.isRunning()) return error;
    const reason = this.failureReason();
    return new Error(
      `The built-in LLM engine stopped unexpectedly${reason ? `: ${reason}` : "."} Check the container logs for [lemond] lines.`
    );
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
    if (this.#stopping) await this.#stopping;
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
          await this.#preferCuda();
          this.#setStatus("ready");
          return true;
        }
        if (!this.process) {
          if (this.#spawnError) throw new Error(this.#spawnError);
          // exit can fire before the last output is read - wait for it, but not forever.
          await Promise.race([
            this.#outputClosed,
            new Promise((r) => setTimeout(r, 1_000)),
          ]);
          const reason = this.failureReason();
          throw new Error(
            `lemond exited while starting up${reason ? `: ${reason}` : "."}`
          );
        }
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

  /**
   * lemond's "auto" llama.cpp backend only picks CUDA once CUDA is already installed - otherwise it picks Vulkan, which
   * in a container without NVIDIA's Vulkan driver (eg: Docker Desktop) runs on Mesa's CPU renderer. So when lemond
   * sees an NVIDIA GPU that CUDA supports, select CUDA so the first model load downloads it.
   * Skipped when EMBEDDED_LEMONADE_LLAMACPP_BACKEND forces a backend. Never throws - lemond keeps its own pick.
   */
  static async #preferCuda() {
    if (process.env.EMBEDDED_LEMONADE_LLAMACPP_BACKEND) return;
    try {
      const info = await fetch(`${this.baseUrl}/api/v1/system-info`).then(
        (res) => res.json()
      );
      const hasNvidiaGpu = !!info?.devices?.nvidia_gpu?.some(
        (gpu) => gpu.available
      );
      const cudaState = info?.recipes?.llamacpp?.backends?.cuda?.state;
      if (!hasNvidiaGpu || !["installed", "installable"].includes(cudaState))
        return;

      const response = await fetch(`${this.baseUrl}/internal/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ llamacpp: { backend: "cuda" } }),
      });
      if (!response.ok) throw new Error(`lemond returned ${response.status}`);
      this.log("NVIDIA GPU found - using the CUDA llama.cpp backend.");
    } catch (e) {
      this.log(`Could not select the CUDA backend: ${e.message}`);
    }
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
      // Its own process group, so stopping lemond also stops the llama.cpp backends it started.
      { stdio: ["ignore", "pipe", "pipe"], detached: true }
    );
    this.process = child;
    this.#spawnError = null;
    this.#recentOutput = [];
    this.#outputClosed = new Promise((resolve) => child.once("close", resolve));
    this.log(`lemond started on port ${port()}. PID ${child.pid}.`);

    // Without a listener a failed spawn (missing or non-executable binary) is an uncaught error that exits the server.
    child.on("error", (error) => {
      this.log(`lemond could not be started: ${error.message}`);
      if (this.process !== child) return;
      this.#spawnError = `The local LLM engine could not be started: ${error.message}`;
      this.process = null;
    });

    // llama.cpp logs to stderr even when nothing is wrong, so both streams share one tag.
    for (const stream of [child.stdout, child.stderr])
      readline
        .createInterface({ input: stream })
        .on("line", (line) => line.trim() && this.#logEngine(line));

    child.on("exit", (code, signal) => {
      this.log(`lemond ${child.pid} exited. Code ${code}. Signal ${signal}.`);
      if (this.process === child) {
        this.process = null;
        this.#setStatus("idle");
      }
    });
  }

  /**
   * Sends a signal to lemond and the llama.cpp backends it started (its process group).
   * @param {import("child_process").ChildProcess} child
   * @param {NodeJS.Signals} signal
   */
  static #signal(child, signal) {
    try {
      process.kill(-child.pid, signal);
    } catch {
      child.kill(signal);
    }
  }

  /**
   * Stops lemond and its llama.cpp backends right away. Used on server exit and before a respawn.
   */
  static kill() {
    if (!this.process) return;
    this.#signal(this.process, "SIGKILL");
    this.process = null;
    this.#setStatus("idle");
  }

  /**
   * Unloads every model and stops lemond so its RAM and VRAM are freed - eg: when the system LLM moves to another
   * provider. A workspace or agent still set to this provider boots it again on its next request.
   */
  static stop() {
    if (!this.#stopping)
      this.#stopping = this.#stop().finally(() => (this.#stopping = null));
    return this.#stopping;
  }

  static async #stop() {
    const child = this.process;
    if (!child) return;
    this.log("Stopping lemond and unloading all models.");
    await fetch(`${this.baseUrl}/api/v1/unload`, {
      method: "POST",
      signal: AbortSignal.timeout(5_000),
    }).catch(() => null);

    const exited = new Promise((resolve) => {
      if (child.exitCode !== null || child.signalCode !== null)
        return resolve();
      child.once("exit", resolve);
    });
    this.#signal(child, "SIGTERM");
    const timeout = new Promise((resolve) => setTimeout(resolve, 5_000));
    await Promise.race([exited, timeout]);
    this.#signal(child, "SIGKILL"); // Anything that ignored SIGTERM.

    if (this.process === child) {
      this.process = null;
      this.#setStatus("idle");
    }
  }
}

process.on("exit", () => EmbeddedLemonadeEngine.kill());

module.exports = { EmbeddedLemonadeEngine };
