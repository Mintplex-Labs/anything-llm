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

  fetchLogo: async function (apiBase) {
    try {
      const response = await fetch(`${apiBase}/system/logo`, {
        method: "GET",
        cache: "no-cache",
      });

      if (response.ok && response.status !== 204) {
        const blob = await response.blob();
        const logoURL = URL.createObjectURL(blob);
        return { success: true, logoURL };
      } else {
        return { success: false, error: "Logo not available" };
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      return { success: false, error: error.message };
    }
  },
};

export default BrowserExtension;
