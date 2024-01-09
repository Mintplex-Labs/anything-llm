import { useState, useEffect } from "react";

const models = [
  {
    name: "Alpaca (7B)",
    string: "togethercomputer/alpaca-7b",
    maxLength: 2048,
  },
  {
    name: "Chronos Hermes (13B)",
    string: "Austism/chronos-hermes-13b",
    maxLength: 2048,
  },
  {
    name: "Code Llama Instruct (13B)",
    string: "togethercomputer/CodeLlama-13b-Instruct",
    maxLength: 8192,
  },
  {
    name: "Code Llama Instruct (34B)",
    string: "togethercomputer/CodeLlama-34b-Instruct",
    maxLength: 8192,
  },
  {
    name: "Code Llama Instruct (7B)",
    string: "togethercomputer/CodeLlama-7b-Instruct",
    maxLength: 8192,
  },
  {
    name: "Dolly v2 (12B)",
    string: "databricks/dolly-v2-12b",
    maxLength: 2048,
  },
  { name: "Dolly v2 (3B)", string: "databricks/dolly-v2-3b", maxLength: 2048 },
  { name: "Dolly v2 (7B)", string: "databricks/dolly-v2-7b", maxLength: 2048 },
  {
    name: "Falcon Instruct (40B)",
    string: "togethercomputer/falcon-40b-instruct",
    maxLength: 2048,
  },
  {
    name: "Falcon Instruct (7B)",
    string: "togethercomputer/falcon-7b-instruct",
    maxLength: 2048,
  },
  {
    name: "GPT-NeoXT-Chat-Base (20B)",
    string: "togethercomputer/GPT-NeoXT-Chat-Base-20B",
    maxLength: 2048,
  },
  {
    name: "Guanaco (13B)",
    string: "togethercomputer/guanaco-13b",
    maxLength: 2048,
  },
  {
    name: "Guanaco (33B)",
    string: "togethercomputer/guanaco-33b",
    maxLength: 2048,
  },
  {
    name: "Guanaco (65B)",
    string: "togethercomputer/guanaco-65b",
    maxLength: 2048,
  },
  {
    name: "Guanaco (7B)",
    string: "togethercomputer/guanaco-7b",
    maxLength: 2048,
  },
  {
    name: "InstructCodeT5 (16B)",
    string: "Salesforce/instructcodet5p-16b",
    maxLength: 2048,
  },
  {
    name: "Koala (13B)",
    string: "togethercomputer/Koala-13B",
    maxLength: 2048,
  },
  { name: "Koala (7B)", string: "togethercomputer/Koala-7B", maxLength: 2048 },
  {
    name: "LLaMA 2 SFT v10 (70B)",
    string: "OpenAssistant/llama2-70b-oasst-sft-v10",
    maxLength: 4096,
  },
  {
    name: "LLaMA-2 Chat (13B)",
    string: "togethercomputer/llama-2-13b-chat",
    maxLength: 4096,
  },
  {
    name: "LLaMA-2 Chat (70B)",
    string: "togethercomputer/llama-2-70b-chat",
    maxLength: 4096,
  },
  {
    name: "LLaMA-2 Chat (7B)",
    string: "togethercomputer/llama-2-7b-chat",
    maxLength: 4096,
  },
  {
    name: "LLaMA-2-7B-32K-Instruct (7B)",
    string: "togethercomputer/Llama-2-7B-32K-Instruct",
    maxLength: 32768,
  },
  {
    name: "MPT-Chat (30B)",
    string: "togethercomputer/mpt-30b-chat",
    maxLength: 2048,
  },
  {
    name: "MPT-Chat (7B)",
    string: "togethercomputer/mpt-7b-chat",
    maxLength: 2048,
  },
  {
    name: "Mistral (7B) Instruct",
    string: "mistralai/Mistral-7B-Instruct-v0.1",
    maxLength: 4096,
  },
  {
    name: "MythoMax-L2 (13B)",
    string: "Gryphe/MythoMax-L2-13b",
    maxLength: 4096,
  },
  {
    name: "Nous Hermes LLaMA-2 (70B)",
    string: "NousResearch/Nous-Hermes-Llama2-70b",
    maxLength: 4096,
  },
  {
    name: "Nous Hermes LLaMA-2 (7B)",
    string: "NousResearch/Nous-Hermes-llama-2-7b",
    maxLength: 4096,
  },
  {
    name: "Nous Hermes Llama-2 (13B)",
    string: "NousResearch/Nous-Hermes-Llama2-13b",
    maxLength: 4096,
  },
  {
    name: "Open-Assistant LLaMA SFT-6 (30B)",
    string: "OpenAssistant/oasst-sft-6-llama-30b-xor",
    maxLength: 2048,
  },
  {
    name: "Open-Assistant Pythia SFT-4 (12B)",
    string: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    maxLength: 2048,
  },
  {
    name: "Open-Assistant StableLM SFT-7 (7B)",
    string: "OpenAssistant/stablelm-7b-sft-v7-epoch-3",
    maxLength: 4096,
  },
  {
    name: "OpenHermes-2-Mistral (7B)",
    string: "teknium/OpenHermes-2-Mistral-7B",
    maxLength: 4096,
  },
  {
    name: "OpenOrca Mistral (7B) 8K",
    string: "Open-Orca/Mistral-7B-OpenOrca",
    maxLength: 8192,
  },
  {
    name: "Platypus2 Instruct (70B)",
    string: "garage-bAInd/Platypus2-70B-instruct",
    maxLength: 4096,
  },
  {
    name: "Pythia-Chat-Base (7B)",
    string: "togethercomputer/Pythia-Chat-Base-7B-v0.16",
    maxLength: 2048,
  },
  {
    name: "Qwen-Chat (7B)",
    string: "togethercomputer/Qwen-7B-Chat",
    maxLength: 8192,
  },
  {
    name: "RedPajama-INCITE Chat (3B)",
    string: "togethercomputer/RedPajama-INCITE-Chat-3B-v1",
    maxLength: 2048,
  },
  {
    name: "RedPajama-INCITE Chat (7B)",
    string: "togethercomputer/RedPajama-INCITE-7B-Chat",
    maxLength: 2048,
  },
  {
    name: "SOLAR v0 (70B)",
    string: "upstage/SOLAR-0-70b-16bit",
    maxLength: 4096,
  },
  {
    name: "StarCoderChat Alpha (16B)",
    string: "HuggingFaceH4/starchat-alpha",
    maxLength: 8192,
  },
  {
    name: "Vicuna v1.3 (13B)",
    string: "lmsys/vicuna-13b-v1.3",
    maxLength: 2048,
  },
  { name: "Vicuna v1.3 (7B)", string: "lmsys/vicuna-7b-v1.3", maxLength: 2048 },
  {
    name: "Vicuna v1.5 (13B)",
    string: "lmsys/vicuna-13b-v1.5",
    maxLength: 4096,
  },
  { name: "Vicuna v1.5 (7B)", string: "lmsys/vicuna-7b-v1.5", maxLength: 4096 },
  {
    name: "Vicuna-FastChat-T5 (3B)",
    string: "lmsys/fastchat-t5-3b-v1.0",
    maxLength: 512,
  },
];

