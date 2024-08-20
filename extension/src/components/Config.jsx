import React, { useState } from "react";
import BrowserExtension from "../models/browserExtension";

export default function Config({ status, extensionId, onStatusChange }) {
  const [saveStatus, setSaveStatus] = useState("");

  const handleRegister = async () => {
    try {
      const result = await BrowserExtension.registerExtension();

      if (!result.error) {
        await chrome.storage.sync.set({
          apiKey: result.apiKey,
          extensionId: result.verificationCode,
        });
        onStatusChange();
      } else {
        setSaveStatus(`Failed to register: ${result.error}`);
      }
    } catch (error) {
      setSaveStatus(`An error occurred during registration: ${error.message}`);
    }
  };

  const handleUnregister = async () => {
    try {
      const { apiKey } = await chrome.storage.sync.get(["apiKey"]);
      const result = await BrowserExtension.unregisterExtension(apiKey);

      if (!result.error) {
        await chrome.storage.sync.remove(["apiKey", "extensionId"]);
        onStatusChange();
      } else {
        setSaveStatus(`Failed to unregister: ${result.error}`);
      }
    } catch (error) {
      setSaveStatus(
        `An error occurred during unregistration: ${error.message}`
      );
    }
  };

  return (
    <div className="mt-4">
      {status === "notRegistered" && (
        <div>
          <p className="text-yellow-400 mb-4">
            No API key registered. Click below to register.
          </p>
          <button
            onClick={handleRegister}
            className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition duration-300"
          >
            Register
          </button>
        </div>
      )}

      {status === "pending" && (
        <div>
          <p className="text-yellow-400 mb-4">
            API key pending approval. Extension ID: {extensionId}
          </p>
          <p className="text-white mb-4">
            Please approve the extension in the AnythingLLM settings menu under
            Tools/Browser Extension.
          </p>
          <button
            onClick={handleUnregister}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-300"
          >
            Cancel Registration
          </button>
        </div>
      )}

      {status === "approved" && (
        <div>
          <div className="flex items-center justify-center gap-x-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-400">Connected to AnythingLLM</p>
          </div>
          <button
            onClick={handleUnregister}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-300"
          >
            Unregister
          </button>
        </div>
      )}

      {status === "error" && (
        <p className="text-red-400 mb-4">
          An error occurred. Please try again later.
        </p>
      )}

      {saveStatus && <p className="mt-2 text-red-400 text-sm">{saveStatus}</p>}
    </div>
  );
}
