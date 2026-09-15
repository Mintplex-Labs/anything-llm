const {
  ExternalCommunicationConnector,
} = require("../models/externalCommunicationConnector");
const { Workspace } = require("../models/workspace");
const { LarkChannelService } = require("../utils/larkChannel");
const { safeLarkConfig } = require("../utils/larkChannel/config");
const {
  encryptConnectorSecret,
  decryptConnectorSecret,
} = require("../utils/externalChannels/credentials");
const {
  KeyedSerialExecutor,
} = require("../utils/externalChannels/messageQueue");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { isSingleUserMode } = require("../utils/middleware/multiUserProtected");
const { reqBody } = require("../utils/http");

// Lifecycle requests must not interleave a successful handshake and its save.
const lifecycle = new KeyedSerialExecutor();
const fail = (
  response,
  code = 500,
  error = "Could not update Lark configuration."
) => response.status(code).json({ success: false, error });
const validLimit = (value) =>
  value === null || (Number.isSafeInteger(value) && value > 0);
const text = (value) => typeof value === "string" && value.trim().length > 0;
function bodyOf(request) {
  try {
    return reqBody(request) || {};
  } catch {
    return {};
  }
}
async function validWorkspace(slug) {
  return text(slug) && Boolean(await Workspace.get({ slug }));
}

async function getLarkConfig(_request, response) {
  try {
    const connector = await ExternalCommunicationConnector.get("lark");
    return response.status(200).json({
      config: connector
        ? safeLarkConfig(connector, new LarkChannelService())
        : null,
    });
  } catch {
    return fail(response);
  }
}
async function getLarkStatus(_request, response) {
  try {
    return response
      .status(200)
      .json(
        safeLarkConfig(
          await ExternalCommunicationConnector.get("lark"),
          new LarkChannelService()
        )
      );
  } catch {
    return fail(response);
  }
}
async function connectLark(request, response) {
  return lifecycle.run("lark", async () => {
    const service = new LarkChannelService();
    let started = false;
    try {
      const input = bodyOf(request);
      const existing = await ExternalCommunicationConnector.get("lark");
      const platform = input.platform;
      const appId = input.app_id;
      const workspace = input.default_workspace;
      const limit =
        input.attachment_size_limit === undefined
          ? existing?.config?.attachment_size_limit ?? null
          : input.attachment_size_limit;
      const reuseSecret =
        input.app_secret === undefined ||
        (typeof input.app_secret === "string" &&
          /^[*•]+$/.test(input.app_secret));
      const secret = reuseSecret
        ? decryptConnectorSecret(existing?.config?.app_secret)
        : input.app_secret;
      if (
        !["lark", "feishu"].includes(platform) ||
        !text(appId) ||
        !text(secret) ||
        !validLimit(limit) ||
        !(await validWorkspace(workspace))
      )
        return fail(
          response,
          400,
          "Valid platform, app credentials, workspace and attachment limit are required."
        );
      const encrypted = encryptConnectorSecret(secret);
      if (!encrypted) return fail(response);

      // Drain pending access/routing writes before reading state to preserve.
      await service.stop();
      const latest = await ExternalCommunicationConnector.get("lark");
      const config = {
        ...latest?.config,
        platform,
        app_id: appId.trim(),
        app_secret: secret,
        default_workspace: workspace,
        attachment_size_limit: limit,
        approved_users: latest?.config?.approved_users || [],
      };
      let status,
        stored,
        persistenceFailed = false;
      try {
        status = await service.start(config, {
          beforeActivate: async (identity) => {
            stored = { ...config, app_secret: encrypted, ...identity };
            try {
              const result = await ExternalCommunicationConnector.upsert(
                "lark",
                { ...stored, active: true }
              );
              if (result.error || !result.connector)
                throw new Error("Persistence failed");
            } catch {
              persistenceFailed = true;
              throw new Error("Persistence failed");
            }
          },
        });
      } catch {
        if (persistenceFailed) {
          await service.stop();
          return fail(response);
        }
        return fail(
          response,
          400,
          "Could not connect to Lark. Check the app credentials and permissions."
        );
      }
      if (!status?.connected) {
        await service.stop();
        return fail(response, 400, "Lark connection did not complete.");
      }
      started = true;
      return response.status(200).json({
        success: true,
        config: safeLarkConfig({ active: true, config: stored }, service),
      });
    } catch {
      if (started) {
        try {
          await service.stop();
        } catch {
          /* Preserve safe failure response. */
        }
      }
      return fail(response);
    }
  });
}
async function disconnectLark(_request, response) {
  return lifecycle.run("lark", async () => {
    try {
      await new LarkChannelService().stop();
      if (!(await ExternalCommunicationConnector.delete("lark")))
        return fail(response);
      return response.status(200).json({ success: true });
    } catch {
      return fail(response);
    }
  });
}
async function getPendingLarkUsers(_request, response) {
  try {
    return response
      .status(200)
      .json({ users: new LarkChannelService().listPendingUsers() });
  } catch {
    return fail(response);
  }
}
async function getApprovedLarkUsers(_request, response) {
  try {
    return response
      .status(200)
      .json({ users: new LarkChannelService().listApprovedUsers() });
  } catch {
    return fail(response);
  }
}
async function mutateUser(method, request, response) {
  try {
    const { open_id } = bodyOf(request);
    if (typeof open_id !== "string" || !/^ou_[A-Za-z0-9_-]+$/.test(open_id))
      return fail(response, 400, "A valid open_id is required.");
    const result = await new LarkChannelService()[method](open_id);
    if (result?.error)
      return fail(response, 400, "Could not update Lark user access.");
    return response.status(200).json({ success: true });
  } catch {
    return fail(response);
  }
}
const approveLarkUser = (request, response) =>
  mutateUser("approveUser", request, response);
