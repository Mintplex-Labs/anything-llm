const {
  ExternalCommunicationConnector,
} = require("../models/externalCommunicationConnector");
const crypto = require("crypto");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { isSingleUserMode } = require("../utils/middleware/multiUserProtected");
const { reqBody } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { WorkspaceThread } = require("../models/workspaceThread");
const { WeChatGatewayThread } = require("../models/wechatGatewayThread");
const { ApiChatHandler } = require("../utils/chats/apiChatHandler");
const { decryptSecret } = require("./advancedGateway");
const {
  disconnect: disconnectOpenClawWeixin,
  getLoginStatus,
  prepareEnvironment,
  startQrLogin,
} = require("../utils/openclawWeixin");

const CONNECTOR_TYPE = "wechat";
const GATEWAY_CONNECTOR_TYPE = "advanced_gateway";
const WECHAT_WORKSPACE_SLUG = "wechat";
const WECHAT_WORKSPACE_NAME = "WeChat";
const MAX_TEXT_CONTENT_LENGTH = 8_000;
const SIGNATURE_WINDOW_MS = 5 * 60 * 1_000;
const VALID_STATUSES = ["disconnected", "pending_scan", "connected", "expired"];
const VALID_QR_STATUSES = ["placeholder", "pending", "pending_scan", "expired"];

const DEFAULT_PROFILE = {
  nickname: null,
  avatar_url: null,
  wxid: null,
  openid: null,
};

const DEFAULT_CONFIG = {
  active: false,
  status: "disconnected",
  qr_status: "placeholder",
  profile: DEFAULT_PROFILE,
  last_connected_at: null,
};

function normalizedConfig(connector = null) {
  if (!connector) return { ...DEFAULT_CONFIG };
  const config = connector.config || {};
  const status = VALID_STATUSES.includes(config.status)
    ? config.status
    : DEFAULT_CONFIG.status;
  const qrStatus = VALID_QR_STATUSES.includes(config.qr_status)
    ? config.qr_status
    : DEFAULT_CONFIG.qr_status;

  return {
    active: Boolean(connector.active),
    status,
    qr_status: qrStatus,
    profile: {
      ...DEFAULT_PROFILE,
      ...(config.profile && typeof config.profile === "object"
        ? config.profile
        : {}),
    },
    last_connected_at: config.last_connected_at || null,
  };
}

async function persistWeChatConfig(config = {}) {
  return await ExternalCommunicationConnector.upsert(CONNECTOR_TYPE, config);
}

function safeFailure(status = 500, error = "webhook_failed", reason = null) {
  return {
    status,
    body: {
      success: false,
      error,
      ...(reason ? { reason } : {}),
    },
  };
}

function parseGatewayTimestamp(value = null) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed > 10_000_000_000 ? parsed : parsed * 1_000;
}

function isTimestampInWindow(timestampMs = null, nowMs = Date.now()) {
  if (!timestampMs) return false;
  return Math.abs(nowMs - timestampMs) <= SIGNATURE_WINDOW_MS;
}

function safeCompareSignatures(expectedSignature = "", providedSignature = "") {
  const expected = Buffer.from(expectedSignature, "hex");
  const normalized = String(providedSignature || "").replace(/^sha256=/, "");
  const provided = Buffer.from(normalized, "hex");

  if (expected.length === 0) return false;
  if (provided.length !== expected.length) {
    crypto.timingSafeEqual(expected, Buffer.alloc(expected.length));
    return false;
  }

  return crypto.timingSafeEqual(expected, provided);
}

