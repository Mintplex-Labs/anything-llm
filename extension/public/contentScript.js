window.addEventListener("message", (event) => {
  if (event.data.type === "NEW_BROWSER_EXTENSION_CONNECTION") {
    chrome.runtime.sendMessage({
      action: "newApiKey",
      apiKey: event.data.apiKey,
    });
  }
});
