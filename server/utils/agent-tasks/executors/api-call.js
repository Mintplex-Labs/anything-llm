/**
 * Execute an API call task
 * @param {Object} config Task configuration
 * @param {Object} context Execution context with introspect function
 * @returns {Promise<string>} Response data
 */
async function executeApiCall(config, context) {
  const { url, method, headers = [], body, bodyType, formData } = config;
  const { introspect } = context;

  console.log("config", config);

  introspect(`Making ${method} request to external API...`);
  introspect(`Config: ${JSON.stringify(config)}`);

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
      // For Discord and other JSON APIs, we want a simple payload
      const payload = {};

      // If we have a content variable, use that directly
      if (context.variables.content) {
        payload.content = context.variables.content;
      }
      // Otherwise use the first available variable as content
      else {
        const firstVar = Object.entries(context.variables)[0];
        if (firstVar) {
          payload.content = String(firstVar[1]);
        }
      }

      requestConfig.body = JSON.stringify(payload);
      requestConfig.headers["Content-Type"] = "application/json";
    } else {
      requestConfig.body = body;
    }
  }

  try {
    const response = await fetch(url, requestConfig);
    if (!response.ok) {
      introspect(`Request failed with status ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    introspect(`Successfully received response`);
    const data = await response.text();
    try {
      // Try to parse as JSON first
      return JSON.stringify(JSON.parse(data));
    } catch {
      // If not JSON, return as text
      return data;
    }
  } catch (error) {
    throw new Error(`API Call failed: ${error.message}`);
  }
}

module.exports = executeApiCall;
