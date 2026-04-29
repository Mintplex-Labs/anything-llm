import { useState } from "react";

export default function DeepgramSttOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.TTSDeepgramApiKey);

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Deepgram API Key
        </label>
        <input
          type="password"
          name="TTSDeepgramApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Deepgram API Key"
          defaultValue={settings?.TTSDeepgramApiKey ? "*".repeat(20) : ""}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <p className="text-xs text-white/50 mt-2">
          This API key is shared with the Deepgram Text-to-Speech provider.
        </p>
      </div>
    </div>
  );
}