function verifyGatewaySignature({
  connector = null,
  timestampHeader = null,
  signatureHeader = null,
  rawBody = "",
  nowMs = Date.now(),
}) {
  if (!connector?.active) return { valid: false, reason: "inactive" };

  const secret = decryptSecret(connector.config?.api_secret);
  if (!secret) return { valid: false, reason: "missing_secret" };

  const timestampMs = parseGatewayTimestamp(timestampHeader);
  if (!isTimestampInWindow(timestampMs, nowMs))
    return { valid: false, reason: "stale_timestamp" };

  if (!signatureHeader) return { valid: false, reason: "missing_signature" };
  const payload = `${timestampHeader}.${rawBody || ""}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const valid = safeCompareSignatures(expectedSignature, signatureHeader);

  return {
    valid,
    reason: valid ? null : "invalid_signature",
  };
}

function validateWebhookBody(body = {}) {
  if (body?.event && body.event !== "message") {
    return {
      status: 400,
      body: { success: false, reason: "unsupported_event" },
    };
  }

  if (!body?.wxid || typeof body.wxid !== "string")
    return { status: 400, body: { success: false, reason: "missing_wxid" } };

  if (body.message_type !== "text") {
    // Media messages are intentionally ignored in phase one. Future Gateway
    // implementations should download WeChat media themselves, then pass either
    // a media_url, a base64 attachment, or an external/local temporary reference.
    // AnythingLLM can later decide whether that becomes a chat attachment,
    // document ingestion, OCR input, or multimodal analysis input.
    return {
      status: 200,
      body: {
        success: false,
        ignored: true,
        reason: "unsupported_message_type",
      },
    };
  }

  if (typeof body.content !== "string" || body.content.trim().length === 0)
    return { status: 400, body: { success: false, reason: "empty_content" } };

  if (body.content.length > MAX_TEXT_CONTENT_LENGTH) {
    return {
      status: 400,
      body: { success: false, reason: "content_too_long" },
    };
  }

  return { status: 200, body: null };
}

async function getOrCreateWeChatWorkspace({ WorkspaceModel = Workspace } = {}) {
  let workspace = await WorkspaceModel.get({ slug: WECHAT_WORKSPACE_SLUG });
  if (workspace) return workspace;

  const result = await WorkspaceModel.new(WECHAT_WORKSPACE_NAME, null, {
    chatMode: "automatic",
  });
  if (result.workspace?.slug === WECHAT_WORKSPACE_SLUG) return result.workspace;

  workspace = await WorkspaceModel.get({ slug: WECHAT_WORKSPACE_SLUG });
  if (workspace) return workspace;

  throw new Error(result.message || "Failed to create WeChat workspace");
}

function threadSlugBase(wxid = "") {
  const sanitized = String(wxid)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return sanitized ? `wechat_${sanitized}` : `wechat_${Date.now()}`;
}

async function createWeChatThread({
  workspace,
  wxid,
  nickname = null,
  WorkspaceThreadModel = WorkspaceThread,
}) {
  const base = threadSlugBase(wxid);
  const name = `WeChat - ${nickname || wxid}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const { thread, message } = await WorkspaceThreadModel.new(
      workspace,
      null,
      {
        name,
        slug,
      }
    );
    if (thread) return thread;
    if (!String(message || "").includes("Unique constraint")) break;
  }

  const { thread, message } = await WorkspaceThreadModel.new(workspace, null, {
    name,
    slug: `${base}-${crypto.randomUUID().slice(0, 8)}`,
  });
  if (thread) return thread;
  throw new Error(message || "Failed to create WeChat thread");
}

async function getOrCreateWeChatThread({
  workspace,
  wxid,
  nickname = null,
  WeChatGatewayThreadModel = WeChatGatewayThread,
  WorkspaceThreadModel = WorkspaceThread,
}) {
  const mapping = await WeChatGatewayThreadModel.getByWxid(wxid);
  if (mapping?.thread_slug) {
    const existingThread = await WorkspaceThreadModel.get({
      slug: mapping.thread_slug,
      workspace_id: workspace.id,
    });

    if (existingThread) {
      await WeChatGatewayThreadModel.upsert({
        wxid,
        nickname,
        workspaceSlug: WECHAT_WORKSPACE_SLUG,
        threadSlug: existingThread.slug,
      });
      return existingThread;
    }
  }

  const thread = await createWeChatThread({
    workspace,
    wxid,
    nickname,
    WorkspaceThreadModel,
  });
  const { error } = await WeChatGatewayThreadModel.upsert({
    wxid,
    nickname,
    workspaceSlug: WECHAT_WORKSPACE_SLUG,
    threadSlug: thread.slug,
  });
  if (error) throw new Error(error);
  return thread;
}

