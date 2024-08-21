import React, { useState, useEffect } from "react";
import Config from "./components/Config";
import AnythingLLMLogo from "./media/anything-llm.png";
import BrowserExtension from "./models/browserExtension";

function App() {
  const [extensionId, setExtensionId] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = async () => {
    const { apiKey, extensionId } = await chrome.storage.sync.get([
      "apiKey",
      "extensionId",
    ]);
    if (!apiKey) {
      setStatus("notRegistered");
      return;
    }
    setExtensionId(extensionId);

    try {
      const { response, data } = await BrowserExtension.checkApiKey(apiKey);

      if (response.status === 401) {
        setStatus("pending");
        setExtensionId(data.verificationCode);
      } else if (response.ok) {
        setStatus(
          data.connected && data.accepted ? "approved" : "notConnected"
        );
        if (!data.connected || !data.accepted) {
          await chrome.storage.sync.remove(["apiKey", "extensionId"]);
        }
      } else if (response.status === 403) {
        await chrome.storage.sync.remove(["apiKey", "extensionId"]);
        setStatus("notRegistered");
      } else {
        throw new Error(data.error || "Unexpected response");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="p-6 bg-[#25272C] min-h-screen flex flex-col items-center">
      <img src={AnythingLLMLogo} alt="AnythingLLM Logo" className="w-40 mb-6" />
      <div className="bg-[#2C2E33] p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-white text-sm font-medium mb-6">
          Select text on any webpage, right-click, and choose "Save to
          AnythingLLM".
        </p>
        <Config
          status={status}
          extensionId={extensionId}
          onStatusChange={checkApiKeyStatus}
        />
      </div>
    </div>
  );
}

export default App;
