/**
 * Scope rules for the developer API. `validApiKey` uses these to decide if a
 * key's scopes permit the matched route and which workspace or user the route
 * acts on.
 */
const { ApiKey } = require("../../models/apiKeys");
const { Workspace } = require("../../models/workspace");
const { EmbedConfig } = require("../../models/embedConfig");
const { User } = require("../../models/user");
const { safeJsonParse } = require("../http");
const SCOPES = ApiKey.scopes;

function bodyField(request, field) {
  const body =
    typeof request.body === "string"
      ? safeJsonParse(request.body, {})
      : request.body;
  return body?.[field];
}

// How a route that does not use `/v1/workspace/:slug` names the workspace it acts on.
const WORKSPACE_LOOKUPS = {
  slug: (request) => Workspace.get({ slug: String(request.params.slug) }),
  workspaceSlugParam: (request) =>
    Workspace.get({ slug: String(request.params.workspaceSlug) }),
  workspaceIdParam: (request) =>
    Workspace.get({ id: Number(request.params.workspaceId) }),
  openAiModel: (request) =>
    Workspace.get({ slug: String(bodyField(request, "model")) }),
  embedWorkspaceSlug: (request) =>
    Workspace.get({ slug: String(bodyField(request, "workspace_slug")) }),
  embedUuid: async (request, response) => {
    const embed = await EmbedConfig.get({
      uuid: String(request.params.embedUuid),
    });
    response.locals.embed = embed;
    return embed ? Workspace.get({ id: embed.workspace_id }) : null;
  },

  // Resolves to null when any slug in the comma-separated list does not exist.
  // Upload bodies are multipart and only parsed after `validApiKey`, so the
  // document routes run this lookup themselves once the body is available.
  addToWorkspaces: async (request) => {
    const slugs = [
      ...new Set(
        String(bodyField(request, "addToWorkspaces"))
          .split(",")
          .map((slug) => slug.trim().toLowerCase())
      ),
    ];
    const workspaces = await Workspace.where({ slug: { in: slugs } });
    return workspaces.length === slugs.length ? workspaces : null;
  },
};

// Needs no scope, so every valid key passes.
const ANY_KEY = { anyKey: true };
const EMBED = {
  any: [SCOPES.embeds],
  workspace: WORKSPACE_LOOKUPS.embedUuid,
  notFound: "Embed not found",
};

/**
 * What a scoped key needs to call each developer API route, keyed by method
 * and Express route pattern. A key must hold every scope in `all` or at least
 * one scope in `any`. Full access keys can call every route, and a route that
 * is missing from this table is full access only.
 *
 * `workspace` finds the workspace the route acts on so it can be checked
 * against the key's workspaces. Routes under `/v1/workspace/:slug` always get
 * this check. `user` loads the user from the `:id` param into
 * `response.locals.targetUser`.
 *
 * Routes that list workspaces filter by the key's workspaces in the handler.
 * @type {Object<string, {anyKey?: boolean, all?: string[], any?: string[], workspace?: Function, notFound?: string, user?: boolean}>}
 */
