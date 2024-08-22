import React, { useState, useEffect } from "react";
import Config from "./components/Config";
import AnythingLLMLogo from "./media/anything-llm.png";
import BrowserExtension from "./models/browserExtension";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [logoUrl, setLogoUrl] = useState(AnythingLLMLogo);

  useEffect(() => {
    checkApiKeyStatus();
    fetchLogo();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "newApiKey") {
        checkApiKeyStatus();
        fetchLogo();
      }
    });
  }, []);

  const checkApiKeyStatus = async () => {
    const { apiBase, apiKey } = await chrome.storage.sync.get([
      "apiBase",
      "apiKey",
    ]);
    if (!apiBase || !apiKey) {
      setStatus("notConnected");
      return;
    }

    try {
      const { online } = await BrowserExtension.checkOnline(apiBase);
      if (!online) {
        setStatus("offline");
        return;
      }

      const { response, data } = await BrowserExtension.checkApiKey(
        apiBase,
        apiKey
      );

      if (response.ok) {
        setStatus("connected");
        chrome.runtime.sendMessage({ action: "connectionUpdated" });
      } else {
        await chrome.storage.sync.remove(["apiBase", "apiKey"]);
        setStatus("notConnected");
        chrome.runtime.sendMessage({ action: "connectionUpdated" });
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const fetchLogo = async () => {
    const { apiBase } = await chrome.storage.sync.get(["apiBase"]);
    if (!apiBase) {
      return;
    }

    const { success, logoURL, error } = await BrowserExtension.fetchLogo(
      apiBase
    );
    if (success) {
      setLogoUrl(logoURL);
    } else {
      console.error("Error fetching logo:", error);
      setLogoUrl(AnythingLLMLogo);
    }
  };

  return (
    <div className="p-6 bg-[#25272C] min-h-screen flex flex-col items-center">
      <img src={logoUrl} alt="AnythingLLM Logo" className="w-40 mb-6" />
      <div className="bg-[#2C2E33] p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-white text-sm font-medium mb-6">
          Right click on any page and send selected text or entire pages to
          AnythingLLM.
        </p>
        <Config status={status} onStatusChange={checkApiKeyStatus} />
      </div>
    </div>
  );
};

export default App;
