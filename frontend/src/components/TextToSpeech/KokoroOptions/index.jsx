import { useEffect, useState } from "react";
import System from "@/models/system";

export default function KokoroTTSOptions({ settings }) {
  const [endpoint, setEndpoint] = useState(
    settings?.TTSKokoroEndpoint || "http://localhost:8880/v1"
  );
  const [inputEndpoint, setInputEndpoint] = useState(endpoint);
  const [apiKey, setApiKey] = useState(settings?.TTSKokoroKey);
  const [inputApiKey, setInputApiKey] = useState(apiKey);

  return (
    <div className="w-full flex flex-col gap-y-7">
      <p className="text-sm font-base text-white text-opacity-60">
        Connect to a self-hosted{" "}
        <a
          href="https://github.com/remsky/Kokoro-FastAPI"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          kokoro-fastapi
        </a>{" "}
        server. The voice list is pulled live from your server.
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Base URL
          </label>
          <input
            type="url"
            name="TTSKokoroEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:8880/v1"
            defaultValue={settings?.TTSKokoroEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputEndpoint(e.target.value)}
            onBlur={() => setEndpoint(inputEndpoint)}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            The OpenAI-compatible base URL of your kokoro-fastapi server.
          </p>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            API Key
          </label>
          <input
            type="password"
            name="TTSKokoroKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Optional API Key"
            defaultValue={settings?.TTSKokoroKey ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputApiKey(e.target.value)}
            onBlur={() => setApiKey(inputApiKey)}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Optional — only required if you front your Kokoro server with auth.
          </p>
        </div>
      </div>
      <div className="flex gap-x-4">
        <KokoroVoiceSelection
          settings={settings}
          endpoint={endpoint}
          apiKey={apiKey}
        />
      </div>
    </div>
  );
}

function KokoroVoiceSelection({ settings, endpoint, apiKey = null }) {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findVoices() {
      if (!endpoint) {
        setVoices([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { models } = await System.customModels(
          "kokoro-tts",
          apiKey,
          endpoint
        );
        setVoices(models || []);
      } catch {
        setVoices([]);
      } finally {
        setLoading(false);
      }
    }
    findVoices();
  }, [endpoint, apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Voice Model
        </label>
        <select
          name="TTSKokoroVoiceModel"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available voices --
          </option>
        </select>
      </div>
    );
  }

  if (voices.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Voice Model
        </label>
        <input
          type="text"
          name="TTSKokoroVoiceModel"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="af_bella"
          defaultValue={settings?.TTSKokoroVoiceModel ?? "af_bella"}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Could not reach the Kokoro server to load voices. Enter a voice id
          manually.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Voice Model
      </label>
      <select
        name="TTSKokoroVoiceModel"
        required={true}
        defaultValue={settings?.TTSKokoroVoiceModel ?? "af_bella"}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
}
