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
import FireworksAILogo from "@/media/llmprovider/fireworksai.jpeg";
import NvidiaNimLogo from "@/media/llmprovider/nvidia-nim.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import NovitaLogo from "@/media/llmprovider/novita.png";
import GroqLogo from "@/media/llmprovider/groq.png";
import KoboldCPPLogo from "@/media/llmprovider/koboldcpp.png";
import TextGenWebUILogo from "@/media/llmprovider/text-generation-webui.png";
import LiteLLMLogo from "@/media/llmprovider/litellm.png";
import AWSBedrockLogo from "@/media/llmprovider/bedrock.png";
import DeepSeekLogo from "@/media/llmprovider/deepseek.png";
import APIPieLogo from "@/media/llmprovider/apipie.png";
import XAILogo from "@/media/llmprovider/xai.png";
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
import PPIOLogo from "@/media/llmprovider/ppio.png";

import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LLM_SELECTION_PRIVACY = {
  openai: {
    name: "OpenAI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to OpenAI",
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
      "Your prompts and document text used in response creation are visible to Anthropic",
    ],
    logo: AnthropicLogo,
  },
  gemini: {
    name: "Google Gemini",
    description: [
      "Your chats are de-identified and used in training",
      "Your prompts and document text used in response creation are visible to Google",
    ],
    logo: GeminiLogo,
  },
  "nvidia-nim": {
    name: "NVIDIA NIM",
    description: [
      "Your model and chats are only accessible on the machine running the NVIDIA NIM",
    ],
    logo: NvidiaNimLogo,
  },
  lmstudio: {
    name: "LMStudio",
    description: [
      "Your model and chats are only accessible on the server running LMStudio",
    ],
    logo: LMStudioLogo,
  },
  localai: {
    name: "LocalAI",
    description: [
      "Your model and chats are only accessible on the server running LocalAI",
    ],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "Your model and chats are only accessible on the machine running Ollama models",
    ],
    logo: OllamaLogo,
  },
  togetherai: {
    name: "TogetherAI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to TogetherAI",
    ],
    logo: TogetherAILogo,
  },
  fireworksai: {
    name: "FireworksAI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to Fireworks AI",
    ],
    logo: FireworksAILogo,
  },
  mistral: {
    name: "Mistral",
    description: [
      "Your prompts and document text used in response creation are visible to Mistral",
    ],
    logo: MistralLogo,
  },
  huggingface: {
    name: "HuggingFace",
    description: [
      "Your prompts and document text used in response are sent to your HuggingFace managed endpoint",
    ],
    logo: HuggingFaceLogo,
  },
  perplexity: {
    name: "Perplexity AI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to Perplexity AI",
    ],
    logo: PerplexityLogo,
  },
  openrouter: {
    name: "OpenRouter",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to OpenRouter",
    ],
    logo: OpenRouterLogo,
  },
  novita: {
    name: "Novita AI",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to Novita AI",
    ],
    logo: NovitaLogo,
  },
  groq: {
    name: "Groq",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to Groq",
    ],
    logo: GroqLogo,
  },
  koboldcpp: {
    name: "KoboldCPP",
    description: [
      "Your model and chats are only accessible on the server running KoboldCPP",
    ],
    logo: KoboldCPPLogo,
  },
  textgenwebui: {
    name: "Oobabooga Web UI",
    description: [
      "Your model and chats are only accessible on the server running the Oobabooga Text Generation Web UI",
    ],
    logo: TextGenWebUILogo,
  },
  "generic-openai": {
    name: "Generic OpenAI compatible service",
    description: [
      "Data is shared according to the terms of service applicable with your generic endpoint provider.",
    ],
    logo: GenericOpenAiLogo,
  },
  cohere: {
    name: "Cohere",
    description: [
      "Data is shared according to the terms of service of cohere.com and your localities privacy laws.",
    ],
    logo: CohereLogo,
  },
  litellm: {
    name: "LiteLLM",
    description: [
      "Your model and chats are only accessible on the server running LiteLLM",
    ],
    logo: LiteLLMLogo,
  },
  bedrock: {
    name: "AWS Bedrock",
    description: [
      "You model and chat contents are subject to the agreed EULA for AWS and the model provider on aws.amazon.com",
    ],
    logo: AWSBedrockLogo,
  },
  deepseek: {
    name: "DeepSeek",
    description: ["Your model and chat contents are visible to DeepSeek"],
    logo: DeepSeekLogo,
  },
  apipie: {
    name: "APIpie.AI",
    description: [
      "Your model and chat contents are visible to APIpie in accordance with their terms of service.",
    ],
    logo: APIPieLogo,
  },
  xai: {
    name: "xAI",
    description: [
      "Your model and chat contents are visible to xAI in accordance with their terms of service.",
    ],
    logo: XAILogo,
  },
  ppio: {
    name: "PPIO",
    description: [
      "Your chats will not be used for training",
      "Your prompts and document text used in response creation are visible to PPIO",
    ],
    logo: PPIOLogo,
  },
};

