const ANYTHING_LLM_API_URL = "http://localhost:3001/api";

async function register() {
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
}

async function checkApiKey(apiKey) {
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
}

async function saveContent(apiKey, textContent, metadata) {
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
}

async function embedContent(apiKey, workspaceId, textContent, metadata) {
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
}

async function createContextMenu(workspaces) {
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

  workspaces.forEach((workspace) => {
    chrome.contextMenus.create({
      id: `workspace-${workspace.id}`,
      parentId: "embedToWorkspace",
      title: workspace.name,
      contexts: ["selection"],
    });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  await attemptRegistration();
  chrome.alarms.create("updateWorkspaces", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateWorkspaces") {
    updateWorkspaces();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToAnythingLLM") {
    saveToAnythingLLM(info.selectionText, tab.title, tab.url);
  } else if (info.menuItemId.startsWith("workspace-")) {
    const workspaceId = info.menuItemId.split("-")[1];
    embedToWorkspace(workspaceId, info.selectionText, tab.title, tab.url);
  }
});

async function attemptRegistration() {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (!apiKey) {
    const result = await register();
    if (!result.error) {
      await chrome.storage.sync.set({
        apiKey: result.apiKey,
        extensionId: result.verificationCode,
      });
      await updateWorkspaces();
    }
  } else {
    await checkApiKeyValidity();
  }
}

async function checkApiKeyValidity() {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (apiKey) {
    const { response, data } = await checkApiKey(apiKey);
    if (response.status === 403 || !response.ok) {
      await chrome.storage.sync.remove(["apiKey", "extensionId"]);
    } else {
      await createContextMenu(data.workspaces);
    }
  }
}

async function updateWorkspaces() {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (apiKey) {
    const { data } = await checkApiKey(apiKey);
    if (data && data.workspaces) {
      await createContextMenu(data.workspaces);
    }
  }
}

async function saveToAnythingLLM(selectedText, pageTitle, pageUrl) {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (!apiKey) return;

  const { response, data } = await saveContent(apiKey, selectedText, {
    title: pageTitle,
    url: pageUrl,
  });

  if (response.status === 401 || response.status === 403) {
    await chrome.storage.sync.remove(["apiKey", "extensionId"]);
    showNotification(
      "Error",
      "Authentication failed. Please re-register the extension."
    );
  } else if (!response.ok) {
    await checkApiKeyValidity();
    showNotification("Error", "Failed to save content. Please try again.");
  } else {
    showNotification("Success", "Content saved to AnythingLLM successfully.");
  }
}

async function embedToWorkspace(workspaceId, selectedText, pageTitle, pageUrl) {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (!apiKey) return;

  const { response, data } = await embedContent(
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
    showNotification(
      "Error",
      "Authentication failed. Please re-register the extension."
    );
  } else if (!response.ok) {
    await checkApiKeyValidity();
    showNotification("Error", "Failed to embed content. Please try again.");
  } else {
    showNotification("Success", "Content embedded in workspace successfully.");
  }
}

function showNotification(title, message) {
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
}
