const addDocumentToNamespace = jest.fn();

jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(() => ({ addDocumentToNamespace })),
  getLLMProvider: jest.fn(),
}));

describe("rag-memory store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addDocumentToNamespace.mockResolvedValue({ error: null });
  });

  it("writes memory directly to the vector database", async () => {
    const { memory } = require("../../../utils/agents/aibitat/plugins/memory");
    let tool = null;
    const aibitat = {
      handlerProps: {
        invocation: {
          workspace: { slug: "test-workspace" },
        },
        log: jest.fn(),
      },
      function: (definition) => {
        tool = definition;
      },
    };
    memory.plugin().setup(aibitat);

    const result = await tool.store("remember this");

    expect(addDocumentToNamespace).toHaveBeenCalledWith(
      "test-workspace",
      expect.objectContaining({
        title: "agent-memory.txt",
        pageContent: "remember this",
      }),
      null
    );
    expect(aibitat.handlerProps.log).toHaveBeenCalledWith(
      "memory.store: direct memory write"
    );
    expect(result).toBe(
      "The content given was successfully embedded. There is nothing else to do."
    );
  });
});
