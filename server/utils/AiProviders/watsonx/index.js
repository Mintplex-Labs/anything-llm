const WatsonxAiMlVmlv1 = require("@ibm-cloud/watsonx-ai/dist/watsonx-ai-ml/vml-v1");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
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
        input += "SYSTEM: \n";
      } else {
        input += "USER: \n";
      }
      input += `${message.content}\n\n`;
    });

    console.log(input);
    return input;
  }

  async streamGetChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    console.log(messages);

    const stream = await this.watsonx.textGenerationStream({
      modelId: this.model,
      input: this.formatMessages(messages),
      projectId: this.projectId,
    });
    return stream;
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

      for await (const event of stream) {
        for (const choice of event.choices) {
          const delta = choice.delta?.content;
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
