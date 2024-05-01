const { safeJsonParse } = require("../../../http");
const { Deduplicator } = require("../utils/dedupe");

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

  formatFuncs(functions = []) {
    const funcs = [];
    functions.forEach((def) => {
      funcs.push({
        name: def.name,
        description: def.description,
        properties: def.properties,
      });
    });

    return JSON.stringify(funcs, null, 2);
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

  async functionCall(messages, functions) {
    const history = [...messages].filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
    if (history[history.length - 1].role !== "user") return null;

    const response = await this.client.chat.completions
      .create({
        model: this.model,
        temperature: 0,
        messages: [
          {
            content: `You are a program which picks the most optimal function and parameters to call. 
DO NOT HAVE TO PICK A FUNCTION IF IT WILL NOT HELP ANSWER OR FULFILL THE USER'S QUERY.
When a function is selection, respond in JSON with no additional text.
When there is no relevant function to call - return with a regular chat text response.
Your task is to pick a **single** function that we will use to call, if any seem useful or relevant for the user query.

Example of Tool definitions:
[
  {
    name: 'rag-memory',
    description: 'Search against local documents for context that is relevant to the query or store a snippet of text into memory for retrieval later. Storing information should only be done when the user specifically requests for information to be remembered or saved to long-term memory. You should use this tool before search the internet for information.',
    parameters: {
      '$schema': 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: [
        action: {
          type: "string",
          enum: ["search", "store"],
          description:
            "The action we want to take to search for existing similar context or storage of new context.",
        },
        content: {
          type: "string",
          description:
            "The plain text to search our local documents with or to store in our vector database.",
        },
      ],
      additionalProperties: false
    }
  },
  {
    name: 'web-scraping',
    description: 'Scrapes the content of a webpage or online resource from a URL.',
    parameters: {
      '$schema': 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: [
        url: {
          type: "string",
          format: "uri",
          description: "A web URL.",
        },
      ],
      additionalProperties: false
    },
  }
]

Example Query:
User: Scrape https://example.com
Your response (JSON ONLY): 
{
  name: 'web-scraping'.
  arguments: {
    url: 'https://example.com'
  }
}

Example Query where tool cannot be used:
User: Hello!
Your response (Text Only): Hello, how are you today?

The available function and their definitions are listed below - respond only with JSON or a regular chat response.
${this.formatFuncs(functions)}

Now, assess the next function to call:
`,
            role: "system",
          },
          ...history,
        ],
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("LMStudio chat: No results!");
        if (result.choices.length === 0)
          throw new Error("LMStudio chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch((_) => {
        return null;
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
