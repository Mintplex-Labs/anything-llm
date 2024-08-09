import React, { useState, useEffect } from "react";
import Config from "./components/Config";
import AnythingLLMLogo from "./media/anything-llm.png";

function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["apiKey"], (result) => {
      if (result.apiKey) {
        setApiKey("********");
      }
    });
  }, []);

  return (
    <div className="p-6 bg-[#25272C] min-h-screen flex flex-col items-center">
      <img src={AnythingLLMLogo} alt="AnythingLLM Logo" className="w-40 mb-6" />
      <div className="bg-[#2C2E33] p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-white text-sm font-medium mb-6">
          Select text on any webpage, right-click, and choose "Save to
          AnythingLLM".
        </p>
        <Config apiKey={apiKey} setApiKey={setApiKey} />
      </div>
    </div>
  );
}

export default App;
