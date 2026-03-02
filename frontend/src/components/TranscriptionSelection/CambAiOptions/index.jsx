import { useState } from "react";

export default function CambAiTranscriptionOptions({ settings }) {
  const [inputValue, setInputValue] = useState(
    settings?.CambAiTranscriptionKey
  );
  const [_cambAiKey, setCambAiKey] = useState(
    settings?.CambAiTranscriptionKey
  );

  return (
    <div className="flex gap-x-7 gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="CambAiTranscriptionKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="CAMB AI API Key"
          defaultValue={
            settings?.CambAiTranscriptionKey ? "*".repeat(20) : ""
          }
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setCambAiKey(inputValue)}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model
        </label>
        <select
          disabled={true}
          className="border-none flex-shrink-0 bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            CAMB AI Transcription
          </option>
        </select>
      </div>
    </div>
  );
}
