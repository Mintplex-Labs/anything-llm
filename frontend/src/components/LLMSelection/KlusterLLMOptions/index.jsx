import React, { useState } from "react";
import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function KlusterLLMOptions({ settings }) {
  const [apiKey, setApiKey] = useState(settings?.KlusterApiKey || "");
  const [maxTokens, setMaxTokens] = useState(
    settings?.KlusterMaxTokens || 1024
  );

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-col gap-y-2">
        <label className="text-white text-sm font-semibold block">
          API Key
          <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="password"
          name="KlusterApiKey"
          className="bg-theme-settings-input-bg text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter your Kluster.ai API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <div className="flex items-center gap-x-2 text-white/60 text-xs">
          <Info size={14} />
          <span>
            You can find your API key in the Kluster.ai developer console
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <label className="text-white text-sm font-semibold block">
          Max Tokens
        </label>
        <input
          type="number"
          name="KlusterMaxTokens"
          className="bg-theme-settings-input-bg text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter max tokens (default: 1024)"
          value={maxTokens}
          onChange={(e) => setMaxTokens(Number(e.target.value))}
        />
        <div className="flex items-center gap-x-2 text-white/60 text-xs">
          <Info size={14} />
          <span>
            Maximum number of tokens to generate in the response (default: 1024)
          </span>
        </div>
      </div>
    </div>
  );
}
