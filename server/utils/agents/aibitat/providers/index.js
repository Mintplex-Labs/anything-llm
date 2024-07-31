const OpenAIProvider = require("./openai.js");
const AnthropicProvider = require("./anthropic.js");
const LMStudioProvider = require("./lmstudio.js");
const OllamaProvider = require("./ollama.js");
const GroqProvider = require("./groq.js");
const TogetherAIProvider = require("./togetherai.js");
const AzureOpenAiProvider = require("./azure.js");
const KoboldCPPProvider = require("./koboldcpp.js");
const LocalAIProvider = require("./localai.js");
const OpenRouterProvider = require("./openrouter.js");
const MistralProvider = require("./mistral.js");
const GenericOpenAiProvider = require("./genericOpenAi.js");
const PerplexityProvider = require("./perplexity.js");
const TextWebGenUiProvider = require("./textgenwebui.js");
const AWSBedrockProvider = require("./bedrock.js");

module.exports = {
  OpenAIProvider,
  AnthropicProvider,
  LMStudioProvider,
  OllamaProvider,
  GroqProvider,
  TogetherAIProvider,
  AzureOpenAiProvider,
  KoboldCPPProvider,
  LocalAIProvider,
  OpenRouterProvider,
  MistralProvider,
  GenericOpenAiProvider,
  PerplexityProvider,
  TextWebGenUiProvider,
  AWSBedrockProvider,
};
