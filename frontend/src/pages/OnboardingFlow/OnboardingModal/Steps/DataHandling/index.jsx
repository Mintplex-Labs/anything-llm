import React, { memo, useEffect, useState } from "react";
import System from "../../../../../models/system";
import OpenAiLogo from "../../../../../media/llmprovider/openai.png";
import AzureOpenAiLogo from "../../../../../media/llmprovider/azure.png";
import AnthropicLogo from "../../../../../media/llmprovider/anthropic.png";
import ChromaLogo from "../../../../../media/vectordbs/chroma.png";
import PineconeLogo from "../../../../../media/vectordbs/pinecone.png";
import LanceDbLogo from "../../../../../media/vectordbs/lancedb.png";
import WeaviateLogo from "../../../../../media/vectordbs/weaviate.png";
import QDrantLogo from "../../../../../media/vectordbs/qdrant.png";
import PreLoader from "../../../../../components/Preloader";

const LLM_SELECTION_PRIVACY = {
  openai: {
    name: "OpenAI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in responses are visible to OpenAI",
    ],
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    description: [
      "Your chats will not be used for training",
      "Your text and embedding text are not visible to OpenAI or Microsoft",
    ],
    logo: AzureOpenAiLogo,
  },
  anthropic: {
    name: "Anthropic",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in responses are visible to Anthropic",
    ],
    logo: AnthropicLogo,
  },
};

const VECTOR_DB_PRIVACY = {
  chroma: {
    name: "Chroma",
    description: [
      "Your embedded text not visible outside of your Chroma instance",
      "Access to your instance is managed by you",
    ],
    logo: ChromaLogo,
  },
  pinecone: {
    name: "Pinecone",
    description: [
      "Your embedded text and vectors are visible to Pinecone, but is not accessed",
      "They manage your data and access to their servers",
    ],
    logo: PineconeLogo,
  },
  qdrant: {
    name: "Qdrant",
    description: [
      "Your embedded text is visible to Qdrant if using a hosted instance",
      "Your embedded text is not visible to Qdrant if using a self-hosted instance",
      "Your data is stored on your Qdrant instance",
    ],
    logo: QDrantLogo,
  },
  weaviate: {
    name: "Weaviate",
    description: [
      "Your embedded text is visible to Weaviate, if using a hosted instance",
      "Your embedded text is not visible to Weaviate, if using a self-hosted instance",
      "Your data is stored on your Weaviate instance",
    ],
    logo: WeaviateLogo,
  },
  lancedb: {
    name: "LanceDB",
    description: [
      "Your embedded text and vectors are only accessible by this AnythingLLM instance",
    ],
    logo: LanceDbLogo,
  },
};

function DataHandling({ nextStep, prevStep, currentStep }) {
  const [llmChoice, setLLMChoice] = useState("openai");
  const [loading, setLoading] = useState(true);
  const [vectorDb, setVectorDb] = useState("pinecone");

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setLLMChoice(_settings?.LLMProvider);
      setVectorDb(_settings?.VectorDB);

      setLoading(false);
    }
    if (currentStep === "data_handling") {
      fetchKeys();
    }
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div className="max-w-[750px]">
      <div className="p-8 flex gap-x-16">
        <div className="w-1/2 flex flex-col gap-y-3.5">
          <div className="text-white text-base font-bold">LLM Selection</div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLM_SELECTION_PRIVACY[llmChoice].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {LLM_SELECTION_PRIVACY[llmChoice].name}
            </p>
          </div>
          <div className="flex flex-col">
            {LLM_SELECTION_PRIVACY[llmChoice].description.map((desc) => (
              <p className="text-white/90 text-sm">
                <b>•</b> {desc}
              </p>
            ))}
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-y-3.5">
          <div className="text-white text-base font-bold">Vector Database</div>
          <div className="flex items-center gap-2.5">
            <img
              src={VECTOR_DB_PRIVACY[vectorDb].logo}
              alt="Vector DB Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {VECTOR_DB_PRIVACY[vectorDb].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc">
            {VECTOR_DB_PRIVACY[vectorDb].description.map((desc) => (
              <li className="text-white/90 text-sm">{desc}</li>
            ))}
          </ul>
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
          onClick={() => nextStep("create_workspace")}
          className="border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default memo(DataHandling);
