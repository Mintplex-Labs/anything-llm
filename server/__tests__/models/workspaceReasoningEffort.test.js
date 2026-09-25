jest.mock("../../utils/prisma", () => ({
  workspaces: {
    findUnique: jest.fn(),
    update: jest.fn(async ({ data }) => ({ id: 1, ...data })),
  },
}));

const prisma = require("../../utils/prisma");
const { Workspace } = require("../../models/workspace");

const stored = {
  id: 1,
  chatProvider: "openai",
  chatModel: "gpt-5.1",
  reasoningEffort: "high",
};

beforeEach(() => {
  jest.clearAllMocks();
  prisma.workspaces.findUnique.mockResolvedValue(stored);
});

function updatedData() {
  return prisma.workspaces.update.mock.calls[0][0].data;
}

describe("Workspace.update reasoning effort on model changes", () => {
  it("clears the effort when the chat model changes", async () => {
    await Workspace.update(1, { chatModel: "gpt-5.4" });
    expect(updatedData()).toEqual({
      chatModel: "gpt-5.4",
      reasoningEffort: null,
    });
  });

  it("clears the effort when the chat provider changes", async () => {
    await Workspace.update(1, {
      chatProvider: "anthropic",
      chatModel: "gpt-5.1",
    });
    expect(updatedData().reasoningEffort).toBeNull();
  });

  it("clears a newly submitted effort sent alongside a model change", async () => {
    // The settings form submits every field, so a stale select value can ride along.
    await Workspace.update(1, {
      chatModel: "gpt-5.4",
      reasoningEffort: "high",
    });
    expect(updatedData().reasoningEffort).toBeNull();
  });

  it("clears the effort when switching back to the system default provider", async () => {
    await Workspace.update(1, { chatProvider: "default" });
    expect(updatedData()).toMatchObject({
      chatProvider: null,
      chatModel: null,
      reasoningEffort: null,
    });
  });

  it("keeps the effort when the submitted provider and model are unchanged", async () => {
    await Workspace.update(1, {
      chatProvider: "openai",
      chatModel: "gpt-5.1",
      reasoningEffort: "low",
      openAiTemp: 0.5,
    });
    expect(updatedData().reasoningEffort).toBe("low");
  });

  it("does not look up the workspace for unrelated updates", async () => {
    await Workspace.update(1, { reasoningEffort: "low" });
    expect(prisma.workspaces.findUnique).not.toHaveBeenCalled();
    expect(updatedData()).toEqual({ reasoningEffort: "low" });
  });

  it("treats a missing stored model like null", async () => {
    prisma.workspaces.findUnique.mockResolvedValue({ id: 1, chatModel: null });
    await Workspace.update(1, { chatModel: null, reasoningEffort: "low" });
    expect(updatedData().reasoningEffort).toBe("low");
  });

  it("clears the effort when the workspace record cannot be read", async () => {
    prisma.workspaces.findUnique.mockResolvedValue(null);
    await Workspace.update(1, { chatModel: "gpt-5.4", reasoningEffort: "low" });
    expect(updatedData().reasoningEffort).toBeNull();
  });
});
