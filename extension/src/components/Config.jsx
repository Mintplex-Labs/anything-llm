import React, { useState, useEffect } from "react";
import BrowserExtension from "../models/browserExtension";

export default function Config({ status, onStatusChange }) {
  const [connectionString, setConnectionString] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleConnect = async () => {
    try {
      const [apiBase, apiKey] = connectionString.split("|");
      if (!apiBase || !apiKey) {
        setSaveStatus("Invalid connection string format.");
        return;
      }

      const { online } = await BrowserExtension.checkOnline(apiBase);
      if (!online) {
        setSaveStatus(
          "AnythingLLM is currently offline. Please try again later."
        );
        return;
      }

      const { response } = await BrowserExtension.checkApiKey(apiBase, apiKey);

      if (response.ok) {
        await chrome.storage.sync.set({ apiBase, apiKey });
        onStatusChange();
        setSaveStatus("Successfully connected to AnythingLLM");
        chrome.runtime.sendMessage({ action: "connectionUpdated" });
      } else {
        setSaveStatus("Failed to connect: Invalid API key");
      }
    } catch (error) {
      setSaveStatus(`An error occurred during connection: ${error.message}`);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { apiBase, apiKey } = await chrome.storage.sync.get([
        "apiBase",
        "apiKey",
      ]);
      if (!apiBase || !apiKey) {
        throw new Error("No connection found");
      }

      const { success, error } = await BrowserExtension.disconnect(
        apiBase,
        apiKey
      );
      if (!success) {
        throw new Error(error || "Failed to disconnect from the server");
      }

      await chrome.storage.sync.remove(["apiBase", "apiKey"]);
      onStatusChange();
      setSaveStatus("Successfully disconnected from AnythingLLM");
      chrome.runtime.sendMessage({ action: "connectionUpdated" });
    } catch (error) {
      setSaveStatus(`An error occurred during disconnection: ${error.message}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      {status === "notConnected" && (
        <div className="w-full flex flex-col gap-y-4">
          <div className="flex flex-col w-full">
            <label className="text-white text-sm font-semibold block mb-3">
              AnythingLLM Connection String
            </label>
            <input
              type="text"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="Paste connection string here"
              className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-[#46C8FF] active:outline-[#46C8FF] outline-none block w-full p-2.5"
            />
          </div>
          <button
            onClick={handleConnect}
            className="bg-[#46C8FF] hover:bg-[#3BA3D0] text-white font-bold py-2 px-4 rounded-lg transition duration-300 border border-[#46C8FF] hover:border-[#3BA3D0] focus:outline-none focus:ring-2 focus:ring-[#46C8FF] focus:ring-opacity-50"
          >
            Connect
          </button>
        </div>
      )}

      {status === "connected" && (
        <div className="w-full flex flex-col gap-y-4">
          <div className="flex items-center justify-center gap-x-2 bg-zinc-900 p-2.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-400 text-sm font-medium">
              Connected to AnythingLLM
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 border border-red-500 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Disconnect
          </button>
        </div>
      )}

      {status === "offline" && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-2.5 rounded-lg">
          AnythingLLM is currently offline. Please try again later.
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-2.5 rounded-lg">
          An error occurred. Please try again later.
        </div>
      )}

      {saveStatus && (
        <div
          className={`p-2.5 rounded-lg ${
            saveStatus.includes("Successfully")
              ? "bg-green-500/10 border border-green-500/50 text-green-400"
              : "bg-red-500/10 border border-red-500/50 text-red-400"
          }`}
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
}
