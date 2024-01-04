import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
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
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const TITLE = "LLM Preference";
const DESCRIPTION =
  "AnythingLLM can work with many LLM providers. This will be the service which handles chatting.";

export default function LLMPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [settings, setSettings] = useState(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const isHosted = window.location.hostname.includes("useanything.com");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider || "openai");
    }
    fetchKeys();
  }, []);

  const LLMS = [
    {
      name: "OpenAI",
      value: "openai",
      logo: OpenAiLogo,
      options: <OpenAiOptions settings={settings} />,
      description: "The standard option for most non-commercial use.",
    },
    {
      name: "Azure OpenAI",
      value: "azure",
      logo: AzureOpenAiLogo,
      options: <AzureAiOptions settings={settings} />,
      description: "The enterprise option of OpenAI hosted on Azure services.",
    },
    {
      name: "Anthropic",
      value: "anthropic",
      logo: AnthropicLogo,
      options: <AnthropicAiOptions settings={settings} />,
      description: "A friendly AI Assistant hosted by Anthropic.",
    },
    {
      name: "Gemini",
      value: "gemini",
      logo: GeminiLogo,
      options: <GeminiLLMOptions settings={settings} />,
      description: "Google's largest and most capable AI model",
    },
    {
      name: "Ollama",
      value: "ollama",
      logo: OllamaLogo,
      options: <OllamaLLMOptions settings={settings} />,
      description: "Run LLMs locally on your own machine.",
    },
    {
      name: "LM Studio",
      value: "lmstudio",
      logo: LMStudioLogo,
      options: <LMStudioOptions settings={settings} />,
      description:
        "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
    },
    {
      name: "Local AI",
      value: "localai",
      logo: LocalAiLogo,
      options: <LocalAiOptions settings={settings} />,
      description: "Run LLMs locally on your own machine.",
    },
    {
      name: "Native",
      value: "native",
      logo: AnythingLLMIcon,
      options: <NativeLLMOptions settings={settings} />,
      description:
        "Use a downloaded custom Llama model for chatting on this AnythingLLM instance.",
    },
  ];

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.home());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    data.LLMProvider = selectedLLM;
    for (var [key, value] of formData.entries()) data[key] = value;

    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save LLM settings: ${error}`, "error");
      return;
    }
    showToast("LLM settings saved successfully.", "success", { clear: true });
    navigate(paths.onboarding.embeddingPreference());
  };

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLLMs(LLMS);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = LLMS.filter((llm) =>
        llm.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredLLMs(filtered);
    }
  }, [searchQuery]);

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="w-full relative border-slate-300/40 shadow border-2 rounded-lg text-white">
          <div className="w-full p-4 absolute top-0 rounded-t-lg bg-accent/50">
            <div className="w-full flex items-center sticky top-0 z-20">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-4 z-30 text-white"
              />
              <input
                type="text"
                placeholder="Search LLM providers"
                className="bg-zinc-600 z-20 pl-10 rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="px-4 pt-[70px] flex flex-col gap-y-1 max-h-[390px] overflow-y-auto no-scroll pb-4">
            {filteredLLMs.map((llm) => {
              if (llm.value === "native" && isHosted) return null;
              return (
                <LLMItem
                  key={llm.name}
                  name={llm.name}
                  value={llm.value}
                  image={llm.logo}
                  description={llm.description}
                  checked={selectedLLM === llm.value}
                  onClick={() => setSelectedLLM(llm.value)}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-y-1">
          {selectedLLM &&
            LLMS.find((llm) => llm.value === selectedLLM)?.options}
        </div>
        <button
          type="submit"
          ref={hiddenSubmitButtonRef}
          hidden
          aria-hidden="true"
        ></button>
      </form>
    </div>
  );
}
