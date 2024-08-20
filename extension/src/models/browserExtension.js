import { ANYTHING_LLM_API_URL } from "../utils/constants";

const BrowserExtension = {
  checkApiKey: async function (apiKey) {
    return await fetch(`${ANYTHING_LLM_API_URL}/browser-extension/check`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then(async (res) => ({ response: res, data: await res.json() }))
      .catch((e) => {
        console.error(e);
        return { error: e.message };
      });
  },

  registerExtension: async function () {
    return await fetch(`${ANYTHING_LLM_API_URL}/browser-extension/register`, {
      method: "POST",
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { error: e.message };
      });
  },

  unregisterExtension: async function (apiKey) {
    return await fetch(`${ANYTHING_LLM_API_URL}/browser-extension/unregister`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { error: e.message };
      });
  },
};

export default BrowserExtension;
