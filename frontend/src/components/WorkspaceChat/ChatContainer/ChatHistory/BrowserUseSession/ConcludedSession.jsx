import { useTranslation } from "react-i18next";
import {
  Globe,
  StopCircle,
  CheckCircle,
  WarningCircle,
  XCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import CardShell from "./CardShell";
import UsageLabel from "./UsageLabel";
import Favicon from "./Favicon";
import TraceModal from "./TraceModal";

const MAX_SITES = 6;

/**
 * A finished session (or one whose agent went away): how it ended, the task and the sites it
 * visited. Clicking it opens the full trace.
 * @param {{session: Object, interrupted?: boolean}} props
 */
export default function ConcludedSession({ session, interrupted = false }) {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const {
    icon: Icon,
    color,
    title,
  } = conclusionOf(interrupted ? "interrupted" : session.status, t);
  const sites = session.sites || [];

  return (
    <>
      <CardShell>
        <button
          type="button"
          onClick={openModal}
          className="border-none w-full flex items-center justify-between gap-x-3 px-2 py-1 hover:bg-zinc-700 light:hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-x-3 min-w-0">
            <div
              className={`rounded-lg flex items-center justify-center flex-shrink-0 h-[48px] w-[48px] ${color}`}
            >
              <Icon size={24} weight="bold" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white light:text-slate-900 text-sm font-medium truncate leading-snug">
                {title}
              </p>
              <p className="text-zinc-400 light:text-slate-500 text-xs leading-snug truncate">
                {session.task}
              </p>
              <div className="flex items-center gap-x-2 mt-0.5">
                {sites.length > 0 && (
                  <div className="flex items-center gap-x-1">
                    {sites.slice(0, MAX_SITES).map((site) => (
                      <Favicon
                        key={site.host}
                        src={site.favicon}
                        host={site.host}
                        size={14}
                      />
                    ))}
                    {sites.length > MAX_SITES && (
                      <span className="text-[10px] text-zinc-400">
                        {t("browserUse.card.moreSites", {
                          count: sites.length - MAX_SITES,
                        })}
                      </span>
                    )}
                  </div>
                )}
                <UsageLabel session={session} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-2 px-4 py-2 rounded-lg border border-zinc-600 light:border-theme-sidebar-border text-white light:text-theme-text-primary text-sm font-medium flex-shrink-0">
            <span>{t("browserUse.card.viewSession")}</span>
            <ArrowRight size={16} weight="bold" />
          </div>
        </button>
      </CardShell>
      {isOpen && (
        <TraceModal traceId={session.sessionId} onClose={closeModal} />
      )}
    </>
  );
}

function conclusionOf(status, t) {
  switch (status) {
    case "done":
      return {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700",
        title: t("browserUse.status.done"),
      };
    case "incomplete":
      return {
        icon: WarningCircle,
        color: "bg-amber-100 text-amber-700",
        title: t("browserUse.status.incomplete"),
      };
    case "stopped":
      return {
        icon: StopCircle,
        color: "bg-zinc-200 text-zinc-700",
        title: t("browserUse.status.stopped"),
      };
    case "failed":
      return {
        icon: XCircle,
        color: "bg-red-100 text-red-700",
        title: t("browserUse.status.failed"),
      };
    case "interrupted":
      return {
        icon: WarningCircle,
        color: "bg-zinc-200 text-zinc-700",
        title: t("browserUse.status.interrupted"),
      };
    default:
      return {
        icon: Globe,
        color: "bg-sky-100 text-sky-700",
        title: t("browserUse.status.ended"),
      };
  }
}
