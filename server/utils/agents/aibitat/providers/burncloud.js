const { OpenAI } = require("openai");
const { RetryError } = require("../error.js");
const Provider = require("./ai-provider.js");

/**
 * The agent provider for the BurnCloud API.
 * Using OpenAI-compatible interface for broad model support.
 */
class BurnCloudProvider extends Provider {
  model;

  constructor(config = {}) {
    const {
      options = {
        apiKey: process.env.BURNCLOUD_API_KEY,
        baseURL: process.env.BURNCLOUD_BASE_URL || "https://ai.burncloud.com/v1",
      },
      model = "claude-3-5-sonnet-20241022",
    } = config;

    const client = new OpenAI(options);
    super(client);
    this.model = model;
  }

  get requiredEnvs() {
    return ["BURNCLOUD_API_KEY"];
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the BurnCloud API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: this.#cleanMsgs(messages),
        ...(Array.isArray(functions) && functions?.length > 0
          ? { 
              tools: functions.map(func => ({
                type: "function",
                function: func
              }))
            }
          : {}),
      });

      // Handle tool/function calls
      if (response.choices?.[0]?.message?.tool_calls) {
        const toolCall = response.choices[0].message.tool_calls[0];
        return {
          result: null,
          functionCall: {
            name: toolCall.function.name,
            arguments: JSON.parse(toolCall.function.arguments),
          },
          cost: 0,
        };
      }

      return {
        result: response.choices?.[0]?.message?.content || "No response generated.",
        cost: 0,
      };
    } catch (error) {
      // Handle different types of errors appropriately
      if (error?.status === 401) throw error;
      if (error?.status === 429 || error?.status >= 500) {
        throw new RetryError(error.message);
      }
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since BurnCloud may have different pricing models
   */
  getCost(_usage) {
    return 0;
  }

  /**
   * Cleans the messages array by removing any invalid messages.
   * @param {Array<any>} messages - The messages array to clean.
   * @returns {Array<any>} The cleaned messages array.
   */
  #cleanMsgs(messages = []) {
    return messages.map((msg) => {
      if (typeof msg.content === "string") return msg;
      return { role: msg.role, content: JSON.stringify(msg.content) };
    });
  }
}

module.exports = BurnCloudProvider; 