const denyLarkUser = (request, response) =>
  mutateUser("denyUser", request, response);
const revokeLarkUser = (request, response) =>
  mutateUser("revokeUser", request, response);
async function updateLarkConfig(request, response) {
  return lifecycle.run("lark", async () => {
    try {
      const input = bodyOf(request),
        updates = {};
      if (Object.hasOwn(input, "default_workspace")) {
        if (!(await validWorkspace(input.default_workspace)))
          return fail(response, 400, "A valid workspace is required.");
        updates.default_workspace = input.default_workspace;
      }
      if (Object.hasOwn(input, "attachment_size_limit")) {
        if (!validLimit(input.attachment_size_limit))
          return fail(
            response,
            400,
            "Attachment limit must be a positive integer or null."
          );
        updates.attachment_size_limit = input.attachment_size_limit;
      }
      if (!Object.keys(updates).length)
        return fail(response, 400, "No valid updates provided.");
      const service = new LarkChannelService();
      const result = await service.updateConfig(updates);
      if (result?.error) return fail(response);
      return response.status(200).json({
        success: true,
        config: safeLarkConfig(
          await ExternalCommunicationConnector.get("lark"),
          service
        ),
      });
    } catch {
      return fail(response);
    }
  });
}
function larkEndpoints(app) {
  if (!app) return;
  for (const [method, path, handler] of [
    ["get", "config", getLarkConfig],
    ["post", "connect", connectLark],
    ["post", "disconnect", disconnectLark],
    ["get", "status", getLarkStatus],
    ["get", "pending-users", getPendingLarkUsers],
    ["get", "approved-users", getApprovedLarkUsers],
    ["post", "approve-user", approveLarkUser],
    ["post", "deny-user", denyLarkUser],
    ["post", "revoke-user", revokeLarkUser],
    ["post", "update-config", updateLarkConfig],
  ])
    app[method](`/lark/${path}`, [validatedRequest, isSingleUserMode], handler);
}
module.exports = {
  larkEndpoints,
  getLarkConfig,
  connectLark,
  disconnectLark,
  getLarkStatus,
  getPendingLarkUsers,
  getApprovedLarkUsers,
  approveLarkUser,
  denyLarkUser,
  revokeLarkUser,
  updateLarkConfig,
};
