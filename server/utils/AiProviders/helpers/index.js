/**
 * Build a fetch implementation that bounds both response-headers and
 * body-chunk wait times to the resolved timeout in ms. This replaces the
 * default node-fetch + agentkeepalive stack used by the OpenAI SDK,
 * sidestepping the hardcoded 5-minute socket-idle timeout that surfaces as
 * "Socket timeout" (`ERR_SOCKET_TIMEOUT`) on slow local models.
 *
 * Resolution order:
 *   1. Valid positive integer in `rawTimeoutValue` → use it.
 *   2. Invalid `rawTimeoutValue` → log via `providerSlog`, fall through.
 *   3. `fallbackTimeoutValue` if provided → use it.
 *   4. Otherwise → return the global `fetch` unchanged (no timeout applied).
 *
 * When a timeout is resolved, the returned wrapper injects an
 * `undici.Agent({ headersTimeout, bodyTimeout })` as the request dispatcher —
 * `headersTimeout` covers the wait for non-streaming model responses,
 * `bodyTimeout` covers gaps between streamed chunks.
 *
 * Note: when used with the OpenAI SDK, fetch errors (including timeouts) are
 * still subject to the SDK's retry layer (`maxRetries: 2` by default), so a
 * timeout-aborted attempt can be retried up to twice before surfacing. Pair
 * with `maxRetries: 0` on the client constructor if the configured value
 * should be the hard wall-clock ceiling.
 *
 * @param {string|number|undefined|null} rawTimeoutValue - typically `process.env.<PROVIDER>_RESPONSE_TIMEOUT`.
 * @param {(text: string, ...args: any[]) => void} providerSlog - static logger used to surface parse/setup failures.
 * @param {number} [fallbackTimeoutValue] - millisecond integer used when `rawTimeoutValue` is missing or fails to parse. Omit to skip the fallback. Not validated — callers are expected to pass a positive integer.
 * @returns {typeof fetch} either the global `fetch` (no timeout applied) or a wrapped fetch with headers + body timeouts.
 */
function getFetchWithCustomTimeout(
  rawTimeoutValue,
  providerSlog,
  fallbackTimeoutValue
) {
  let timeout;
  if (!!rawTimeoutValue) {
    try {
      const v = Number(rawTimeoutValue);
      if (!Number.isInteger(v) || v <= 0) {
        throw new Error("Timeout value must be a positive integer");
      }
      timeout = v;
    } catch (error) {
      providerSlog("Error parsing response timeout value", error);
    }
  }

  if (!timeout && fallbackTimeoutValue) {
    timeout = fallbackTimeoutValue;
  }

  if (!timeout) {
    providerSlog(
      "No custom response timeout provided, falling back to default fetch"
    );
    return fetch;
  }

  try {
    const { Agent } = require("undici");
    const moment = require("moment");

    const agent = new Agent({
      headersTimeout: timeout,
      bodyTimeout: timeout,
    });

    const customFetch = (input, init = {}) => {
      return fetch(input, {
        ...init,
        dispatcher: agent,
      });
    };

    const humanDiff = moment.duration(timeout).humanize();
    providerSlog(`Applying custom fetch w/timeout of ${humanDiff}.`);
    return customFetch;
  } catch (error) {
    providerSlog("Error applying custom fetch - using default fetch", error);
    return fetch;
  }
}

module.exports = {
  getFetchWithCustomTimeout,
};
