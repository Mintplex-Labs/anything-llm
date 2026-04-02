const { handleWorkspaceCreate } = require("./handleWorkspaceCreate");
const { handleWorkspacePagination } = require("./handleWorkspacePagination");
const { handleWorkspaceSelect } = require("./handleWorkspaceSelect");
const { handleThreadPagination } = require("./handleThreadPagination");
const { handleThreadSelect } = require("./handleThreadSelect");
const { handleBackWorkspaces } = require("./handleBackWorkspaces");
const { handleModelPagination } = require("./handleModelPagination");
const { handleModelCancel } = require("./handleModelCancel");
const { handleModelSelect } = require("./handleModelSelect");
const { handleSourceSelect } = require("./handleSourceSelect");
const { handleSourcePagination } = require("./handleSourcePagination");
const { handleBackSources } = require("./handleBackSources");
const { handleToolApproval } = require("./handleToolApproval");

const ExactCallbackHandlers = {
  "ws-create": handleWorkspaceCreate,
  "back:workspaces": handleBackWorkspaces,
  "mdl:cancel": handleModelCancel,
  "src:back": handleBackSources,
  "src:close": handleSourceSelect,
};

const PrefixCallbackHandlers = [
  { prefix: "tool:", handler: handleToolApproval },
  { prefix: "wspg:", handler: handleWorkspacePagination },
  { prefix: "ws:", handler: handleWorkspaceSelect },
  { prefix: "thpg:", handler: handleThreadPagination },
  { prefix: "th:", handler: handleThreadSelect },
  { prefix: "mdlpg:", handler: handleModelPagination },
  { prefix: "mdl:", handler: handleModelSelect },
  { prefix: "srcpg:", handler: handleSourcePagination },
  { prefix: "src:", handler: handleSourceSelect },
];

/**
 * Resolves the appropriate callback handler for the given data string.
 * First checks exact matches, then prefix matches (in order).
 * @param {string} data - The callback data string
 * @returns {Function|null} - The handler function or null if not found
 */
function resolveCallbackHandler(data) {
  if (ExactCallbackHandlers[data]) {
    return ExactCallbackHandlers[data];
  }

  for (const { prefix, handler } of PrefixCallbackHandlers) {
    if (data.startsWith(prefix)) {
      return handler;
    }
  }

  return null;
}

module.exports = {
  ExactCallbackHandlers,
  PrefixCallbackHandlers,
  resolveCallbackHandler,
};
