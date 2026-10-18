import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Trash,
  CheckCircle,
  WarningCircle,
  StopCircle,
  XCircle,
  LinkSimple,
} from "@phosphor-icons/react";
import Toggle from "@/components/lib/Toggle";
import BrowserUse from "@/models/browserUse";
import showToast from "@/utils/toast";
import TraceModal, {
  Favicon,
  formatTokens,
} from "@/components/WorkspaceChat/ChatContainer/ChatHistory/BrowserUseSession/TraceModal";

function confirmAction(message) {
  return window.confirm(message);
}

/**
 * Agent skill panel for Browser Use: the toggle and the history of every
 * session the agent ran. Sessions are anonymous, so there are no profiles to manage.
 */
export default function BrowserUseSkillPanel({
  title,
  description,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
}) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[560px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            <Globe size={24} color="var(--theme-text-primary)" weight="bold" />
            <label className="text-theme-text-primary text-md font-bold">
              {title}
            </label>
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            disabled={disabled}
            onChange={() => toggleSkill(skill)}
          />
        </div>
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
          {description}
        </p>
        <SessionHistory />
      </div>
    </div>
  );
}

function Section({ title, description, children, action = null }) {
  return (
    <div className="flex flex-col gap-y-2 pt-4 border-t border-theme-sidebar-border">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-theme-text-primary">{title}</p>
        {action}
      </div>
      {description && (
        <p className="text-xs text-theme-text-secondary">{description}</p>
      )}
      {children}
    </div>
  );
}

const STATUS_ICONS = {
  done: [CheckCircle, "text-green-400"],
  incomplete: [WarningCircle, "text-amber-400"],
  stopped: [StopCircle, "text-zinc-400"],
  failed: [XCircle, "text-red-400"],
};

function SessionHistory() {
  const { t } = useTranslation();
  const [traces, setTraces] = useState(null);
  const [openId, setOpenId] = useState(null);

  const load = useCallback(() => BrowserUse.traces().then(setTraces), []);
  useEffect(() => {
    load();
  }, [load]);

  const remove = async (e, id) => {
    e.stopPropagation();
    if (!confirmAction(t("browserUse.history.deleteConfirm"))) return;
    if (!(await BrowserUse.deleteTrace(id)))
      showToast(t("browserUse.history.deleteFailed"), "error", {
        clear: true,
      });
    load();
  };

  const clearAll = async () => {
    if (!confirmAction(t("browserUse.history.clearConfirm"))) return;
    if (!(await BrowserUse.clearTraces()))
      showToast(t("browserUse.history.clearFailed"), "error", { clear: true });
    load();
  };

  return (
    <Section
      title={t("browserUse.history.title")}
      description={t("browserUse.history.description")}
      action={
        traces?.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="border-none text-xs text-theme-text-secondary hover:text-red-400"
          >
            {t("browserUse.history.clear")}
          </button>
        )
      }
    >
      {traces?.length === 0 && (
        <p className="text-xs text-theme-text-secondary">
          {t("browserUse.history.empty")}
        </p>
      )}
      <div className="flex flex-col max-h-[360px] overflow-y-auto">
        {(traces || []).map((trace) => {
          const [Icon, color] = STATUS_ICONS[trace.status] || [
            Globe,
            "text-sky-400",
          ];
          return (
            <div
              key={trace.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpenId(trace.id)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                e.target === e.currentTarget &&
                setOpenId(trace.id)
              }
              className="group flex items-center gap-x-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-theme-bg-primary"
            >
              <Icon
                size={18}
                weight="fill"
                className={`${color} flex-shrink-0`}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-sm text-theme-text-primary truncate">
                  {trace.task}
                </p>
                <div className="flex items-center gap-x-2 text-[11px] text-theme-text-secondary">
                  <span>{new Date(trace.startedAt).toLocaleString()}</span>
                  {trace.resumedFrom && (
                    <span
                      className="flex items-center flex-shrink-0"
                      title={t("browserUse.resume.continuedFrom", {
                        task: trace.resumedFromTask || "",
                      })}
                      aria-label={t("browserUse.resume.continued")}
                    >
                      <LinkSimple size={12} weight="bold" />
                    </span>
                  )}
                  <span className="flex items-center gap-x-1">
                    {(trace.sites || []).slice(0, 5).map((site) => (
                      <Favicon key={site.host} src={site.favicon} size={12} />
                    ))}
                  </span>
                  <span>
                    {t("browserUse.card.usage", {
                      steps: trace.stepCount,
                      tokens: formatTokens(trace.tokens?.total),
                    })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => remove(e, trace.id)}
                aria-label={t("browserUse.history.delete")}
                title={t("browserUse.history.delete")}
                className="border-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-theme-text-secondary hover:text-red-400 flex-shrink-0"
              >
                <Trash size={14} />
              </button>
            </div>
          );
        })}
      </div>
      {openId && (
        <TraceModal traceId={openId} onClose={() => setOpenId(null)} />
      )}
    </Section>
  );
}
