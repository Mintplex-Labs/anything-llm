const {
  NativeEmbeddingReranker,
} = require("../../../EmbeddingRerankers/native");
const { TokenManager } = require("../../../helpers/tiktoken");

class ToolReranker {
  /**
   * The default number of top tools to keep after reranking
   * @type {number}
   */
  static defaultTopN = 15;

  static instance = null;
  static #reranker = null;

  constructor() {
    if (ToolReranker.instance) return ToolReranker.instance;
    ToolReranker.instance = this;
    this.tokenManager = new TokenManager();
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
   * Get or create the reranker singleton
   * @returns {NativeEmbeddingReranker}
   */
  async #getReranker() {
    if (!ToolReranker.#reranker) {
      ToolReranker.#reranker = new NativeEmbeddingReranker();
      await ToolReranker.#reranker.initClient();
    }
    return ToolReranker.#reranker;
  }

  /**
   * Convert a tool/function definition to a text representation for reranking.
   * Format follows the best practices benchmark we have: name, description, param descriptions, example prompts
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

    // Include example prompts if available (common in aibitat built-in tools)
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
   * Rerank tools based on the user prompt and return the top N most relevant tools
   * @param {string} userPrompt - The user's query/prompt
   * @param {Object[]} tools - Array of tool/function definitions from aibitat.functions
   * @param {Object} options - Options for reranking
   * @param {number} options.topN - (optional) Number of top tools to return (default: ToolReranker.getTopN())
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
      const reranker = await this.#getReranker();
      const rerankedDocs = await reranker.rerank(userPrompt, documents, {
        topK: topN,
      });
      const elapsedMs = Date.now() - startTime;

      const rerankedTools = rerankedDocs.map((doc) => doc.tool);
      const newTokenCount = rerankedDocs.reduce(
        (acc, doc) => acc + doc.tokens,
        0
      );
      const percentSaved = Math.round(
        ((originalTokenCount - newTokenCount) / originalTokenCount) * 100
      );
      this.log(`
Identified top ${rerankedTools.length} of ${tools.length} tools in ${elapsedMs}ms
${originalTokenCount.toLocaleString()} -> ${newTokenCount.toLocaleString()} tokens \x1b[0;93m(${percentSaved}% reduction)\x1b[0m`);

      let logText = "Selected tools:\n";
      rerankedDocs.forEach((doc, index) => {
        logText += `  ${index + 1}. ${doc.toolName}\n`;
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
