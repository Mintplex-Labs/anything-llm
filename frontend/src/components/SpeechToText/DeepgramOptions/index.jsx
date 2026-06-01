import { useEffect, useState } from "react";
import System from "@/models/system";

export default function DeepgramSpeechToTextOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.STTDeepgramApiKey);
  const [deepgramApiKey, setDeepgramApiKey] = useState(
    settings?.STTDeepgramApiKey
  );

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="STTDeepgramApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Deepgram API Key"
          defaultValue={settings?.STTDeepgramApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setDeepgramApiKey(inputValue)}
        />
      </div>
      <DeepgramSttModelSelection apiKey={deepgramApiKey} settings={settings} />
    </div>
  );
}

function DeepgramSttModelSelection({ apiKey, settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findModels() {
      setLoading(true);
      const { models } = await System.customModels(
        "deepgram-stt",
        typeof apiKey === "boolean" ? null : apiKey
      );
      setModels(models || []);
      setLoading(false);
    }
    findModels();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Transcription Model
        </label>
        <select
          name="STTDeepgramModel"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Transcription Model
      </label>
      <select
        name="STTDeepgramModel"
        required={true}
        defaultValue={settings?.STTDeepgramModel ?? "nova-3"}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
