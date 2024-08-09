import React, { useState, useEffect } from "react";

export default function Config({ apiKey, setApiKey }) {
  const [inputApiKey, setInputApiKey] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setInputApiKey(apiKey);
  }, [apiKey]);

  const handleInputChange = (e) => {
    setInputApiKey(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey: inputApiKey }, () => {
      setApiKey("********");
      setSaveStatus("API Key saved successfully!");
      setIsModified(false);
      setTimeout(() => setSaveStatus(""), 3000);
    });
  };

  return (
    <div className="mt-4">
      <label
        htmlFor="apiKey"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        API Key
      </label>
      <div className="flex items-center gap-x-1">
        <input
          type="password"
          id="apiKey"
          value={inputApiKey}
          onChange={handleInputChange}
          className="flex-grow px-3 py-2 bg-[#3A3D42] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Enter your API key"
        />
        <button
          onClick={handleSave}
          disabled={!isModified}
          className={`px-4 py-2 rounded-md transition duration-300 ${
            isModified
              ? "bg-sky-500 hover:bg-sky-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
      {saveStatus && (
        <p className="mt-2 text-green-400 text-sm">{saveStatus}</p>
      )}
    </div>
  );
}
