const AIbitat = require("../../agents/aibitat");

/**
 * Execute an LLM instruction flow step
 * @param {Object} config Flow step configuration
 * @param {{introspect: Function, variables: Object, logger: Function}} context Execution context with introspect function
 * @returns {Promise<string>} Processed result
 */
async function executeLLMInstruction(config, context) {
  const { instruction, inputVariable, resultVariable } = config;
  const { introspect, variables, logger, aibitat } = context;
  logger(
    `\x1b[43m[AgentFlowToolExecutor]\x1b[0m - executing LLM Instruction block`
  );
  introspect(`Processing data with LLM instruction...`);

  if (!variables[inputVariable]) {
    logger(`Input variable ${inputVariable} not found`);
    throw new Error(`Input variable ${inputVariable} not found`);
  }

  try {
    logger(
      `Sending request to LLM (${aibitat.defaultProvider.provider}::${aibitat.defaultProvider.model})`
    );
    introspect(`Sending request to LLM...`);

    // Ensure the input is a string since we are sending it to the LLM direct as a message
    let input = variables[inputVariable];
    if (typeof input === "object") input = JSON.stringify(input);
    if (typeof input !== "string") input = String(input);

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
    if (resultVariable) config.resultVariable = resultVariable;
    return completion.result;
  } catch (error) {
    logger(`LLM processing failed: ${error.message}`, error);
    throw new Error(`LLM processing failed: ${error.message}`);
  }
}

module.exports = executeLLMInstruction;
