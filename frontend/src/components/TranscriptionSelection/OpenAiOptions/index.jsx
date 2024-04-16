import InputField from "@/components/lib/InputField";
import { useState } from "react";

export default function OpenAiWhisperOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.OpenAiKey);
  const [_openAIKey, setOpenAIKey] = useState(settings?.OpenAiKey);

  return (
    <div className="flex gap-x-4">
      <InputField
        type="password"
        label="API Key"
        name="OpenAiKey"
        placeholder="OpenAI API Key"
        defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
        required={true}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => setOpenAIKey(inputValue)}
        className="w-60"
      />
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Whisper Model
        </label>
        <select
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            Whisper Large
          </option>
        </select>
      </div>
    </div>
  );
}
