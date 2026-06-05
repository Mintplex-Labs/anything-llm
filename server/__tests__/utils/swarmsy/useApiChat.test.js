const {
  NO_API_KEY_CONNECTED_MESSAGE,
  API_PROVIDER_ROUTING_FAILED_MESSAGE,
  normalizeUseApiIntent,
  hasConnectedOnlineProviderConfig,
  canonicalProviderId,
  buildUseApiGuardResponse,
  useApiSsePayload,
  isOnlineChatProvider,
  hasProviderKeyConfig,
  hasBedrockProviderConfig,
  firstConfiguredUseApiProvider,
  buildUseApiRuntimeWorkspace,
  useApiProviderSelectedSsePayload,
  useApiRoutingFailedSsePayload,
  localOnlyProviderBlockedSsePayload,
} = require("../../../utils/swarmsy/useApiChat");

describe("SWARMSY Use API chat guard", () => {
  it("defaults missing and false useApi intent to local/default flow", () => {
    expect(normalizeUseApiIntent(undefined)).toBe(false);
    expect(normalizeUseApiIntent(null)).toBe(false);
    expect(normalizeUseApiIntent(false)).toBe(false);
    expect(normalizeUseApiIntent("true")).toBe(false);
  });

  it("accepts only explicit boolean true as API intent", () => {
    expect(normalizeUseApiIntent(true)).toBe(true);
  });

  it("returns Needs user action when no provider key is connected", () => {
    expect(hasConnectedOnlineProviderConfig({})).toBe(false);
    expect(buildUseApiGuardResponse({ hasProviderConfig: false })).toEqual({
      success: false,
      mode: "api_requested",
      status: "needs_user_action",
      message: NO_API_KEY_CONNECTED_MESSAGE,
    });
  });

  it("detects real provider env key names for Fireworks and Novita", () => {
    const fireworksSecret = "fireworks-secret-do-not-return";
    const novitaSecret = "novita-secret-do-not-return";

    expect(
      hasConnectedOnlineProviderConfig({
        FIREWORKS_AI_LLM_API_KEY: fireworksSecret,
      })
    ).toBe(true);
    expect(
      hasConnectedOnlineProviderConfig({ NOVITA_LLM_API_KEY: novitaSecret })
    ).toBe(true);

    const fireworksPayload = useApiSsePayload({
      uuid: "fireworks-message",
      hasProviderConfig: hasConnectedOnlineProviderConfig({
        FIREWORKS_AI_LLM_API_KEY: fireworksSecret,
      }),
    });
    const novitaPayload = useApiSsePayload({
      uuid: "novita-message",
      hasProviderConfig: hasConnectedOnlineProviderConfig({
        NOVITA_LLM_API_KEY: novitaSecret,
      }),
    });

    expect(JSON.stringify(fireworksPayload)).not.toContain(fireworksSecret);
    expect(JSON.stringify(novitaPayload)).not.toContain(novitaSecret);
  });

  it("returns routing-failed status without exposing key values when a key exists", () => {
    const secret = "sk-test-secret-do-not-return";
    expect(hasConnectedOnlineProviderConfig({ OPEN_AI_KEY: secret })).toBe(
      true
    );
    const result = buildUseApiGuardResponse({ hasProviderConfig: true });
    expect(result.status).toBe("routing_failed");
    expect(result.message).toBe(API_PROVIDER_ROUTING_FAILED_MESSAGE);
    expect(JSON.stringify(result)).not.toContain(secret);
  });

  it("detects provider-specific keys without returning key names or values", () => {
    const secret = "secret-do-not-return";

    expect(
      hasProviderKeyConfig("fireworksAi", { FIREWORKS_AI_LLM_API_KEY: secret })
    ).toBe(true);
    expect(hasProviderKeyConfig("novita", { NOVITA_LLM_API_KEY: secret })).toBe(
      true
    );
    expect(
      hasProviderKeyConfig("openrouter", { OPEN_ROUTER_API_KEY: secret })
    ).toBe(true);
    expect(
      hasProviderKeyConfig("openrouter", { OPENROUTER_API_KEY: secret })
    ).toBe(true);
    expect(hasProviderKeyConfig("openai", { OPEN_AI_KEY: secret })).toBe(true);

    const selected = firstConfiguredUseApiProvider({
      workspace: { chatProvider: "fireworksAi" },
      env: { FIREWORKS_AI_LLM_API_KEY: secret },
    });

    expect(selected).toEqual({ provider: "fireworksai", source: "workspace" });
    expect(JSON.stringify(selected)).not.toContain(secret);
    expect(JSON.stringify(selected)).not.toContain("FIREWORKS_AI_LLM_API_KEY");
  });

  it("selects workspace, then system, then SWARMSY provider without mutating workspace", () => {
    const workspace = {
      id: 1,
      chatProvider: "ollama",
      chatModel: "llama3.1:8b",
    };
    const runtime = buildUseApiRuntimeWorkspace({
      workspace,
      env: { LLM_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "secret" },
    });

    expect(runtime.provider).toBe("anthropic");
    expect(runtime.source).toBe("system");
    expect(runtime.workspace).toEqual({
      ...workspace,
      chatProvider: "anthropic",
      chatModel: null,
    });
    expect(workspace).toEqual({
      id: 1,
      chatProvider: "ollama",
      chatModel: "llama3.1:8b",
    });

    const swarmsyRuntime = buildUseApiRuntimeWorkspace({
      workspace,
      env: { SWARMSY_API_CHAT_PROVIDER: "groq", GROQ_API_KEY: "secret" },
    });
    expect(swarmsyRuntime.provider).toBe("groq");
    expect(swarmsyRuntime.source).toBe("swarmsy");
  });

  it("canonicalizes selected provider IDs for downstream provider switches", () => {
    expect(canonicalProviderId("OpenAI")).toBe("openai");
    expect(canonicalProviderId("openAi")).toBe("openai");
    expect(canonicalProviderId("FIREWORKSAI")).toBe("fireworksai");
    expect(canonicalProviderId("generic-openai")).toBe("generic-openai");
    expect(canonicalProviderId("genericOpenAI")).toBe("generic-openai");
    expect(canonicalProviderId("openRouter")).toBe("openrouter");

    const runtime = buildUseApiRuntimeWorkspace({
      workspace: { chatProvider: "OpenAI" },
      env: { OPEN_AI_KEY: "secret" },
    });

    expect(runtime.provider).toBe("openai");
    expect(runtime.workspace.chatProvider).toBe("openai");
  });

  it("detects Bedrock required config and keeps secrets out of selection responses", () => {
    const bedrockEnv = {
      LLM_PROVIDER: "bedrock",
      AWS_BEDROCK_LLM_ACCESS_KEY_ID: "access-key-id",
      AWS_BEDROCK_LLM_ACCESS_KEY: "secret-access-key",
      AWS_BEDROCK_LLM_REGION: "us-east-1",
      AWS_BEDROCK_LLM_MODEL_PREFERENCE: "anthropic.claude-3-haiku",
    };

    expect(hasBedrockProviderConfig(bedrockEnv)).toBe(true);
    expect(hasProviderKeyConfig("bedrock", bedrockEnv)).toBe(true);

    const selected = firstConfiguredUseApiProvider({
      workspace: { chatProvider: "ollama" },
      env: bedrockEnv,
    });

    expect(selected).toEqual({ provider: "bedrock", source: "system" });
    expect(JSON.stringify(selected)).not.toContain("secret-access-key");
    expect(JSON.stringify(selected)).not.toContain(
      "AWS_BEDROCK_LLM_ACCESS_KEY"
    );
  });

  it("requires Bedrock auth-specific required env config", () => {
    expect(
      hasProviderKeyConfig("bedrock", {
        AWS_BEDROCK_LLM_ACCESS_KEY_ID: "access-key-id",
        AWS_BEDROCK_LLM_REGION: "us-east-1",
        AWS_BEDROCK_LLM_MODEL_PREFERENCE: "anthropic.claude-3-haiku",
      })
    ).toBe(false);

    expect(
      hasProviderKeyConfig("bedrock", {
        AWS_BEDROCK_LLM_CONNECTION_METHOD: "apiKey",
        AWS_BEDROCK_LLM_API_KEY: "api-key",
        AWS_BEDROCK_LLM_REGION: "us-east-1",
        AWS_BEDROCK_LLM_MODEL_PREFERENCE: "anthropic.claude-3-haiku",
      })
    ).toBe(true);

    expect(
      hasProviderKeyConfig("bedrock", {
        AWS_BEDROCK_LLM_CONNECTION_METHOD: "sessionToken",
        AWS_BEDROCK_LLM_ACCESS_KEY_ID: "access-key-id",
        AWS_BEDROCK_LLM_ACCESS_KEY: "secret-access-key",
        AWS_BEDROCK_LLM_REGION: "us-east-1",
        AWS_BEDROCK_LLM_MODEL_PREFERENCE: "anthropic.claude-3-haiku",
      })
    ).toBe(false);
  });

  it("returns needs_user_action when no configured online provider has a key", () => {
    const runtime = buildUseApiRuntimeWorkspace({
      workspace: { chatProvider: "ollama" },
      env: { LLM_PROVIDER: "ollama" },
    });

    expect(runtime.workspace).toBeNull();
    expect(runtime.status).toEqual({
      success: false,
      mode: "api_requested",
      status: "needs_user_action",
      message: NO_API_KEY_CONNECTED_MESSAGE,
    });
  });

  it("builds safe provider selected and routing failed payloads", () => {
    const secret = "secret-do-not-return";
    const selectedPayload = useApiProviderSelectedSsePayload({
      uuid: "message-3",
      provider: "openai",
      source: "workspace",
    });
    const failedPayload = useApiRoutingFailedSsePayload({ uuid: "message-4" });

    expect(selectedPayload).toEqual(
      expect.objectContaining({
        type: "statusResponse",
        mode: "api_requested",
        status: "provider_selected",
        provider: "openai",
        close: false,
      })
    );
    expect(failedPayload).toEqual(
      expect.objectContaining({
        type: "statusResponse",
        mode: "api_requested",
        status: "routing_failed",
        close: true,
      })
    );
    expect(JSON.stringify(selectedPayload)).not.toContain(secret);
    expect(JSON.stringify(failedPayload)).not.toContain(secret);
  });

  it("builds a user-facing SSE payload without API key values", () => {
    const secret = "sk-test-secret-do-not-return";
    const payload = useApiSsePayload({
      uuid: "message-1",
      hasProviderConfig: hasConnectedOnlineProviderConfig({
        OPEN_AI_KEY: secret,
      }),
    });

    expect(payload).toEqual(
      expect.objectContaining({
        uuid: "message-1",
        type: "statusResponse",
        success: false,
        mode: "api_requested",
        status: "routing_failed",
        close: true,
      })
    );
    expect(JSON.stringify(payload)).not.toContain(secret);
  });
});

