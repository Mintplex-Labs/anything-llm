import { useEffect, useState } from "react";
import { Brain } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import useUser from "@/hooks/useUser";
import Workspace from "@/models/workspace";
import System from "@/models/system";
import { SAVE_LLM_SELECTOR_EVENT } from "../LLMSelector/action";

/**
 * Quick picker for the workspace reasoning effort. Only renders when the
 * workspace's current model supports reasoning controls.
 * @param {object} props
 * @param {string} props.workspaceSlug - Workspace slug
 * @param {boolean} [props.centered] - When true the menu opens below the button (home page layout)
 */
export default function ReasoningEffortButton({
  workspaceSlug,
  centered = false,
}) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [effort, setEffort] = useState(null);
  const [globalEffort, setGlobalEffort] = useState(null);

  useEffect(() => {
    if (!workspaceSlug) return;
    async function load() {
      const [capabilities, workspace, settings] = await Promise.all([
        Workspace.llmCapabilities(workspaceSlug),
        Workspace.bySlug(workspaceSlug),
        System.keys(),
      ]);
      setOptions(
        capabilities?.reasoning === true ? capabilities.reasoningOptions : []
      );
      setEffort(workspace?.reasoningEffort ?? null);
      setGlobalEffort(settings?.ReasoningEffort ?? null);
    }
    load();
    window.addEventListener(SAVE_LLM_SELECTOR_EVENT, load);
    return () => window.removeEventListener(SAVE_LLM_SELECTOR_EVENT, load);
  }, [workspaceSlug]);

  async function select(value) {
    setOpen(false);
    if (value === effort) return;
    setEffort(value);
    await Workspace.update(workspaceSlug, { reasoningEffort: value });
    window.dispatchEvent(new Event(SAVE_LLM_SELECTOR_EVENT));
  }

  if (!!user && !["admin", "manager"].includes(user.role)) return null;
  if (!options.length) return null;

  // The menu is positioned against the prompt input's outer wrapper (not this
  // button) so the input's overflow-hidden container does not clip it.
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        data-tooltip-id="reasoning-effort"
        data-tooltip-content={t("chat.reasoning_effort.title")}
        aria-label={t("chat.reasoning_effort.title")}
        className={`group border-none cursor-pointer flex items-center gap-x-1 h-6 px-1.5 rounded-full ${
          open
            ? "bg-zinc-700 light:bg-slate-200"
            : "hover:bg-zinc-700 light:hover:bg-slate-200"
        }`}
      >
        <Brain
          size={18}
          className={`pointer-events-none shrink-0 ${
            open
              ? "text-white light:text-slate-800"
              : "text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-800"
          }`}
        />
        {effort && (
          <span className="text-sm font-medium capitalize text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-800">
            {effort}
          </span>
        )}
      </button>
      {!open && (
        <Tooltip
          id="reasoning-effort"
          place="bottom"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      )}
      {open && (
        <div
          className={`absolute left-5 z-50 w-[180px] p-1 flex flex-col bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-xl shadow-lg ${
            centered ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          <EffortOption
            label={
              globalEffort
                ? t("chat.reasoning_effort.global_default", {
                    value: globalEffort,
                  })
                : t("chat.reasoning_effort.default")
            }
            selected={!effort}
            onClick={() => select(null)}
          />
          {options.map((option) => (
            <EffortOption
              key={option}
              label={option}
              selected={effort === option}
              onClick={() => select(option)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function EffortOption({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-none w-full text-left px-2 py-1.5 rounded-lg text-xs capitalize cursor-pointer ${
        selected
          ? "bg-zinc-700 light:bg-slate-200 text-white light:text-slate-800"
          : "text-zinc-300 light:text-slate-600 hover:bg-zinc-700 light:hover:bg-slate-200 hover:text-white light:hover:text-slate-800"
      }`}
    >
      {label}
    </button>
  );
}
