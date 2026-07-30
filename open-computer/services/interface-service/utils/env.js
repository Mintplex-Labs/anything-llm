const fs = require("fs");
const path = require("path");

const QEMU_HOST_GATEWAY = "10.0.2.2";

// Default location of the per-agent .env inside the VM. The open-computer CLI scp's
// agents/<name>/.env here on boot so each agent VM can deterministically
// override values from the service-level .env.
const DEFAULT_AGENT_ENV = "/home/agent/agent.env";

function parseEnvFile(envPath) {
  const entries = [];
  if (!fs.existsSync(envPath)) return entries;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) entries.push([key, val]);
  }
  return entries;
}

// Load the service-level .env. Only fills keys that are not already set in the
// environment (so explicitly exported env vars / systemd Environment= win).
// Returns { path, keys } where `keys` is the set of keys this call populated,
// so a later agent .env can override exactly those without clobbering values
// that were set externally.
function loadDotEnv(serviceRoot) {
  const envPath = path.join(serviceRoot, ".env");
  const exists = fs.existsSync(envPath);
  const keys = new Set();
  for (const [key, val] of parseEnvFile(envPath)) {
    if (process.env[key] === undefined) {
      process.env[key] = val;
      keys.add(key);
    }
  }
  return { path: exists ? envPath : null, keys };
}

// Load a per-agent .env on top of the service .env. Values for keys that came
// from the service .env are overridden; brand-new keys are filled. Values that
// were set externally (e.g. by systemd) are respected and never clobbered,
// so agent .env cannot break VM-critical vars like PORT.
function loadAgentEnv(envPath, serviceKeys) {
  const resolved = envPath || process.env.OPEN_COMPUTER_AGENT_ENV || DEFAULT_AGENT_ENV;
  const entries = parseEnvFile(resolved);
  if (!entries.length && !fs.existsSync(resolved)) return null;
  for (const [key, val] of entries) {
    if (serviceKeys && serviceKeys.has(key)) {
      process.env[key] = val;
    } else if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
  return resolved;
}

function envFlag(name) {
  return ["1", "true", "yes", "on"].includes(
    String(process.env[name] || "").toLowerCase(),
  );
}

function normalizeBaseUrl(url) {
  if (!url) return "";
  let u = url.replace(/\/+$/, "");
  if (!u.endsWith("/v1")) u += "/v1";
  return u;
}

function resolveBaseUrlForGuest(url) {
  if (!url) return "";
  return normalizeBaseUrl(url).replace(
    /localhost|127\.0\.0\.1/g,
    QEMU_HOST_GATEWAY,
  );
}

module.exports = {
  DEFAULT_AGENT_ENV,
  QEMU_HOST_GATEWAY,
  envFlag,
  loadAgentEnv,
  loadDotEnv,
  normalizeBaseUrl,
  resolveBaseUrlForGuest,
};
