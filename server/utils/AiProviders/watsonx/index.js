const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { IamTokenManager } = require("ibm-watson/auth");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { input } = require("@inquirer/prompts");

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

    // this.watsonx.listFoundationModelSpecs().then((response) => {
    //   let obj = response.result.resources.find(
    //     (o) => o.model_id === process.env.WATSONX_AI_MODEL
    //   );
    //   console.log(obj.model_limits.max_sequence_length);
    //   console.log(this.model);
    //   this.test = obj.model_limits.max_sequence_length
    // });

    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
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
    return !!process.env.WATSONX_TOKEN_LIMIT
      ? Number(process.env.WATSONX_TOKEN_LIMIT)
      : 4096;
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
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const data = await this.watsonx.getChatCompletions(this.model, messages, {
      temperature,
    });
    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  formatMessages(messages) {
    let input = "";
    messages.forEach((message, index) => {
      if (message.role == "system") {
        input += "[INST]<<SYS>>\n";
        input += `${message.content}\n`;
        input += "<</SYS>>\n\n";
      } else {
        input += `${message.content} [INST]\n\n`;
      }
    });
    console.log(input);
    return input;
  }

  async streamGetChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const data = {
      input: this.formatMessages(messages),
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 900,
        min_new_tokens: 0,
        stop_sequences: [],
        repetition_penalty: 1,
      },
      model_id: this.model,
      project_id: this.projectId,
    };

    const stream = await fetch(
      "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation_stream?version=2023-05-29",
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
    console.log(stream);

    return stream.body;
  }

  parseStreamResult(result) {
    const lines = result.split("\n");
    const events = [];
    let event = {};

    lines.forEach((line) => {
      if (line.startsWith("id:")) {
        event.id = line.slice(4);
      } else if (line.startsWith("event:")) {
        event.event = line.slice(7);
      } else if (line.startsWith("data:")) {
        event.data = JSON.parse(line.slice(6));
      } else if (line === "") {
        if (Object.keys(event).length > 0) {
          events.push(event);
          event = {};
        }
      }
    });

    return events;
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
      //const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");
      let chunks = "";

      // try {
      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;

      //     chunks += decoder.decode(value, { stream: true });
      //   }

      //   // Convert the accumulated chunks to JSON
      //   const jsonData = JSON.parse(chunks);

      //   console.log('JSON Data:', jsonData);
      // } catch (error) {
      //   console.error('Error reading stream or parsing JSON:', error);
      // } finally {
      //   reader.releaseLock();
      // }

      for await (const chunk of stream) {
        const decodedChunk = decoder.decode(chunk);
        const lines = decodedChunk.split("\n");
        console.log(lines);
        const parsedLines = lines.map((line) => {
          console.log(line.replace(/^data: /, ""));
          line.replace(/^data: /, "").trim();
        });
        console.log(parsedLines);
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
