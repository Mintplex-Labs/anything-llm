const ContextMenuModel = {
  async create(workspaces) {
    await chrome.contextMenus.removeAll();

    chrome.contextMenus.create({
      id: "saveToAnythingLLM",
      title: "Save selected to AnythingLLM",
      contexts: ["selection"],
    });

    if (workspaces && workspaces.length > 0) {
      chrome.contextMenus.create({
        id: "embedToWorkspace",
        title: "Embed selected content to workspace",
        contexts: ["selection"],
      });

      workspaces.forEach((workspace) => {
        chrome.contextMenus.create({
          id: `workspace-${workspace.id}`,
          parentId: "embedToWorkspace",
          title: workspace.name,
          contexts: ["selection"],
        });
      });
    } else {
      chrome.contextMenus.create({
        id: "noWorkspaces",
        title: "No available workspaces",
        contexts: ["selection"],
        enabled: false,
      });
    }

    chrome.contextMenus.create({
      id: "sendPageToAnythingLLM",
      title: "Save entire page to AnythingLLM",
      contexts: ["page", "selection"],
    });
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

    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiBase", "apiKey"]);
      await ContextMenuModel.remove();
      this.showNotification(
        "Error",
        "Authentication failed. Please reconnect the extension."
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

    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiBase", "apiKey"]);
      await ContextMenuModel.remove();
      this.showNotification(
        "Error",
        "Authentication failed. Please reconnect the extension."
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
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (!apiBase || !apiKey) return;

    const response = await fetch(`${apiBase}/browser-extension/upload-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ link: pageUrl }),
    });

    if (response.status === 401 || response.status === 403) {
      await chrome.storage.sync.remove(["apiBase", "apiKey"]);
      await ContextMenuModel.remove();
      this.showNotification(
        "Error",
        "Authentication failed. Please reconnect the extension."
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
  await ExtensionModel.checkApiKeyValidity();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "connectionUpdated") {
    ExtensionModel.checkApiKeyValidity();
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
