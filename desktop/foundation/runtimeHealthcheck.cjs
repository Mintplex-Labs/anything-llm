const http = require("http");
const https = require("https");

const TRUSTED_DESKTOP_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
const DEFAULT_RUNTIME_TIMEOUT_MS = 2500;

function normalizeTrustedHost(hostname = "") {
  return String(hostname || "")
    .trim()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .toLowerCase();
}

function parseDesktopStartUrl(targetUrl) {
  const trimmed = String(targetUrl || "").trim();
  if (!trimmed) {
    return {
      ok: false,
      reason: "invalid_start_url",
      message:
        "SWARMSY_DESKTOP_START_URL must be a valid local http(s) URL. Received an empty value.",
    };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      ok: false,
      reason: "invalid_start_url",
      message: `SWARMSY_DESKTOP_START_URL is malformed: "${trimmed}".`,
    };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      reason: "unsupported_protocol",
      message: `SWARMSY_DESKTOP_START_URL only supports http(s). Received "${parsed.protocol}".`,
    };
  }

  if (!TRUSTED_DESKTOP_HOSTS.has(normalizeTrustedHost(parsed.hostname))) {
    return {
      ok: false,
      reason: "untrusted_host",
      message: `SWARMSY Desktop only trusts local runtime hosts (localhost, 127.0.0.1, ::1). Received "${parsed.hostname}".`,
    };
  }

  return {
    ok: true,
    parsed,
    startUrl: parsed.toString(),
    origin: parsed.origin,
  };
}

function isTrustedDesktopOrigin(targetUrl) {
  return parseDesktopStartUrl(targetUrl).ok;
}

function probeRuntimeReachability(startUrl, { timeoutMs = DEFAULT_RUNTIME_TIMEOUT_MS } = {}) {
  const parsedResult = parseDesktopStartUrl(startUrl);

  if (!parsedResult.ok) {
    return Promise.resolve({
      ok: false,
      reason: parsedResult.reason || "invalid_start_url",
      message: parsedResult.message,
      error: new Error(parsedResult.message),
    });
  }

  const { parsed } = parsedResult;
  const transport = parsed.protocol === "https:" ? https : http;

  return new Promise((resolve) => {
    const request = transport.request(
      parsed,
      {
        method: "GET",
        timeout: timeoutMs,
        headers: {
          Accept: "text/html,application/json,*/*",
        },
      },
      (response) => {
        response.resume();
        resolve({ ok: true, statusCode: response.statusCode ?? null });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("Request timed out"));
    });

    request.on("error", (error) => {
      resolve({ ok: false, error });
    });

    request.end();
  });
}

async function runDesktopRuntimeHealthcheck({
  startUrl,
  timeoutMs = DEFAULT_RUNTIME_TIMEOUT_MS,
  probeImpl = probeRuntimeReachability,
} = {}) {
  const parsedResult = parseDesktopStartUrl(startUrl);
  if (!parsedResult.ok) {
    return {
      ok: false,
      reason: parsedResult.reason,
      message: parsedResult.message,
      startUrl: String(startUrl || "").trim(),
    };
  }

  try {
    const probe = await probeImpl(parsedResult.startUrl, { timeoutMs });
    if (!probe?.ok) {
      return {
        ok: false,
        reason: "runtime_unreachable",
        message: `SWARMSY local runtime is not reachable at ${parsedResult.origin}.`,
        startUrl: parsedResult.startUrl,
        origin: parsedResult.origin,
      };
    }
  } catch {
    return {
      ok: false,
      reason: "runtime_unreachable",
      message: `SWARMSY local runtime is not reachable at ${parsedResult.origin}.`,
      startUrl: parsedResult.startUrl,
      origin: parsedResult.origin,
    };
  }

  return {
    ok: true,
    startUrl: parsedResult.startUrl,
    origin: parsedResult.origin,
    mode: "desktop_local_runtime",
  };
}

module.exports = {
  TRUSTED_DESKTOP_HOSTS,
  DEFAULT_RUNTIME_TIMEOUT_MS,
  normalizeTrustedHost,
  parseDesktopStartUrl,
  isTrustedDesktopOrigin,
  probeRuntimeReachability,
  runDesktopRuntimeHealthcheck,
};
