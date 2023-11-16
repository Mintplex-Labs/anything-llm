import React, { useEffect, useState } from "react";
import Sidebar, {
  SidebarMobileHeader,
} from "../../../components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "../../../models/system";
import showToast from "../../../utils/toast";
import OpenAiLogo from "../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../media/llmprovider/azure.png";
import LocalAiLogo from "../../../media/llmprovider/localai.png";
import PreLoader from "../../../components/Preloader";
import LLMProviderOption from "../../../components/LLMSelection/LLMProviderOption";
import ChangeWarningModal from "../../../components/ChangeWarning";

export default function GeneralEmbeddingPreference() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [embeddingChoice, setEmbeddingChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basePathValue, setBasePathValue] = useState("");
  const [basePath, setBasePath] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      embeddingChoice !== settings?.EmbeddingEngine &&
      hasChanges &&
      hasEmbeddings
    ) {
      document.getElementById("confirmation-modal")?.showModal();
    } else {
      await handleSaveSettings();
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const data = new FormData(document.getElementById("embedding-form"));
    const settingsData = {};
    for (let [key, value] of data.entries()) {
      settingsData[key] = value;
    }

    const { error } = await System.updateSystem(settingsData);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
      setHasChanges(true);
    } else {
      showToast("LLM preferences saved successfully.", "success");
      setHasChanges(false);
    }
    setSaving(false);
    document.getElementById("confirmation-modal")?.close();
  };

  const updateChoice = (selection) => {
    setEmbeddingChoice(selection);
    setHasChanges(true);
  };

  function updateBasePath() {
    setBasePath(basePathValue);
  }

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setEmbeddingChoice(_settings?.EmbeddingEngine || "openai");
      setBasePath(_settings?.EmbeddingBasePath || "");
      setBasePathValue(_settings?.EmbeddingBasePath || "");
      setHasEmbeddings(_settings?.HasExistingEmbeddings || false);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <ChangeWarningModal
        warningText=" Switching the embedder may affect previously embedded documents and future similarity search results."
        onClose={() => document.getElementById("confirmation-modal")?.close()}
        onConfirm={handleSaveSettings}
      />
      {!isMobile && <Sidebar />}
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll animate-pulse"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
        >
          {isMobile && <SidebarMobileHeader />}
          <form
            id="embedding-form"
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
                <div className="items-center flex gap-x-4">
                  <p className="text-2xl font-semibold text-white">
                    Embedding Preference
                  </p>
                  {hasChanges && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  )}
                </div>
                <p className="text-sm font-base text-white text-opacity-60">
                  When using an LLM that does not natively support an embedding
                  engine - you may need to additionally specify credentials to
                  for embedding text.
                  <br />
                  Embedding is the process of turning text into vectors. These
                  credentials are required to turn your files and prompts into a
                  format which AnythingLLM can use to process.
                </p>
              </div>

              {["openai", "azure"].includes(settings.LLMProvider) ? (
                <div className="w-full h-20 items-center justify-center flex">
                  <p className="text-gray-800 dark:text-slate-400 text-center">
                    Your current LLM preference does not require you to set up
                    this part of AnythingLLM.
                    <br />
                    Embedding is being automatically managed by AnythingLLM.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-white text-sm font-medium py-4">
                    Embedding Providers
                  </div>
                  <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-[900px]">
                    <input
                      hidden={true}
                      name="EmbeddingEngine"
                      value={embeddingChoice}
                    />
                    <LLMProviderOption
                      name="OpenAI"
                      value="openai"
                      link="openai.com"
                      description="Use OpenAI's text-embedding-ada-002 embedding model."
                      checked={embeddingChoice === "openai"}
                      image={OpenAiLogo}
                      onClick={updateChoice}
                    />
                    <LLMProviderOption
                      name="Azure OpenAI"
                      value="azure"
                      link="azure.microsoft.com"
                      description="The enterprise option of OpenAI hosted on Azure services."
                      checked={embeddingChoice === "azure"}
                      image={AzureOpenAiLogo}
                      onClick={updateChoice}
                    />
                    <LLMProviderOption
                      name="LocalAI"
                      value="localai"
                      link="localai.io"
                      description="Self hosted LocalAI embedding engine."
                      checked={embeddingChoice === "localai"}
                      image={LocalAiLogo}
                      onClick={updateChoice}
                    />
                  </div>
                  <div className="mt-10 flex flex-wrap gap-4 max-w-[800px]">
                    {embeddingChoice === "openai" && (
                      <>
                        <div className="flex flex-col w-60">
                          <label className="text-white text-sm font-semibold block mb-4">
                            API Key
                          </label>
                          <input
                            type="text"
                            name="OpenAiKey"
                            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                            placeholder="OpenAI API Key"
                            defaultValue={
                              settings?.OpenAiKey ? "*".repeat(20) : ""
                            }
                            required={true}
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                      </>
                    )}

                    {embeddingChoice === "azure" && (
                      <>
                        <div className="flex flex-col w-60">
                          <label className="text-white text-sm font-semibold block mb-4">
                            Azure Service Endpoint
                          </label>
                          <input
                            type="url"
                            name="AzureOpenAiEndpoint"
                            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                            placeholder="https://my-azure.openai.azure.com"
                            defaultValue={settings?.AzureOpenAiEndpoint}
                            required={true}
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>

                        <div className="flex flex-col w-60">
                          <label className="text-white text-sm font-semibold block mb-4">
                            API Key
                          </label>
                          <input
                            type="password"
                            name="AzureOpenAiKey"
                            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                            placeholder="Azure OpenAI API Key"
                            defaultValue={
                              settings?.AzureOpenAiKey ? "*".repeat(20) : ""
                            }
                            required={true}
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>

                        <div className="flex flex-col w-60">
                          <label className="text-white text-sm font-semibold block mb-4">
                            Embedding Deployment Name
                          </label>
                          <input
                            type="text"
                            name="AzureOpenAiEmbeddingModelPref"
                            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                            placeholder="Azure OpenAI embedding model deployment name"
                            defaultValue={
                              settings?.AzureOpenAiEmbeddingModelPref
                            }
                            required={true}
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                      </>
                    )}

                    {embeddingChoice === "localai" && (
                      <>
                        <div className="flex flex-col w-60">
                          <label className="text-white text-sm font-semibold block mb-4">
                            LocalAI Base URL
                          </label>
                          <input
                            type="url"
                            name="EmbeddingBasePath"
                            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                            placeholder="http://localhost:8080/v1"
                            defaultValue={settings?.EmbeddingBasePath}
                            onChange={(e) => setBasePathValue(e.target.value)}
                            onBlur={updateBasePath}
                            required={true}
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                        <LocalAIModelSelection
                          settings={settings}
                          basePath={basePath}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function LocalAIModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath || !basePath.includes("/v1")) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels("localai", null, basePath);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Embedding Model Name
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
              ? "-- loading available models --"
              : "-- waiting for URL --"}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-4">
        Embedding Model Name
      </label>
      <select
        name="EmbeddingModelPref"
        required={true}
        className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.EmbeddingModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}