const ROUTE_SCOPES = {
  "GET /v1/auth": ANY_KEY,
  "GET /v1/admin/is-multi-user-mode": ANY_KEY,
  "GET /v1/document/accepted-file-types": ANY_KEY,
  "GET /v1/document/metadata-schema": ANY_KEY,

  "GET /v1/workspaces": { any: [SCOPES.chat, SCOPES.workspace] },
  "GET /v1/workspace/:slug": { any: [SCOPES.chat, SCOPES.workspace] },
  "GET /v1/workspace/:slug/chats": { any: [SCOPES.chat, SCOPES.workspace] },
  "POST /v1/workspace/:slug/chat": { any: [SCOPES.chat] },
  "POST /v1/workspace/:slug/stream-chat": { any: [SCOPES.chat] },
  "DELETE /v1/workspace/:slug": { any: [SCOPES.workspace] },
  "POST /v1/workspace/:slug/update": { any: [SCOPES.workspace] },
  "POST /v1/workspace/:slug/update-embeddings": { any: [SCOPES.workspace] },
  "POST /v1/workspace/:slug/update-pin": { any: [SCOPES.workspace] },
  "POST /v1/workspace/:slug/vector-search": { any: [SCOPES.workspace] },

  "POST /v1/workspace/:slug/thread/new": { any: [SCOPES.workspace] },
  "POST /v1/workspace/:slug/thread/:threadSlug/update": {
    any: [SCOPES.workspace],
  },
  "DELETE /v1/workspace/:slug/thread/:threadSlug": { any: [SCOPES.workspace] },
  "GET /v1/workspace/:slug/thread/:threadSlug/chats": {
    any: [SCOPES.workspace],
  },
  "POST /v1/workspace/:slug/thread/:threadSlug/chat": {
    any: [SCOPES.workspace],
  },
  "POST /v1/workspace/:slug/thread/:threadSlug/stream-chat": {
    any: [SCOPES.workspace],
  },

  "POST /v1/document/upload": { any: [SCOPES.documents] },
  "POST /v1/document/upload/:folderName": { any: [SCOPES.documents] },
  "POST /v1/document/upload-link": { any: [SCOPES.documents] },
  "POST /v1/document/raw-text": { any: [SCOPES.documents] },
  "GET /v1/documents": { any: [SCOPES.documents] },
  "GET /v1/documents/folder/:folderName": { any: [SCOPES.documents] },
  "GET /v1/document/:docName": { any: [SCOPES.documents] },
  "POST /v1/document/create-folder": { any: [SCOPES.documents] },
  "DELETE /v1/document/remove-folder": { any: [SCOPES.documents] },
  "POST /v1/document/move-files": { any: [SCOPES.documents] },
  "GET /v1/document/generated-files/:filename": { any: [SCOPES.documents] },

  "GET /v1/openai/models": { any: [SCOPES.openai] },
  "GET /v1/openai/vector_stores": { any: [SCOPES.openai] },
  "POST /v1/openai/embeddings": { any: [SCOPES.openai] },
  "POST /v1/openai/images/generations": { any: [SCOPES.openai] },
  "POST /v1/openai/chat/completions": {
    all: [SCOPES.openai, SCOPES.chat],
    workspace: WORKSPACE_LOOKUPS.openAiModel,
  },

  "GET /v1/embed": { any: [SCOPES.embeds] },
  "POST /v1/embed/new": {
    any: [SCOPES.embeds],
    workspace: WORKSPACE_LOOKUPS.embedWorkspaceSlug,
  },
  "GET /v1/embed/:embedUuid/chats": EMBED,
  "GET /v1/embed/:embedUuid/chats/:sessionUuid": EMBED,
  "POST /v1/embed/:embedUuid": EMBED,
  "DELETE /v1/embed/:embedUuid": EMBED,

  "GET /v1/mcp-servers": { any: [SCOPES.mcp] },
  "POST /v1/mcp-servers/new": { any: [SCOPES.mcp] },
  "POST /v1/mcp-servers/reload": { any: [SCOPES.mcp] },
  "POST /v1/mcp-servers/:name/update": { any: [SCOPES.mcp] },
  "POST /v1/mcp-servers/:name/toggle": { any: [SCOPES.mcp] },
  "POST /v1/mcp-servers/:name/toggle-tool": { any: [SCOPES.mcp] },
  "DELETE /v1/mcp-servers/:name": { any: [SCOPES.mcp] },

  "GET /v1/users": { any: [SCOPES.users] },
  "GET /v1/admin/users": { any: [SCOPES.users] },
  "POST /v1/admin/users/new": { any: [SCOPES.users] },
  "POST /v1/admin/users/:id": { any: [SCOPES.users], user: true },
  "DELETE /v1/admin/users/:id": { any: [SCOPES.users], user: true },
  "GET /v1/admin/invites": { any: [SCOPES.users] },
  "POST /v1/admin/invite/new": { any: [SCOPES.users] },
  "DELETE /v1/admin/invite/:id": { any: [SCOPES.users] },
  "GET /v1/admin/workspaces/:workspaceId/users": {
    any: [SCOPES.users],
    workspace: WORKSPACE_LOOKUPS.workspaceIdParam,
  },
  "POST /v1/admin/workspaces/:workspaceId/update-users": {
    any: [SCOPES.users],
    workspace: WORKSPACE_LOOKUPS.workspaceIdParam,
  },
  "POST /v1/admin/workspaces/:workspaceSlug/manage-users": {
    any: [SCOPES.users],
    workspace: WORKSPACE_LOOKUPS.workspaceSlugParam,
  },

  // A login token lets the key act as that user, so no other scope reaches it.
  "GET /v1/users/:id/issue-auth-token": { any: [SCOPES.sso], user: true },
};

/**
 * @param {import("express").Request} request
 * @returns {object|undefined} The matched route's entry in ROUTE_SCOPES
 */
function routeRule(request) {
  return ROUTE_SCOPES[`${request.method} ${String(request.route?.path)}`];
}

/**
 * @param {import("../../models/apiKeys").ApiKeyRecord} apiKey
 * @param {{anyKey?: boolean, all?: string[], any?: string[]}} [rule] - The route's entry in ROUTE_SCOPES
 * @returns {boolean}
 */
function keyPermitted(apiKey, rule) {
  if (ApiKey.isFullAccess(apiKey)) return true;
  if (!rule) return false;
  if (rule.anyKey) return true;

  const held = ApiKey.scopesOf(apiKey);
  if (rule.all) return rule.all.every((scope) => held.includes(scope));
  return rule.any.some((scope) => held.includes(scope));
}

/**
 * Sets the user a `/:id` route acts on. Outside of multi-user mode there are
 * no users and the route rejects the request itself.
 * @returns {Promise<boolean>} false when the response was ended with a 404
 */
async function setTargetUser(request, response) {
  if (!response.locals.multiUserMode) return true;

  const user = await User.get({ id: Number(request.params.id) });
  if (!user) {
    response.status(404).json({ success: false, error: "User not found." });
    return false;
  }

  response.locals.targetUser = user;
  return true;
}

module.exports = {
  WORKSPACE_LOOKUPS,
  ROUTE_SCOPES,
  routeRule,
  keyPermitted,
  setTargetUser,
};
