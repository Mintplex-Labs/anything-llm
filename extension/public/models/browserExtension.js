const ANYTHING_LLM_API_URL = "http://localhost:3001/api";

const BrowserExtension = {
  register: async function () {
    try {
      const response = await fetch(
        `${ANYTHING_LLM_API_URL}/browser-extension/register`,
        { method: "POST" }
      );
      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      return { error: error.message };
    }
  },

  checkApiKey: async function (apiKey) {
    try {
      const response = await fetch(
        `${ANYTHING_LLM_API_URL}/browser-extension/check`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      return { response, data: await response.json() };
    } catch (error) {
      console.error("API key check error:", error);
      return { error: error.message };
    }
  },

  saveContent: async function (apiKey, textContent, metadata) {
    try {
      const response = await fetch(
        `${ANYTHING_LLM_API_URL}/v1/document/raw-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ textContent, metadata }),
        }
      );
      return { response, data: await response.json() };
    } catch (error) {
      console.error("Save content error:", error);
      return { error: error.message };
    }
  },
};

export default BrowserExtension;