describe("SWARMSY local-only provider guard", () => {
  it("detects online providers and allows local/self-hosted providers", () => {
    expect(isOnlineChatProvider("openai")).toBe(true);
    expect(isOnlineChatProvider("openAi")).toBe(true);
    expect(isOnlineChatProvider("openrouter")).toBe(true);
    expect(isOnlineChatProvider("fireworksAi")).toBe(true);
    expect(isOnlineChatProvider("novita")).toBe(true);
    expect(isOnlineChatProvider("bedrock")).toBe(true);
    expect(isOnlineChatProvider("ollama")).toBe(false);
    expect(isOnlineChatProvider("lmStudio")).toBe(false);
    expect(isOnlineChatProvider("localAi")).toBe(false);
    expect(isOnlineChatProvider("koboldCPP")).toBe(false);
    expect(isOnlineChatProvider("textGenWebUI")).toBe(false);
  });

  it("builds a local-only blocked payload without provider key values", () => {
    const secret = "sk-test-secret-do-not-return";
    const payload = localOnlyProviderBlockedSsePayload({ uuid: "message-2" });

    expect(payload).toEqual(
      expect.objectContaining({
        uuid: "message-2",
        type: "statusResponse",
        success: false,
        mode: "local_only",
        status: "blocked_online_provider",
        close: true,
      })
    );
    expect(JSON.stringify(payload)).not.toContain(secret);
  });
});
