const MODELS = {
  "togethercomputer/alpaca-7b": {
    id: "togethercomputer/alpaca-7b",
    name: "Alpaca (7B)",
    maxLength: 2048,
  },
  "Austism/chronos-hermes-13b": {
    id: "Austism/chronos-hermes-13b",
    name: "Chronos Hermes (13B)",
    maxLength: 2048,
  },
  "togethercomputer/CodeLlama-13b-Instruct": {
    id: "togethercomputer/CodeLlama-13b-Instruct",
    name: "Code Llama Instruct (13B)",
    maxLength: 8192,
  },
  "togethercomputer/CodeLlama-34b-Instruct": {
    id: "togethercomputer/CodeLlama-34b-Instruct",
    name: "Code Llama Instruct (34B)",
    maxLength: 8192,
  },
  "togethercomputer/CodeLlama-7b-Instruct": {
    id: "togethercomputer/CodeLlama-7b-Instruct",
    name: "Code Llama Instruct (7B)",
    maxLength: 8192,
  },
  "DiscoResearch/DiscoLM-mixtral-8x7b-v2": {
    id: "DiscoResearch/DiscoLM-mixtral-8x7b-v2",
    name: "DiscoLM Mixtral 8x7b",
    maxLength: 32768,
  },
  "togethercomputer/falcon-40b-instruct": {
    id: "togethercomputer/falcon-40b-instruct",
    name: "Falcon Instruct (40B)",
    maxLength: 2048,
  },
  "togethercomputer/falcon-7b-instruct": {
    id: "togethercomputer/falcon-7b-instruct",
    name: "Falcon Instruct (7B)",
    maxLength: 2048,
  },
  "togethercomputer/GPT-NeoXT-Chat-Base-20B": {
    id: "togethercomputer/GPT-NeoXT-Chat-Base-20B",
    name: "GPT-NeoXT-Chat-Base (20B)",
    maxLength: 2048,
  },
  "togethercomputer/llama-2-13b-chat": {
    id: "togethercomputer/llama-2-13b-chat",
    name: "LLaMA-2 Chat (13B)",
    maxLength: 4096,
  },
  "togethercomputer/llama-2-70b-chat": {
    id: "togethercomputer/llama-2-70b-chat",
    name: "LLaMA-2 Chat (70B)",
    maxLength: 4096,
  },
  "togethercomputer/llama-2-7b-chat": {
    id: "togethercomputer/llama-2-7b-chat",
    name: "LLaMA-2 Chat (7B)",
    maxLength: 4096,
  },
  "togethercomputer/Llama-2-7B-32K-Instruct": {
    id: "togethercomputer/Llama-2-7B-32K-Instruct",
    name: "LLaMA-2-7B-32K-Instruct (7B)",
    maxLength: 32768,
  },
  "mistralai/Mistral-7B-Instruct-v0.1": {
    id: "mistralai/Mistral-7B-Instruct-v0.1",
    name: "Mistral (7B) Instruct v0.1",
    maxLength: 4096,
  },
  "mistralai/Mistral-7B-Instruct-v0.2": {
    id: "mistralai/Mistral-7B-Instruct-v0.2",
    name: "Mistral (7B) Instruct v0.2",
    maxLength: 32768,
  },
  "mistralai/Mixtral-8x7B-Instruct-v0.1": {
    id: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    name: "Mixtral-8x7B Instruct",
    maxLength: 32768,
  },
  "Gryphe/MythoMax-L2-13b": {
    id: "Gryphe/MythoMax-L2-13b",
    name: "MythoMax-L2 (13B)",
    maxLength: 4096,
  },
  "NousResearch/Nous-Hermes-llama-2-7b": {
    id: "NousResearch/Nous-Hermes-llama-2-7b",
    name: "Nous Hermes LLaMA-2 (7B)",
    maxLength: 4096,
  },
  "NousResearch/Nous-Hermes-Llama2-13b": {
    id: "NousResearch/Nous-Hermes-Llama2-13b",
    name: "Nous Hermes Llama-2 (13B)",
    maxLength: 4096,
  },
  "NousResearch/Nous-Hermes-Llama2-70b": {
    id: "NousResearch/Nous-Hermes-Llama2-70b",
    name: "Nous Hermes Llama-2 (70B)",
    maxLength: 4096,
  },
  "NousResearch/Nous-Hermes-2-Yi-34B": {
    id: "NousResearch/Nous-Hermes-2-Yi-34B",
    name: "Nous Hermes-2 Yi (34B)",
    maxLength: 4096,
  },
  "NousResearch/Nous-Capybara-7B-V1p9": {
    id: "NousResearch/Nous-Capybara-7B-V1p9",
    name: "Nous Capybara v1.9 (7B)",
    maxLength: 8192,
  },
  "openchat/openchat-3.5-1210": {
    id: "openchat/openchat-3.5-1210",
    name: "OpenChat 3.5 1210 (7B)",
    maxLength: 8192,
  },
  "teknium/OpenHermes-2-Mistral-7B": {
    id: "teknium/OpenHermes-2-Mistral-7B",
    name: "OpenHermes-2-Mistral (7B)",
    maxLength: 4096,
  },
  "teknium/OpenHermes-2p5-Mistral-7B": {
    id: "teknium/OpenHermes-2p5-Mistral-7B",
    name: "OpenHermes-2.5-Mistral (7B)",
    maxLength: 4096,
  },
  "Open-Orca/Mistral-7B-OpenOrca": {
    id: "Open-Orca/Mistral-7B-OpenOrca",
    name: "OpenOrca Mistral (7B) 8K",
    maxLength: 8192,
  },
  "garage-bAInd/Platypus2-70B-instruct": {
    id: "garage-bAInd/Platypus2-70B-instruct",
    name: "Platypus2 Instruct (70B)",
    maxLength: 4096,
  },
  "togethercomputer/Pythia-Chat-Base-7B-v0.16": {
    id: "togethercomputer/Pythia-Chat-Base-7B-v0.16",
    name: "Pythia-Chat-Base (7B)",
    maxLength: 2048,
  },
  "togethercomputer/Qwen-7B-Chat": {
    id: "togethercomputer/Qwen-7B-Chat",
    name: "Qwen-Chat (7B)",
    maxLength: 8192,
  },
  "togethercomputer/RedPajama-INCITE-Chat-3B-v1": {
    id: "togethercomputer/RedPajama-INCITE-Chat-3B-v1",
    name: "RedPajama-INCITE Chat (3B)",
    maxLength: 2048,
  },
  "togethercomputer/RedPajama-INCITE-7B-Chat": {
    id: "togethercomputer/RedPajama-INCITE-7B-Chat",
    name: "RedPajama-INCITE Chat (7B)",
    maxLength: 2048,
  },
  "upstage/SOLAR-0-70b-16bit": {
    id: "upstage/SOLAR-0-70b-16bit",
    name: "SOLAR v0 (70B)",
    maxLength: 4096,
  },
  "togethercomputer/StripedHyena-Nous-7B": {
    id: "togethercomputer/StripedHyena-Nous-7B",
    name: "StripedHyena Nous (7B)",
    maxLength: 32768,
  },
  "lmsys/vicuna-7b-v1.5": {
    id: "lmsys/vicuna-7b-v1.5",
    name: "Vicuna v1.5 (7B)",
    maxLength: 4096,
  },
  "lmsys/vicuna-13b-v1.5": {
    id: "lmsys/vicuna-13b-v1.5",
    name: "Vicuna v1.5 (13B)",
    maxLength: 4096,
  },
  "lmsys/vicuna-13b-v1.5-16k": {
    id: "lmsys/vicuna-13b-v1.5-16k",
    name: "Vicuna v1.5 16K (13B)",
    maxLength: 16384,
  },
  "zero-one-ai/Yi-34B-Chat": {
    id: "zero-one-ai/Yi-34B-Chat",
    name: "01-ai Yi Chat (34B)",
    maxLength: 4096,
  },
};

module.exports.MODELS = MODELS;
