const {
  GoogleGenerativeAI,
  FunctionDeclarationSchemaType,
} = require("@google/generative-ai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");

/**
 * The provider for the Gemini API.
 * By default, the model is set to 'gemini-pro'.
 */
class GeminiProvider extends Provider {
  model;
  client;
  constructor(config = {}) {
    const {
      options = {
        apiKey: process.env.GEMINI_API_KEY,
      },
      model = "gemini-pro",
    } = config;

    super(null);

    this.model = model;
    this.options = options;
  }

  async initializeClient(functions = []) {
    const genAI = new GoogleGenerativeAI(this.options.apiKey);

    // const functionDeclarations = functions?.map((func) => ({
    //   name: func.name,
    //   parameters: func.parameters,
    // }));

    const functionDeclarations = [
      {
        name: "web-browsing",
        description: "Searches for a given query using a search engine.",
        parameters: {
          description:
            "Searches for a given query using a search engine to get better results for the user query.",
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            query: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "A search query.",
            },
          },
        },
      },
      {
        name: "convertCtoF",
        description: "Convert temperature from Celsius to Fahrenheit",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            value: { type: FunctionDeclarationSchemaType.NUMBER },
          },
          required: ["value"],
        },
      },
    ];

    console.log(
      "functionDeclarations",
      JSON.stringify(functionDeclarations, null, 2)
    );

    this.client = genAI.getGenerativeModel(
      {
        model: this.model,
        tools: {
          functionDeclarations: [functionDeclarations],
        },
      },
      {
        // Tools are only available on v1beta
        apiVersion: "v1beta",
      }
    );

    console.log("this.client", JSON.stringify(this.client, null, 2));
  }

  formatMessages(messages = []) {
    // Gemini roles are either user || model.
    // and all "content" is relabeled to "parts"
    const allMessages = messages
      .map((message) => {
        if (message.role === "system")
          return { role: "user", parts: [{ text: message.content }] };
        if (message.role === "user")
          return { role: "user", parts: [{ text: message.content }] };
        if (message.role === "assistant")
          return { role: "model", parts: [{ text: message.content }] };
        return null;
      })
      .filter((msg) => !!msg);

    // Specifically, Google cannot have the last sent message be from a user with no assistant reply
    // otherwise it will crash. So if the last item is from the user, it was not completed so pop it off
    // the history.
    if (
      allMessages.length > 0 &&
      allMessages[allMessages.length - 1].role === "user"
    )
      allMessages.pop();
    return allMessages;
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the Gemini API.
   * @param functions An array of function declarations to pass to the model.
   * @returns The completion.
   */
  async complete(messages, functions = null) {
    try {
      // TODO: Check if functions changed then re-initialize client if it has changed
      if (!this.client) {
        await this.initializeClient(functions);
      }

      const prompt = {
        role: "user",
        parts: [
          {
            text: "research aapl stock for me",
          },
        ],
      };

      const response = await this.client.generateContent({
        contents: [prompt],
      });

      console.log("RESPONSE", JSON.stringify(response, null, 2));
      //   console.log("FORMATTING MESSAGES", this.formatMessages(messages));
      //   const chat = this.client.startChat({
      //     history: this.formatMessages(messages),
      //   });

      //   let response;
      //   const userPrompt = messages.find(
      //     (message) => message.role === "user"
      //   )?.content;

      //   response = await chat.sendMessage(userPrompt);

      //   if (response.response.functionCalls()[0]) {
      //     const call = response.response.functionCalls()[0];

      //     if (call) {
      //       const functionHandler = functions.find(
      //         (func) => func.name === call.name
      //       )?.handler;

      //       if (functionHandler) {
      //         const functionResponse = await functionHandler(call.args);
      //         response = await chat.sendMessage([
      //           {
      //             functionResponse: {
      //               name: call.name,
      //               response: functionResponse,
      //             },
      //           },
      //         ]);
      //       }
      //     }
      //   }

      //   const completion = response.response.text();
      //   const cost = this.getCost();

      //   return { result: completion, cost };
    } catch (error) {
      if (error instanceof RetryError) {
        throw error;
      }
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }

  /**
   * Get the cost of the completion.
   *
   * @returns The cost of the completion.
   * Stubbed since Gemini has no cost basis.
   */
  getCost() {
    return 0;
  }
}

module.exports = GeminiProvider;
