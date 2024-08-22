const BrowserExtension = {
  checkApiKey: async function (apiBase, apiKey) {
    return await fetch(`${apiBase}/browser-extension/check`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then(async (res) => ({ response: res, data: await res.json() }))
      .catch((e) => {
        console.error(e);
        return { error: e.message };
      });
  },

  checkOnline: async function (apiBase) {
    return await fetch(`${apiBase}/ping`)
      .then(async (res) => ({ online: res.ok, data: await res.json() }))
      .catch((e) => {
        console.error(e);
        return { online: false, error: e.message };
      });
  },
};

export default BrowserExtension;
