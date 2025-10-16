const { safeJsonParse } = require("../../../../http");
const { Deduplicator } = require("../../utils/dedupe");
const { v4 } = require("uuid");

// Useful inheritance class for a model which supports OpenAi schema for API requests
// but does not have tool-calling or JSON output support.
class UnTooled {
  constructor() {
    this.deduplicator = new Deduplicator();
  }

  cleanMsgs(messages) {
    const modifiedMessages = [];
    messages.forEach((msg) => {
      if (msg.role === "function") {
        const prevMsg = modifiedMessages[modifiedMessages.length - 1].content;
        modifiedMessages[modifiedMessages.length - 1].content =
          `${prevMsg}\n${msg.content}`;
        return;
      }
      modifiedMessages.push(msg);
    });
    return modifiedMessages;
  }

  showcaseFunctions(functions = []) {
    let output = "";
    functions.forEach((def) => {
      let shotExample = `-----------
Function name: ${def.name}
Function Description: ${def.description}
Function parameters in JSON format:
${JSON.stringify(def.parameters.properties, null, 4)}\n`;

      if (Array.isArray(def.examples)) {
        def.examples.forEach(({ prompt, call }) => {
          shotExample += `Query: "${prompt}"\nJSON: ${JSON.stringify({
            name: def.name,
            arguments: safeJsonParse(call, {}),
          })}\n`;
        });
      }
      output += `${shotExample}-----------\n`;
    });
    return output;
  }

  /**
   * Validate a function call against a list of functions.
   * @param {{name: string, arguments: Object}} functionCall - The function call to validate.
   * @param {Object[]} functions - The list of functions definitions to validate against.
   * @return {{valid: boolean, reason: string|null}} - The validation result.
   */
  validFuncCall(functionCall = {}, functions = []) {
    if (
      !functionCall ||
      !functionCall?.hasOwnProperty("name") ||
      !functionCall?.hasOwnProperty("arguments")
    ) {
      return {
        valid: false,
        reason: "Missing name or arguments in function call.",
      };
    }

    const foundFunc = functions.find((def) => def.name === functionCall.name);
    if (!foundFunc)
      return { valid: false, reason: "Function name does not exist." };

    const schemaProps = Object.keys(foundFunc?.parameters?.properties || {});
    const requiredProps = foundFunc?.parameters?.required || [];
    const providedProps = Object.keys(functionCall.arguments);

    for (const requiredProp of requiredProps) {
      if (!providedProps.includes(requiredProp)) {
        return {
          valid: false,
          reason: `Missing required argument: ${requiredProp}`,
        };
      }
    }

    // Ensure all provided arguments are valid for the schema
    // This is to prevent the model from hallucinating or providing invalid additional arguments.
    for (const providedProp of providedProps) {
      if (!schemaProps.includes(providedProp)) {
        return {
          valid: false,
          reason: `Unknown argument: ${providedProp} provided but not in schema.`,
        };
      }
    }

    return { valid: true, reason: null };
  }

  buildToolCallMessages(history = [], functions = []) {
    return [
      {
        content: `You are a program which picks the most optimal function and parameters to call.
      DO NOT HAVE TO PICK A FUNCTION IF IT WILL NOT HELP ANSWER OR FULFILL THE USER'S QUERY.
      When a function is selection, respond in JSON with no additional text.
      When there is no relevant function to call - return with a regular chat text response.
      Your task is to pick a **single** function that we will use to call, if any seem useful or relevant for the user query.

      All JSON responses should have two keys.
      'name': this is the name of the function name to call. eg: 'web-scraper', 'rag-memory', etc..
      'arguments': this is an object with the function properties to invoke the function.
      DO NOT INCLUDE ANY OTHER KEYS IN JSON RESPONSES.

      Here are the available tools you can use an examples of a query and response so you can understand how each one works.
      ${this.showcaseFunctions(functions)}

      Now pick a function if there is an appropriate one to use given the last user message and the given conversation so far.`,
        role: "system",
      },
      ...history,
    ];
  }

  async functionCall(messages, functions, chatCb = null) {
    const history = [...messages].filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
    if (history[history.length - 1].role !== "user") return null;
    const historyMessages = this.buildToolCallMessages(history, functions);
    const response = await chatCb({ messages: historyMessages });

    const call = safeJsonParse(response, null);
    if (call === null) return { toolCall: null, text: response }; // failed to parse, so must be text.

    const { valid, reason } = this.validFuncCall(call, functions);
    if (!valid) {
      this.providerLog(`Invalid function tool call: ${reason}.`);
      return { toolCall: null, text: null };
    }

    if (this.deduplicator.isDuplicate(call.name, call.arguments)) {
      this.providerLog(
        `Function tool with exact arguments has already been called this stack.`
      );
      return { toolCall: null, text: null };
    }

    return { toolCall: call, text: null };
  }

