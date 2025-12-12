import LiteLLMLogo from "@/media/llmprovider/litellm.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import GroqLogo from "@/media/llmprovider/groq.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import FireworksAILogo from "@/media/llmprovider/fireworksai.jpeg";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import KoboldCPPLogo from "@/media/llmprovider/koboldcpp.png";
import TextGenWebUILogo from "@/media/llmprovider/text-generation-webui.png";
import CohereLogo from "@/media/llmprovider/cohere.png";
import AWSBedrockLogo from "@/media/llmprovider/bedrock.png";
import DeepSeekLogo from "@/media/llmprovider/deepseek.png";
import PPIOLogo from "@/media/llmprovider/ppio.png";
import APIPieLogo from "@/media/llmprovider/apipie.png";
import XAILogo from "@/media/llmprovider/xai.png";
import NvidiaNimLogo from "@/media/llmprovider/nvidia-nim.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import MoonshotAiLogo from "@/media/llmprovider/moonshotai.png";
import NovitaLogo from "@/media/llmprovider/novita.png";
import CometApiLogo from "@/media/llmprovider/cometapi.png";
import FoundryLogo from "@/media/llmprovider/foundry-local.png";
import DellProAiStudioLogo from "@/media/llmprovider/dpais.png";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";

// Define connection-specific field configurations for each provider
// This maps provider values to their connection configuration fields
const PROVIDER_FIELD_CONFIGS = {
  litellm: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:4000", description: "The base URL of your LiteLLM proxy" },
    { name: "apiKey", label: "API Key", type: "password", required: false, placeholder: "sk-...", description: "Optional API key for authentication" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens for the model" },
  ],
  ollama: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:11434", description: "The base URL of your Ollama instance" },
    { name: "apiKey", label: "API Key", type: "password", required: false, placeholder: "Optional", description: "Optional API key for authentication" },
  ],
  openai: [
    { name: "basePath", label: "Base Path", type: "text", required: false, placeholder: "https://api.openai.com/v1", description: "Optional custom base path" },
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-...", description: "Your OpenAI API key" },
  ],
  anthropic: [
    { name: "basePath", label: "Base Path", type: "text", required: false, placeholder: "https://api.anthropic.com/v1", description: "Optional custom base path" },
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-ant-...", description: "Your Anthropic API key" },
  ],
  "generic-openai": [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "https://api.example.com/v1", description: "Base URL of the OpenAI-compatible API" },
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-...", description: "Your API key" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens for the model" },
  ],
  azure: [
    { name: "basePath", label: "Endpoint", type: "text", required: true, placeholder: "https://your-resource.openai.azure.com", description: "Your Azure OpenAI endpoint" },
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Azure API key", description: "Your Azure OpenAI API key" },
  ],
  lmstudio: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:1234", description: "The base URL of your LM Studio instance" },
  ],
  localai: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:8080", description: "The base URL of your LocalAI instance" },
    { name: "apiKey", label: "API Key", type: "password", required: false, placeholder: "Optional", description: "Optional API key" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens" },
  ],
  groq: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "gsk_...", description: "Your Groq API key" },
  ],
  togetherai: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your Together AI API key" },
  ],
  fireworksai: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "fw_...", description: "Your Fireworks AI API key" },
  ],
  mistral: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your Mistral API key" },
  ],
  perplexity: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "pplx-...", description: "Your Perplexity API key" },
  ],
  openrouter: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-or-...", description: "Your OpenRouter API key" },
  ],
  koboldcpp: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:5001", description: "The base URL of your KoboldCPP instance" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens" },
  ],
  textgenwebui: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:5000", description: "The base URL of your Text Generation Web UI" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens" },
  ],
  cohere: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your Cohere API key" },
  ],
  bedrock: [
    { name: "accessKeyId", label: "Access Key ID", type: "text", required: true, placeholder: "AKIA...", description: "AWS Access Key ID" },
    { name: "secretAccessKey", label: "Secret Access Key", type: "password", required: true, placeholder: "Your secret key", description: "AWS Secret Access Key" },
    { name: "region", label: "AWS Region", type: "text", required: true, placeholder: "us-east-1", description: "AWS Region" },
  ],
  deepseek: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-...", description: "Your DeepSeek API key" },
  ],
  ppio: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your PPIO API key" },
  ],
  apipie: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your APIpie API key" },
  ],
  xai: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "xai-...", description: "Your xAI API key" },
  ],
  "nvidia-nim": [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:8000", description: "NVIDIA NIM endpoint URL" },
    { name: "apiKey", label: "API Key", type: "password", required: false, placeholder: "Optional", description: "Optional API key" },
  ],
  gemini: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "AIza...", description: "Your Google Gemini API key" },
  ],
  moonshotai: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your Moonshot AI API key" },
  ],
  novita: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your Novita AI API key" },
  ],
  cometapi: [
    { name: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your API key", description: "Your CometAPI key" },
  ],
  foundry: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:8080", description: "Microsoft Foundry endpoint" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens" },
  ],
  dpais: [
    { name: "basePath", label: "Base Path", type: "text", required: true, placeholder: "http://localhost:8080", description: "Dell Pro AI Studio endpoint" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens" },
  ],
  huggingface: [
    { name: "basePath", label: "Endpoint", type: "text", required: true, placeholder: "https://api-inference.huggingface.co", description: "HuggingFace API endpoint" },
    { name: "apiKey", label: "Access Token", type: "password", required: true, placeholder: "hf_...", description: "Your HuggingFace access token" },
    { name: "modelTokenLimit", label: "Model Token Limit", type: "number", required: false, placeholder: "4096", description: "Maximum tokens" },
  ],
};

