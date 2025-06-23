import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import { parseCurlCommand, isValidCurlCommand } from "@/utils/curlParser";
import showToast from "@/utils/toast";
import ModalWrapper from "@/components/ModalWrapper";

export default function ImportFromCurlModal({ isOpen, onClose, onImport }) {
  const [curlInput, setCurlInput] = useState("");

  const handleImportCurl = () => {
    if (!curlInput.trim()) {
      showToast("Please enter a cURL command", "error");
      return;
    }

    if (!isValidCurlCommand(curlInput)) {
      showToast(
        "Please enter a valid cURL command (must start with 'curl')",
        "error"
      );
      return;
    }

    try {
      const parsedConfig = parseCurlCommand(curlInput);

      // Call the parent's onImport function with parsed values
      onImport({
        url: parsedConfig.url,
        method: parsedConfig.method,
        headers: parsedConfig.headers,
        body: parsedConfig.body,
        bodyType: parsedConfig.bodyType,
        formData: parsedConfig.formData,
      });

      setCurlInput("");
      showToast("cURL command imported successfully", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleClose = () => {
    setCurlInput("");
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="bg-theme-bg-primary border border-white/10 rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-theme-text-primary">
            Import from cURL
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-theme-text-primary hover:bg-theme-action-menu-item-hover transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text-primary mb-2">
              Paste your cURL command
            </label>
            <textarea
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              placeholder={`curl -X POST https://api.example.com/endpoint -H 'Content-Type: application/json' -d '{"key": "value"}'`}
              className="w-full p-3 text-sm rounded-lg bg-theme-settings-input-bg border border-white/5 text-theme-text-primary placeholder:text-theme-text-secondary/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none font-mono"
              rows={6}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="p-3 rounded-lg bg-theme-button-disable-hover-bg text-theme-button-disable-hover-text text-sm">
            <strong>Warning:</strong> Importing a cURL command will overwrite
            all current settings in this API block (URL, method, headers, and
            body).
          </div>

          <div className="text-xs text-theme-text-secondary">
            <p className="mb-2">Supported cURL options:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <code className="bg-theme-settings-input-bg px-1 rounded">
                  -X, --request
                </code>{" "}
                - HTTP method
              </li>
              <li>
                <code className="bg-theme-settings-input-bg px-1 rounded">
                  -H, --header
                </code>{" "}
                - Request headers
              </li>
              <li>
                <code className="bg-theme-settings-input-bg px-1 rounded">
                  -d, --data
                </code>{" "}
                - Request body data
              </li>
              <li>
                <code className="bg-theme-settings-input-bg px-1 rounded">
                  --json
                </code>{" "}
                - JSON data
              </li>
              <li>
                <code className="bg-theme-settings-input-bg px-1 rounded">
                  -F, --form
                </code>{" "}
                - Form data
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-3 py-2 rounded-lg border-none bg-theme-settings-input-bg text-theme-text-primary hover:bg-theme-action-menu-bg transition-colors duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleImportCurl}
              className="border-none bg-primary-button hover:opacity-80 text-black light:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
