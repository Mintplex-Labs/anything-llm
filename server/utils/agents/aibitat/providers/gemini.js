const { GoogleGenerativeAI } = require("@google/generative-ai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

/**
 * The agent provider for the Gemini provider.
 */
class GeminiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(_config = {}) {
    super();
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key was set.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = process.env.GEMINI_LLM_MODEL_PREF || "gemini-pro";
    this._client = genAI.getGenerativeModel(
      { model: this.model },
      {
        apiVersion:
          this.model === "gemini-1.5-pro-latest" ||
          this.model === "gemini-1.5-flash-latest"
            ? "v1beta"
            : "v1",
      }
    );
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  #safetySettings() {
    const threshold =
      process.env.GEMINI_SAFETY_SETTING ?? "BLOCK_MEDIUM_AND_ABOVE";
    return [
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold },
      { category: "HARM_CATEGORY_HARASSMENT", threshold },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold },
    ];
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

    // Validate that after every user message, there is a model message
    // sometimes when using gemini we try to compress messages in order to retain as
    // much context as possible but this may mess up the order of the messages that the gemini model expects
    // we do this check to work around the edge case where 2 user prompts may be next to each other, in the message array
    for (let i = 0; i < allMessages.length; i++) {
      if (
        allMessages[i].role === "user" &&
        i < allMessages.length - 1 &&
        allMessages[i + 1].role !== "model"
      ) {
        allMessages.splice(i + 1, 0, {
          role: "model",
          parts: [{ text: "Okay." }],
        });
      }
    }

    return allMessages;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    const formattedMessages = this.formatMessages(messages);
    const chatThread = this.client.startChat({
      history: formattedMessages,
      safetySettings: this.#safetySettings(),
    });

    try {
      const result = await chatThread.sendMessage(
        formattedMessages[formattedMessages.length - 1].parts[0].text
      );
      return result.response.text();
    } catch (error) {
      console.error("Error in Gemini chat:", error);
      return null;
    }
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = null) {
    try {
      let completion;
      if (functions && functions.length > 0) {
        const { toolCall, text } = await this.functionCall(
          messages,
          functions,
          this.#handleFunctionCallChat.bind(this)
        );

        if (toolCall !== null) {
          this.providerLog(`Valid tool call found - running ${toolCall.name}.`);
          this.deduplicator.trackRun(toolCall.name, toolCall.arguments);
          return {
            result: null,
            functionCall: {
              name: toolCall.name,
              arguments: toolCall.arguments,
            },
            cost: 0,
          };
        }
        completion = { content: text };
      }

      if (!completion?.content) {
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const formattedMessages = this.formatMessages(this.cleanMsgs(messages));
        const chatThread = this.client.startChat({
          history: formattedMessages.slice(0, -1),
          safetySettings: this.#safetySettings(),
        });
        const result = await chatThread.sendMessage(
          formattedMessages[formattedMessages.length - 1].parts[0].text
        );
        completion = { content: result.response.text() };
      }

      this.deduplicator.reset("runs");
      return {
        result: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since Gemini has no cost basis in this implementation.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = GeminiProvider;
