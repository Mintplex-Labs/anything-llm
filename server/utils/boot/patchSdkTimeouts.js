const LOG_PREFIX = "\x1b[36m[SDK Timeout Patch]\x1b[0m";
const DEFAULT_TIMEOUT_MS = 600_000; // 10 minutes default
const DEFAULT_MAX_RETRIES = 0;

/**
 * Raises undici's global dispatcher timeouts from the 5-minute default to
 * at least 10 minutes for the 80% use case so
 * the transport layer doesn't kill connections before the SDK does.
 *
 * When `ANYTHINGLLM_FETCH_TIMEOUT` is set (milliseconds), both the undici
 * dispatcher and the SDK-level AbortController deadline are raised to that
 * value instead — for users with slow local models that need even longer.
 *
 * Must be called before any provider module is required.
 */
function patchSdkTimeouts() {
  const envDefinedTimeout = process.env.ANYTHINGLLM_FETCH_TIMEOUT;
  const envDefinedMaxRetries = process.env.ANYTHINGLLM_MAX_RETRIES;
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  let maxRetries = DEFAULT_MAX_RETRIES;

  if (envDefinedTimeout) {
    const parsed = parseInt(envDefinedTimeout, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      console.warn(
        `${LOG_PREFIX} ANYTHINGLLM_FETCH_TIMEOUT="${envDefinedTimeout}" is not a valid positive integer — using default ${DEFAULT_TIMEOUT_MS}ms.`
      );
    } else {
      timeoutMs = parsed;
    }
  }

  if (envDefinedMaxRetries) {
    const parsed = parseInt(envDefinedMaxRetries, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      console.warn(
        `${LOG_PREFIX} ANYTHINGLLM_MAX_RETRIES="${envDefinedMaxRetries}" is not a valid non-negative integer — using default ${DEFAULT_MAX_RETRIES}.`
      );
    } else {
      maxRetries = parsed;
    }
  }

  const humanSecs = `${(timeoutMs / 1000).toFixed(0)}s`;
  try {
    const { Agent, setGlobalDispatcher } = require("undici");
    setGlobalDispatcher(
      new Agent({ headersTimeout: timeoutMs, bodyTimeout: timeoutMs })
    );
    console.log(
      `${LOG_PREFIX} undici global dispatcher — headersTimeout & bodyTimeout ${humanSecs}`
    );
  } catch {
    console.warn(
      `${LOG_PREFIX} undici not available — transport-level timeout not patched.`
    );
  }

  for (const [pkg, label] of [
    ["openai", "OpenAI"],
    ["@anthropic-ai/sdk", "Anthropic"],
  ]) {
    try {
      const SDK = require(pkg);
      const ClientClass = SDK.default ?? SDK[label] ?? SDK;
      let proto = ClientClass?.prototype;
      while (proto && typeof proto.buildRequest !== "function") {
        proto = Object.getPrototypeOf(proto);
      }
      if (!proto) continue;

      const origBuild = proto.buildRequest;
      proto.buildRequest = function patchedBuildRequest(options, ...rest) {
        if (!options.timeout) options.timeout = timeoutMs;
        return origBuild.call(this, options, ...rest);
      };

      if (typeof proto.makeRequest === "function") {
        const origMakeRequest = proto.makeRequest;
        proto.makeRequest = function patchedMakeRequest(
          optionsInput,
          // eslint-disable-next-line
          retriesRemaining
        ) {
          return origMakeRequest.call(this, optionsInput, maxRetries);
        };
      }

      console.log(
        `${LOG_PREFIX} ${label} SDK — timeout ${humanSecs}, maxRetries ${maxRetries}`
      );
    } catch {
      // SDK not installed
    }
  }
}

module.exports = patchSdkTimeouts;
