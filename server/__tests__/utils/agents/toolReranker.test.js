const mockRerank = jest.fn();

jest.mock("../../../utils/EmbeddingRerankers/native", () => ({
  NativeEmbeddingReranker: jest.fn().mockImplementation(() => ({
    initClient: jest.fn().mockResolvedValue(),
    rerank: mockRerank,
  })),
}));

const {
  ToolReranker,
} = require("../../../utils/agents/aibitat/utils/toolReranker");

function makeTools(count) {
  return Array.from({ length: count }, (_, i) => ({
    name: `tool_${i}`,
    description: `does thing ${i}`,
  }));
}

describe("ToolReranker.rerank", () => {
  beforeEach(() => {
    ToolReranker.instance = null;
    mockRerank.mockReset();
    mockRerank.mockImplementation(async (_query, documents, { topK }) =>
      documents
        .slice(0, topK)
        .map((doc, i) => ({ ...doc, rerank_corpus_id: i, rerank_score: 1 }))
    );
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  it("truncates the query so injected document context cannot reach the cross-encoder", async () => {
    // Agent turns append the full text of every attached file onto the user
    // message. Passing that through verbatim blows up the (batch x sequence^2)
    // cost of the cross-encoder and crashes the process.
    const injectedContext = "lorem ipsum dolor sit amet ".repeat(4000);
    const userPrompt = `summarize the attached file\n\n<attached_documents>\n${injectedContext}\n</attached_documents>`;
    expect(userPrompt.length).toBeGreaterThan(100_000);

    await new ToolReranker().rerank(userPrompt, makeTools(31));

    const [queryUsed] = mockRerank.mock.calls[0];
    expect(queryUsed.length).toBeLessThanOrEqual(1000);
    expect(queryUsed.startsWith("summarize the attached file")).toBe(true);
  });

  it("leaves a normal length prompt untouched", async () => {
    const userPrompt = "search the web for today's weather";

    await new ToolReranker().rerank(userPrompt, makeTools(31));

    expect(mockRerank.mock.calls[0][0]).toBe(userPrompt);
  });

  it("hands the full tool set to the reranker in a single call", async () => {
    await new ToolReranker().rerank("find me a chart", makeTools(60));

    expect(mockRerank).toHaveBeenCalledTimes(1);
    expect(mockRerank.mock.calls[0][1]).toHaveLength(60);
  });

  it("maps reranked corpus ids back to the original tools", async () => {
    const tools = makeTools(20);
    mockRerank.mockImplementation(async () => [
      { rerank_corpus_id: 7, rerank_score: 0.9 },
      { rerank_corpus_id: 2, rerank_score: 0.8 },
    ]);

    const result = await new ToolReranker().rerank("do a thing", tools);

    expect(result).toEqual([tools[7], tools[2]]);
  });

  it("skips reranking when the tool count is already within topN", async () => {
    const tools = makeTools(5);

    const result = await new ToolReranker().rerank("do a thing", tools);

    expect(mockRerank).not.toHaveBeenCalled();
    expect(result).toBe(tools);
  });
});
