import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Trash,
  CheckCircle,
  WarningCircle,
  StopCircle,
  XCircle,
  ClockCounterClockwise,
  UserCircle,
  Detective,
  EyeSlash,
} from "@phosphor-icons/react";
import BrowserUse from "@/models/browserUse";
import showToast from "@/utils/toast";
import TraceModal from "@/components/WorkspaceChat/ChatContainer/ChatHistory/BrowserUseSession/TraceModal";
import Favicon from "@/components/WorkspaceChat/ChatContainer/ChatHistory/BrowserUseSession/Favicon";
import { formatTokens } from "@/components/WorkspaceChat/ChatContainer/ChatHistory/BrowserUseSession/utils";
import Section, { EmptyState } from "./Section";

const STATUS_ICONS = {
  done: [CheckCircle, "text-green-400"],
  incomplete: [WarningCircle, "text-amber-400"],
  stopped: [StopCircle, "text-zinc-400"],
  failed: [XCircle, "text-red-400"],
};

/** Every browser session the agent ran, newest first. Each opens its trace; each can be deleted. */
export default function SessionHistory() {
  const { t } = useTranslation();
  const [traces, setTraces] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [openId, setOpenId] = useState(null);

  const load = useCallback(
    () =>
      BrowserUse.traces().then((result) => {
        setTraces(result.traces);
        setHidden(result.hidden);
      }),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  const remove = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm(t("browserUse.history.deleteConfirm"))) return;
    if (!(await BrowserUse.deleteTrace(id)))
      showToast(t("browserUse.history.deleteFailed"), "error", {
        clear: true,
      });
    load();
  };

  const clearAll = async () => {
    if (!window.confirm(t("browserUse.history.clearConfirm"))) return;
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
      {traces?.length === 0 &&
        (hidden ? (
          <EmptyState Icon={EyeSlash} text={t("browserUse.history.hidden")} />
        ) : (
          <EmptyState Icon={Globe} text={t("browserUse.history.empty")} />
        ))}
      <div className="flex flex-col max-h-[360px] overflow-y-auto">
        {(traces || []).map((trace) => (
          <SessionRow
            key={trace.id}
            trace={trace}
            onOpen={() => setOpenId(trace.id)}
            onDelete={(e) => remove(e, trace.id)}
          />
        ))}
      </div>
      {openId && (
        <TraceModal traceId={openId} onClose={() => setOpenId(null)} />
      )}
    </Section>
  );
}

/** One session: status, task, who ran it, when, the sites and what it cost. */
function SessionRow({ trace, onOpen, onDelete }) {
  const { t } = useTranslation();
  const [Icon, color] = STATUS_ICONS[trace.status] || [Globe, "text-sky-400"];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) =>
        e.key === "Enter" && e.target === e.currentTarget && onOpen()
      }
      className="group flex items-center gap-x-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-theme-bg-primary light:hover:bg-theme-settings-input-bg"
    >
      <Icon size={18} weight="fill" className={`${color} flex-shrink-0`} />
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-sm text-theme-text-primary truncate">{trace.task}</p>
        <div className="flex items-center gap-x-2 text-[11px] text-theme-text-secondary">
          {trace.userId !== null && trace.userId !== undefined && (
            <span className="flex items-center gap-x-1 flex-shrink-0">
              <UserCircle size={12} />
              {trace.username ||
                t("browserUse.profiles.deletedUser", { id: trace.userId })}
            </span>
          )}
          {trace.resume?.profile?.ephemeral && (
            <span
              className="flex items-center flex-shrink-0"
              title={t("browserUse.history.incognito")}
              aria-label={t("browserUse.history.incognito")}
            >
              <Detective size={12} />
            </span>
          )}
          <span>{new Date(trace.startedAt).toLocaleString()}</span>
          {trace.resumedFrom && (
            <span
              className="flex items-center flex-shrink-0"
              title={t("browserUse.resume.continuedFromPrevious")}
              aria-label={t("browserUse.resume.continuedFromPrevious")}
            >
              <ClockCounterClockwise size={12} />
            </span>
          )}
          <span className="flex items-center gap-x-1">
            {(trace.sites || []).slice(0, 5).map((site) => (
              <Favicon
                key={site.host}
                src={site.favicon}
                host={site.host}
                size={12}
              />
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
        onClick={onDelete}
        aria-label={t("browserUse.history.delete")}
        title={t("browserUse.history.delete")}
        className="border-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-theme-text-secondary hover:text-red-400 flex-shrink-0"
      >
        <Trash size={14} />
      </button>
    </div>
  );
}
