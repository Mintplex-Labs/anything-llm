import React, { memo, useEffect, useState } from "react";
import OpenAiLogo from "../../../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../../../media/llmprovider/azure.png";
import LocalAiLogo from "../../../../../media/llmprovider/localai.png";
import System from "../../../../../models/system";
import PreLoader from "../../../../../components/Preloader";
import LLMProviderOption from "../../../../../components/LLMSelection/LLMProviderOption";
import OpenAiOptions from "../../../../../components/EmbeddingSelection/OpenAiOptions";
import AzureAiOptions from "../../../../../components/EmbeddingSelection/AzureAiOptions";
import LocalAiOptions from "../../../../../components/EmbeddingSelection/LocalAiOptions";

function EmbeddingSelection({ nextStep, prevStep, currentStep }) {
  const [embeddingChoice, setEmbeddingChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const updateChoice = (selection) => {
    setEmbeddingChoice(selection);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setEmbeddingChoice(_settings?.EmbeddingEngine || "openai");
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
        <div className="flex flex-col w-full px-1 md:px-8 py-4">
          <div className="text-white text-sm font-medium pb-4">
            Embedding Provider
          </div>
          <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-[752px]">
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
          <div className="mt-4 flex flex-wrap gap-4 max-w-[752px]">
            {embeddingChoice === "openai" && (
              <OpenAiOptions settings={settings} />
            )}
            {embeddingChoice === "azure" && (
              <AzureAiOptions settings={settings} />
            )}
            {embeddingChoice === "localai" && (
              <LocalAiOptions settings={settings} />
            )}
          </div>
        </div>
        <div className="flex w-full justify-between items-center px-6 py-4 space-x-2 border-t rounded-b border-gray-500/50">
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

export default memo(EmbeddingSelection);
