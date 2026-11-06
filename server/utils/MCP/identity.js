const { AsyncLocalStorage } = require("async_hooks");

/**
 * Forwards the calling AnythingLLM user and/or workspace to MCP servers that
 * opt in via `anythingllm.forwardIdentity` in the MCP config file:
 *
 *   "anythingllm": { "forwardIdentity": true }                  // user + workspace
 *   "anythingllm": { "forwardIdentity": ["workspace"] }         // only these scopes
 *
 * Identity is sent on every request made for an agent session (tools/list and
 * tools/call) in two places:
 * - HTTP servers (sse/streamable): `X-AnythingLLM-*` headers.
 * - All servers (incl. stdio): `params._meta["com.anythingllm/identity"]`.
 *
 * The "user" scope sends the user's id, username and role (multi-user only).
 * Values are omitted when unavailable - e.g. single-user mode has no user.
 * The `X-AnythingLLM-` header prefix is reserved: static config headers using
 * it are dropped so they can never pose as a forwarded identity.
 *
 * MCP clients are shared across the whole instance, so per-request headers are
 * injected by a custom `fetch` reading an AsyncLocalStorage context set around
 * each MCP call.
 */

const IDENTITY_SCOPES = ["user", "workspace"];
const RESERVED_HEADER_PREFIX = "x-anythingllm-";
const IDENTITY_META_KEY = "com.anythingllm/identity";

/** @type {AsyncLocalStorage<{headers: Record<string, string>}>} */
const requestIdentity = new AsyncLocalStorage();

/** @type {WeakMap<object, Promise<{username: string, role: string}|null>>} */
const userCache = new WeakMap();

/**
 * @param {boolean|string[]|undefined} value - `anythingllm.forwardIdentity`
 * @returns {("user"|"workspace")[]}
 */
function forwardIdentityScopes(value) {
  if (value === true) return [...IDENTITY_SCOPES];
  if (!Array.isArray(value)) return [];
  return IDENTITY_SCOPES.filter((scope) => value.includes(scope));
}

/**
 * Only looked up when the user scope is forwarded. Cached per agent session.
 * @param {object} aibitat
 * @param {number} userId
 * @returns {Promise<{username: string, role: string}|null>}
 */
function lookupUser(aibitat, userId) {
  if (!userCache.has(aibitat)) {
    const { User } = require("../../models/user");
    userCache.set(
      aibitat,
      User.get({ id: userId })
        .then((user) =>
          user ? { username: user.username, role: user.role } : null
        )
        .catch(() => null)
    );
  }
  return userCache.get(aibitat);
}

/**
 * Header values must be visible ASCII. Usernames always are; workspace slugs
 * can keep non-latin characters, so those are percent-encoded.
 * @param {string|number} value
 * @returns {string}
 */
function headerValue(value) {
  const str = String(value);
  return /^[\x20-\x7E]*$/.test(str) ? str : encodeURIComponent(str);
}

/**
 * Build the identity to forward to one MCP server for an agent session.
 * @param {("user"|"workspace")[]} scopes
 * @param {object|null} aibitat - carries `handlerProps.invocation`
 * @returns {Promise<{headers: Record<string, string>, _meta: object}|null>}
 */
async function resolveMCPIdentity(scopes, aibitat) {
  const invocation = aibitat?.handlerProps?.invocation;
  if (!scopes.length || !invocation) return null;

  const identity = {};
  const headers = {};

  if (scopes.includes("user") && invocation.user_id) {
    const id = Number(invocation.user_id);
    const user = await lookupUser(aibitat, id);
    identity.user = {
      id,
      username: user?.username ?? null,
      role: user?.role ?? null,
    };
    headers["X-AnythingLLM-User-Id"] = String(id);
    if (user?.username)
      headers["X-AnythingLLM-Username"] = headerValue(user.username);
    if (user?.role) headers["X-AnythingLLM-User-Role"] = headerValue(user.role);
  }

  const workspace = invocation.workspace;
  if (scopes.includes("workspace") && workspace?.id) {
    identity.workspace = { id: workspace.id, slug: workspace.slug };
    headers["X-AnythingLLM-Workspace-Id"] = String(workspace.id);
    headers["X-AnythingLLM-Workspace-Slug"] = headerValue(workspace.slug);
  }

  if (!Object.keys(identity).length) return null;
  return { headers, _meta: { [IDENTITY_META_KEY]: identity } };
}

/**
 * Run an MCP request with the identity headers available to `identityFetch`.
 * @template T
 * @param {{headers: Record<string, string>}|null} identity
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
function withMCPIdentity(identity, fn) {
  if (!identity) return fn();
  return requestIdentity.run({ headers: identity.headers }, fn);
}

/**
 * `fetch` for MCP HTTP transports - adds the identity headers of the MCP call
 * currently in flight, if any.
 * @param {string|URL} url
 * @param {RequestInit} [init]
 */
function identityFetch(url, init = {}) {
  const forwarded = requestIdentity.getStore()?.headers;
  if (!forwarded) return fetch(url, init);
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(forwarded)) headers.set(key, value);
  return fetch(url, { ...init, headers });
}

/**
 * Drop static config headers in the reserved `X-AnythingLLM-` namespace.
 * @param {Record<string, string>|undefined} headers
 * @param {(msg: string) => void} [log]
 * @returns {Record<string, string>|undefined}
 */
function stripReservedHeaders(headers, log = () => {}) {
  if (!headers || typeof headers !== "object") return headers;
  const kept = {};
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase().startsWith(RESERVED_HEADER_PREFIX)) {
      log(`Ignoring reserved MCP header "${key}" from config`);
      continue;
    }
    kept[key] = value;
  }
  return kept;
}

module.exports = {
  IDENTITY_META_KEY,
  forwardIdentityScopes,
  resolveMCPIdentity,
  withMCPIdentity,
  identityFetch,
  stripReservedHeaders,
};