// Build complete provider configs with logos, labels, and descriptions
export const PROVIDER_CONFIGS = {
  litellm: { label: "LiteLLM", logo: LiteLLMLogo, description: "Connect to a LiteLLM proxy server", fields: PROVIDER_FIELD_CONFIGS.litellm },
  ollama: { label: "Ollama", logo: OllamaLogo, description: "Connect to an Ollama instance", fields: PROVIDER_FIELD_CONFIGS.ollama },
  openai: { label: "OpenAI", logo: OpenAiLogo, description: "Connect to OpenAI API", fields: PROVIDER_FIELD_CONFIGS.openai },
  anthropic: { label: "Anthropic", logo: AnthropicLogo, description: "Connect to Anthropic API", fields: PROVIDER_FIELD_CONFIGS.anthropic },
  "generic-openai": { label: "Generic OpenAI", logo: GenericOpenAiLogo, description: "Connect to any OpenAI-compatible service", fields: PROVIDER_FIELD_CONFIGS["generic-openai"] },
  azure: { label: "Azure OpenAI", logo: AzureOpenAiLogo, description: "Connect to Azure OpenAI service", fields: PROVIDER_FIELD_CONFIGS.azure },
  lmstudio: { label: "LM Studio", logo: LMStudioLogo, description: "Connect to LM Studio instance", fields: PROVIDER_FIELD_CONFIGS.lmstudio },
  localai: { label: "Local AI", logo: LocalAiLogo, description: "Connect to LocalAI instance", fields: PROVIDER_FIELD_CONFIGS.localai },
  groq: { label: "Groq", logo: GroqLogo, description: "Connect to Groq AI", fields: PROVIDER_FIELD_CONFIGS.groq },
  togetherai: { label: "Together AI", logo: TogetherAILogo, description: "Connect to Together AI", fields: PROVIDER_FIELD_CONFIGS.togetherai },
  fireworksai: { label: "Fireworks AI", logo: FireworksAILogo, description: "Connect to Fireworks AI", fields: PROVIDER_FIELD_CONFIGS.fireworksai },
  mistral: { label: "Mistral", logo: MistralLogo, description: "Connect to Mistral AI", fields: PROVIDER_FIELD_CONFIGS.mistral },
  perplexity: { label: "Perplexity AI", logo: PerplexityLogo, description: "Connect to Perplexity AI", fields: PROVIDER_FIELD_CONFIGS.perplexity },
  openrouter: { label: "OpenRouter", logo: OpenRouterLogo, description: "Connect to OpenRouter", fields: PROVIDER_FIELD_CONFIGS.openrouter },
  koboldcpp: { label: "KoboldCPP", logo: KoboldCPPLogo, description: "Connect to KoboldCPP instance", fields: PROVIDER_FIELD_CONFIGS.koboldcpp },
  textgenwebui: { label: "Oobabooga Web UI", logo: TextGenWebUILogo, description: "Connect to Text Generation Web UI", fields: PROVIDER_FIELD_CONFIGS.textgenwebui },
  cohere: { label: "Cohere", logo: CohereLogo, description: "Connect to Cohere AI", fields: PROVIDER_FIELD_CONFIGS.cohere },
  bedrock: { label: "AWS Bedrock", logo: AWSBedrockLogo, description: "Connect to AWS Bedrock", fields: PROVIDER_FIELD_CONFIGS.bedrock },
  deepseek: { label: "DeepSeek", logo: DeepSeekLogo, description: "Connect to DeepSeek AI", fields: PROVIDER_FIELD_CONFIGS.deepseek },
  ppio: { label: "PPIO", logo: PPIOLogo, description: "Connect to PPIO AI", fields: PROVIDER_FIELD_CONFIGS.ppio },
  apipie: { label: "APIpie", logo: APIPieLogo, description: "Connect to APIpie", fields: PROVIDER_FIELD_CONFIGS.apipie },
  xai: { label: "xAI", logo: XAILogo, description: "Connect to xAI (Grok)", fields: PROVIDER_FIELD_CONFIGS.xai },
  "nvidia-nim": { label: "NVIDIA NIM", logo: NvidiaNimLogo, description: "Connect to NVIDIA NIM", fields: PROVIDER_FIELD_CONFIGS["nvidia-nim"] },
  gemini: { label: "Gemini", logo: GeminiLogo, description: "Connect to Google Gemini", fields: PROVIDER_FIELD_CONFIGS.gemini },
  moonshotai: { label: "Moonshot AI", logo: MoonshotAiLogo, description: "Connect to Moonshot AI", fields: PROVIDER_FIELD_CONFIGS.moonshotai },
  novita: { label: "Novita AI", logo: NovitaLogo, description: "Connect to Novita AI", fields: PROVIDER_FIELD_CONFIGS.novita },
  cometapi: { label: "CometAPI", logo: CometApiLogo, description: "Connect to CometAPI", fields: PROVIDER_FIELD_CONFIGS.cometapi },
  foundry: { label: "Microsoft Foundry Local", logo: FoundryLogo, description: "Connect to Microsoft Foundry", fields: PROVIDER_FIELD_CONFIGS.foundry },
  dpais: { label: "Dell Pro AI Studio", logo: DellProAiStudioLogo, description: "Connect to Dell Pro AI Studio", fields: PROVIDER_FIELD_CONFIGS.dpais },
  huggingface: { label: "HuggingFace", logo: HuggingFaceLogo, description: "Connect to HuggingFace", fields: PROVIDER_FIELD_CONFIGS.huggingface },
};
