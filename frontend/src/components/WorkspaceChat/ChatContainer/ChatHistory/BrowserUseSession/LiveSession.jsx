import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HandWaving, ArrowRight, ChartBar } from "@phosphor-icons/react";
import BrowserUse from "@/models/browserUse";
import { useMetricsVisibility } from "../HistoricalMessage/Actions/RenderMetrics";
import CardShell from "./CardShell";
import UsageLabel from "./UsageLabel";
import Favicon from "./Favicon";
import LiveView, { useLiveFrame } from "./LiveView";
import HelpRequest from "./HelpRequest";
import { ACK_TIMEOUT_MS, hostOf } from "./utils";

/**
 * A running session, fed by the chat's agent socket: the live view, the current step and the stop
 * button - or, while the agent asks for help, the help request.
 * @param {{session: Object, websocket: WebSocket}} props
 */
export default function LiveSession({ session, websocket }) {
  const frame = useLiveFrame(session.sessionId, websocket);
  const needsHelp = session.status === "needs-help";
  // The person can only drive the browser while the agent asks for help - taking
  // over mid-step would leave the agent not knowing what page it is on.
  const [controlling, setControlling] = useState(false);
  useEffect(() => {
    if (!needsHelp) setControlling(false);
  }, [needsHelp]);
  const inControl = needsHelp && controlling;
  const send = (action, data) =>
    BrowserUse.control(websocket, session.sessionId, action, data);

  return (
    <CardShell>
      <div className="flex items-center justify-between gap-x-3 px-3 py-2">
        {needsHelp ? <NeedsHelpTitle /> : <SiteTitle step={session.step} />}
        <StopButton session={session} onStop={() => send("stop")} />
      </div>
      <LiveView
        frameSrc={frame ? `data:image/jpeg;base64,${frame}` : null}
        controlling={inControl}
        onInput={(input) => send("input", { input })}
      />
      {needsHelp ? (
        <HelpRequest
          session={session}
          controlling={inControl}
          onToggleControl={() => setControlling((on) => !on)}
          onReply={(text) => send("reply", { text })}
          onSent={() => setControlling(false)}
        />
      ) : (
        <CurrentStep session={session} />
      )}
    </CardShell>
  );
}

/** The site the agent is on - follows it from host to host. */
function SiteTitle({ step }) {
  const { t } = useTranslation();
  const host = hostOf(step?.url);
  return (
    <div className="flex items-center gap-x-2 min-w-0">
      <Favicon src={host ? step.favicon : null} host={host} size={16} />
      <p className="text-sm font-medium text-white light:text-slate-900 truncate">
        {host || t("browserUse.card.browsing")}
      </p>
    </div>
  );
}

function NeedsHelpTitle() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-x-2 min-w-0">
      <HandWaving
        size={18}
        weight="fill"
        className="text-amber-400 light:text-amber-600 flex-shrink-0"
      />
      <p className="text-sm font-medium text-white light:text-slate-900 truncate">
        {t("browserUse.card.needsHelp")}
      </p>
    </div>
  );
}

/**
 * Styled after the chat's own stop button: a rounded square in a circle. Once pressed it stays
 * "Stopping" until the session's status changes, or until the server never answers.
 * @param {{session: Object, onStop: () => boolean}} props - onStop: whether the stop was sent
 */
function StopButton({ session, onStop }) {
  const { t } = useTranslation();
  // The status the session had when Stop was pressed.
  const [stoppedAt, setStoppedAt] = useState(null);
  const stopping = stoppedAt !== null && stoppedAt === session.status;

  useEffect(() => {
    if (stoppedAt === null) return;
    const timer = setTimeout(() => setStoppedAt(null), ACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [stoppedAt]);

  return (
    <button
      type="button"
      onClick={() => onStop() && setStoppedAt(session.status)}
      disabled={stopping}
      className="group/stop border-none flex items-center gap-x-1.5 pl-1 pr-2.5 h-[26px] rounded-full text-xs font-medium bg-zinc-700 light:bg-slate-200 text-white light:text-slate-900 enabled:hover:bg-red-500 enabled:hover:text-white light:enabled:hover:bg-red-500 light:enabled:hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
    >
      <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white light:bg-slate-800 group-enabled/stop:group-hover/stop:bg-white">
        <span className="w-2 h-2 rounded-[2px] bg-zinc-800 light:bg-white group-enabled/stop:group-hover/stop:bg-red-500" />
      </span>
      {stopping ? t("browserUse.card.stopping") : t("browserUse.card.stop")}
    </button>
  );
}

function CurrentStep({ session }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-x-2 px-3 py-2 min-w-0">
      <ArrowRight
        size={14}
        className="text-zinc-400 light:text-slate-500 flex-shrink-0"
      />
      <p className="flex-1 text-sm text-zinc-300 light:text-slate-700 truncate">
        {session.step?.label || t("browserUse.card.starting")}
      </p>
      <SessionMetrics session={session} />
    </div>
  );
}

/**
 * Steps and tokens behind a chart icon - shown on hover, or always once clicked,
 * sharing the "show metrics" preference of chat replies.
 */
function SessionMetrics({ session }) {
  const { t } = useTranslation();
  const { show, toggle } = useMetricsVisibility();
  return (
    <button
      type="button"
      onClick={toggle}
      title={
        show
          ? t("browserUse.card.metricsOnHover")
          : t("browserUse.card.metricsAlways")
      }
      className="group/metrics border-none flex items-center gap-x-1.5 flex-shrink-0 text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900"
    >
      <span
        className={`${show ? "opacity-100" : "opacity-0"} group-hover/metrics:opacity-100 transition-opacity duration-300`}
      >
        <UsageLabel session={session} />
      </span>
      <ChartBar size={14} weight={show ? "fill" : "regular"} />
    </button>
  );
}
