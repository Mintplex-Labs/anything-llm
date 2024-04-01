import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import NativeEmbeddingOptions from "@/components/EmbeddingSelection/NativeEmbeddingOptions";
import OpenAiOptions from "@/components/EmbeddingSelection/OpenAiOptions";
import AzureAiOptions from "@/components/EmbeddingSelection/AzureAiOptions";
import LocalAiOptions from "@/components/EmbeddingSelection/LocalAiOptions";
import OllamaEmbeddingOptions from "@/components/EmbeddingSelection/OllamaOptions";
import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const TITLE = "Embedding Preference";
const DESCRIPTION =
  "AnythingLLM can work with many embedding models. This will be the model which turns documents into vectors.";

export default function EmbeddingPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmbedders, setFilteredEmbedders] = useState([]);
  const [selectedEmbedder, setSelectedEmbedder] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(true);
  const searchInputRef = useRef(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    data.EmbeddingEngine = selectedEmbedder;
    for (var [key, value] of formData.entries()) data[key] = value;

    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save embedding settings: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.vectorDatabase());
  };

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.llmPreference());
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const updateEmbedderChoice = (selection) => {
    setSearchQuery("");
    setSelectedEmbedder(selection);
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
      setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
      console.log(_settings?.EmbeddingEngine);
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = EMBEDDERS.filter((embedder) =>
      embedder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmbedders(filtered);
  }, [searchQuery, selectedEmbedder]);

  const EMBEDDERS = [
    {
      name: "AnythingLLM Embedder",
      value: "native",
      logo: AnythingLLMIcon,
      options: <NativeEmbeddingOptions settings={settings} />,
      description:
        "Use the built-in embedding engine for AnythingLLM. Zero setup!",
    },
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
      name: "Local AI",
      value: "localai",
      logo: LocalAiLogo,
      options: <LocalAiOptions settings={settings} />,
      description: "Run embedding models locally on your own machine.",
    },
    {
      name: "Ollama",
      value: "ollama",
      logo: OllamaLogo,
      options: <OllamaEmbeddingOptions settings={settings} />,
      description: "Run embedding models locally on your own machine.",
    },
  ];

  const selectedEmbedderObject = EMBEDDERS.find(
    (embedder) => embedder.value === selectedEmbedder
  );

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
                  name="embedder-search"
                  placeholder="Search all embedding providers"
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
                {filteredEmbedders.map((embedder) => (
                  <EmbedderItem
                    key={embedder.name}
                    name={embedder.name}
                    value={embedder.value}
                    image={embedder.logo}
                    description={embedder.description}
                    checked={selectedEmbedder === embedder.value}
                    onClick={() => updateEmbedderChoice(embedder.value)}
                  />
                ))}
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
                src={selectedEmbedderObject.logo}
                alt={`${selectedEmbedderObject.name} logo`}
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col text-left">
                <div className="text-sm font-semibold text-white">
                  {selectedEmbedderObject.name}
                </div>
                <div className="mt-1 text-xs text-[#D2D5DB]">
                  {selectedEmbedderObject.description}
                </div>
              </div>
            </div>
            <CaretUpDown size={24} weight="bold" className="text-white" />
          </button>
        )}
        <div className="mt-4 flex flex-col gap-y-1 justify-start w-full">
          {selectedEmbedderObject && selectedEmbedderObject.options}
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