export default function TogetherAiOptions({ settings }) {
  const [tokenLimit, setTokenLimit] = useState(0);
  const [selectedModelString, setSelectedModelString] = useState(
    settings?.TogetherAiModelPref || ""
  );
  useEffect(() => {
    const selectedModel = models.find(
      (model) => model.string === settings?.TogetherAiModelPref
    );
    if (selectedModel) {
      setTokenLimit(selectedModel.maxLength);
      setSelectedModelString(selectedModel.string);
    }
  }, [settings]);

  const handleModelChange = (event) => {
    setSelectedModelString(event.target.value);
    const selectedModel = models.find(
      (model) => model.string === event.target.value
    );
    setTokenLimit(selectedModel.maxLength);
  };

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Together AI API Key
        </label>
        <input
          type="password"
          name="TogetherAiApiKey"
          className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="Together AI API Key"
          defaultValue={settings?.TogetherAiApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Chat Model Name
        </label>
        <select
          name="TogetherAiModelPref"
          className="bg-zinc-900 text-white text-sm rounded-lg focus:border-white block w-full p-2.5"
          onChange={handleModelChange}
          value={selectedModelString}
          required={true}
        >
          {models.map((model, index) => (
            <option key={index} value={model.string}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="TogetherAiTokenLimit" value={tokenLimit} />
    </div>
  );
}
