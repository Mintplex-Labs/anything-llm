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

const LLM_PROVIDER_PRIVACY_MAP = {
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
      "Your model and chats are only accessible on the machine running the NVIDIA NIM.",
    ],
    logo: NvidiaNimLogo,
  },
  lmstudio: {
    name: "LMStudio",
    description: [
      "Your model and chats are only accessible on the server running LMStudio.",
    ],
    logo: LMStudioLogo,
  },
  localai: {
    name: "LocalAI",
    description: [
      "Your model and chats are only accessible on the server running LocalAI.",
    ],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "Your model and chats are only accessible on the machine running Ollama models.",
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
      "Your model and chat contents are only accessible on the computer running Dell Pro AI Studio.",
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
      "Your model and chats are only accessible on the machine running Foundry Local.",
    ],
    logo: FoundryLogo,
  },
  giteeai: {
    name: "GiteeAI",
    policyUrl: "https://ai.gitee.com/docs/appendix/privacy",
    logo: GiteeAILogo,
  },
};

const VECTOR_DB_PROVIDER_PRIVACY_MAP = {
  pgvector: {
    name: "PGVector",
    description: [
      "Your vectors and document text are stored on your PostgreSQL instance.",
      "Access to your instance is managed by you.",
    ],
    logo: PGVectorLogo,
  },
  chroma: {
    name: "Chroma",
    description: [
      "Your vectors and document text are stored on your Chroma instance.",
      "Access to your instance is managed by you.",
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
      "Your vectors and document text are stored on your Milvus instance (cloud or self-hosted).",
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
      "Your vectors and document text are stored privately on this instance of AnythingLLM.",
    ],
    logo: LanceDbLogo,
  },
};

const EMBEDDING_ENGINE_PROVIDER_PRIVACY_MAP = {
  native: {
    name: "AnythingLLM Embedder",
    description: [
      "Your document text is embedded privately on this instance of AnythingLLM.",
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
      "Your document text is embedded privately on the server running LocalAI.",
    ],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: [
      "Your document text is embedded privately on the server running Ollama.",
    ],
    logo: OllamaLogo,
  },
  lmstudio: {
    name: "LMStudio",
    description: [
      "Your document text is embedded privately on the server running LMStudio.",
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

export const PROVIDER_PRIVACY_MAP = {
  llm: LLM_PROVIDER_PRIVACY_MAP,
  embeddingEngine: EMBEDDING_ENGINE_PROVIDER_PRIVACY_MAP,
  vectorDb: VECTOR_DB_PROVIDER_PRIVACY_MAP,
};
