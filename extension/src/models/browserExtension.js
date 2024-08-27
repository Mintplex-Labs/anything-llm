const BrowserExtension = {
  checkApiKey: async function (apiBase, apiKey) {
    return await fetch(`${apiBase}/browser-extension/check`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Bad response to /check");
        return res.json();
      })
      .then((data) => ({ response: { ok: true }, data, error: null }))
      .catch((e) => {
        console.error(e);
        return { response: { ok: false }, data: null, error: e.message };
      });
  },

  checkOnline: async function (apiBase) {
    return await fetch(`${apiBase}/ping`)
      .then((res) => {
        if (!res.ok) throw new Error("Bad response to /ping");
        return res.json();
      })
      .then((data) => ({ online: true, data, error: null }))
      .catch((e) => {
        return { online: false, data: null, error: e.message };
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
        return { success: true, error: null, logoURL };
      } else {
        return { success: false, error: "Logo not available", logoURL: null };
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      return { success: false, error: error.message, logoURL: null };
    }
  },

  disconnect: async function (apiBase, apiKey) {
    try {
      await fetch(`${apiBase}/browser-extension/disconnect`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!!data.error)
            throw new Error(errorData.error || "Failed to disconnect");
          return;
        });
      return { success: true, error: null };
    } catch (error) {
      console.error("Disconnect error:", error);
      return { success: false, error: error.message };
    }
  },
};

export default BrowserExtension;
