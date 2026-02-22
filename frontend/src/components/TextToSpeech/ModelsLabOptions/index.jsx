import { useState, useEffect } from "react";
import System from "@/models/system";

const VOICES = [
  { name: "Bella", voice_id: 1 },
  { name: "Antoni", voice_id: 2 },
  { name: "Elli", voice_id: 3 },
  { name: "Josh", voice_id: 4 },
  { name: "Arnold", voice_id: 5 },
  { name: "Adam", voice_id: 6 },
  { name: "Sam", voice_id: 7 },
  { name: "Rachel", voice_id: 8 },
  { name: "Domi", voice_id: 9 },
  { name: "Gigi", voice_id: 10 },
];

export default function ModelsLabTTSOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.TTSModelsLabKey);
  const [modelsLabKey, setModelsLabKey] = useState(settings?.TTSModelsLabKey);

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="TTSModelsLabKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="ModelsLab API Key"
          defaultValue={settings?.TTSModelsLabKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setModelsLabKey(inputValue)}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Voice
        </label>
        <select
          name="TTSModelsLabVoiceModel"
          className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          defaultValue={settings?.TTSModelsLabVoiceModel || "Bella"}
        >
          {VOICES.map((voice) => (
            <option key={voice.voice_id} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
