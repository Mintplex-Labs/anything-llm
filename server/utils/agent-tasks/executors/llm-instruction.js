const AIbitat = require("../../agents/aibitat");

/**
 * Execute an LLM instruction task
 * @param {Object} config Task configuration
 * @param {Object} context Execution context with introspect function
 * @returns {Promise<string>} Processed result
 */
async function executeLLMInstruction(config, context) {
  const { instruction, inputVariable, resultVariable } = config;
  const { introspect, variables } = context;

  introspect(`Processing data with LLM instruction...`);

  if (!variables[inputVariable]) {
    throw new Error(`Input variable ${inputVariable} not found`);
  }

  const input = variables[inputVariable];

  try {
    introspect(`Sending request to LLM...`);
    const aibitat = new AIbitat();

    const provider = aibitat.getProviderForConfig(aibitat.defaultProvider);

    const completion = await provider.complete([
      {
        role: "system",
        content: `Follow these instructions carefully: ${instruction}`,
      },
      {
        role: "user",
        content: input,
      },
    ]);

    introspect(`Successfully received LLM response`);
    if (resultVariable) {
      config.resultVariable = resultVariable;
    }
    return completion.result;
  } catch (error) {
    throw new Error(`LLM processing failed: ${error.message}`);
  }
}

module.exports = executeLLMInstruction;
