const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { IamTokenManager } = require("ibm-watson/auth");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");

class WatsonxLLM {
  constructor(embedder = null, _modelPreference = null) {
    const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
    if (!process.env.WATSONX_AI_ENDPOINT)
      throw new Error("No Watsonx API endpoint was set.");
    if (!process.env.WATSONX_AI_APIKEY)
      throw new Error("No Watsonx API key was set.");
    this.auth = new IamTokenManager({
      apikey: process.env.WATSONX_AI_APIKEY || "",
    });

    this.watsonx = WatsonXAI.newInstance({
      version: "2024-05-31",
      serviceUrl: process.env.WATSONX_AI_ENDPOINT,
    });

    this.model = process.env.WATSONX_AI_MODEL;
    this.projectId = process.env.WATSONX_AI_PROJECT_ID;

    this.guardrail = process.env.WATSONX_GUARD_RAILS_ENABLED;
    this.limits = {};

    this.limitPromise = this.promptWindowLimit().then((result) => {
      this.limits = result;
    });

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => {
          return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
        })
        .join("")
    );
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  // Sure the user selected a proper value for the token limit
  // could be any of these https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4-models
  // and if undefined - assume it is the lowest end.
  promptWindowLimit() {
    return this.watsonx.listFoundationModelSpecs().then((response) => {
      console.log('response.result.resources', response.result.resources)
      let obj = response.result.resources.find(
        (o) => o.model_id === process.env.WATSONX_AI_MODEL
      );
      if (!obj) {
        throw new Error(`wrong llm model configured: ${process.env.WATSONX_AI_MODEL} does not exist. available: ${response.result.resources.map(x => x.model_id)}`);
      }
      if (process.env.WATSONX_TOKEN_LIMIT) {
        return Number(process.env.WATSONX_TOKEN_LIMIT) >
          Number(obj.model_limits.max_sequence_length)
          ? Number(obj.model_limits.max_sequence_length)
          : Number(process.env.WATSONX_TOKEN_LIMIT);
      } else {
        console.log();
        return Number(obj.model_limits.max_sequence_length);
      }
    });
  }

  isValidChatCompletionModel(_modelName = "") {
    // The Azure user names their "models" as deployments and they can be any name
    // so we rely on the user to put in the correct deployment as only they would
    // know it.
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
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async isSafe(_input = "") {
    // Not implemented by Azure OpenAI so must be stubbed
    return { safe: true, reasons: [] };
  }

  async getChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No WATSONX_AI_MODEL in ENV defined. This must the id of your model on watsonx.ai"
      );

    const data = await this.watsonx.textGeneration(
      this.getWatsonxPayload(messages)
    );
    if (!data.hasOwnProperty("result")) return null;
    return data.result.results[0].generated_text;
  }

  formatMessages(messages) {
    let input = "";
    // TODO: Adapt different Prompt settings for model types
    messages.forEach((message, index) => {
      if (message.role == "system") {
        input += `
        <|system|>
        ${message.content}
        <|user|>
        `;
      } else {
        input += `${message.content}\n<|assistant|>\n\n`;
      }
    });

    return input;
  }

  async getWatsonxPayload(messages) {
    await this.limitPromise;

    let data = {
      input: this.formatMessages(messages),
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: this.limits - 1,
        min_new_tokens: 0,
        stop_sequences: [],
        repetition_penalty: 1,
      },
      model_id: this.model,
      project_id: this.projectId,
    };
    // adding guard rail settings when necessary
    if (this.guardrail === "true") {
      data["moderations"] = {
        hap: {
          input: {
            enabled: true,
            threshold: 0.5,
            mask: {
              remove_entity_value: true,
            },
          },
          output: {
            enabled: true,
            threshold: 0.5,
            mask: {
              remove_entity_value: true,
            },
          },
        },
      };
    }
    return data;
  }

  async streamGetChatCompletion(messages = []) {
    if (!this.model)
      throw new Error(
        "No WATSONX_AI_MODEL in ENV defined. This must the id of your model on watsonx.ai."
      );

    const data = await this.getWatsonxPayload(messages);
    console.log(data);
    const stream = await fetch(
      `${process.env.WATSONX_AI_ENDPOINT}/ml/v1/text/generation_stream?version=2024-05-31`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${await this.auth.getToken()}`,
        },
        body: JSON.stringify(data),
      }
    );

    return stream.body;
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => clientAbortedHandler(resolve, fullText);
      response.on("close", handleAbort);
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8", {
        stream: true,
      });

      try {
        let collectedChunks = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const decodedChunk = decoder.decode(value);
          collectedChunks += decodedChunk;

          console.log('collectedChunks', collectedChunks)

          // we cache the chunks incase two parts of different events are in the same chunk
          if (collectedChunks.includes("\n\n")) {
            const overlappingEvents = collectedChunks.split("\n\n");
            const decodedLines = overlappingEvents
              .slice(0, -1)
              .join("\n")
              .split("\n");
            let parsedLines = decodedLines
              .filter((line) => line.startsWith("data: {"))
              .map((line) => {
                console.log('line', line);
                line = line.replace(/^data: /, "").trim();
                return line;
              });

            collectedChunks = "" + overlappingEvents.slice(-1)[0];
            for (const parsedLine of parsedLines) {
              try {
                const data = JSON.parse(parsedLine);
                const delta = data.results[0].generated_text;

                if (!delta) continue;
                fullText += delta;
                writeResponseChunk(response, {
                  uuid,
                  sources: [],
                  type: "textResponseChunk",
                  textResponse: delta,
                  close: false,
                  error: false,
                });
              } catch {
                console.error("Invalid JSON in: ", parsedLines);
                throw new Error("Invalid JSON in: " + parsedLines);
              }
            }
          }
        }
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: false,
        });
        response.removeListener("close", handleAbort);
        resolve(fullText);
      } catch (error) {
        console.error("Error reading stream or parsing JSON:", error);
      } finally {
        reader.releaseLock();
      }
    });
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
  WatsonxLLM,
};

class SSEStream {
  constructor(response) {
    this.buffer = "";
    this.response = response;
    this.response.on("data", (chunk) => this.handleData(chunk));
    this.response.on("end", () => this.handleEnd());
    this.response.on("error", (error) => this.handleError(error));
  }

  handleData(chunk) {
    this.buffer += chunk.toString();
    while (this.parseBuffer()) {}
  }

  handleEnd() {
    this.parseBuffer();
  }

  handleError(error) {
    this.emit("error", error);
  }

  parseBuffer() {
    const endOfLine = this.buffer.indexOf("\n");
    if (endOfLine === -1) {
      return false;
    }

    const line = this.buffer.slice(0, endOfLine);
    this.buffer = this.buffer.slice(endOfLine + 1);

    if (line.startsWith("data:")) {
      const jsonData = JSON.parse(line.substring(5).trim());
      this.emit("data", jsonData);
    }

    return true;
  }

  emit(event, data) {
    if (event === "data") {
      if (this.onData) {
        this.onData(data);
      }
    } else if (event === "error") {
      if (this.onError) {
        this.onError(data);
      }
    }
  }

  on(event, callback) {
    if (event === "data") {
      this.onData = callback;
    } else if (event === "error") {
      this.onError = callback;
    }
  }
}
