import { useTranslation } from "react-i18next";

export default function LLMSelectorSidePanel({
  availableProviders,
  selectedLLMProvider,
  onSearchChange,
  onProviderClick,
}) {
  const { t } = useTranslation();

  return (
    <div className="w-[40%] h-full flex flex-col gap-y-1 border-r-2 border-theme-modal-border py-2 px-[5px]">
      <input
        id="llm-search-input"
        type="search"
        placeholder={t("chat_window.workspace_llm_manager.search")}
        onChange={onSearchChange}
        className="search-input bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder outline-none text-sm rounded-lg px-2 py-2 w-full h-[32px] border-theme-modal-border border border-solid"
      />
      <div className="flex flex-col gap-y-2 overflow-y-scroll ">
        {availableProviders.map((llm) => (
          <button
            key={llm.value}
            type="button"
            data-llm-value={llm.value}
            className={`border-none hover:cursor-pointer hover:bg-theme-checklist-item-bg-hover flex gap-x-2 items-center p-2 rounded-md ${selectedLLMProvider === llm.value ? "bg-theme-checklist-item-bg" : ""}`}
            onClick={() => onProviderClick(llm.value)}
          >
            <img
              src={llm.logo}
              alt={`${llm.name} logo`}
              className="w-6 h-6 rounded-md"
            />
            <div className="flex flex-col">
              <div className="text-xs text-theme-text-primary">{llm.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
