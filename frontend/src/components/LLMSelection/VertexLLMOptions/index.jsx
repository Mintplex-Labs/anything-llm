import { ArrowSquareOut, Info } from "@phosphor-icons/react";
import { VERTEX_REGIONS } from "./regions";
import { useState, useEffect } from "react";
import System from "@/models/system";

const MANUAL_REGION_ENTRY = "-- Enter region manually --";

export default function VertexLLMOptions({ settings }) {
  const [region, setRegion] = useState(settings?.VertexAiLLMRegion || "global");
  // A saved region outside the known list can only render via manual entry -
  // a select with no matching option would silently fall back to the first
  // region.
  const [manualRegion, setManualRegion] = useState(
    !!settings?.VertexAiLLMRegion &&
      !VERTEX_REGIONS.some((r) => r.code === settings.VertexAiLLMRegion)
  );

  return (
    <div className="w-full flex flex-col">
      {!settings?.credentialsOnly && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={40} />
            <p className="text-base">
              Connect to Google Cloud Vertex AI using its OpenAI-compatible
              endpoint and a Vertex AI API key.
              <br />
              <a
                href="https://docs.anythingllm.com/setup/llm-configuration/cloud/google-vertex"
                target="_blank"
                className="underline flex gap-x-1 items-center"
                rel="noreferrer"
              >
                Read more on how to use Google Vertex AI in AnythingLLM
                <ArrowSquareOut size={14} />
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex items-center gap-[36px] my-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Vertex AI API Key
          </label>
          <input
            type="password"
            name="VertexAiLLMApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Vertex AI API Key"
            defaultValue={settings?.VertexAiLLMApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            GCP Project ID
          </label>
          <input
            type="text"
            name="VertexAiLLMProjectId"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="my-gcp-project"
            defaultValue={settings?.VertexAiLLMProjectId}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Region
          </label>
          {manualRegion ? (
            <>
              <input
                type="text"
                name="VertexAiLLMRegion"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="us-central1"
                defaultValue={region}
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setRegion(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  if (!VERTEX_REGIONS.some((r) => r.code === region))
                    setRegion(VERTEX_REGIONS[0].code);
                  setManualRegion(false);
                }}
                className="text-white/60 hover:text-white text-xs text-left mt-1.5 underline w-fit"
              >
                Select from available regions
              </button>
            </>
          ) : (
            <select
              name="VertexAiLLMRegion"
              value={region}
              required={true}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              onChange={(e) => {
                if (e.target.value === MANUAL_REGION_ENTRY)
                  return setManualRegion(true);
                setRegion(e.target.value);
              }}
            >
              {VERTEX_REGIONS.map((region) => {
                return (
                  <option key={region.code} value={region.code}>
                    {region.name} ({region.code})
                  </option>
                );
              })}
              <option disabled={true}>──────────</option>
              <option value={MANUAL_REGION_ENTRY}>{MANUAL_REGION_ENTRY}</option>
            </select>
          )}
        </div>
      </div>

      {!settings?.credentialsOnly && (
        <div className="w-full flex items-center gap-[36px] my-1.5">
          <VertexModelSelection settings={settings} />
          <div className="flex flex-col w-60">
            <div className="flex items-center gap-x-1 mb-3">
              <label className="text-white text-sm font-semibold block">
                Model context window
              </label>
              <div className="group relative">
                <Info size={14} className="text-white/60 cursor-pointer" />
                <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-64 p-2 bg-theme-settings-input-bg text-white text-xs rounded-lg shadow-lg z-10">
                  Only needed for manually entered models - known Gemini models
                  resolve their context window automatically.
                </div>
              </div>
            </div>
            <input
              type="number"
              name="VertexAiLLMTokenLimit"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Content window limit (eg: 128000)"
              min={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.VertexAiLLMTokenLimit}
              required={false}
              autoComplete="off"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const MANUAL_MODEL_ENTRY = "-- Enter model ID manually --";

function VertexModelSelection({ settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [manualEntry, setManualEntry] = useState(false);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models = [] } = await System.customModels("vertex");
      const modelsByOrganization = models.reduce((acc, model) => {
        const org = model.organization || "Google";
        acc[org] = acc[org] || [];
        acc[org].push(model);
        return acc;
      }, {});
      setGroupedModels(modelsByOrganization);

      // Saved models not present in the fetched list (eg: Model Garden
      // partner models like `meta/llama-...`) can only render via manual
      // entry - same for an empty list.
      const savedModel = settings?.VertexAiLLMModelPref;
      const savedModelInList = models.some((model) => model.id === savedModel);
      setManualEntry(
        models.length === 0 || (!!savedModel && !savedModelInList)
      );
      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="VertexAiLLMModelPref"
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

  if (manualEntry) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <input
          type="text"
          name="VertexAiLLMModelPref"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="gemini-2.5-flash"
          defaultValue={settings?.VertexAiLLMModelPref}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
        {Object.keys(groupedModels).length > 0 && (
          <button
            type="button"
            onClick={() => setManualEntry(false)}
            className="text-white/60 hover:text-white text-xs text-left mt-1.5 underline w-fit"
          >
            Select from available models
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Chat Model Selection
      </label>
      <select
        name="VertexAiLLMModelPref"
        required={true}
        onChange={(e) => {
          if (e.target.value === MANUAL_MODEL_ENTRY) setManualEntry(true);
        }}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {Object.keys(groupedModels)
          .sort()
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.VertexAiLLMModelPref === model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
        <option disabled={true}>──────────</option>
        <option value={MANUAL_MODEL_ENTRY}>{MANUAL_MODEL_ENTRY}</option>
      </select>
    </div>
  );
}
