const OpenAIProvider = require("./openai.js");
const AnthropicProvider = require("./anthropic.js");
const LMStudioProvider = require("./lmstudio.js");
const OllamaProvider = require("./ollama.js");
const GroqProvider = require("./groq.js");
const TogetherAIProvider = require("./togetherai.js");
const AzureOpenAiProvider = require("./azure.js");
const KoboldCPPProvider = require("./koboldcpp.js");
const LocalAIProvider = require("./localai.js");

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
};
