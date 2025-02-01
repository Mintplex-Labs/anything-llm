async function executeApiCall(config) {
  const { url, method, headers = [], body, bodyType, formData } = config;

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
      requestConfig.body = body;
      requestConfig.headers["Content-Type"] = "application/json";
    } else {
      requestConfig.body = body;
    }
  }

  try {
    const response = await fetch(url, requestConfig);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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
