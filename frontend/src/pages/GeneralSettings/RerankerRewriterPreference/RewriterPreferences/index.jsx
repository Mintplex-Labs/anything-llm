import { DEFAULT_REWRITER_PROMPT } from "@/utils/constants";
import React from "react";
import { useTranslation } from "react-i18next";

function RewriterPreferences({
  settings,
  isRewriterEnabled,
  setIsRewriterEnabled,
}) {
  const { t } = useTranslation();

  const TitleWithToggle = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-base font-bold text-white custom-text-secondary">
          {t("reranker-rewriter.rewriter.title")}
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isRewriterEnabled}
            onChange={() =>
              setIsRewriterEnabled((previousState) => !previousState)
            }
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 custom-text-secondary">
        {t("reranker-rewriter.rewriter.desc")}
      </p>
    </div>
  );
  const PromptInput = () => (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-full max-w-[640px]">
          <label className="text-white text-sm font-semibold block mb-3 custom-text-secondary">
            {t("reranker-rewriter.rewriter.prompt-label")}
          </label>
          <textarea
            name="QueryRewriterPrompt"
            className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
            placeholder="Prism Re-Writer Prompt"
            defaultValue={
              settings?.QueryRewriterPrompt || DEFAULT_REWRITER_PROMPT
            }
            autoComplete="off"
            spellCheck={false}
            rows={6}
          />
        </div>
      </div>
    </div>
  );
  return (
    <div className="w-full space-y-4">
      <TitleWithToggle />
      {isRewriterEnabled && <PromptInput />}
    </div>
  );
}

export default React.memo(
  RewriterPreferences,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
