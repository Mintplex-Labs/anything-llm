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
import ZAiLogo from "@/media/llmprovider/zai.png";
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
import PGVectorLogo from "@/media/vectordbs/pgvector.png";
import DPAISLogo from "@/media/llmprovider/dpais.png";
import MoonshotAiLogo from "@/media/llmprovider/moonshotai.png";
import CometApiLogo from "@/media/llmprovider/cometapi.png";
import FoundryLogo from "@/media/llmprovider/foundry-local.png";
import GiteeAILogo from "@/media/llmprovider/giteeai.png";

import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LLM_SELECTION_PRIVACY = {
  openai: {
    name: "OpenAI",
    policyUrl: "https://openai.com/policies/privacy-policy/",
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    policyUrl: "https://privacy.microsoft.com/privacystatement",
    logo: AzureOpenAiLogo,
  },
  anthropic: {
    name: "Anthropic",
    policyUrl: "https://www.anthropic.com/privacy",
    logo: AnthropicLogo,
  },
  gemini: {
    name: "Google Gemini",
    policyUrl: "https://policies.google.com/privacy",
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
    policyUrl: "https://www.together.ai/privacy",
    logo: TogetherAILogo,
  },
  fireworksai: {
    name: "FireworksAI",
    policyUrl: "https://fireworks.ai/privacy-policy",
    logo: FireworksAILogo,
  },
  mistral: {
    name: "Mistral",
    policyUrl: "https://legal.mistral.ai/terms/privacy-policy",
    logo: MistralLogo,
  },
  huggingface: {
    name: "HuggingFace",
    policyUrl: "https://huggingface.co/privacy",
    logo: HuggingFaceLogo,
  },
  perplexity: {
    name: "Perplexity AI",
    policyUrl: "https://www.perplexity.ai/privacy",
    logo: PerplexityLogo,
  },
  openrouter: {
    name: "OpenRouter",
    policyUrl: "https://openrouter.ai/privacy",
    logo: OpenRouterLogo,
  },
  novita: {
    name: "Novita AI",
    policyUrl: "https://novita.ai/legal/privacy-policy",
    logo: NovitaLogo,
  },
  groq: {
    name: "Groq",
    policyUrl: "https://groq.com/privacy-policy/",
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
    policyUrl: "https://cohere.com/privacy",
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
    policyUrl: "https://aws.amazon.com/bedrock/security-compliance/",
    logo: AWSBedrockLogo,
  },
  deepseek: {
    name: "DeepSeek",
    policyUrl:
      "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html",
    logo: DeepSeekLogo,
  },
  apipie: {
    name: "APIpie.AI",
    policyUrl: "https://apipie.ai/docs/Terms/privacy",
    logo: APIPieLogo,
  },
  xai: {
    name: "xAI",
    policyUrl: "https://x.ai/legal/privacy-policy",
    logo: XAILogo,
  },
  zai: {
    name: "Z.AI",
    policyUrl: "https://docs.z.ai/legal-agreement/privacy-policy",
    logo: ZAiLogo,
  },
  ppio: {
    name: "PPIO",
    policyUrl: "https://www.pipio.ai/privacy-policy",
    logo: PPIOLogo,
  },
  dpais: {
    name: "Dell Pro AI Studio",
    description: [
      "Your model and chat contents are only accessible on the computer running Dell Pro AI Studio",
    ],
    logo: DPAISLogo,
  },
  moonshotai: {
    name: "Moonshot AI",
    policyUrl: "https://platform.moonshot.ai/docs/agreement/userprivacy",
    logo: MoonshotAiLogo,
  },
  cometapi: {
    name: "CometAPI",
    policyUrl: "https://apidoc.cometapi.com/privacy-policy-873819m0",
    logo: CometApiLogo,
  },
  foundry: {
    name: "Microsoft Foundry Local",
    description: [
      "Your model and chats are only accessible on the machine running Foundry Local",
    ],
    logo: FoundryLogo,
  },
  giteeai: {
    name: "GiteeAI",
    policyUrl: "https://ai.gitee.com/docs/appendix/privacy",
    logo: GiteeAILogo,
  },
};

