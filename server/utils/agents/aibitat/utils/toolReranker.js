const { TokenManager } = require("../../../helpers/tiktoken");
const {
  NativeEmbeddingReranker,
} = require("../../../EmbeddingRerankers/native");

const CHUNK_SIZE = 25;
const MAX_TEXT_LENGTH = 1000;

class ToolReranker {
  /**
   * The default number of top tools to keep after reranking
   * @type {number}
   */
  static defaultTopN = 15;

  static instance = null;

  constructor() {
    if (ToolReranker.instance) return ToolReranker.instance;
    ToolReranker.instance = this;
    this.tokenManager = new TokenManager();
    this.reranker = null;
  }

  log(text, ...args) {
    console.log(`\x1b[33m[IntelligentSkillSelector]\x1b[0m ${text}`, ...args);
  }

  /**
   * Check if tool reranking is enabled via environment variable
   * @returns {boolean}
   */
  static isEnabled() {
    if (!("AGENT_SKILL_RERANKER_ENABLED" in process.env)) return false;
    if (process.env.AGENT_SKILL_RERANKER_ENABLED === "false") return false;
    return true;
  }

  /**
   * Get the configured topN value from environment or use default
   * @returns {number}
   */
  static getTopN() {
    const envTopN = parseInt(process.env.AGENT_SKILL_RERANKER_TOP_N, 10);
    return !isNaN(envTopN) && envTopN > 0 ? envTopN : ToolReranker.defaultTopN;
  }

  /**
   * Truncate text to max length, trying to break at word boundary
   */
  #truncateText(text, maxLength = MAX_TEXT_LENGTH) {
    if (!text || text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > maxLength * 0.8
      ? truncated.slice(0, lastSpace)
      : truncated;
  }

  /**
   * Get or initialize the reranker instance
   */
  async #getReranker() {
    if (!this.reranker) {
      this.reranker = new NativeEmbeddingReranker();
      await this.reranker.initClient();
    }
    return this.reranker;
  }

  /**
   * Process documents in chunks and merge results to get global top K
   */
  async #chunkedRerank(query, documents, topK) {
    const reranker = await this.#getReranker();
    const totalDocs = documents.length;

    if (totalDocs <= CHUNK_SIZE) {
      return await reranker.rerank(query, documents, { topK });
    }

    this.log(`Processing ${totalDocs} documents in chunks of ${CHUNK_SIZE}...`);
    const allScored = [];

    for (let i = 0; i < totalDocs; i += CHUNK_SIZE) {
      const chunk = documents.slice(i, i + CHUNK_SIZE);
      const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(totalDocs / CHUNK_SIZE);

      this.log(
        `Processing chunk ${chunkNum}/${totalChunks} (${chunk.length} docs)...`
      );

      const chunkResults = await reranker.rerank(query, chunk, {
        topK: chunk.length,
      });

      chunkResults.forEach((result) => {
        allScored.push({
          ...result,
          rerank_corpus_id: result.rerank_corpus_id + i,
        });
      });
    }

    allScored.sort((a, b) => b.rerank_score - a.rerank_score);
    return allScored.slice(0, topK);
  }

  /**
   * Convert a tool/function definition to a text representation for reranking.
   * @param {Object} tool - The tool definition object
   * @returns {{text: string, toolName: string, tool: Object, tokens: number}}
   */
  #toolToDocument(tool) {
    const parts = [];
    if (!tool || !tool.name)
      return { text: null, toolName: null, tool: null, tokens: 0 };

    parts.push(tool.name);
    if (tool.description) parts.push(tool.description);

    if (tool.parameters?.properties) {
      const paramNames = Object.keys(tool.parameters.properties);
      if (paramNames.length > 0) {
        const paramDescriptions = paramNames.map((name) => {
          const prop = tool.parameters.properties[name];
          return prop.description ? `${name}: ${prop.description}` : name;
        });
        parts.push(paramDescriptions.join(", "));
      }
    }

    if (
      tool.examples &&
      Array.isArray(tool.examples) &&
      tool.examples.length > 0
    ) {
      const examplePrompts = tool.examples
        .map((ex) => ex.prompt)
        .filter(Boolean);
      if (examplePrompts.length > 0) {
        parts.push(examplePrompts.join("; "));
      }
    }

    const textContent = parts.join("\n");
    return {
      text: textContent,
      toolName: tool.name,
      tool,
      tokens: this.tokenManager.countFromString(textContent),
    };
  }

  /**
   * Rerank tools based on the user prompt and return the top N most relevant tools.
   * Uses chunked processing to handle large numbers of tools efficiently.
   * @param {string} userPrompt - The user's query/prompt
   * @param {Object[]} tools - Array of tool/function definitions from aibitat.functions
   * @param {Object} options - Options for reranking
   * @param {number} options.topN - Number of top tools to return
   * @returns {Promise<Object[]>} - Array of reranked tools (top N)
   */
  async rerank(userPrompt, tools = [], options = {}) {
    if (!ToolReranker.isEnabled()) return tools;
    if (!tools || tools.length === 0) return tools;
    const { topN = ToolReranker.getTopN() } = options;

    if (tools.length <= topN) {
      this.log(`${tools.length} tools <= ${topN}, skipping reranking`);
      return tools;
    }

    try {
      this.log(`Starting tool reranking for ${tools.length} tools...`);
      const documents = tools.map((tool) => this.#toolToDocument(tool));
      const originalTokenCount = documents.reduce(
        (acc, doc) => acc + doc.tokens,
        0
      );

      const startTime = Date.now();
      // Truncate and format documents for reranking
      const rerankDocs = documents.map((doc) => ({
        text: this.#truncateText(doc.text),
      }));

      const reranked = await this.#chunkedRerank(userPrompt, rerankDocs, topN);
      const elapsedMs = Date.now() - startTime;

      const rerankedIndices = reranked.map((doc) => ({
        index: doc.rerank_corpus_id,
        score: doc.rerank_score,
      }));

      const rerankedTools = rerankedIndices.map(
        ({ index }) => documents[index].tool
      );
      const newTokenCount = rerankedIndices.reduce(
        (acc, { index }) => acc + documents[index].tokens,
        0
      );
      const percentSaved = Math.round(
        ((originalTokenCount - newTokenCount) / originalTokenCount) * 100
      );
      this.log(`
Identified top ${rerankedTools.length} of ${tools.length} tools in ${elapsedMs}ms
${originalTokenCount.toLocaleString()} -> ${newTokenCount.toLocaleString()} tokens \x1b[0;93m(${percentSaved}% reduction)\x1b[0m`);

      let logText = "Selected tools:\n";
      rerankedIndices.forEach(({ index }, i) => {
        logText += `  ${i + 1}. ${documents[index].toolName}\n`;
      });
      this.log(logText);
      return rerankedTools;
    } catch (error) {
      this.log(`Error during tool reranking: ${error.message}`);
      this.log("Falling back to original tool set");
      return tools;
    }
  }
}

module.exports = { ToolReranker };