  async streamingFunctionCall(
    messages,
    functions,
    chatCb = null,
    eventHandler = null
  ) {
    const history = [...messages].filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
    if (history[history.length - 1].role !== "user") return null;

    const msgUUID = v4();
    let textResponse = "";
    const historyMessages = this.buildToolCallMessages(history, functions);
    const stream = await chatCb({ messages: historyMessages });

    eventHandler?.("reportStreamEvent", {
      type: "statusResponse",
      uuid: v4(),
      content: "Agent is thinking...",
    });

    for await (const chunk of stream) {
      if (!chunk?.choices?.[0]) continue; // Skip if no choices
      const choice = chunk.choices[0];

      if (choice.delta?.content) {
        textResponse += choice.delta.content;
        eventHandler?.("reportStreamEvent", {
          type: "statusResponse",
          uuid: msgUUID,
          content: choice.delta.content,
        });
      }
    }

    const call = safeJsonParse(textResponse, null);
    if (call === null)
      return { toolCall: null, text: textResponse, uuid: msgUUID }; // failed to parse, so must be regular text response.

    const { valid, reason } = this.validFuncCall(call, functions);
    if (!valid) {
      this.providerLog(`Invalid function tool call: ${reason}.`);
      eventHandler?.("reportStreamEvent", {
        type: "removeStatusResponse",
        uuid: msgUUID,
        content:
          "The model attempted to make an invalid function call - it was ignored.",
      });
      return { toolCall: null, text: null, uuid: msgUUID };
    }

    if (this.deduplicator.isDuplicate(call.name, call.arguments)) {
      this.providerLog(
        `Function tool with exact arguments has already been called this stack.`
      );
      eventHandler?.("reportStreamEvent", {
        type: "removeStatusResponse",
        uuid: msgUUID,
        content:
          "The model tried to call a function with the same arguments as a previous call - it was ignored.",
      });
      return { toolCall: null, text: null, uuid: msgUUID };
    }

    eventHandler?.("reportStreamEvent", {
      uuid: `${msgUUID}:tool_call_invocation`,
      type: "toolCallInvocation",
      content: `Parsed Tool Call: ${call.name}(${JSON.stringify(call.arguments)})`,
    });
    return { toolCall: call, text: null, uuid: msgUUID };
  }

  /**
   * Stream a chat completion from the LLM with tool calling
   * Note: This using the OpenAI API format and may need to be adapted for other providers.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} chatCallback - A callback function to handle the chat completion.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(
    messages,
    functions = [],
    chatCallback = null,
    eventHandler = null
  ) {
    this.providerLog("Untooled.stream - will process this chat completion.");
    try {
      let completion = { content: "" };
      if (functions.length > 0) {
        const {
          toolCall,
          text,
          uuid: msgUUID,
        } = await this.streamingFunctionCall(
          messages,
          functions,
          chatCallback,
          eventHandler
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

        if (text) {
          this.providerLog(
            `No tool call found in the response - will send as a full text response.`
          );
          completion.content = text;
          eventHandler?.("reportStreamEvent", {
            type: "removeStatusResponse",
            uuid: msgUUID,
            content: "No tool call found in the response",
          });
          eventHandler?.("reportStreamEvent", {
            type: "statusResponse",
            uuid: v4(),
            content: "Done thinking.",
          });
          eventHandler?.("reportStreamEvent", {
            type: "fullTextResponse",
            uuid: v4(),
            content: text,
          });
        }
      }

      if (!completion?.content) {
        eventHandler?.("reportStreamEvent", {
          type: "statusResponse",
          uuid: v4(),
          content: "Done thinking.",
        });

        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const msgUUID = v4();
        completion = { content: "" };
        const stream = await chatCallback({
          messages: this.cleanMsgs(messages),
        });

        for await (const chunk of stream) {
          if (!chunk?.choices?.[0]) continue; // Skip if no choices
          const choice = chunk.choices[0];
          if (choice.delta?.content) {
            completion.content += choice.delta.content;
            eventHandler?.("reportStreamEvent", {
              type: "textResponseChunk",
              uuid: msgUUID,
              content: choice.delta.content,
            });
          }
        }
      }

      // The UnTooled class inherited Deduplicator is mostly useful to prevent the agent
      // from calling the exact same function over and over in a loop within a single chat exchange
      // _but_ we should enable it to call previously used tools in a new chat interaction.
      this.deduplicator.reset("runs");
      return {
        textResponse: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @param chatCallback - A callback function to handle the chat completion.
   * @returns The completion.
   */
  async complete(messages, functions = [], chatCallback = null) {
    this.providerLog("Untooled.complete - will process this chat completion.");
    try {
      let completion = { content: "" };
      if (functions.length > 0) {
        const { toolCall, text } = await this.functionCall(
          messages,
          functions,
          chatCallback
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
        completion.content = text;
      }

      // If there are no functions, we want to run a normal chat completion.
      if (!completion?.content) {
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const response = await chatCallback({
          messages: this.cleanMsgs(messages),
        });
        // If the response from the callback is the raw OpenAI Spec response object, we can use that directly.
        // Otherwise, we will assume the response is just the string output we wanted (see: `#handleFunctionCallChat` which returns the content only)
        // This handles both streaming and non-streaming completions.
        completion =
          typeof response === "string"
            ? { content: response }
            : response.choices?.[0]?.message;
      }

      // The UnTooled class inherited Deduplicator is mostly useful to prevent the agent
      // from calling the exact same function over and over in a loop within a single chat exchange
      // _but_ we should enable it to call previously used tools in a new chat interaction.
      this.deduplicator.reset("runs");
      return {
        textResponse: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UnTooled;
