/* eslint-env jest */
const crypto = require("crypto");
const {
  MAX_TEXT_CONTENT_LENGTH,
  WECHAT_WORKSPACE_SLUG,
  getOrCreateWeChatThread,
  handleWeChatWebhook,
  safeCompareSignatures,
} = require("../../endpoints/wechat");

function sign(secret, timestamp, rawBody) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
}

describe("WeChat Gateway webhook", () => {
  const secret = "gateway-secret";
  const nowMs = 1_710_000_000_000;
  const timestamp = String(nowMs);
  const connector = {
    active: true,
    config: { api_secret: secret },
  };

  function signedRequest(body) {
    const rawBody = JSON.stringify(body);
    return {
      body,
      rawBody,
      timestampHeader: timestamp,
      signatureHeader: sign(secret, timestamp, rawBody),
      nowMs,
      deps: { gatewayConnector: connector },
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ignores non-text message types without processing media", async () => {
    const result = await handleWeChatWebhook(
      signedRequest({
        event: "message",
        wxid: "wxid_1",
        message_type: "image",
        media: { media_url: "https://example.com/image.jpg" },
      })
    );

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      success: false,
      ignored: true,
      reason: "unsupported_message_type",
    });
  });

  it("rejects missing, invalid, stale, and future signatures", async () => {
    const body = {
      event: "message",
      wxid: "wxid_1",
      message_type: "text",
      content: "hello",
    };
    const rawBody = JSON.stringify(body);

    await expect(
      handleWeChatWebhook({
        body,
        rawBody,
        timestampHeader: timestamp,
        signatureHeader: null,
        nowMs,
        deps: { gatewayConnector: connector },
      })
    ).resolves.toMatchObject({
      status: 401,
      body: { success: false, error: "unauthorized" },
    });

    await expect(
      handleWeChatWebhook({
        body,
        rawBody,
        timestampHeader: timestamp,
        signatureHeader: sign("wrong-secret", timestamp, rawBody),
        nowMs,
        deps: { gatewayConnector: connector },
      })
    ).resolves.toMatchObject({ status: 401 });

    await expect(
      handleWeChatWebhook({
        body,
        rawBody,
        timestampHeader: String(nowMs - 301_000),
        signatureHeader: sign(secret, String(nowMs - 301_000), rawBody),
        nowMs,
        deps: { gatewayConnector: connector },
      })
    ).resolves.toMatchObject({ status: 401 });

    await expect(
      handleWeChatWebhook({
        body,
        rawBody,
        timestampHeader: String(nowMs + 301_000),
        signatureHeader: sign(secret, String(nowMs + 301_000), rawBody),
        nowMs,
        deps: { gatewayConnector: connector },
      })
    ).resolves.toMatchObject({ status: 401 });
  });

  it("uses timingSafeEqual for signature comparison", () => {
    const spy = jest.spyOn(crypto, "timingSafeEqual");
    expect(safeCompareSignatures("a".repeat(64), "a".repeat(64))).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("rejects empty and oversized text content with stable reasons", async () => {
    await expect(
      handleWeChatWebhook(
        signedRequest({
          event: "message",
          wxid: "wxid_1",
          message_type: "text",
          content: "   ",
        })
      )
    ).resolves.toMatchObject({
      status: 400,
      body: { success: false, reason: "empty_content" },
    });

    await expect(
      handleWeChatWebhook(
        signedRequest({
          event: "message",
          wxid: "wxid_1",
          message_type: "text",
          content: "a".repeat(MAX_TEXT_CONTENT_LENGTH + 1),
        })
      )
    ).resolves.toMatchObject({
      status: 400,
      body: { success: false, reason: "content_too_long" },
    });
  });

  it("creates the wechat workspace and uses ApiChatHandler.chatSync", async () => {
    const workspace = {
      id: 1,
      name: "WeChat",
      slug: WECHAT_WORKSPACE_SLUG,
      chatMode: "automatic",
    };
    const thread = { id: 10, slug: "wechat_wxid_1" };
    const WorkspaceModel = {
      get: jest.fn().mockResolvedValueOnce(null),
      new: jest.fn().mockResolvedValue({ workspace, message: null }),
    };
    const WorkspaceThreadModel = {
      get: jest.fn(),
      new: jest.fn().mockResolvedValue({ thread, message: null }),
    };
    const WeChatGatewayThreadModel = {
      getByWxid: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({ mapping: {}, error: null }),
    };
    const ApiChatHandler = {
      chatSync: jest.fn().mockResolvedValue({
        textResponse: "AI reply",
        error: null,
      }),
    };

    const result = await handleWeChatWebhook({
      ...signedRequest({
        event: "message",
        wxid: "wxid_1",
        nickname: "Nick",
        message_type: "text",
        content: " hello ",
      }),
      deps: {
        gatewayConnector: connector,
        WorkspaceModel,
        WorkspaceThreadModel,
        WeChatGatewayThreadModel,
        ApiChatHandler,
      },
    });

    expect(WorkspaceModel.new).toHaveBeenCalledWith("WeChat", null, {
      chatMode: "automatic",
    });
    expect(ApiChatHandler.chatSync).toHaveBeenCalledWith({
      workspace,
      thread,
      message: "hello",
      mode: "automatic",
      user: null,
      attachments: [],
    });
    expect(result).toMatchObject({
      status: 200,
      body: {
        success: true,
        reply: "AI reply",
        workspace_slug: WECHAT_WORKSPACE_SLUG,
        thread_slug: "wechat_wxid_1",
      },
    });
  });

  it("reuses an existing wxid thread mapping", async () => {
    const workspace = { id: 1, slug: WECHAT_WORKSPACE_SLUG };
    const existingThread = { id: 2, slug: "wechat_existing" };
    const WorkspaceThreadModel = {
      get: jest.fn().mockResolvedValue(existingThread),
      new: jest.fn(),
    };
    const WeChatGatewayThreadModel = {
      getByWxid: jest.fn().mockResolvedValue({
        wxid: "wxid_1",
        thread_slug: "wechat_existing",
      }),
      upsert: jest.fn().mockResolvedValue({ mapping: {}, error: null }),
    };

    const thread = await getOrCreateWeChatThread({
      workspace,
      wxid: "wxid_1",
      nickname: "Nick",
      WeChatGatewayThreadModel,
      WorkspaceThreadModel,
    });

    expect(thread).toBe(existingThread);
    expect(WorkspaceThreadModel.new).not.toHaveBeenCalled();
    expect(WeChatGatewayThreadModel.upsert).toHaveBeenCalledWith({
      wxid: "wxid_1",
      nickname: "Nick",
      workspaceSlug: WECHAT_WORKSPACE_SLUG,
      threadSlug: "wechat_existing",
    });
  });

  it("recreates a thread when the saved mapping points to a deleted thread", async () => {
    const workspace = { id: 1, slug: WECHAT_WORKSPACE_SLUG };
    const recreatedThread = { id: 3, slug: "wechat_wxid_1" };
    const WorkspaceThreadModel = {
      get: jest.fn().mockResolvedValue(null),
      new: jest.fn().mockResolvedValue({
        thread: recreatedThread,
        message: null,
      }),
    };
    const WeChatGatewayThreadModel = {
      getByWxid: jest.fn().mockResolvedValue({
        wxid: "wxid_1",
        thread_slug: "deleted_thread",
      }),
      upsert: jest.fn().mockResolvedValue({ mapping: {}, error: null }),
    };

    const thread = await getOrCreateWeChatThread({
      workspace,
      wxid: "wxid_1",
      WeChatGatewayThreadModel,
      WorkspaceThreadModel,
    });

    expect(thread).toBe(recreatedThread);
    expect(WorkspaceThreadModel.new).toHaveBeenCalled();
    expect(WeChatGatewayThreadModel.upsert).toHaveBeenCalledWith({
      wxid: "wxid_1",
      nickname: null,
      workspaceSlug: WECHAT_WORKSPACE_SLUG,
      threadSlug: "wechat_wxid_1",
    });
  });

  it("returns a stable chat_failed error without leaking internals", async () => {
    const workspace = {
      id: 1,
      slug: WECHAT_WORKSPACE_SLUG,
      chatMode: "automatic",
    };
    const thread = { id: 10, slug: "wechat_wxid_1" };
    const result = await handleWeChatWebhook({
      ...signedRequest({
        event: "message",
        wxid: "wxid_1",
        message_type: "text",
        content: "hello",
      }),
      deps: {
        gatewayConnector: connector,
        WorkspaceModel: { get: jest.fn().mockResolvedValue(workspace) },
        WorkspaceThreadModel: {
          get: jest.fn(),
          new: jest.fn().mockResolvedValue({ thread, message: null }),
        },
        WeChatGatewayThreadModel: {
          getByWxid: jest.fn().mockResolvedValue(null),
          upsert: jest.fn().mockResolvedValue({ mapping: {}, error: null }),
        },
        ApiChatHandler: {
          chatSync: jest
            .fn()
            .mockRejectedValue(new Error("provider stack trace details")),
        },
      },
    });

    expect(result).toEqual({
      status: 500,
      body: {
        success: false,
        error: "chat_failed",
        reply: null,
        workspace_slug: WECHAT_WORKSPACE_SLUG,
        thread_slug: "wechat_wxid_1",
      },
    });
    expect(JSON.stringify(result.body)).not.toContain("provider stack");
  });
});
