import React from "react";

import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import CohereLogo from "@/media/llmprovider/cohere.png";
import JinaLogo from "@/media/llmprovider/jina.png";

import JinaRerankerOptions from "@/components/RerankerRewriter/RerankerOptions/JinaRerankerOptions";
import CohereRerankerOptions from "@/components/RerankerRewriter/RerankerOptions/CohereRerankerOptions";
import PrismRerankerOptions from "@/components/RerankerRewriter/RerankerOptions/PrismRerankerOptions";

import { useTranslation } from "react-i18next";

import SelectorWithSearchModal from "@/components/RerankerRewriter/SelectorWithSearchModal";

const RE_RANKERS = [
  {
    name: "Prism",
    value: "prism",
    logo: AnythingLLMIcon,
    options: (settings) => <PrismRerankerOptions settings={settings} />,
    description: "Use the Prism Re-Ranker model.",
  },
  {
    name: "Cohere",
    value: "cohere",
    logo: CohereLogo,
    options: (settings) => <CohereRerankerOptions settings={settings} />,
    description: "Run Cohere's powerful Command models.",
    requiredConfig: ["CohereApiKey"],
  },
  {
    name: "Jina",
    value: "jina",
    logo: JinaLogo,
    options: (settings) => <JinaRerankerOptions settings={settings} />,
    description: "Run Jina's powerful Re-Ranker models",
    requiredConfig: ["CohereApiKey"],
  },
];

function RerankerPreferences({
  settings,
  isRerankerEnabled,
  setIsRerankerEnabled,
  selectedReranker,
  setSelectedReranker,
}) {
  const { t } = useTranslation();

  const TitleWithToggle = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-base font-bold text-white custom-text-secondary">
          {t("reranker-rewriter.reranker.title")}
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isRerankerEnabled}
            onChange={() =>
              setIsRerankerEnabled((previousState) => !previousState)
            }
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 custom-text-secondary">
        {t("reranker-rewriter.reranker.desc")}
      </p>
    </div>
  );
  const ReRankerSelector = () => (
    <div className="space-y-4">
      <div className="text-base font-bold text-white custom-text-secondary">
        {t("reranker-rewriter.reranker.provider.title")}
      </div>
      <SelectorWithSearchModal
        allOptions={RE_RANKERS}
        updateChoice={(selection) => {
          setSelectedReranker(selection);
        }}
        selectedOptionValue={selectedReranker}
        searchInputPlaceholder="Search all Re-Ranker providers"
      />
      <div className="space-y-1 custom-llm-provider-modal">
        {selectedReranker &&
          RE_RANKERS.find(
            (reranker) => reranker.value === selectedReranker
          )?.options(settings)}
      </div>
    </div>
  );
  return (
    <div className="w-full space-y-4">
      <TitleWithToggle />
      {isRerankerEnabled && <ReRankerSelector />}
    </div>
  );
}

export default React.memo(
  RerankerPreferences,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
