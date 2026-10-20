import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  StopCircle,
  CheckCircle,
  WarningCircle,
  XCircle,
  HandWaving,
  HandPointing,
  ArrowRight,
  PaperPlaneRight,
  CircleNotch,
  ChartBar,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import BrowserUse from "@/models/browserUse";
import { useModal } from "@/hooks/useModal";
import { useMetricsVisibility } from "../HistoricalMessage/Actions/RenderMetrics";
import TraceModal, { Favicon, formatTokens } from "./TraceModal";

const LIVE_STATUSES = ["running", "needs-help"];
// A stop or reply the server never acknowledges must not leave the controls disabled forever.
const ACK_TIMEOUT_MS = 30_000;
// Mouse moves sent to the browser while the person has control - enough for a drag to follow.
const MOVE_INTERVAL_MS = 50;

/**
 * Chat card for a browser-use session. While the session runs it streams the
 * browser, the current step, token usage and lets the user stop it or answer a
 * help request. Once it concludes it collapses into a summary that opens the trace.
 * @param {{content: Object, websocket?: WebSocket|null}} props
 */
function BrowserUseSession({ content = {}, websocket = null }) {
  const active = LIVE_STATUSES.includes(content.status);
  if (active && websocket?.readyState === WebSocket.OPEN)
    return <LiveSession session={content} websocket={websocket} />;
  // Still running when its agent session went away (socket closed, app reloaded
  // mid-session) - it never reached a conclusion.
  return <ConcludedSession session={content} interrupted={active} />;
}

