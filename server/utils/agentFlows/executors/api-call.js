const { safeJsonParse } = require("../../http");

/**
 * Execute an API call flow step
 * @param {Object} config Flow step configuration
 * @param {Object} context Execution context with introspect function
 * @returns {Promise<string>} Response data
 */
async function executeApiCall(config, context) {
  const { url, method, headers = [], body, bodyType, formData } = config;
  const { introspect, logger } = context;
  logger(`\x1b[43m[AgentFlowToolExecutor]\x1b[0m - executing API Call block`);
  introspect(`Making ${method} request to external API...`);

  const requestConfig = {
    method,
    headers: headers.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
  };

  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (bodyType === "form") {
      const formDataObj = new URLSearchParams();
      formData.forEach(({ key, value }) => formDataObj.append(key, value));
      requestConfig.body = formDataObj.toString();
      requestConfig.headers["Content-Type"] =
        "application/x-www-form-urlencoded";
    } else if (bodyType === "json") {
      const parsedBody = safeJsonParse(body, null);
      if (parsedBody !== null) {
        requestConfig.body = JSON.stringify(parsedBody);
      }
      requestConfig.headers["Content-Type"] = "application/json";
    } else if (bodyType === "text") {
      requestConfig.body = String(body);
    } else {
      requestConfig.body = body;
    }
  }

  try {
    introspect(`Sending body to ${url}: ${requestConfig?.body || "No body"}`);
    const response = await fetch(url, requestConfig);
    if (!response.ok) {
      introspect(`Request failed with status ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    introspect(`API call completed`);
    const responseText = await response.text();
    try {
      // JSON bodies parse into values; anything else (plain text, HTML,
      // empty bodies) is passed through verbatim. We intentionally avoid
      // safeJsonParse here so non-JSON bodies are never "repaired" into
      // invented JSON or reduced to an embedded JSON substring.
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error(error);
    throw new Error(`API Call failed: ${error.message}`);
  }
}

module.exports = executeApiCall;
