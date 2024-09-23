import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import KoboldCPPLogo from "@/media/llmprovider/koboldcpp.png";
import TextGenWebUILogo from "@/media/llmprovider/text-generation-webui.png";
import LiteLLMLogo from "@/media/llmprovider/litellm.png";

import CohereLogo from "@/media/llmprovider/cohere.png";
import ZillizLogo from "@/media/vectordbs/zilliz.png";
import AstraDBLogo from "@/media/vectordbs/astraDB.png";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import PineconeLogo from "@/media/vectordbs/pinecone.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import WeaviateLogo from "@/media/vectordbs/weaviate.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";
import MilvusLogo from "@/media/vectordbs/milvus.png";
import VoyageAiLogo from "@/media/embeddingprovider/voyageai.png";

import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LLM_LOGOS = {
  openai: OpenAiLogo,
  azure: AzureOpenAiLogo,
  anthropic: AnthropicLogo,
  gemini: GeminiLogo,
  lmstudio: LMStudioLogo,
  localai: LocalAiLogo,
  ollama: OllamaLogo,
  native: AnythingLLMIcon,
  togetherai: TogetherAILogo,
  mistral: MistralLogo,
  huggingface: HuggingFaceLogo,
  perplexity: PerplexityLogo,
  openrouter: OpenRouterLogo,
  groq: GroqLogo,
  koboldcpp: KoboldCPPLogo,
  textgenwebui: TextGenWebUILogo,
  litellm: LiteLLMLogo,
  "generic-openai": GenericOpenAiLogo,
  cohere: CohereLogo,
  litellm: LiteLLMLogo,
};

export const VECTOR_LOGOS = {
  chroma: ChromaLogo,
  pinecone: PineconeLogo,
  qdrant: QDrantLogo,
  weaviate: WeaviateLogo,
  milvus: MilvusLogo,
  zilliz: ZillizLogo,
  astra: AstraDBLogo,
  lancedb: LanceDbLogo,
};

export const EMBEDDING_LOGOS = {
  native: AnythingLLMIcon,
  openai: OpenAiLogo,
  azure: AzureOpenAiLogo,
  localai: LocalAiLogo,
  ollama: OllamaLogo,
  lmstudio: LMStudioLogo,
  cohere: CohereLogo,
  voyageai: VoyageAiLogo,
  litellm: LiteLLMLogo,
  "generic-openai": GenericOpenAiLogo,
};

export default function DataHandling({ setHeader, setForwardBtn, setBackBtn }) {
  const [llmChoice, setLLMChoice] = useState("openai");
  const [loading, setLoading] = useState(true);
  const [vectorDb, setVectorDb] = useState("pinecone");
  const [embeddingEngine, setEmbeddingEngine] = useState("openai");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const llmName = t(`handlingPrivacy.llmSelectionPrivacy.${llmChoice}.name`);
  const llmDescription = t(
    `handlingPrivacy.llmSelectionPrivacy.${llmChoice}.description`,
    {
      returnObjects: true,
    }
  );
  const llmLogo = LLM_LOGOS[llmChoice];
  const vectorName = t(`handlingPrivacy.vectorDbPrivacy.${vectorDb}.name`);
  const vectorDescription = t(
    `handlingPrivacy.vectorDbPrivacy.${vectorDb}.description`,
    {
      returnObjects: true,
    }
  );
  const vectorLogo = VECTOR_LOGOS[vectorDb];
  const embaddingName = t(
    `handlingPrivacy.embeddingEnginePrivacy.${embeddingEngine}.name`
  );
  const embaddingDescription = t(
    `handlingPrivacy.embeddingEnginePrivacy.${embeddingEngine}.description`,
    {
      returnObjects: true,
    }
  );
  const embeddingLogo = EMBEDDING_LOGOS[embeddingEngine];

  useEffect(() => {
    setHeader({
      title: t("handlingPrivacy.title"),
      description: t("handlingPrivacy.description"),
    });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });

    async function fetchKeys() {
      const _settings = await System.keys();
      setLLMChoice(_settings?.LLMProvider || "openai");
      setVectorDb(_settings?.VectorDB || "lancedb");
      setEmbeddingEngine(_settings?.EmbeddingEngine || "openai");
      setLoading(false);
    }

    fetchKeys();
  }, []);

  function handleForward() {
    navigate(paths.onboarding.survey());
  }

  function handleBack() {
    navigate(paths.onboarding.userSetup());
  }

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">
            {t("privacy.llm")}
          </div>
          <div className="flex items-center gap-2.5">
            <img src={llmLogo} alt="LLM Logo" className="w-8 h-8 rounded" />
            <p className="text-white text-sm font-bold">{llmName}</p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {llmDescription.map((desc, index) => (
              <li key={index} className="text-white/90 text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">
            {t("privacy.embedding")}
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={embeddingLogo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">{embaddingName}</p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {embaddingDescription.map((desc, index) => (
              <li key={index} className="text-white/90 text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4">
          <div className="text-white text-base font-bold">
            {t("privacy.vector")}
          </div>
          <div className="flex items-center gap-2.5">
            <img src={vectorLogo} alt="LLM Logo" className="w-8 h-8 rounded" />
            <p className="text-white text-sm font-bold">{vectorName}</p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {vectorDescription.map((desc, index) => (
              <li key={index} className="text-white/90 text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-white/60 text-sm font-medium py-1">
        {t("handlingPrivacy.setting")}
      </p>
    </div>
  );
}
