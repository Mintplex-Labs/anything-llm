const { safeJsonParse } = require("../../../../http");
const { Deduplicator } = require("../../utils/dedupe");

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
          shotExample += `Query: "${prompt}"\nJSON: ${call}\n`;
        });
      }
      output += `${shotExample}-----------\n`;
    });
    return output;
  }

  /**
   * Check if two arrays of strings or numbers have the same values
   * @param {string[]|number[]} arr1
   * @param {string[]|number[]} arr2
   * @param {Object} [opts]
   * @param {boolean} [opts.enforceOrder] - By default (false), the order of the values in the arrays doesn't matter.
   * @return {boolean}
   */
  compareArrays(arr1, arr2, opts) {
    function vKey(i, v) {
      return (opts?.enforceOrder ? `${i}-` : "") + `${typeof v}-${v}`;
    }

    if (arr1.length !== arr2.length) return false;

    const d1 = {};
    const d2 = {};
    for (let i = arr1.length - 1; i >= 0; i--) {
      d1[vKey(i, arr1[i])] = true;
      d2[vKey(i, arr2[i])] = true;
    }

    for (let i = arr1.length - 1; i >= 0; i--) {
      const v = vKey(i, arr1[i]);
      if (d1[v] !== d2[v]) return false;
    }

    for (let i = arr2.length - 1; i >= 0; i--) {
      const v = vKey(i, arr2[i]);
      if (d1[v] !== d2[v]) return false;
    }

    return true;
  }

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
    if (!foundFunc) {
      return { valid: false, reason: "Function name does not exist." };
    }

    const props = Object.keys(foundFunc.parameters.properties);
    const fProps = Object.keys(functionCall.arguments);
    if (!this.compareArrays(props, fProps)) {
      return { valid: false, reason: "Invalid argument schema match." };
    }

    return { valid: true, reason: null };
  }

  async functionCall(messages, functions, chatCb = null) {
    const history = [...messages].filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
    if (history[history.length - 1].role !== "user") return null;
    const response = await chatCb({
      messages: [
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
      ],
    });

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
}

module.exports = UnTooled;
