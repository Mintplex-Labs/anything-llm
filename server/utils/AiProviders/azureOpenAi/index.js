const { AzureOpenAiEmbedder } = require("../../EmbeddingEngines/azureOpenAi");

class AzureOpenAiLLM extends AzureOpenAiEmbedder {
  constructor() {
    super();
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    if (!process.env.AZURE_OPENAI_ENDPOINT)
      throw new Error("No Azure API endpoint was set.");
    if (!process.env.AZURE_OPENAI_KEY)
      throw new Error("No Azure API key was set.");

    this.openai = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
  }

  isValidChatModel(_modelName = "") {
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
    // Not implemented by Azure OpenAI so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}) {
    const model = process.env.OPEN_MODEL_PREF;
    if (!model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const textResponse = await this.openai
      .getChatCompletions(
        model,
        [
          { role: "system", content: "" },
          ...chatHistory,
          { role: "user", content: prompt },
        ],
        {
          temperature: Number(workspace?.openAiTemp ?? 0.7),
          n: 1,
        }
      )
      .then((res) => {
        if (!res.hasOwnProperty("choices"))
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        console.log(error);
        throw new Error(
          `AzureOpenAI::getChatCompletions failed with: ${error.message}`
        );
      });
    return textResponse;
  }

  async getChatCompletion(messages = [], { temperature = 0.7 }) {
    const model = process.env.OPEN_MODEL_PREF;
    if (!model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const data = await this.openai.getChatCompletions(model, messages, {
      temperature,
    });
    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }
}

module.exports = {
  AzureOpenAiLLM,
};
