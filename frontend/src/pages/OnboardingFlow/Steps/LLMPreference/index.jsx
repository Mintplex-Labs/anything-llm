import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect } from "react";
const TITLE = "LLM Preference";
const DESCRIPTION =
  "AnythingLLM can work with many LLM providers. This will be the service which handles chatting.";

import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import NativeLLMOptions from "@/components/LLMSelection/NativeLLMOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import LLMItem from "./LLMItem";

const LLMS = [
  {
    name: "OpenAI",
    logo: OpenAiLogo,
    options: <OpenAiOptions />,
    description: "The standard option for most non-commercial use.",
  },
  {
    name: "Azure OpenAI",
    logo: AzureOpenAiLogo,
    options: <AzureAiOptions />,
    description: "The enterprise option of OpenAI hosted on Azure services.",
  },
  {
    name: "Anthropic",
    logo: AnthropicLogo,
    options: <AnthropicAiOptions />,
    description: "A friendly AI Assistant hosted by Anthropic.",
  },
  {
    name: "Gemini",
    logo: GeminiLogo,
    options: <GeminiLLMOptions />,
    description: "Google's largest and most capable AI model",
  },
  {
    name: "Ollama",
    logo: OllamaLogo,
    options: <OllamaLLMOptions />,
    description: "Run LLMs locally on your own machine.",
  },
  {
    name: "LM Studio",
    logo: LMStudioLogo,
    options: <LMStudioOptions />,
    description:
      "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
  },
  {
    name: "Local AI",
    logo: LocalAiLogo,
    options: <LocalAiOptions />,
    description: "Run LLMs locally on your own machine.",
  },
  {
    name: "Native",
    logo: AnythingLLMIcon,
    options: <NativeLLMOptions />,
    description:
      "Use a downloaded custom Llama model for chatting on this AnythingLLM instance.",
  },
];

export default function LLMPreference({ setHeader, setForwardBtn }) {
  function handleForward() {
    console.log("Go forward");
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  return (
    <div className="w-full border-slate-300/40 shadow border-2 rounded-lg p-4 text-white">
      <div className="relative flex items-center">
        <MagnifyingGlass
          size={16}
          weight="bold"
          className="absolute left-4 z-10 text-white"
        />
        <input
          type="text"
          placeholder="Chroma"
          className="bg-white/10 pl-10 rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
        />
      </div>
      <div className="mt-4 flex flex-col">
        {LLMS.map((llm) => (
          <LLMItem
            key={llm.name}
            name={llm.name}
            image={llm.logo}
            description={llm.description}
          />
        ))}
      </div>
    </div>
  );
}