function LiveSession({ session, websocket }) {
  const frame = useLiveFrame(session.sessionId, websocket);
  // The status the session had when Stop was pressed - stopping lasts until the
  // status changes, or until the timeout below gives the button back.
  const [stopRequestedAt, setStopRequestedAt] = useState(null);
  const stopping =
    stopRequestedAt !== null && stopRequestedAt === session.status;

  useEffect(() => {
    if (stopRequestedAt === null) return;
    const timer = setTimeout(() => setStopRequestedAt(null), ACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [stopRequestedAt]);

  const stop = () => {
    if (BrowserUse.control(websocket, session.sessionId, "stop"))
      setStopRequestedAt(session.status);
  };

  return (
    <LiveCard
      session={session}
      frameSrc={frame ? `data:image/jpeg;base64,${frame}` : null}
      stopping={stopping}
      onStop={stop}
      onInput={(input) =>
        BrowserUse.control(websocket, session.sessionId, "input", { input })
      }
      onReply={(text) =>
        BrowserUse.control(websocket, session.sessionId, "reply", { text })
      }
    />
  );
}

/**
 * What a running session looks like, apart from the socket that feeds it.
 * @param {{session: Object, frameSrc: string|null, stopping: boolean, onStop: () => void,
 *   onInput: (input: Object) => void, onReply: (text: string) => boolean}} props
 */
function LiveCard({ session, frameSrc, stopping, onStop, onInput, onReply }) {
  const needsHelp = session.status === "needs-help";
  // The person can only drive the browser while the agent asks for help - taking
  // over mid-step would leave the agent not knowing what page it is on.
  const [controlling, setControlling] = useState(false);
  useEffect(() => {
    if (!needsHelp) setControlling(false);
  }, [needsHelp]);
  const inControl = needsHelp && controlling;

  return (
    <CardShell>
      <div className="flex items-center justify-between gap-x-3 px-3 py-2">
        {needsHelp ? <NeedsHelpTitle /> : <SiteTitle step={session.step} />}
        <StopButton stopping={stopping} onStop={onStop} />
      </div>
      <LiveView frameSrc={frameSrc} controlling={inControl} onInput={onInput} />

      {needsHelp ? (
        <HelpRequest
          session={session}
          controlling={inControl}
          onToggleControl={() => setControlling((on) => !on)}
          onReply={onReply}
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

/** Styled after the chat's own stop button: a rounded square in a circle. */
function StopButton({ stopping, onStop }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onStop}
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

/**
 * The live picture of the browser. While the person has control, their mouse, scrolls and keys
 * go to the browser: positions as fractions of the view (the card's size never matters), typed
 * characters as text and everything else as key presses. The mouse goes as press, moves and
 * release, so they can press and hold or drag, not only click.
 */
function LiveView({ frameSrc, controlling, onInput }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const pressed = useRef(false);
  const lastMoveAt = useRef(0);
  useEffect(() => {
    if (controlling) ref.current?.focus();
    // Handing control back mid-press must not leave the browser's button held down.
    else if (pressed.current) {
      pressed.current = false;
      onInput({ type: "up" });
    }
  }, [controlling]);

  const at = (e) => {
    const box = ref.current.getBoundingClientRect();
    return {
      x: (e.clientX - box.left) / box.width,
      y: (e.clientY - box.top) / box.height,
    };
  };
  const release = (e) => {
    if (!pressed.current) return;
    pressed.current = false;
    onInput({ type: "up", ...at(e) });
  };
  const handlers = controlling
    ? {
        onPointerDown: (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          ref.current.focus();
          // Keeps the release coming here even if the pointer leaves the view while held.
          e.currentTarget.setPointerCapture(e.pointerId);
          pressed.current = true;
          onInput({ type: "down", ...at(e) });
        },
        onPointerMove: (e) => {
          const now = Date.now();
          if (now - lastMoveAt.current < MOVE_INTERVAL_MS) return;
          lastMoveAt.current = now;
          onInput({ type: "move", ...at(e) });
        },
        onPointerUp: release,
        onPointerCancel: release,
        onWheel: (e) => onInput({ type: "scroll", ...at(e), deltaY: e.deltaY }),
        onKeyDown: (e) => {
          e.preventDefault();
          const shortcut = e.ctrlKey || e.metaKey || e.altKey;
          if (e.key.length === 1 && !shortcut)
            return onInput({ type: "text", text: e.key });
          onInput({ type: "key", key: keyCombo(e) });
        },
        onPaste: (e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text");
          if (text) onInput({ type: "text", text });
        },
      }
    : {};

  return (
    <div
      ref={ref}
      tabIndex={controlling ? 0 : -1}
      {...handlers}
      className={`relative w-full aspect-[16/10] bg-zinc-950 light:bg-slate-200 outline-none ${controlling ? "cursor-pointer touch-none select-none ring-2 ring-inset ring-amber-400" : ""}`}
    >
      {frameSrc ? (
        <img
          src={frameSrc}
          alt=""
          draggable={false}
          className="w-full h-full object-contain select-none"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Globe size={40} className="text-zinc-600 animate-pulse" />
        </div>
      )}
      {controlling && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/75 text-white text-xs whitespace-nowrap">
          {t("browserUse.card.controlHint")}
        </div>
      )}
    </div>
  );
}

function TakeControlButton({ controlling, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-x-1.5 px-3 h-[30px] rounded-lg text-xs font-medium flex-shrink-0 border border-solid ${controlling ? "bg-amber-400 border-amber-400 text-zinc-900 hover:opacity-80" : "bg-transparent border-amber-500/60 text-amber-200 light:text-amber-700 hover:bg-amber-500/15"}`}
    >
      <HandPointing size={14} weight="bold" />
      {controlling
        ? t("browserUse.card.releaseControl")
        : t("browserUse.card.takeOver")}
    </button>
  );
}

/** "Control+Shift+K" style name for a key event, as the browser's press_key understands it. */
function keyCombo(e) {
  const key = e.key === " " ? "Space" : e.key;
  if (["Control", "Shift", "Alt", "Meta"].includes(key)) return key;
  return [
    e.ctrlKey && "Control",
    e.altKey && "Alt",
    e.shiftKey && key.length > 1 && "Shift",
    e.metaKey && "Meta",
    key,
  ]
    .filter(Boolean)
    .join("+");
}

function HelpRequest({
  session,
  controlling,
  onToggleControl,
  onReply,
  onSent,
}) {
  const { t } = useTranslation();
  const [reply, setReply] = useState("");
  // The snapshot the reply was sent against - every session update is a new
  // snapshot, so the "sent" state clears as soon as the agent reacts.
  const [sentFor, setSentFor] = useState(null);
  const sent = sentFor === session;

  // A reply the agent was no longer waiting for gets no update - hand the box back.
  useEffect(() => {
    if (sentFor === null) return;
    const timer = setTimeout(() => setSentFor(null), ACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [sentFor]);

  const send = (e) => {
    e?.preventDefault();
    if (sent) return;
    if (!onReply(reply)) return;
    setReply("");
    setSentFor(session);
    onSent?.();
  };

  return (
    <form
      onSubmit={send}
      className="flex flex-col gap-y-2.5 px-3 py-3 bg-amber-500/10 border-t border-amber-500/30"
    >
      <div className="flex items-start justify-between gap-x-3">
        <p className="min-w-0 text-sm text-white light:text-slate-900 whitespace-pre-wrap">
          {session.question}
        </p>
        <TakeControlButton
          controlling={controlling}
          onToggle={onToggleControl}
        />
      </div>
      <div className="flex items-center gap-x-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          disabled={sent}
          placeholder={
            sent
              ? t("browserUse.card.replySent")
              : t("browserUse.card.replyPlaceholder")
          }
          className="flex-1 min-w-0 h-[32px] px-3 text-sm rounded-lg outline-none border border-zinc-700 bg-zinc-800 text-white light:bg-white light:border-slate-300 light:text-slate-900 focus:border-sky-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sent}
          className="border-none flex items-center gap-x-1 px-3 h-[32px] rounded-lg text-xs font-medium bg-white light:bg-slate-900 text-zinc-900 light:text-white hover:opacity-80 disabled:opacity-50 flex-shrink-0"
        >
          {sent ? (
            <CircleNotch size={14} weight="bold" className="animate-spin" />
          ) : (
            <PaperPlaneRight size={14} weight="bold" />
          )}
          {t("browserUse.card.continue")}
        </button>
      </div>
      <p className="text-[11px] text-zinc-400 light:text-slate-500">
        {t("browserUse.card.signInHint")}
      </p>
    </form>
  );
}

function ConcludedSession({ session, interrupted = false }) {
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
                    {sites.slice(0, 6).map((site) => (
                      <Favicon
                        key={site.host}
                        src={site.favicon}
                        host={site.host}
                        size={14}
                      />
                    ))}
                    {sites.length > 6 && (
                      <span className="text-[10px] text-zinc-400">
                        {t("browserUse.card.moreSites", {
                          count: sites.length - 6,
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

function CardShell({ children }) {
  return (
    <div className="flex justify-center w-full my-2">
      <div className="w-full max-w-[750px] mr-4 overflow-hidden rounded-xl bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50">
        {children}
      </div>
    </div>
  );
}

/** "12 steps · 81k tokens", plus " · Continued from a previous session" for a resumed one. */
function UsageLabel({ session }) {
  const { t } = useTranslation();
  const tokens = session.tokens || {};
  return (
    <span className="flex items-center gap-x-1 text-xs text-zinc-400 light:text-slate-500 whitespace-nowrap">
      {t("browserUse.card.usage", {
        steps: session.stepCount || 0,
        tokens: `${tokens.estimated ? "~" : ""}${formatTokens(tokens.total || 0)}`,
      })}
      {session.resumedFrom?.id && (
        <>
          <span>·</span>
          <ClockCounterClockwise size={12} className="flex-shrink-0" />
          <span>{t("browserUse.resume.continuedFromPrevious")}</span>
        </>
      )}
    </span>
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

/**
 * The latest frame (base64 jpeg) of a running session's live view. The server only streams
 * frames while a card watches, so the card says so over the agent socket while it is mounted;
 * the server starts it off with the current picture.
 */
function useLiveFrame(sessionId, websocket) {
  // Tagged with its session so a frame never outlives a change of sessionId.
  const [latest, setLatest] = useState({ sessionId: null, frame: null });
  useEffect(() => {
    if (!websocket) return;
    const onMessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (
        data?.type === "browserUseFrame" &&
        data.content?.sessionId === sessionId
      )
        setLatest({ sessionId, frame: data.content.frame });
    };
    websocket.addEventListener("message", onMessage);
    BrowserUse.control(websocket, sessionId, "watch", { watching: true });
    return () => {
      websocket.removeEventListener("message", onMessage);
      BrowserUse.control(websocket, sessionId, "watch", { watching: false });
    };
  }, [sessionId, websocket]);
  return latest.sessionId === sessionId ? latest.frame : null;
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export default memo(BrowserUseSession);
