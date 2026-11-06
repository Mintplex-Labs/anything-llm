const { AsyncLocalStorage } = require("async_hooks");

/**
 * Forwards the calling AnythingLLM user and/or workspace to MCP servers that
 * opt in via `anythingllm.forwardIdentity` in the MCP config file:
 *
 *   "forwardIdentity": true                               // every field
 *   "forwardIdentity": ["user", "workspace"]              // every field
 *   "forwardIdentity": ["user.id", "workspace.slug"]      // only these fields
 *
 * `user` is shorthand for user.id, user.username and user.role; `workspace` for
 * workspace.id and workspace.slug. Anything not in IDENTITY_FIELDS is ignored.
 *
 * Identity is sent on every request made for an agent session (tools/list and
 * tools/call) in two places:
 * - HTTP servers (sse/streamable): `X-AnythingLLM-*` headers.
 * - All servers (incl. stdio): `params._meta["com.anythingllm/identity"]`.
 *
 * Values are omitted when unavailable - e.g. single-user mode has no user.
 * On servers with forwardIdentity enabled, static config headers starting with
 * `X-AnythingLLM-` are dropped so they can never pose as a forwarded identity.
 * Servers without it keep their config headers untouched.
 *
 * MCP clients are shared across the whole instance, so per-request headers are
 * injected by a custom `fetch` reading an AsyncLocalStorage context set around
 * each MCP call.
 */

/** Forwardable fields and the header each is sent as. */
const IDENTITY_FIELDS = {
  "user.id": "X-AnythingLLM-User-Id",
  "user.username": "X-AnythingLLM-Username",
  "user.role": "X-AnythingLLM-User-Role",
  "workspace.id": "X-AnythingLLM-Workspace-Id",
  "workspace.slug": "X-AnythingLLM-Workspace-Slug",
};
const ALL_FIELDS = Object.keys(IDENTITY_FIELDS);
const RESERVED_HEADER_PREFIX = "x-anythingllm-";
const IDENTITY_META_KEY = "com.anythingllm/identity";

/** @type {AsyncLocalStorage<{headers: Record<string, string>}>} */
const requestIdentity = new AsyncLocalStorage();

/** @type {WeakMap<object, Promise<{username: string, role: string}|null>>} */
const userCache = new WeakMap();

/**
 * @param {boolean|string[]|undefined} value - `anythingllm.forwardIdentity`
 * @returns {string[]} fields from IDENTITY_FIELDS, in their declared order
 */
function forwardIdentityFields(value) {
  if (value === true) return [...ALL_FIELDS];
  if (!Array.isArray(value)) return [];
  return ALL_FIELDS.filter(
    (field) => value.includes(field) || value.includes(field.split(".")[0])
  );
}

/**
 * Only looked up when user.username or user.role is forwarded. Cached per
 * agent session.
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
 * @param {string[]} fields
 * @param {object} aibitat
 * @param {object} invocation
 * @returns {Promise<Record<string, string|number|null|undefined>>}
 */
async function identityValues(fields, aibitat, invocation) {
  const values = {};
  const userId = invocation.user_id ? Number(invocation.user_id) : null;
  if (userId) {
    values["user.id"] = userId;
    if (fields.includes("user.username") || fields.includes("user.role")) {
      const user = await lookupUser(aibitat, userId);
      values["user.username"] = user?.username;
      values["user.role"] = user?.role;
    }
  }
  if (invocation.workspace?.id) {
    values["workspace.id"] = invocation.workspace.id;
    values["workspace.slug"] = invocation.workspace.slug;
  }
  return values;
}

/**
 * Build the identity to forward to one MCP server for an agent session.
 * @param {string[]} fields - from forwardIdentityFields
 * @param {object|null} aibitat - carries `handlerProps.invocation`
 * @returns {Promise<{headers: Record<string, string>, _meta: object}|null>}
 */
async function resolveMCPIdentity(fields, aibitat) {
  const invocation = aibitat?.handlerProps?.invocation;
  if (!fields.length || !invocation) return null;

  const values = await identityValues(fields, aibitat, invocation);
  const identity = {};
  const headers = {};
  for (const field of fields) {
    const value = values[field];
    if (value === null || value === undefined || value === "") continue;
    const [group, key] = field.split(".");
    identity[group] = { ...identity[group], [key]: value };
    headers[IDENTITY_FIELDS[field]] = headerValue(value);
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
  forwardIdentityFields,
  resolveMCPIdentity,
  withMCPIdentity,
  identityFetch,
  stripReservedHeaders,
};