export const VECTOR_DB_PRIVACY = {
  chroma: {
    name: "Chroma",
    description: [
      "Your vectors and document text are stored on your Chroma instance",
      "Access to your instance is managed by you",
    ],
    logo: ChromaLogo,
  },
  pinecone: {
    name: "Pinecone",
    description: [
      "Your vectors and document text are stored on Pinecone's servers",
      "Access to your data is managed by Pinecone",
    ],
    logo: PineconeLogo,
  },
  qdrant: {
    name: "Qdrant",
    description: [
      "Your vectors and document text are stored on your Qdrant instance (cloud or self-hosted)",
    ],
    logo: QDrantLogo,
  },
  weaviate: {
    name: "Weaviate",
    description: [
      "Your vectors and document text are stored on your Weaviate instance (cloud or self-hosted)",
    ],
    logo: WeaviateLogo,
  },
  milvus: {
    name: "Milvus",
    description: [
      "Your vectors and document text are stored on your Milvus instance (cloud or self-hosted)",
    ],
    logo: MilvusLogo,
  },
  zilliz: {
    name: "Zilliz Cloud",
    description: [
      "Your vectors and document text are stored on your Zilliz cloud cluster.",
    ],
    logo: ZillizLogo,
  },
  astra: {
    name: "AstraDB",
    description: [
      "Your vectors and document text are stored on your cloud AstraDB database.",
    ],
    logo: AstraDBLogo,
  },
  lancedb: {
    name: "LanceDB",
    description: [
      "Your vectors and document text are stored privately on this instance of AnythingLLM",
    ],
    logo: LanceDbLogo,
  },
};

export const EMBEDDING_ENGINE_PRIVACY = {
  native: {
    name: "AnythingLLM Embedder",
    description: [
      "Your document text is embedded privately on this instance of AnythingLLM",
    ],
    logo: AnythingLLMIcon,
  },
  openai: {
    name: "OpenAI",
    description: [
      "Your document text is sent to OpenAI servers",
      "Your documents are not used for training",
    ],
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    description: [
      "Your document text is sent to your Microsoft Azure service",
      "Your documents are not used for training",
    ],
    logo: AzureOpenAiLogo,
  },
  localai: {
    name: "LocalAI",
    description: [
      "Your document text is embedded privately on the server running LocalAI",
    ],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "Your document text is embedded privately on the server running Ollama",
    ],
    logo: OllamaLogo,
  },
  lmstudio: {
    name: "LMStudio",
    description: [
      "Your document text is embedded privately on the server running LMStudio",
    ],
    logo: LMStudioLogo,
  },
  cohere: {
    name: "Cohere",
    description: [
      "Data is shared according to the terms of service of cohere.com and your localities privacy laws.",
    ],
    logo: CohereLogo,
  },
  voyageai: {
    name: "Voyage AI",
    description: [
      "Data sent to Voyage AI's servers is shared according to the terms of service of voyageai.com.",
    ],
    logo: VoyageAiLogo,
  },
  mistral: {
    name: "Mistral AI",
    description: [
      "Data sent to Mistral AI's servers is shared according to the terms of service of https://mistral.ai.",
    ],
    logo: MistralLogo,
  },
  litellm: {
    name: "LiteLLM",
    description: [
      "Your document text is only accessible on the server running LiteLLM and to the providers you configured in LiteLLM.",
    ],
    logo: LiteLLMLogo,
  },
  "generic-openai": {
    name: "Generic OpenAI compatible service",
    description: [
      "Data is shared according to the terms of service applicable with your generic endpoint provider.",
    ],
    logo: GenericOpenAiLogo,
  },
  gemini: {
    name: "Google Gemini",
    description: [
      "Your document text is sent to Google Gemini's servers for processing",
      "Your document text is stored or managed according to the terms of service of Google Gemini API Terms of Service",
    ],
    logo: GeminiLogo,
  },
};

export const FALLBACKS = {
  LLM: (provider) => ({
    name: "Unknown",
    description: [
      `"${provider}" has no known data handling policy defined in AnythingLLM`,
    ],
    logo: AnythingLLMIcon,
  }),
  EMBEDDING: (provider) => ({
    name: "Unknown",
    description: [
      `"${provider}" has no known data handling policy defined in AnythingLLM`,
    ],
    logo: AnythingLLMIcon,
  }),
  VECTOR: (provider) => ({
    name: "Unknown",
    description: [
      `"${provider}" has no known data handling policy defined in AnythingLLM`,
    ],
    logo: AnythingLLMIcon,
  }),
};

export default function DataHandling({ setHeader, setForwardBtn, setBackBtn }) {
  const { t } = useTranslation();
  const [llmChoice, setLLMChoice] = useState("openai");
  const [loading, setLoading] = useState(true);
  const [vectorDb, setVectorDb] = useState("pinecone");
  const [embeddingEngine, setEmbeddingEngine] = useState("openai");
  const navigate = useNavigate();

  const TITLE = t("onboarding.data.title");
  const DESCRIPTION = t("onboarding.data.description");

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
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

  const LLMSelection =
    LLM_SELECTION_PRIVACY?.[llmChoice] || FALLBACKS.LLM(llmChoice);
  const EmbeddingEngine =
    EMBEDDING_ENGINE_PRIVACY?.[embeddingEngine] ||
    FALLBACKS.EMBEDDING(embeddingEngine);
  const VectorDb = VECTOR_DB_PRIVACY?.[vectorDb] || FALLBACKS.VECTOR(vectorDb);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-theme-sidebar-border pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            LLM Selection
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLMSelection.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {LLMSelection.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {LLMSelection.description.map((desc) => (
              <li className="text-theme-text-primary text-sm">{desc}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-theme-sidebar-border pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            Embedding Preference
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={EmbeddingEngine.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {EmbeddingEngine.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {EmbeddingEngine.description.map((desc) => (
              <li className="text-theme-text-primary text-sm">{desc}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            Vector Database
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={VectorDb.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {VectorDb.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {VectorDb.description.map((desc) => (
              <li className="text-theme-text-primary text-sm">{desc}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-theme-text-secondary text-sm font-medium py-1">
        {t("onboarding.data.settingsHint")}
      </p>
    </div>
  );
}
