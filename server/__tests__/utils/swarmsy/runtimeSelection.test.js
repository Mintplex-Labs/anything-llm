const {
  applyRuntimeSelectionToWorkspace,
  normalizeLocalUserOllamaRuntimeSelection,
} = require("../../../utils/swarmsy/runtimeSelection");

describe("SWARMSY runtime selection helper", () => {
  it("normalizes only local-user ollama runtime payloads", () => {
    expect(
      normalizeLocalUserOllamaRuntimeSelection({
        provider: "ollama",
        mode: "local_user",
        model: " llama3.1:8b ",
      })
    ).toEqual({
      provider: "ollama",
      mode: "local_user",
      model: "llama3.1:8b",
    });

    expect(
      normalizeLocalUserOllamaRuntimeSelection({
        provider: "openai",
        mode: "local_user",
        model: "gpt-4o",
      })
    ).toBeNull();
  });

  it("rejects runtime with empty model", () => {
    expect(
      normalizeLocalUserOllamaRuntimeSelection({
        provider: "ollama",
        mode: "local_user",
        model: "   ",
      })
    ).toBeNull();

    expect(
      normalizeLocalUserOllamaRuntimeSelection({
        provider: "ollama",
        mode: "local_user",
        model: "",
      })
    ).toBeNull();
  });

  it("rejects null/undefined runtime payload", () => {
    expect(normalizeLocalUserOllamaRuntimeSelection(null)).toBeNull();
    expect(normalizeLocalUserOllamaRuntimeSelection(undefined)).toBeNull();
    expect(normalizeLocalUserOllamaRuntimeSelection({})).toBeNull();
  });

  it("overrides workspace chat provider/model when runtime handoff is valid", () => {
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      chatProvider: "openai",
      chatModel: "gpt-4o-mini",
    };

    expect(
      applyRuntimeSelectionToWorkspace(workspace, {
        provider: "ollama",
        mode: "local_user",
        model: "llama3.1:8b",
      })
    ).toEqual({
      workspace: {
        ...workspace,
        chatProvider: "ollama",
        chatModel: "llama3.1:8b",
      },
      runtimeSelection: {
        provider: "ollama",
        mode: "local_user",
        model: "llama3.1:8b",
      },
    });
  });

  it("leaves the workspace unchanged when runtime handoff is invalid", () => {
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      chatProvider: "openai",
      chatModel: "gpt-4o-mini",
    };

    expect(
      applyRuntimeSelectionToWorkspace(workspace, {
        provider: "ollama",
        mode: "hosted_admin",
        model: "llama3.1:8b",
      })
    ).toEqual({
      workspace,
      runtimeSelection: null,
    });
  });

  it("does not mutate the original workspace object", () => {
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      chatProvider: "openai",
      chatModel: "gpt-4o-mini",
    };
    const originalChatProvider = workspace.chatProvider;
    const originalChatModel = workspace.chatModel;

    applyRuntimeSelectionToWorkspace(workspace, {
      provider: "ollama",
      mode: "local_user",
      model: "llama3.1:8b",
    });

    expect(workspace.chatProvider).toBe(originalChatProvider);
    expect(workspace.chatModel).toBe(originalChatModel);
  });

  it("leaves workspace unchanged when runtime payload is null", () => {
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      chatProvider: "openai",
      chatModel: "gpt-4o-mini",
    };

    expect(applyRuntimeSelectionToWorkspace(workspace, null)).toEqual({
      workspace,
      runtimeSelection: null,
    });
  });

  it("returns original workspace when workspace is null", () => {
    expect(
      applyRuntimeSelectionToWorkspace(null, {
        provider: "ollama",
        mode: "local_user",
        model: "llama3.1:8b",
      })
    ).toEqual({
      workspace: null,
      runtimeSelection: null,
    });
  });
});
