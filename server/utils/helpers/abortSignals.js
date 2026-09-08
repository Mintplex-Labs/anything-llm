/**
 * Request cancellation shared by the agent and chat flows.
 *
 * When a user stops a generation we want the provider to stop generating, not just
 * for us to stop listening - otherwise tokens keep being produced (and billed) for
 * a response nobody will read. Rather than threading a `signal` through every
 * provider call site, an abort signal is bound once to the SDK client and rides
 * along with every request it makes.
 */

/**
 * SDK clients whose request methods have already been bound to an abort signal -
 * binding is per-client and must only happen once, but the attach helpers may be
 * called repeatedly (ex: before every agent turn).
 * @type {WeakSet<object>}
 */
const ABORT_BOUND_CLIENTS = new WeakSet();

/**
 * The request funnels every SDK we use routes completions through, as property
 * paths on the client. Binding these is what makes an abort tear down in-flight
 * LLM requests.
 * @type {string[][]}
 */
const ABORTABLE_REQUEST_METHODS = [
  ["chat", "completions", "create"], // OpenAI-compatible SDKs
  ["responses", "create"], // OpenAI Responses API
  ["messages", "create"], // Anthropic SDK
];

/**
 * Combine abort signals so any one of them firing aborts the request.
 * `AbortSignal.any` is not available on the oldest Node we support, and returning
 * the lone signal as-is keeps us from registering listeners in the common case.
 * @param {Array<AbortSignal|null|undefined>} signals
 * @returns {AbortSignal|undefined}
 */
function combineAbortSignals(signals = []) {
  const present = signals.filter(Boolean);
  if (present.length < 2) return present[0] ?? undefined;

  const controller = new AbortController();
  const abort = () => controller.abort();
  if (present.some((signal) => signal.aborted)) abort();
  else
    present.forEach((signal) =>
      signal.addEventListener("abort", abort, { once: true })
    );
  return controller.signal;
}

/**
 * Whether an object exposes one of the SDK request funnels we know how to bind.
 * @param {object} client
 * @returns {boolean}
 */
function hasAbortableRequestMethod(client) {
  return ABORTABLE_REQUEST_METHODS.some((path) => {
    const method = path[path.length - 1];
    const resource = path
      .slice(0, -1)
      .reduce((parent, key) => parent?.[key], client);
    return typeof resource?.[method] === "function";
  });
}

/**
 * Whether an object is an SDK client that only takes cancellation at the fetch
 * layer (ex: the Ollama SDK, which exposes `chat()` and a swappable `fetch`).
 * @param {object} client
 * @returns {boolean}
 */
function isFetchBackedClient(client) {
  return (
    typeof client.fetch === "function" && typeof client.chat === "function"
  );
}

/**
 * Wraps a client's request methods so the holder's abort signal rides along with
 * every call it makes. Prefers the SDK's own request options - OpenAI/Anthropic
 * clients only skip their retry logic and throw `APIUserAbortError` when the
 * signal arrives that way. SDKs without request options (ex: Ollama) are bound at
 * the fetch layer instead, which also cancels requests still waiting on response
 * headers (ex: while a local model loads).
 *
 * Reads `signalHolder.abortSignal` at call time, so re-attaching a new signal to
 * the holder needs no re-binding.
 * @param {{abortSignal: AbortSignal|null}} signalHolder - Agent provider or LLM connector holding the signal.
 * @param {object} client
 */
function bindAbortSignal(signalHolder, client) {
  if (!client || ABORT_BOUND_CLIENTS.has(client)) return;
  ABORT_BOUND_CLIENTS.add(client);

  let boundRequestMethod = false;
  for (const path of ABORTABLE_REQUEST_METHODS) {
    const method = path[path.length - 1];
    const resource = path
      .slice(0, -1)
      .reduce((parent, key) => parent?.[key], client);
    if (typeof resource?.[method] !== "function") continue;

    const request = resource[method].bind(resource);
    resource[method] = (body, options = {}) =>
      request(body, {
        ...options,
        signal: combineAbortSignals([
          options?.signal,
          signalHolder.abortSignal,
        ]),
      });
    boundRequestMethod = true;
  }
  if (boundRequestMethod || typeof client.fetch !== "function") return;

  const clientFetch = client.fetch.bind(client);
  client.fetch = (input, init = {}) =>
    clientFetch(input, {
      ...init,
      signal: combineAbortSignals([init?.signal, signalHolder.abortSignal]),
    });
}

/**
 * Bind an abort signal to every SDK client held by an LLM connector or agent
 * provider. Connectors keep their client on a differently named property per
 * provider (`openai`, `anthropic`, `lmstudio`, `client`, ...), so clients are
 * found by shape instead of by name and new connectors are covered for free.
 * @param {object} target - The connector/provider to bind.
 * @param {AbortSignal|null} signal
 * @returns {object} The same target, for chaining.
 */
function attachAbortSignal(target, signal = null) {
  if (!target || !signal) return target;
  target.abortSignal = signal;
  Object.values(target).forEach((value) => {
    if (!value || typeof value !== "object") return;
    if (!hasAbortableRequestMethod(value) && !isFetchBackedClient(value))
      return;
    bindAbortSignal(target, value);
  });
  return target;
}

/**
 * Cancel a connector's in-flight LLM requests as soon as the client goes away -
 * stop button, tab close, or a dropped connection. Without this the provider
 * keeps generating a response that can no longer be delivered.
 * @param {import("express").Response} response
 * @param {object} connector - The LLM connector handling this request.
 * @returns {object} The same connector, for chaining.
 */
function abortConnectorOnClientDisconnect(response, connector) {
  // Not every caller hands us a real express response (ex: a passthrough or a
  // test double) - without a close event there is nothing to cancel on.
  if (!connector || typeof response?.on !== "function") return connector;
  const controller = new AbortController();
  response.on("close", () => controller.abort());
  return attachAbortSignal(connector, controller.signal);
}

/**
 * Whether an error is a cancellation rather than a real failure. SDK abort errors
 * do not set `name`, so they are matched by class name; fetch/undici cancellation
 * surfaces as a `DOMException` named `AbortError`.
 * @param {Error|null} error
 * @returns {boolean}
 */
function isAbortError(error) {
  if (!error) return false;
  return (
    error.name === "AbortError" ||
    error.constructor?.name === "APIUserAbortError"
  );
}

module.exports = {
  combineAbortSignals,
  bindAbortSignal,
  attachAbortSignal,
  abortConnectorOnClientDisconnect,
  isAbortError,
};
