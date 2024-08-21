const ANYTHING_LLM_API_URL = "http://localhost:3001/api";

const BrowserExtension = {
  async register() {
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

  async checkApiKey(apiKey) {
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

  async saveContent(apiKey, textContent, metadata) {
    try {
      const response = await fetch(
        `${ANYTHING_LLM_API_URL}/browser-extension/upload-content`,
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

  async embedContent(apiKey, workspaceId, textContent, metadata) {
    try {
      const response = await fetch(
        `${ANYTHING_LLM_API_URL}/browser-extension/embed-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ workspaceId, textContent, metadata }),
        }
      );
      return { response, data: await response.json() };
    } catch (error) {
      console.error("Embed content error:", error);
      return { error: error.message };
    }
  },

  async uploadLink(apiKey, link) {
    try {
      const response = await fetch(
        `${ANYTHING_LLM_API_URL}/browser-extension/upload-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ link }),
        }
      );
      return { response, data: await response.json() };
    } catch (error) {
      console.error("Upload link error:", error);
      return { error: error.message };
    }
  },
};

const ContextMenuModel = {
  async create(workspaces) {
    await chrome.contextMenus.removeAll();

    chrome.contextMenus.create({
      id: "saveToAnythingLLM",
      title: "Save to AnythingLLM",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "embedToWorkspace",
      title: "Embed content to workspace",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "sendPageToAnythingLLM",
      title: "Send page to AnythingLLM",
      contexts: ["page"],
    });

    workspaces.forEach((workspace) => {
      chrome.contextMenus.create({
        id: `workspace-${workspace.id}`,
        parentId: "embedToWorkspace",
        title: workspace.name,
        contexts: ["selection"],
      });
    });
  },
};

const ExtensionModel = {
  async attemptRegistration() {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
    if (!apiKey) {
      const result = await BrowserExtension.register();
      if (!result.error) {
        await chrome.storage.sync.set({
          apiKey: result.apiKey,
          extensionId: result.verificationCode,
        });
        await this.updateWorkspaces();
      }
    } else {
      await this.checkApiKeyValidity();
    }
  },

  async checkApiKeyValidity() {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
    if (apiKey) {
      const { response, data } = await BrowserExtension.checkApiKey(apiKey);
      if (response.status === 403 || !response.ok) {
        await chrome.storage.sync.remove(["apiKey", "extensionId"]);
      } else {
        await ContextMenuModel.create(data.workspaces);
      }
    }
  },

  async updateWorkspaces() {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
    if (apiKey) {
      const { data } = await BrowserExtension.checkApiKey(apiKey);
      if (data && data.workspaces) {
        await ContextMenuModel.create(data.workspaces);
      }
    }
  },

  async saveToAnythingLLM(selectedText, pageTitle, pageUrl) {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
    if (!apiKey) return;

    const { response, data } = await BrowserExtension.saveContent(
      apiKey,
      selectedText,
      {
        title: pageTitle,
        url: pageUrl,
      }
    );

    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiKey", "extensionId"]);
      this.showNotification(
        "Error",
        "Authentication failed. Please re-register the extension."
      );
    } else if (!response.ok) {
      await this.checkApiKeyValidity();
      this.showNotification(
        "Error",
        "Failed to save content. Please try again."
      );
    } else {
      this.showNotification(
        "Success",
        "Content saved to AnythingLLM successfully."
      );
    }
  },

  async embedToWorkspace(workspaceId, selectedText, pageTitle, pageUrl) {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
    if (!apiKey) return;

    const { response, data } = await BrowserExtension.embedContent(
      apiKey,
      workspaceId,
      selectedText,
      {
        title: pageTitle,
        url: pageUrl,
      }
    );

    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiKey", "extensionId"]);
      this.showNotification(
        "Error",
        "Authentication failed. Please re-register the extension."
      );
    } else if (!response.ok) {
      await this.checkApiKeyValidity();
      this.showNotification(
        "Error",
        "Failed to embed content. Please try again."
      );
    } else {
      this.showNotification(
        "Success",
        "Content embedded in workspace successfully."
      );
    }
  },

  async sendPageToAnythingLLM(pageUrl) {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
    if (!apiKey) return;

    const { response, data } = await BrowserExtension.uploadLink(
      apiKey,
      pageUrl
    );

    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiKey", "extensionId"]);
      this.showNotification(
        "Error",
        "Authentication failed. Please re-register the extension."
      );
    } else if (!response.ok) {
      await this.checkApiKeyValidity();
      this.showNotification("Error", "Failed to send page. Please try again.");
    } else {
      this.showNotification(
        "Success",
        "Page sent to AnythingLLM successfully."
      );
    }
  },

  showNotification(title, message) {
    if (title === "Error") {
      chrome.action.setBadgeText({ text: "❌" });
    } else {
      chrome.action.setBadgeText({ text: "✅" });
    }
    chrome.action.setTitle({ title: `${title}: ${message}` });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
      chrome.action.setTitle({ title: "AnythingLLM Browser Extension" });
    }, 5000);
  },
};

// Event Listeners
chrome.runtime.onInstalled.addListener(async () => {
  await ExtensionModel.attemptRegistration();
  chrome.alarms.create("updateWorkspaces", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateWorkspaces") {
    ExtensionModel.updateWorkspaces();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToAnythingLLM") {
    ExtensionModel.saveToAnythingLLM(info.selectionText, tab.title, tab.url);
  } else if (info.menuItemId.startsWith("workspace-")) {
    const workspaceId = info.menuItemId.split("-")[1];
    ExtensionModel.embedToWorkspace(
      workspaceId,
      info.selectionText,
      tab.title,
      tab.url
    );
  } else if (info.menuItemId === "sendPageToAnythingLLM") {
    ExtensionModel.sendPageToAnythingLLM(tab.url);
  }
});
