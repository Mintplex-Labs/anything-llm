chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "saveToAnythingLLM",
    title: "Save to AnythingLLM",
    contexts: ["selection"],
  });

  await attemptRegistration();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToAnythingLLM") {
    saveToAnythingLLM(info.selectionText, tab.title, tab.url);
  }
});

async function attemptRegistration() {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (!apiKey) {
    const result = await BrowserExtension.register();
    if (!result.error) {
      await chrome.storage.sync.set({
        apiKey: result.apiKey,
        extensionId: result.verificationCode,
      });
    }
  } else {
    await checkApiKeyValidity();
  }
}

async function checkApiKeyValidity() {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (apiKey) {
    const { response } = await BrowserExtension.checkApiKey(apiKey);
    if (response.status === 403 || !response.ok) {
      await chrome.storage.sync.remove(["apiKey", "extensionId"]);
    }
  }
}

async function saveToAnythingLLM(selectedText, pageTitle, pageUrl) {
  const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
  if (!apiKey) return;

  const { response } = await BrowserExtension.saveContent(
    apiKey,
    selectedText,
    {
      title: pageTitle,
      url: pageUrl,
    }
  );

  if (response.status === 401 || response.status === 403) {
    await chrome.storage.sync.remove(["apiKey", "extensionId"]);
  } else if (!response.ok) {
    await checkApiKeyValidity();
  }
}
