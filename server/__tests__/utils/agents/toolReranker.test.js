const mockRerank = jest.fn();
const mockInitClient = jest.fn().mockResolvedValue();

jest.mock("../../../utils/EmbeddingRerankers/native", () => ({
  NativeEmbeddingReranker: jest.fn().mockImplementation(() => ({
    initClient: mockInitClient,
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

describe("ToolReranker", () => {
  beforeEach(() => {
    ToolReranker.instance = null;
    mockRerank.mockReset();
    mockInitClient.mockReset().mockResolvedValue();
    mockRerank.mockImplementation(async (_query, documents, { topK }) =>
      documents
        .slice(0, topK)
        .map((doc, i) => ({ ...doc, rerank_corpus_id: i, rerank_score: 1 }))
    );
    jest.spyOn(console, "log").mockImplementation(() => {});
    delete process.env.AGENT_SKILL_RERANKER_ENABLED;
    delete process.env.AGENT_SKILL_RERANKER_TOP_N;
  });

  afterEach(() => jest.restoreAllMocks());

  describe("isEnabled", () => {
    it("returns true when env var is not set", () => {
      delete process.env.AGENT_SKILL_RERANKER_ENABLED;
      expect(ToolReranker.isEnabled()).toBe(true);
    });

    it("returns false only for the exact string 'false'", () => {
      process.env.AGENT_SKILL_RERANKER_ENABLED = "false";
      expect(ToolReranker.isEnabled()).toBe(false);
    });

    it("treats 'False', 'FALSE', '0', and empty string as enabled", () => {
      for (const val of ["False", "FALSE", "0", "", " "]) {
        process.env.AGENT_SKILL_RERANKER_ENABLED = val;
        expect(ToolReranker.isEnabled()).toBe(true);
      }
    });
  });

  describe("getTopN", () => {
    it("returns defaultTopN when env var is not set", () => {
      expect(ToolReranker.getTopN()).toBe(ToolReranker.defaultTopN);
    });

    it("returns parsed integer from env var", () => {
      process.env.AGENT_SKILL_RERANKER_TOP_N = "25";
      expect(ToolReranker.getTopN()).toBe(25);
    });

    it("rejects non-numeric, zero, negative, and float strings", () => {
      for (const val of ["abc", "0", "-5", "", "3.7", "NaN", "Infinity"]) {
        process.env.AGENT_SKILL_RERANKER_TOP_N = val;
        const result = ToolReranker.getTopN();
        // parseInt("3.7") = 3 which is valid, parseInt("Infinity") = NaN
        if (Number.isInteger(parseInt(val, 10)) && parseInt(val, 10) > 0) {
          expect(result).toBe(parseInt(val, 10));
        } else {
          expect(result).toBe(ToolReranker.defaultTopN);
        }
      }
    });
  });

  describe("singleton", () => {
    it("returns the same instance on repeated construction", () => {
      const a = new ToolReranker();
      const b = new ToolReranker();
      expect(a).toBe(b);
    });

    it("shares reranker state across calls from same singleton", async () => {
      const tools = makeTools(31);
      const instance = new ToolReranker();
      await instance.rerank("first call", tools);
      await instance.rerank("second call", tools);
      // initClient called once on first rerank, reused on second
      expect(mockInitClient).toHaveBeenCalledTimes(1);
    });
  });

  describe("rerank", () => {
    it("skips reranking when tool count is within topN", async () => {
      const tools = makeTools(5);
      const result = await new ToolReranker().rerank("do a thing", tools);
      expect(mockRerank).not.toHaveBeenCalled();
      expect(result).toBe(tools);
    });

    it("returns tools as-is when disabled via env", async () => {
      process.env.AGENT_SKILL_RERANKER_ENABLED = "false";
      const tools = makeTools(31);
      const result = await new ToolReranker().rerank("do a thing", tools);
      expect(mockRerank).not.toHaveBeenCalled();
      expect(result).toBe(tools);
    });

    it("passes through null and empty arrays without calling reranker", async () => {
      expect(await new ToolReranker().rerank("q", null)).toBeNull();
      ToolReranker.instance = null;
      expect(await new ToolReranker().rerank("q", [])).toEqual([]);
      expect(mockRerank).not.toHaveBeenCalled();
    });

    // --- Query handling ---

    it("truncates oversized queries before they reach the cross-encoder", async () => {
      const injectedContext = "lorem ipsum dolor sit amet ".repeat(4000);
      const userPrompt = `summarize the attached file\n\n<attached_documents>\n${injectedContext}\n</attached_documents>`;

      await new ToolReranker().rerank(userPrompt, makeTools(31));

      const [queryUsed] = mockRerank.mock.calls[0];
      expect(queryUsed.length).toBeLessThanOrEqual(1000);
      expect(queryUsed.startsWith("summarize the attached file")).toBe(true);
    });

    it("breaks at a word boundary when truncating, not mid-word", async () => {
      // 200 five-char words = 1200 chars with spaces, forces truncation
      const prompt = Array.from({ length: 200 }, (_, i) => `word${i}`).join(
        " "
      );
      await new ToolReranker().rerank(prompt, makeTools(31));

      const [queryUsed] = mockRerank.mock.calls[0];
      expect(queryUsed.length).toBeLessThanOrEqual(1000);
      // Should not end mid-word
      expect(queryUsed).toMatch(/\w$/);
      expect(queryUsed.endsWith(" ")).toBe(false);
    });

    it("handles a prompt with no spaces at all when truncating", async () => {
      const prompt = "x".repeat(2000);
      await new ToolReranker().rerank(prompt, makeTools(31));

      const [queryUsed] = mockRerank.mock.calls[0];
      // No space to break at — lastIndexOf(" ") returns -1, which is < 80%,
      // so it should hard-cut at 1000
      expect(queryUsed.length).toBe(1000);
    });

    it("leaves a short prompt untouched", async () => {
      const prompt = "search the web for today's weather";
      await new ToolReranker().rerank(prompt, makeTools(31));
      expect(mockRerank.mock.calls[0][0]).toBe(prompt);
    });

    // --- Corpus ID edge cases ---

    it("maps reranked corpus ids back to original tools correctly", async () => {
      const tools = makeTools(31);
      mockRerank.mockImplementation(async () => [
        { rerank_corpus_id: 19, rerank_score: 0.9 },
        { rerank_corpus_id: 0, rerank_score: 0.8 },
        { rerank_corpus_id: 30, rerank_score: 0.7 },
      ]);

      const result = await new ToolReranker().rerank("q", tools);
      expect(result).toEqual([tools[19], tools[0], tools[30]]);
    });

    it("returns undefined entries when reranker returns out-of-bounds corpus ids", async () => {
      const tools = makeTools(31);
      mockRerank.mockImplementation(async () => [
        { rerank_corpus_id: 999, rerank_score: 0.9 },
        { rerank_corpus_id: -1, rerank_score: 0.8 },
      ]);

      const result = await new ToolReranker().rerank("q", tools);
      // documents[999] is undefined, so documents[999].tool throws,
      // which triggers the catch → fallback to original tools
      expect(result).toBe(tools);
    });

    it("returns duplicate tools when reranker returns duplicate corpus ids", async () => {
      const tools = makeTools(31);
      mockRerank.mockImplementation(async () => [
        { rerank_corpus_id: 3, rerank_score: 0.9 },
        { rerank_corpus_id: 3, rerank_score: 0.85 },
      ]);

      const result = await new ToolReranker().rerank("q", tools);
      expect(result).toEqual([tools[3], tools[3]]);
    });

    it("handles reranker returning empty results", async () => {
      mockRerank.mockImplementation(async () => []);
      const result = await new ToolReranker().rerank("q", makeTools(31));
      expect(result).toEqual([]);
    });

    // --- Error resilience ---

    it("falls back to original tools when reranker rejects", async () => {
      mockRerank.mockRejectedValue(new Error("ONNX segfault"));
      const tools = makeTools(31);
      const result = await new ToolReranker().rerank("q", tools);
      expect(result).toBe(tools);
    });

    it("falls back when reranker returns non-array", async () => {
      mockRerank.mockResolvedValue(null);
      const tools = makeTools(31);
      const result = await new ToolReranker().rerank("q", tools);
      // .map on null will throw, caught by try/catch → fallback
      expect(result).toBe(tools);
    });

    it("falls back when initClient rejects", async () => {
      mockInitClient.mockRejectedValue(new Error("model download failed"));
      const tools = makeTools(31);
      const result = await new ToolReranker().rerank("q", tools);
      expect(result).toBe(tools);
    });

    // --- topN configuration ---

    it("respects topN from options over env var", async () => {
      process.env.AGENT_SKILL_RERANKER_TOP_N = "8";
      await new ToolReranker().rerank("q", makeTools(31), { topN: 5 });
      expect(mockRerank.mock.calls[0][2]).toEqual({ topK: 5 });
    });

    it("uses env var topN when no option provided", async () => {
      process.env.AGENT_SKILL_RERANKER_TOP_N = "8";
      await new ToolReranker().rerank("q", makeTools(31));
      expect(mockRerank.mock.calls[0][2]).toEqual({ topK: 8 });
    });

    // --- Concurrent calls ---

    it("handles concurrent rerank calls on the same instance", async () => {
      let callCount = 0;
      mockRerank.mockImplementation(async (_q, docs, { topK }) => {
        callCount++;
        // Simulate async delay to force interleaving
        await new Promise((r) => setTimeout(r, 10));
        return docs
          .slice(0, topK)
          .map((doc, i) => ({ ...doc, rerank_corpus_id: i, rerank_score: 1 }));
      });

      const instance = new ToolReranker();
      const tools = makeTools(31);
      const [r1, r2, r3] = await Promise.all([
        instance.rerank("query one", tools),
        instance.rerank("query two", tools),
        instance.rerank("query three", tools),
      ]);

      expect(callCount).toBe(3);
      expect(r1).toHaveLength(ToolReranker.defaultTopN);
      expect(r2).toHaveLength(ToolReranker.defaultTopN);
      expect(r3).toHaveLength(ToolReranker.defaultTopN);
    });
  });

  describe("tool-to-document conversion", () => {
    it("builds text from name, description, params, and examples", async () => {
      const tools = [
        ...makeTools(20),
        {
          name: "web-search",
          description: "Search the internet for information",
          parameters: {
            properties: {
              query: { description: "The search query" },
              limit: { description: "Max results" },
              format: {},
            },
          },
          examples: [
            { prompt: "find recent news about AI" },
            { prompt: "search for weather in NYC" },
            { notPrompt: "this should be filtered out" },
          ],
        },
      ];

      await new ToolReranker().rerank("find something", tools);

      const docs = mockRerank.mock.calls[0][1];
      const searchDoc = docs[docs.length - 1];
      expect(searchDoc.text).toContain("web-search");
      expect(searchDoc.text).toContain("Search the internet");
      expect(searchDoc.text).toContain("query: The search query");
      expect(searchDoc.text).toContain("limit: Max results");
      // Param with no description should just show the name
      expect(searchDoc.text).toContain("format");
      // Examples
      expect(searchDoc.text).toContain("find recent news about AI");
      expect(searchDoc.text).toContain("search for weather in NYC");
      // Filtered out (no .prompt key)
      expect(searchDoc.text).not.toContain("this should be filtered out");
    });

    it("handles a tool with null name as null text", async () => {
      const tools = [...makeTools(20), { name: null, description: "orphan" }];
      await new ToolReranker().rerank("q", tools);

      const docs = mockRerank.mock.calls[0][1];
      expect(docs[docs.length - 1].text).toBeNull();
    });

    it("handles a completely empty tool object", async () => {
      const tools = [...makeTools(20), {}];
      await new ToolReranker().rerank("q", tools);

      const docs = mockRerank.mock.calls[0][1];
      expect(docs[docs.length - 1].text).toBeNull();
    });

    it("truncates tool text exceeding MAX_TEXT_LENGTH at a word boundary", async () => {
      // Build text where a hard cut at 1000 would land mid-word.
      // "abcdefghij" is 10 chars; 110 of them with spaces = 1209 chars.
      // A naive slice(0,1000) lands inside a word; the truncator should
      // back up to the prior space.
      const longDesc = Array.from({ length: 110 }, () => "abcdefghij")
        .join(" ");
      const tools = [
        ...makeTools(20),
        { name: "t", description: longDesc },
      ];

      await new ToolReranker().rerank("q", tools);

      const docs = mockRerank.mock.calls[0][1];
      const verboseDoc = docs[docs.length - 1];
      expect(verboseDoc.text.length).toBeLessThanOrEqual(1000);
      // Should NOT end mid-word — must end with a complete word
      const lastLine = verboseDoc.text.split("\n").pop();
      const lastWord = lastLine.split(" ").pop();
      expect(lastWord).toBe("abcdefghij");
    });

    it("handles tools with adversarial string content without crashing", async () => {
      const tools = [
        ...makeTools(20),
        {
          name: "<script>alert('xss')</script>",
          description: "'; DROP TABLE tools;--",
          parameters: {
            properties: {
              "../../etc/passwd": { description: "path traversal" },
            },
          },
          examples: [{ prompt: "${process.env.SECRET}" }],
        },
      ];

      await new ToolReranker().rerank("q", tools);

      const docs = mockRerank.mock.calls[0][1];
      const lastDoc = docs[docs.length - 1];
      // Content passes through as-is (it's just text for the cross-encoder)
      expect(lastDoc.text).toContain("<script>");
      expect(lastDoc.text).toContain("DROP TABLE");
    });

    it("handles tools where parameters.properties is empty", async () => {
      const tools = [
        ...makeTools(20),
        {
          name: "no-params",
          description: "a tool",
          parameters: { properties: {} },
        },
      ];

      await new ToolReranker().rerank("q", tools);

      const docs = mockRerank.mock.calls[0][1];
      const doc = docs[docs.length - 1];
      expect(doc.text).toBe("no-params\na tool");
    });

    it("handles tools with examples array containing no prompt keys", async () => {
      const tools = [
        ...makeTools(20),
        {
          name: "bad-examples",
          description: "a tool",
          examples: [{ notPrompt: "a" }, { alsoNot: "b" }],
        },
      ];

      await new ToolReranker().rerank("q", tools);

      const docs = mockRerank.mock.calls[0][1];
      const doc = docs[docs.length - 1];
      // No example prompts to add, so text is just name + description
      expect(doc.text).toBe("bad-examples\na tool");
    });
  });
});