export const VECTOR_DB_PRIVACY = {
  pgvector: {
    name: "PGVector",
    description: [
      "Your vectors and document text are stored on your PostgreSQL instance",
      "Access to your instance is managed by you",
    ],
    logo: PGVectorLogo,
  },
  chroma: {
    name: "Chroma",
    description: [
      "Your vectors and document text are stored on your Chroma instance",
      "Access to your instance is managed by you",
    ],
    logo: ChromaLogo,
  },
  chromacloud: {
    name: "Chroma Cloud",
    policyUrl: "https://www.trychroma.com/privacy",
    logo: ChromaLogo,
  },
  pinecone: {
    name: "Pinecone",
    policyUrl: "https://www.pinecone.io/privacy/",
    logo: PineconeLogo,
  },
  qdrant: {
    name: "Qdrant",
    policyUrl: "https://qdrant.tech/legal/privacy-policy/",
    logo: QDrantLogo,
  },
  weaviate: {
    name: "Weaviate",
    policyUrl: "https://weaviate.io/privacy",
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
    policyUrl: "https://zilliz.com/privacy-policy",
    logo: ZillizLogo,
  },
  astra: {
    name: "AstraDB",
    policyUrl: "https://www.ibm.com/us-en/privacy",
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
    policyUrl: "https://openai.com/policies/privacy-policy/",
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    policyUrl: "https://privacy.microsoft.com/privacystatement",
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
  openrouter: {
    name: "OpenRouter",
    policyUrl: "https://openrouter.ai/privacy",
    logo: OpenRouterLogo,
  },
  cohere: {
    name: "Cohere",
    policyUrl: "https://cohere.com/privacy",
    logo: CohereLogo,
  },
  voyageai: {
    name: "Voyage AI",
    policyUrl: "https://www.voyageai.com/privacy",
    logo: VoyageAiLogo,
  },
  mistral: {
    name: "Mistral AI",
    policyUrl: "https://legal.mistral.ai/terms/privacy-policy",
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
    policyUrl: "https://policies.google.com/privacy",
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
      <div className="p-8 flex flex-col gap-8 w-full max-w-2xl">
        <div className="flex flex-col items-start gap-y-3 border-b border-theme-sidebar-border pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            LLM Provider
          </div>
          <div className="flex items-start gap-3">
            <img
              src={LLMSelection.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded flex-shrink-0 mt-0.5"
            />
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-theme-text-primary text-sm font-semibold">
                  {LLMSelection.name}
                </span>
              </div>
              {LLMSelection.policyUrl ? (
                <div className="text-theme-text-secondary text-sm">
                  Your usage, chats, and data are subject to the service&apos;s{" "}
                  <a
                    className="text-theme-text-secondary hover:text-theme-text-primary text-sm font-medium underline transition-colors inline-flex items-center gap-1"
                    href={LLMSelection.policyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    privacy policy
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  .
                </div>
              ) : (
                LLMSelection.description && (
                  <ul className="flex flex-col list-disc ml-4 gap-1">
                    {LLMSelection.description.map((desc, idx) => (
                      <li
                        key={idx}
                        className="text-theme-text-secondary text-sm"
                      >
                        {desc}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 border-b border-theme-sidebar-border pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            Embedding Preference
          </div>
          <div className="flex items-start gap-3">
            <img
              src={EmbeddingEngine.logo}
              alt="Embedding Logo"
              className="w-8 h-8 rounded flex-shrink-0 mt-0.5"
            />
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-theme-text-primary text-sm font-semibold">
                  {EmbeddingEngine.name}
                </span>
              </div>
              {EmbeddingEngine.policyUrl ? (
                <div className="text-theme-text-secondary text-sm">
                  Your usage, chats, and data are subject to the service&apos;s{" "}
                  <a
                    className="text-theme-text-secondary hover:text-theme-text-primary text-sm font-medium underline transition-colors inline-flex items-center gap-1"
                    href={EmbeddingEngine.policyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    privacy policy
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  .
                </div>
              ) : (
                EmbeddingEngine.description && (
                  <ul className="flex flex-col list-disc ml-4 gap-1">
                    {EmbeddingEngine.description.map((desc, idx) => (
                      <li
                        key={idx}
                        className="text-theme-text-secondary text-sm"
                      >
                        {desc}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-3 pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            Vector Database
          </div>
          <div className="flex items-start gap-3">
            <img
              src={VectorDb.logo}
              alt="Vector DB Logo"
              className="w-8 h-8 rounded flex-shrink-0 mt-0.5"
            />
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-theme-text-primary text-sm font-semibold">
                  {VectorDb.name}
                </span>
              </div>
              {VectorDb.policyUrl ? (
                <div className="text-theme-text-secondary text-sm">
                  Your usage, chats, and data are subject to the service&apos;s{" "}
                  <a
                    className="text-theme-text-secondary hover:text-theme-text-primary text-sm font-medium underline transition-colors inline-flex items-center gap-1"
                    href={VectorDb.policyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    privacy policy
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  .
                </div>
              ) : (
                VectorDb.description && (
                  <ul className="flex flex-col list-disc ml-4 gap-1">
                    {VectorDb.description.map((desc, idx) => (
                      <li
                        key={idx}
                        className="text-theme-text-secondary text-sm"
                      >
                        {desc}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-theme-text-secondary text-sm font-medium py-1">
        {t("onboarding.data.settingsHint")}
      </p>
    </div>
  );
}
