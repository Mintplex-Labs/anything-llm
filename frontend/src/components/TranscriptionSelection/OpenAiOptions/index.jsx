import { useState } from "react";

export default function OpenAiWhisperOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.OpenAiKey);
  const [_openAIKey, setOpenAIKey] = useState(settings?.OpenAiKey);

  return (
    <div className="flex gap-x-7 gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-foreground text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="border-none bg-theme-settings-input-bg text-foreground placeholder:text-theme-settings-input-placeholder text-sm rounded-sm focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setOpenAIKey(inputValue)}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-foreground text-sm font-semibold block mb-3">
          Whisper Model
        </label>
        <select
          disabled={true}
          className="border-none flex-shrink-0 bg-theme-settings-input-bg border-border text-foreground text-sm rounded-sm block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            Whisper Large
          </option>
        </select>
      </div>
    </div>
  );
}
