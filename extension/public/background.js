chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToAnythingLLM",
    title: "Save to AnythingLLM",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToAnythingLLM") {
    const selectedText = info.selectionText;
    saveToAnythingLLM(selectedText, tab.title);
  }
});

async function saveToAnythingLLM(selectedText, pageTitle) {
  try {
    const { apiKey } = await chrome.storage.sync.get(["apiKey"]);

    if (!apiKey) {
      console.error(
        "API key not set. Please configure it in the extension options."
      );
      return;
    }

    const response = await fetch(
      "http://localhost:3001/api/v1/document/raw-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          textContent: selectedText,
          metadata: {
            title: pageTitle,
          },
        }),
      }
    );

    if (response.ok) {
      console.log("Text saved successfully!");
    } else {
      console.error("Failed to save text.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
