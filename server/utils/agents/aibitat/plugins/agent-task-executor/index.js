const executeApiCall = require("./executors/api-call");
const executeWebsiteAction = require("./executors/website");
const executeFileOperation = require("./executors/file");
const executeCode = require("./executors/code");
const TASK_TYPES = require("./task-types");

// Simple utilities for task execution
function replaceVariables(config, variables) {
  const configStr = JSON.stringify(config);
  const replaced = configStr.replace(/\${([^}]+)}/g, (match, varName) => {
    return variables[varName] || match;
  });
  return JSON.parse(replaced);
}

async function executeStep(step, variables) {
  const config = replaceVariables(step.config, variables);

  switch (step.type) {
    case TASK_TYPES.API_CALL.type:
      return await executeApiCall(config);
    case TASK_TYPES.WEBSITE.type:
      return await executeWebsiteAction(config);
    case TASK_TYPES.FILE.type:
      return await executeFileOperation(config);
    case TASK_TYPES.CODE.type:
      return await executeCode(config);
    default:
      throw new Error(`Unknown task type: ${step.type}`);
  }
}

module.exports = {
  executeStep,
};
