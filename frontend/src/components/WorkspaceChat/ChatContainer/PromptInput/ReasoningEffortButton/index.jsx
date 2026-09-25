import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Brain } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import Workspace from "@/models/workspace";
import System from "@/models/system";
import { SAVE_LLM_SELECTOR_EVENT } from "../LLMSelector/action";
import {
  effectiveReasoningEffort,
  getSessionReasoningEffort,
  setSessionReasoningEffort,
} from "@/utils/chat/reasoningEffort";

/**
 * Quick picker for the current chat session's reasoning effort. The choice is
 * kept per thread in this browser, so it never changes other users' chats.
 * Only renders when the workspace's current model supports reasoning controls.
 * @param {object} props
 * @param {string} [props.workspaceSlug] - Workspace slug when the route has no params (home page)
 * @param {string} [props.threadSlug] - Thread slug when the route has no params (home page)
 * @param {boolean} [props.centered] - When true the menu opens below the button (home page layout)
 */
export default function ReasoningEffortButton({
  workspaceSlug = null,
  threadSlug = null,
  centered = false,
}) {
  const { t } = useTranslation();
  const params = useParams();
  const slug = workspaceSlug ?? params.slug ?? null;
  const thread = threadSlug ?? params.threadSlug ?? null;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [sessionEffort, setSessionEffort] = useState(null);
  const [defaults, setDefaults] = useState({
    workspaceEffort: null,
    systemEffort: null,
  });

  useEffect(() => {
    setSessionEffort(getSessionReasoningEffort(slug, thread));
  }, [slug, thread]);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      const [capabilities, workspace, settings] = await Promise.all([
        Workspace.llmCapabilities(slug),
        Workspace.bySlug(slug),
        System.keys(),
      ]);
      setOptions(
        capabilities?.reasoning === true ? capabilities.reasoningOptions : []
      );
      setDefaults({
        workspaceEffort: workspace?.reasoningEffort ?? null,
        systemEffort: settings?.ReasoningEffort ?? null,
      });
    }
    load();
    window.addEventListener(SAVE_LLM_SELECTOR_EVENT, load);
    return () => window.removeEventListener(SAVE_LLM_SELECTOR_EVENT, load);
  }, [slug]);

  function select(value) {
    setOpen(false);
    setSessionEffort(value);
    setSessionReasoningEffort(slug, thread, value);
  }

  if (!options.length) return null;

  // Mirrors how the server picks the effort, so the chip only ever shows a
  // level that will actually be sent to the current model.
  const defaultEffort = effectiveReasoningEffort(defaults, options);
  const effort = effectiveReasoningEffort(
    { ...defaults, sessionEffort },
    options
  );
  const usingDefault = !sessionEffort || !options.includes(sessionEffort);

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
              defaultEffort
                ? t("chat.reasoning_effort.session_default", {
                    value: defaultEffort,
                  })
                : t("chat.reasoning_effort.default")
            }
            selected={usingDefault}
            onClick={() => select(null)}
          />
          {options.map((option) => (
            <EffortOption
              key={option}
              label={option}
              selected={!usingDefault && sessionEffort === option}
              onClick={() => select(option)}
            />
          ))}
          {!options.includes("off") && (
            <p className="px-2 pt-1 pb-0.5 text-[11px] text-zinc-400 light:text-slate-500">
              {t("chat.reasoning_effort.cannot_disable")}
            </p>
          )}
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
