const { chatPrompt } = require("../../chats");

// Docs: https://github.com/jmorganca/ollama/blob/main/docs/api.md
class OllamaAILLM {
  constructor(embedder = null) {
    if (!process.env.OLLAMA_BASE_PATH)
      throw new Error("No Ollama Base Path was set.");

    this.basePath = process.env.OLLAMA_BASE_PATH;
    this.model = process.env.OLLAMA_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID OLLAMA SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use Ollama as your LLM."
      );
    this.embedder = embedder;
  }

  streamingEnabled() {
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.OLLAMA_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No Ollama token context limit was set.");
    return Number(limit);
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}
Context:
    ${contextTexts
      .map((text, i) => {
        return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
      })
      .join("")}`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const textResponse = await fetch(`${this.basePath}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        options: {
          temperature: Number(workspace?.openAiTemp ?? 0.7),
        },
        messages: await this.compressMessages(
          {
            systemPrompt: chatPrompt(workspace),
            userPrompt: prompt,
            chatHistory,
          },
          rawHistory
        ),
      }),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(`Ollama:sendChat ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => data?.message?.content)
      .catch((e) => {
        console.error(e);
        throw new Error(`Ollama::sendChat failed with: ${error.message}`);
      });

    if (!textResponse.length)
      throw new Error(`Ollama::sendChat text response was empty.`);

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const response = await fetch(`${this.basePath}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        stream: true,
        options: {
          temperature: Number(workspace?.openAiTemp ?? 0.7),
        },
        messages: await this.compressMessages(
          {
            systemPrompt: chatPrompt(workspace),
            userPrompt: prompt,
            chatHistory,
          },
          rawHistory
        ),
      }),
    }).catch((e) => {
      console.error(e);
      throw new Error(`Ollama:streamChat ${error.message}`);
    });

    return { type: "ollamaStream", response };
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const textResponse = await fetch(`${this.basePath}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature,
        },
      }),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `Ollama:getChatCompletion ${res.status} ${res.statusText}`
          );
        return res.json();
      })
      .then((data) => data?.message?.content)
      .catch((e) => {
        console.error(e);
        throw new Error(
          `Ollama::getChatCompletion failed with: ${error.message}`
        );
      });

    if (!textResponse.length)
      throw new Error(`Ollama::getChatCompletion text response was empty.`);

    return textResponse;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const response = await fetch(`${this.basePath}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        stream: true,
        messages,
        options: {
          temperature,
        },
      }),
    }).catch((e) => {
      console.error(e);
      throw new Error(`Ollama:streamGetChatCompletion ${error.message}`);
    });

    return { type: "ollamaStream", response };
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  OllamaAILLM,
};
