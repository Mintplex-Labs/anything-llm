const { Document } = require("../../../models/documents");
const {
  WorkspaceParsedFiles,
} = require("../../../models/workspaceParsedFiles");
const {
  docSummarizer,
} = require("../../../utils/agents/aibitat/plugins/summarize");

jest.mock("../../../models/documents", () => ({
  Document: {
    where: jest.fn(),
    content: jest.fn(),
  },
}));

jest.mock("../../../models/workspaceParsedFiles", () => ({
  WorkspaceParsedFiles: {
    getContextFiles: jest.fn(),
  },
}));

jest.mock("../../../utils/helpers/tiktoken", () => ({
  TokenManager: class TokenManager {
    countFromString() {
      return 10;
    }
  },
}));

jest.mock("../../../utils/agents/aibitat/providers/ai-provider", () => ({
  contextLimit: jest.fn(() => 1000),
}));

describe("document-summarizer parsed files", () => {
  const workspace = { id: 1 };
  let handler;

  beforeEach(() => {
    jest.clearAllMocks();
    Document.where.mockResolvedValue([]);
    WorkspaceParsedFiles.getContextFiles.mockResolvedValue([
      {
        title: "lecture.mp3",
        description: "FonadaLabs transcript",
        pageContent: "A readable lecture transcript.",
      },
    ]);

    const aibitat = {
      handlerProps: {
        invocation: {
          workspace_id: workspace.id,
          workspace,
          thread_id: 7,
          user_id: null,
        },
        log: jest.fn(),
      },
      function: jest.fn((definition) => {
        handler = definition;
      }),
      introspect: jest.fn(),
      addCitation: jest.fn(),
      provider: "gemini",
      model: "gemini-2.5-flash",
    };

    docSummarizer.plugin.call(docSummarizer).setup(aibitat);
  });

  it("lists and reads a transcript attached to the current thread", async () => {
    const documents = JSON.parse(await handler.listDocuments.call(handler));

    expect(documents).toEqual([
      expect.objectContaining({
        filename: "lecture.mp3",
        parsed_file: true,
      }),
    ]);
    await expect(
      handler.summarizeDoc.call(handler, "lecture.mp3")
    ).resolves.toBe("A readable lecture transcript.");
    expect(WorkspaceParsedFiles.getContextFiles).toHaveBeenCalledWith(
      workspace,
      { id: 7 },
      null
    );
    expect(Document.content).not.toHaveBeenCalled();
  });
});
