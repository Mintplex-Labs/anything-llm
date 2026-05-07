import { useEffect, useRef, useState } from "react";
import { Brain } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import Workspace from "@/models/workspace";
import { SAVE_LLM_SELECTOR_EVENT } from "../LLMSelector/action";

export default function ReasoningEffortButton({
  workspace,
  reasoningOption,
  setReasoningOption,
}) {
  const tooltipRef = useRef(null);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [capabilities, setCapabilities] = useState(
    workspace?.llmSettings?.capabilities ?? null
  );

  // Sync to the workspace prop when the workspace itself changes.
  useEffect(() => {
    setCapabilities(workspace?.llmSettings?.capabilities ?? null);
  }, [workspace?.slug, workspace?.llmSettings]);

  // Re-fetch capabilities whenever the workspace's chat model is changed
  // via the model picker so the brain button reflects the new model.
  useEffect(() => {
    if (!workspace?.slug) return;
    async function refreshCapabilities() {
      const fresh = await Workspace.bySlug(workspace.slug);
      setCapabilities(fresh?.llmSettings?.capabilities ?? null);
    }
    window.addEventListener(SAVE_LLM_SELECTOR_EVENT, refreshCapabilities);
    return () =>
      window.removeEventListener(SAVE_LLM_SELECTOR_EVENT, refreshCapabilities);
  }, [workspace?.slug]);

  const supportsReasoning = capabilities?.reasoning === true;
  const options = capabilities?.reasoningOptions ?? [];

  // Clear the current selection if the new model doesn't support it
  // or no longer offers that option.
  useEffect(() => {
    if (!reasoningOption) return;
    const stillValid = supportsReasoning && options.includes(reasoningOption);
    if (!stillValid) setReasoningOption(null);
  }, [supportsReasoning, options, reasoningOption]);

  if (!supportsReasoning || options.length === 0) return null;

  const toggleTooltip = () => {
    if (!tooltipRef.current) return;
    tooltipRef.current.isOpen
      ? tooltipRef.current.close()
      : tooltipRef.current.open();
  };

  const isActive = !!reasoningOption;

  return (
    <>
      <button
        type="button"
        id="reasoning-effort-btn"
        data-tooltip-id="tooltip-reasoning-effort-btn"
        aria-label={t("chat_window.reasoning_effort", "Reasoning effort")}
        onClick={toggleTooltip}
        className={`group border-none cursor-pointer flex items-center justify-center gap-x-1 h-6 px-2 rounded-full ${
          isActive
            ? "bg-zinc-700 light:bg-slate-200"
            : "hover:bg-zinc-700 light:hover:bg-slate-200"
        }`}
      >
        <Brain
          size={18}
          weight={isActive ? "fill" : "regular"}
          className={`pointer-events-none shrink-0 ${
            isActive
              ? "text-white light:text-slate-800"
              : "text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-800"
          }`}
        />
        {isActive && (
          <span className="text-xs font-medium text-white light:text-slate-800 capitalize">
            {reasoningOption}
          </span>
        )}
      </button>
      <Tooltip
        ref={tooltipRef}
        id="tooltip-reasoning-effort-btn"
        place="top"
        opacity={1}
        clickable={true}
        delayShow={300}
        delayHide={800}
        arrowColor={
          theme === "light"
            ? "var(--theme-modal-border)"
            : "var(--theme-bg-primary)"
        }
        className="z-99 !w-[160px] !bg-theme-bg-primary !px-[5px] !rounded-lg !pointer-events-auto light:border-2 light:border-theme-modal-border"
      >
        <ReasoningEffortMenu
          tooltipRef={tooltipRef}
          options={options}
          reasoningOption={reasoningOption}
          setReasoningOption={setReasoningOption}
        />
      </Tooltip>
    </>
  );
}

function ReasoningEffortMenu({
  tooltipRef,
  options,
  reasoningOption,
  setReasoningOption,
}) {
  const handleSelect = (option) => {
    setReasoningOption(reasoningOption === option ? null : option);
    tooltipRef.current?.close();
  };

  return (
    <div className="flex flex-col justify-start items-stretch gap-1 p-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleSelect(option);
          }}
          className={`border-none w-full hover:cursor-pointer px-2 py-2 rounded-md flex items-center group ${
            reasoningOption === option
              ? "bg-theme-action-menu-item-hover"
              : "hover:bg-theme-action-menu-item-hover"
          }`}
        >
          <div className="text-theme-text-primary text-sm capitalize">
            {option}
          </div>
        </button>
      ))}
    </div>
  );
}