async function handleWeChatWebhook({
  body = {},
  rawBody = "",
  timestampHeader = null,
  signatureHeader = null,
  nowMs = Date.now(),
  deps = {},
}) {
  const connector =
    deps.gatewayConnector ||
    (await ExternalCommunicationConnector.get(GATEWAY_CONNECTOR_TYPE));
  const auth = verifyGatewaySignature({
    connector,
    timestampHeader,
    signatureHeader,
    rawBody,
    nowMs,
  });
  if (!auth.valid) return safeFailure(401, "unauthorized", auth.reason);

  const validation = validateWebhookBody(body);
  if (validation.body) return validation;

  let workspace = null;
  let thread = null;
  try {
    workspace = await getOrCreateWeChatWorkspace({
      WorkspaceModel: deps.WorkspaceModel,
    });
  } catch (error) {
    console.error("WeChat webhook workspace failed", error.message);
    return safeFailure(500, "webhook_failed", "wechat_workspace_failed");
  }

  try {
    thread = await getOrCreateWeChatThread({
      workspace,
      wxid: body.wxid,
      nickname: body.nickname,
      WeChatGatewayThreadModel: deps.WeChatGatewayThreadModel,
      WorkspaceThreadModel: deps.WorkspaceThreadModel,
    });
  } catch (error) {
    console.error("WeChat webhook thread mapping failed", error.message);
    return safeFailure(500, "webhook_failed", "wechat_thread_mapping_failed");
  }

  try {
    const result = await (deps.ApiChatHandler || ApiChatHandler).chatSync({
      workspace,
      thread,
      message: body.content.trim(),
      mode: workspace.chatMode,
      user: null,
      attachments: [],
    });

    if (result?.error || !result?.textResponse) throw new Error("chat_failed");

    return {
      status: 200,
      body: {
        success: true,
        reply: result.textResponse,
        workspace_slug: WECHAT_WORKSPACE_SLUG,
        thread_slug: thread.slug,
      },
    };
  } catch (error) {
    console.error("WeChat webhook chat failed", error.message);
    const reason = classifyChatFailure(error);
    return {
      status: 500,
      body: {
        success: false,
        error: reason,
        reply: null,
        workspace_slug: WECHAT_WORKSPACE_SLUG,
        thread_slug: thread.slug,
      },
    };
  }
}

function classifyChatFailure(error = null) {
  const message = String(error?.message || "").toLowerCase();
  if (
    message.includes("api key") ||
    message.includes("llm provider") ||
    message.includes("unknown provider") ||
    message.includes("no valid provider") ||
    message.includes("provider is not set") ||
    message.includes("model is not set")
  ) {
    return "llm_provider_not_configured";
  }
  return "chat_failed";
}

