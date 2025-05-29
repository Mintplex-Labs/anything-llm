import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import AnythingLLMLogo from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";

import NativeEmbeddingOptions from "@/components/EmbeddingSelection/NativeEmbeddingOptions";
import OpenAiOptions from "@/components/EmbeddingSelection/OpenAiOptions";

import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EMBEDDERS = [
  {
    name: "HempGPT Embedder",
    value: "native",
    logo: AnythingLLMLogo,
    options: (settings) => <NativeEmbeddingOptions settings={settings} />,
    description: "Use the built-in embedding engine for HempGPT.",
  },
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    description: "The standard option for most non-commercial use.",
  },
];

export default function EmbeddingPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmbedders, setFilteredEmbedders] = useState([]);
  const [selectedEmbedder, setSelectedEmbedder] = useState(null);
  const [settings, setSettings] = useState(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const navigate = useNavigate();

  const TITLE = "Embedding Preferences";
  const DESCRIPTION = "Choose how HempGPT will create document embeddings.";

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
    }
    fetchKeys();
  }, []);

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.llmPreference());
  }

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

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    const filtered = EMBEDDERS.filter((embedder) =>
      embedder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmbedders(filtered);
  }, [searchQuery, selectedEmbedder]);

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="card-hemp w-full relative shadow-md">
          <div className="w-full p-4 absolute top-0 rounded-t-xl backdrop-blur-sm">
            <div className="w-full flex items-center sticky top-0">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-4 z-30 text-hemp-earth"
              />
              <input
                type="text"
                placeholder="Search embedding providers"
                className="input-hemp pl-10 h-[38px] rounded-full w-full"
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="px-4 pt-[70px] flex flex-col gap-y-1 max-h-[390px] overflow-y-auto no-scroll pb-4">
            {filteredEmbedders.map((embedder) => (
              <EmbedderItem
                key={embedder.name}
                name={embedder.name}
                value={embedder.value}
                image={embedder.logo}
                description={embedder.description}
                checked={selectedEmbedder === embedder.value}
                onClick={() => setSelectedEmbedder(embedder.value)}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-y-1">
          {selectedEmbedder &&
            EMBEDDERS.find((e) => e.value === selectedEmbedder)?.options(
              settings
            )}
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
