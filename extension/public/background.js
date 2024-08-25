const ContextMenuModel = {
  async create(workspaces) {
    await chrome.contextMenus.removeAll();

    if (workspaces && workspaces.length > 0) {
      chrome.contextMenus.create({
        id: "saveToAnythingLLM",
        title: "Save selected to AnythingLLM",
        contexts: ["selection"],
      });

      chrome.contextMenus.create({
        id: "embedToWorkspace",
        title: "Embed selected content to workspace",
        contexts: ["selection"],
      });

      chrome.contextMenus.create({
        id: "saveEntirePageToAnythingLLM",
        title: "Save entire page to AnythingLLM",
        contexts: ["page"],
      });

      chrome.contextMenus.create({
        id: "embedEntirePageToWorkspace",
        title: "Embed entire page to workspace",
        contexts: ["page"],
      });

      workspaces.forEach((workspace) => {
        chrome.contextMenus.create({
          id: `workspace-selected-${workspace.id}`,
          parentId: "embedToWorkspace",
          title: workspace.name,
          contexts: ["selection"],
        });
        chrome.contextMenus.create({
          id: `workspace-page-${workspace.id}`,
          parentId: "embedEntirePageToWorkspace",
          title: workspace.name,
          contexts: ["page"],
        });
      });
    } else {
      chrome.contextMenus.create({
        id: "noWorkspaces",
        title: "No available workspaces",
        contexts: ["selection", "page"],
        enabled: false,
      });
    }
  },

  async remove() {
    await chrome.contextMenus.removeAll();
  },
};

const ExtensionModel = {
  async checkApiKeyValidity() {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (apiBase && apiKey) {
      const response = await fetch(`${apiBase}/browser-extension/check`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (response.ok) {
        const data = await response.json();
        await ContextMenuModel.create(data.workspaces);
        return true;
      } else {
        await chrome.storage.sync.remove(["apiBase", "apiKey"]);
        await ContextMenuModel.remove();
        return false;
      }
    } else {
      await ContextMenuModel.remove();
      return false;
    }
  },

  async updateWorkspaces() {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (apiBase && apiKey) {
      const response = await fetch(`${apiBase}/browser-extension/check`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (response.ok) {
        const data = await response.json();
        await ContextMenuModel.create(data.workspaces);
      } else {
        await ContextMenuModel.remove();
      }
    } else {
      await ContextMenuModel.remove();
    }
  },

  async saveToAnythingLLM(selectedText, pageTitle, pageUrl) {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (!apiBase || !apiKey) return;

    const response = await fetch(
      `${apiBase}/browser-extension/upload-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          textContent: selectedText,
          metadata: { title: pageTitle, url: pageUrl },
        }),
      }
    );

    this.handleResponse(response, "save content");
  },

  async embedToWorkspace(workspaceId, selectedText, pageTitle, pageUrl) {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (!apiBase || !apiKey) return;

    const response = await fetch(`${apiBase}/browser-extension/embed-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workspaceId,
        textContent: selectedText,
        metadata: { title: pageTitle, url: pageUrl },
      }),
    });

    this.handleResponse(response, "embed content");
  },

  async saveEntirePageToAnythingLLM(pageContent, pageTitle, pageUrl) {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (!apiBase || !apiKey) return;

    const response = await fetch(
      `${apiBase}/browser-extension/upload-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          textContent: pageContent,
          metadata: { title: pageTitle, url: pageUrl },
        }),
      }
    );

    this.handleResponse(response, "save entire page");
  },

  async embedEntirePageToWorkspace(
    workspaceId,
    pageContent,
    pageTitle,
    pageUrl
  ) {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (!apiBase || !apiKey) return;

    const response = await fetch(`${apiBase}/browser-extension/embed-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workspaceId,
        textContent: pageContent,
        metadata: { title: pageTitle, url: pageUrl },
      }),
    });

    this.handleResponse(response, "embed entire page");
  },

  async handleResponse(response, action) {
    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiBase", "apiKey"]);
      await ContextMenuModel.remove();
      this.showNotification(
        "Error",
        "Authentication failed. Please reconnect the extension."
      );
    } else if (!response.ok) {
      await this.checkApiKeyValidity();
      this.showNotification("Error", `Failed to ${action}. Please try again.`);
    } else {
      this.showNotification(
        "Success",
        "Successfully saved content to AnythingLLM."
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
      chrome.action.setTitle({ title: "AnythingLLM Extension" });
    }, 5000);
  },
};

// Event Listeners
chrome.runtime.onInstalled.addListener(async () => {
  await ExtensionModel.checkApiKeyValidity();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "connectionUpdated") {
    ExtensionModel.checkApiKeyValidity();
  } else if (message.action === "newApiKey") {
    const [apiBase, apiKey] = message.connectionString.split("|");
    chrome.storage.sync.set({ apiBase, apiKey }, () => {
      ExtensionModel.checkApiKeyValidity();
      chrome.action.openPopup();
    });
  }
});

function getPageContent(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: "getPageContent" }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (response && response.content) {
        resolve(response.content);
      } else {
        reject(new Error("Failed to get page content"));
      }
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToAnythingLLM") {
    ExtensionModel.saveToAnythingLLM(info.selectionText, tab.title, tab.url);
  } else if (info.menuItemId.startsWith("workspace-selected-")) {
    const workspaceId = info.menuItemId.split("-")[2];
    ExtensionModel.embedToWorkspace(
      workspaceId,
      info.selectionText,
      tab.title,
      tab.url
    );
  } else if (info.menuItemId === "saveEntirePageToAnythingLLM") {
    getPageContent(tab.id)
      .then((content) => {
        ExtensionModel.saveEntirePageToAnythingLLM(content, tab.title, tab.url);
      })
      .catch((error) => {
        console.error("Error getting page content:", error);
        ExtensionModel.showNotification(
          "Error",
          "Failed to get page content. Please try again."
        );
      });
  } else if (info.menuItemId.startsWith("workspace-page-")) {
    const workspaceId = info.menuItemId.split("-")[2];
    getPageContent(tab.id)
      .then((content) => {
        ExtensionModel.embedEntirePageToWorkspace(
          workspaceId,
          content,
          tab.title,
          tab.url
        );
      })
      .catch((error) => {
        console.error("Error getting page content:", error);
        ExtensionModel.showNotification(
          "Error",
          "Failed to get page content. Please try again."
        );
      });
  }
});

// Remove context menu items when connection is lost
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && (changes.apiBase || changes.apiKey)) {
    if (!changes.apiBase?.newValue || !changes.apiKey?.newValue) {
      ContextMenuModel.remove();
    }
  }
});

// Update workspaces periodically
chrome.alarms.create("updateWorkspaces", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateWorkspaces") {
    ExtensionModel.updateWorkspaces();
  }
});