function wechatEndpoints(app) {
  if (!app) return;

  app.get(
    "/wechat/config",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const connector =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        return response
          .status(200)
          .json({ config: connector ? normalizedConfig(connector) : null });
      } catch (e) {
        console.error(e.message, e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/wechat/config",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const existing =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        const current = normalizedConfig(existing);
        const body = reqBody(request) || {};
        const nextConfig = {
          ...current,
          active: Boolean(body.active),
          status: VALID_STATUSES.includes(body.status)
            ? body.status
            : current.status,
          qr_status: VALID_QR_STATUSES.includes(body.qr_status)
            ? body.qr_status
            : current.qr_status,
          profile: current.profile,
        };

        const { connector, error } =
          await ExternalCommunicationConnector.upsert(
            CONNECTOR_TYPE,
            nextConfig
          );
        if (error) return response.status(500).json({ success: false, error });

        return response
          .status(200)
          .json({ success: true, config: normalizedConfig(connector) });
      } catch (e) {
        console.error(e.message, e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/wechat/qrcode",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const environment = await prepareEnvironment();
        if (environment.status !== "environment_ready") {
          return response.status(500).json({
            success: false,
            error: environment.status,
            environment_status: environment.status,
          });
        }

        const qr = await startQrLogin();
        if (!qr.success) {
          return response.status(500).json({
            success: false,
            error: qr.error || "qr_generation_failed",
            reason: qr.reason || null,
            environment_status: environment.status,
          });
        }

        const existing =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        const current = normalizedConfig(existing);
        const nextConfig = {
          ...current,
          active: true,
          status: "pending_scan",
          qr_status: "pending_scan",
        };

        const { connector, error } = await persistWeChatConfig(nextConfig);
        if (error) return response.status(500).json({ success: false, error });

        return response.status(200).json({
          success: true,
          status: "pending_scan",
          qr_status: "pending_scan",
          qr_code: qr.qr_code,
          qr_code_type: qr.qr_code_type,
          qr_code_preview: qr.qr_code_preview || null,
          extraction_source: qr.extraction_source || null,
          environment_status: environment.status,
          config: normalizedConfig(connector),
          qrcode: {
            status: "pending_scan",
            qr_status: "pending_scan",
            qr_code: qr.qr_code,
            qr_code_type: qr.qr_code_type,
            qr_code_preview: qr.qr_code_preview || null,
            extraction_source: qr.extraction_source || null,
            image_url: qr.qr_code_type === "image" ? qr.qr_code : null,
            expires_at: null,
          },
        });
      } catch (e) {
        console.error(e.message, e);
        return response.sendStatus(500);
      }
    }
  );

  app.get(
    "/wechat/status",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const existing =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        const current = normalizedConfig(existing);
        const status = await getLoginStatus();
        const nextConfig = {
          ...current,
          status: status.status,
          qr_status:
            status.status === "pending_scan"
              ? "pending_scan"
              : status.status === "expired"
                ? "expired"
                : status.status === "disconnected"
                  ? "placeholder"
                  : current.qr_status,
          profile:
            status.status === "disconnected"
              ? DEFAULT_PROFILE
              : status.profile || current.profile,
          last_connected_at:
            status.status === "connected"
              ? status.lastConnectedAt || new Date().toISOString()
              : current.last_connected_at,
        };

        const { connector, error } = await persistWeChatConfig(nextConfig);
        if (error) return response.status(500).json({ success: false, error });

        const config = normalizedConfig(connector);
        return response.status(200).json({
          success: true,
          status: config.status,
          profile: config.profile,
          config,
        });
      } catch (e) {
        console.error(e.message, e);
        return response
          .status(500)
          .json({ success: false, error: "login_status_failed" });
      }
    }
  );

  app.post(
    "/wechat/disconnect",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const existing =
          await ExternalCommunicationConnector.get(CONNECTOR_TYPE);
        const current = normalizedConfig(existing);
        const status = await getLoginStatus();
        const disconnect = await disconnectOpenClawWeixin({
          accountId:
            status.accountId ||
            current.profile?.openid ||
            current.profile?.wxid ||
            null,
        });
        if (!disconnect.success) {
          return response.status(200).json({
            success: false,
            error: disconnect.error || "disconnect_failed",
            reason: disconnect.reason || null,
          });
        }

        const nextConfig = {
          ...current,
          status: "disconnected",
          qr_status: "placeholder",
          profile: DEFAULT_PROFILE,
          last_connected_at: null,
        };

        const { connector, error } = await persistWeChatConfig(nextConfig);
        if (error) return response.status(500).json({ success: false, error });

        return response
          .status(200)
          .json({ success: true, config: normalizedConfig(connector) });
      } catch (e) {
        console.error(e.message, e);
        return response.status(200).json({
          success: false,
          error: "disconnect_failed",
          reason: "unexpected_error",
        });
      }
    }
  );

  app.post("/wechat/webhook", async (request, response) => {
    try {
      const body = reqBody(request) || {};
      const result = await handleWeChatWebhook({
        body,
        rawBody: request.rawBody || JSON.stringify(body),
        timestampHeader: request.header("x-anythingllm-gateway-timestamp"),
        signatureHeader: request.header("x-anythingllm-gateway-signature"),
      });
      return response.status(result.status).json(result.body);
    } catch (error) {
      console.error("WeChat webhook failed", error.message);
      return response
        .status(500)
        .json(safeFailure(500, "webhook_failed", "unexpected_error").body);
    }
  });
}

module.exports = {
  MAX_TEXT_CONTENT_LENGTH,
  WECHAT_WORKSPACE_SLUG,
  getOrCreateWeChatThread,
  getOrCreateWeChatWorkspace,
  handleWeChatWebhook,
  isTimestampInWindow,
  classifyChatFailure,
  normalizedConfig,
  parseGatewayTimestamp,
  safeCompareSignatures,
  threadSlugBase,
  validateWebhookBody,
  verifyGatewaySignature,
  wechatEndpoints,
};
