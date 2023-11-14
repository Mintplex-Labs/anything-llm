import React, { memo, useEffect, useState } from "react";
import OpenAiLogo from "../../../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../../../media/llmprovider/azure.png";
import LocalAiLogo from "../../../../../media/llmprovider/localai.png";
import System from "../../../../../models/system";
import PreLoader from "../../../../../components/Preloader";
import LLMProviderOption from "../../../../../components/LLMSelection/LLMProviderOption";

function EmbeddingSelection({ nextStep, prevStep, currentStep }) {
  const [embeddingChoice, setEmbeddingChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basePathValue, setBasePathValue] = useState("");
  const [basePath, setBasePath] = useState("");

  const updateChoice = (selection) => {
    setEmbeddingChoice(selection);
  };

  function updateBasePath() {
    setBasePath(basePathValue);
  }

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setEmbeddingChoice(_settings?.EmbeddingEngine || "openai");
      setBasePathValue(_settings?.EmbeddingBasePath || "");
      setLoading(false);
    }
    fetchKeys();
  }, [currentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      alert(`Failed to save LLM settings: ${error}`, "error");
      return;
    }
    nextStep("vector_database");
    return;
  };

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div className="flex flex-col w-full px-1 md:px-8 py-12">
          <div className="text-white text-sm font-medium pb-4">
            Embedding Provider
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
              description="The standard option for most non-commercial use. Provides both chat and embedding."
              checked={embeddingChoice === "openai"}
              image={OpenAiLogo}
              onClick={updateChoice}
            />
            <LLMProviderOption
              name="Azure OpenAI"
              value="azure"
              link="azure.microsoft.com"
              description="The enterprise option of OpenAI hosted on Azure services. Provides both chat and embedding."
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
                    type="password"
                    name="OpenAiKey"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="OpenAI API Key"
                    defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
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
                    defaultValue={settings?.AzureOpenAiEmbeddingModelPref}
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
        </div>
        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={prevStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Back
          </button>
          <button
            type="submit"
            className="border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            Continue
          </button>
        </div>
      </form>
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
                  selected={settings.EmbeddingModelPref === model.id}
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

export default memo(EmbeddingSelection);
