import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import NativeLLMOptions from "@/components/LLMSelection/NativeLLMOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import MistralOptions from "@/components/LLMSelection/MistralOptions";
import HuggingFaceOptions from "@/components/LLMSelection/HuggingFaceOptions";
import TogetherAiOptions from "@/components/LLMSelection/TogetherAiOptions";
import PerplexityOptions from "@/components/LLMSelection/PerplexityOptions";
import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";
import GroqAiOptions from "@/components/LLMSelection/GroqAiOptions";
import LLMItem from "@/components/LLMSelection/LLMItem";
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
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(true);
  const searchInputRef = useRef(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const isHosted = window.location.hostname.includes("useanything.com");
  const navigate = useNavigate();

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
    navigate(paths.onboarding.embeddingPreference());
  };

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.home());
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const updateLLMChoice = (selection) => {
    setSearchQuery("");
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = LLMS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

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
      name: "HuggingFace",
      value: "huggingface",
      logo: HuggingFaceLogo,
      options: <HuggingFaceOptions settings={settings} />,
      description:
        "Access 150,000+ open-source LLMs and the world's AI community",
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
      name: "Together AI",
      value: "togetherai",
      logo: TogetherAILogo,
      options: <TogetherAiOptions settings={settings} />,
      description: "Run open source models from Together AI.",
    },
    {
      name: "Mistral",
      value: "mistral",
      logo: MistralLogo,
      options: <MistralOptions settings={settings} />,
      description: "Run open source models from Mistral AI.",
    },
    {
      name: "Perplexity AI",
      value: "perplexity",
      logo: PerplexityLogo,
      options: <PerplexityOptions settings={settings} />,
      description:
        "Run powerful and internet-connected models hosted by Perplexity AI.",
    },
    {
      name: "OpenRouter",
      value: "openrouter",
      logo: OpenRouterLogo,
      options: <OpenRouterOptions settings={settings} />,
      description: "A unified interface for LLMs.",
    },
    {
      name: "Groq",
      value: "groq",
      logo: GroqLogo,
      options: <GroqAiOptions settings={settings} />,
      description:
        "The fastest LLM inferencing available for real-time AI applications.",
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

  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center"
    >
      <div className="relative">
        {searchMenuOpen ? (
          <div className="w-full max-w-[753px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-[#18181B] rounded-lg flex flex-col justify-between cursor-pointer border-2 border-[#46C8FF] z-20">
            <div className="w-full flex flex-col gap-y-1">
              <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-[#18181B]">
                <MagnifyingGlass
                  size={20}
                  weight="bold"
                  className="absolute left-4 z-30 text-white -ml-4 my-2"
                />
                <input
                  type="text"
                  name="llm-search"
                  placeholder="Search all LLM providers"
                  className="-ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:border-white text-white placeholder:text-white placeholder:font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <X
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-white hover:text-[#9CA3AF]"
                  onClick={handleXButton}
                />
              </div>
              <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
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
                      onClick={() => updateLLMChoice(llm.value)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <button
            className="w-full max-w-[753px] h-[64px] bg-[#18181B] rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-[#46C8FF] transition-all duration-300"
            type="button"
            onClick={() => setSearchMenuOpen(true)}
          >
            <div className="flex gap-x-4 items-center">
              <img
                src={selectedLLMObject.logo}
                alt={`${selectedLLMObject.name} logo`}
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col text-left">
                <div className="text-sm font-semibold text-white">
                  {selectedLLMObject.name}
                </div>
                <div className="mt-1 text-xs text-[#D2D5DB]">
                  {selectedLLMObject.description}
                </div>
              </div>
            </div>
            <CaretUpDown size={24} weight="bold" className="text-white" />
          </button>
        )}
        <div className="mt-4 flex flex-col gap-y-1 justify-start w-full">
          {selectedLLMObject && selectedLLMObject.options}
        </div>
      </div>

      <button
        type="submit"
        ref={hiddenSubmitButtonRef}
        hidden
        aria-hidden="true"
      ></button>
    </form>
  );
}
