const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const MAX_CONTENT_LENGTH = 8_000;
const DEFAULT_PORT = 8787;
const DEFAULT_ANYTHINGLLM_BASE_URL = "http://localhost:3001";

function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || Object.prototype.hasOwnProperty.call(process.env, key))
      continue;
    process.env[key] = value.replace(/^['"]|['"]$/g, "");
  }
}

function jsonResponse(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  response.end(body);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("request_body_too_large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    request.on("error", reject);
  });
}

function validateMockMessage(body = {}) {
  if (typeof body.wxid !== "string" || body.wxid.trim().length === 0) {
    return { valid: false, status: 400, reason: "missing_wxid" };
  }

  if (typeof body.content !== "string" || body.content.trim().length === 0) {
    return { valid: false, status: 400, reason: "empty_content" };
  }

  if (body.content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, status: 400, reason: "content_too_long" };
  }

  return { valid: true };
}

function signedWebhookRequest({ wxid, nickname = null, content, secret }) {
  const timestamp = String(Date.now());
  const payload = {
    event: "message",
    wxid: wxid.trim(),
    nickname:
      typeof nickname === "string" && nickname.trim().length > 0
        ? nickname.trim()
        : null,
    message_type: "text",
    content: content.trim(),
    timestamp: Number(timestamp),
  };

  const rawBody = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return {
    rawBody,
    headers: {
      "content-type": "application/json",
      "x-anythingllm-gateway-timestamp": timestamp,
      "x-anythingllm-gateway-signature": signature,
    },
  };
}

async function forwardToAnythingLLM({ wxid, nickname = null, content }) {
  const secret = process.env.ANYTHINGLLM_GATEWAY_SECRET;
  if (!secret || secret === "your-secret") {
    return {
      success: false,
      status: 500,
      error: "gateway_secret_not_configured",
    };
  }

  const baseUrl = (
    process.env.ANYTHINGLLM_BASE_URL || DEFAULT_ANYTHINGLLM_BASE_URL
  ).replace(/\/$/, "");
  const { rawBody, headers } = signedWebhookRequest({
    wxid,
    nickname,
    content,
    secret,
  });

  try {
    const response = await fetch(`${baseUrl}/api/wechat/webhook`, {
      method: "POST",
      headers,
      body: rawBody,
    });
    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok || !data.success) {
      return {
        success: false,
        status: response.status,
        error: data.error || data.reason || "anythingllm_webhook_failed",
        reason: data.reason || null,
        details: data,
      };
    }

    return {
      success: true,
      status: response.status,
      reply: data.reply,
      workspace_slug: data.workspace_slug,
      thread_slug: data.thread_slug,
    };
  } catch (error) {
    return {
      success: false,
      status: 502,
      error: "anythingllm_unreachable",
      details: { message: error.message },
    };
  }
}

async function handleMockWeChatMessage(request, response) {
  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    return jsonResponse(response, 400, {
      success: false,
      error: error.message,
    });
  }

  const validation = validateMockMessage(body);
  if (!validation.valid) {
    return jsonResponse(response, validation.status, {
      success: false,
      reason: validation.reason,
    });
  }

  const result = await forwardToAnythingLLM({
    wxid: body.wxid,
    nickname: body.nickname,
    content: body.content,
  });

  if (!result.success) {
    return jsonResponse(response, result.status || 502, {
      success: false,
      error: result.error,
      ...(result.reason ? { reason: result.reason } : {}),
      details: result.details,
    });
  }

  return jsonResponse(response, 200, {
    success: true,
    reply: result.reply,
  });
}

function createServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse(response, 200, { ok: true });
    }

    if (
      request.method === "POST" &&
      url.pathname === "/mock/wechat/message"
    ) {
      return handleMockWeChatMessage(request, response);
    }

    return jsonResponse(response, 404, {
      success: false,
      error: "not_found",
    });
  });
}

function start() {
  loadDotEnv();
  const port = Number(process.env.GATEWAY_PORT || DEFAULT_PORT);
  createServer().listen(port, () => {
    console.log(`WeChat Gateway example listening on http://localhost:${port}`);
    console.log(
      `Forwarding text messages to ${
        process.env.ANYTHINGLLM_BASE_URL || DEFAULT_ANYTHINGLLM_BASE_URL
      }`
    );
  });
}

if (require.main === module) start();

module.exports = {
  MAX_CONTENT_LENGTH,
  createServer,
  forwardToAnythingLLM,
  signedWebhookRequest,
  validateMockMessage,
};
