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
} from "@phosphor-icons/react";
import BrowserUse from "@/models/browserUse";
import { useModal } from "@/hooks/useModal";
import TraceModal, { ContinuedFrom, Favicon, formatTokens } from "./TraceModal";

const LIVE_STATUSES = ["running", "needs-help"];
// A stop or reply the server never acknowledges must not leave the controls disabled forever.
const ACK_TIMEOUT_MS = 30_000;

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
  const { t } = useTranslation();
  const frame = useLiveFrame(session.sessionId, websocket);
  // The person drives the browser from the live view (sign in, solve a check, show the way).
  const [controlling, setControlling] = useState(false);
  // The status the session had when Stop was pressed - stopping lasts until the
  // status changes, or until the timeout below gives the button back.
  const [stopRequestedAt, setStopRequestedAt] = useState(null);
  const stopping =
    stopRequestedAt !== null && stopRequestedAt === session.status;
  const needsHelp = session.status === "needs-help";
  const host = hostOf(session.step?.url);

  useEffect(() => {
    if (stopRequestedAt === null) return;
    const timer = setTimeout(() => setStopRequestedAt(null), ACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [stopRequestedAt]);

  const stop = () => {
    if (BrowserUse.control(websocket, session.sessionId, "stop"))
      setStopRequestedAt(session.status);
  };
  const toggleControl = () => setControlling((on) => !on);

  return (
    <CardShell>
      <div className="flex items-center justify-between gap-x-3 px-3 py-2">
        <div className="flex items-center gap-x-2 min-w-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${needsHelp ? "bg-amber-400" : "bg-sky-400"}`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${needsHelp ? "bg-amber-400" : "bg-sky-400"}`}
            />
          </span>
          <p className="text-sm font-medium text-white light:text-slate-900 truncate">
            {needsHelp
              ? t("browserUse.card.needsHelp")
              : t("browserUse.card.browsing")}
          </p>
        </div>
        <div className="flex items-center gap-x-3 flex-shrink-0">
          <UsageLabel session={session} />
          <TakeControlButton
            controlling={controlling}
            onToggle={toggleControl}
          />
          <button
            type="button"
            onClick={stop}
            disabled={stopping}
            className="border-none flex items-center gap-x-1 px-2 py-1 rounded-lg text-xs font-medium text-red-300 light:text-red-600 hover:bg-red-500/10 disabled:opacity-50"
          >
            <StopCircle size={16} weight="fill" />
            {stopping
              ? t("browserUse.card.stopping")
              : t("browserUse.card.stop")}
          </button>
        </div>
      </div>
      <ResumedFrom resumedFrom={session.resumedFrom} className="px-3 pb-2" />

      <LiveView
        frame={frame}
        controlling={controlling}
        onInput={(input) =>
          BrowserUse.control(websocket, session.sessionId, "input", { input })
        }
      >
        {host && (
          <div className="pointer-events-none absolute top-2 left-2 flex items-center gap-x-1.5 max-w-[70%] px-2 py-1 rounded-md bg-black/70 text-white text-xs">
            <Favicon src={session.step?.favicon} size={14} />
            <span className="truncate">{host}</span>
          </div>
        )}
      </LiveView>

      {needsHelp ? (
        <HelpRequest
          session={session}
          websocket={websocket}
          controlling={controlling}
          onToggleControl={toggleControl}
          onSent={() => setControlling(false)}
        />
      ) : (
        <div className="flex items-center gap-x-2 px-3 py-2 min-w-0">
          <ArrowRight
            size={14}
            className="text-zinc-400 light:text-slate-500 flex-shrink-0"
          />
          <p className="text-sm text-zinc-300 light:text-slate-700 truncate">
            {session.step?.label || t("browserUse.card.starting")}
          </p>
        </div>
      )}
    </CardShell>
  );
}

/**
 * The live picture of the browser. While the person has control, their clicks, scrolls and keys
 * go to the browser: positions as fractions of the view (the card's size never matters), typed
 * characters as text and everything else as key presses.
 */
function LiveView({ frame, controlling, onInput, children }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  useEffect(() => {
    if (controlling) ref.current?.focus();
  }, [controlling]);

  const at = (e) => {
    const box = ref.current.getBoundingClientRect();
    return {
      x: (e.clientX - box.left) / box.width,
      y: (e.clientY - box.top) / box.height,
    };
  };
  const handlers = controlling
    ? {
        onClick: (e) => onInput({ type: "click", ...at(e) }),
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
      className={`relative w-full aspect-[16/10] bg-zinc-950 light:bg-slate-200 outline-none ${controlling ? "cursor-pointer ring-2 ring-inset ring-amber-400" : ""}`}
    >
      {frame ? (
        <img
          src={`data:image/jpeg;base64,${frame}`}
          alt=""
          draggable={false}
          className="w-full h-full object-contain select-none"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Globe size={40} className="text-zinc-600 animate-pulse" />
        </div>
      )}
      {children}
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
      className={`border-none flex items-center gap-x-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80 ${controlling ? "bg-amber-400 text-zinc-900" : "text-zinc-300 light:text-slate-700 hover:bg-zinc-700 light:hover:bg-slate-200"}`}
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
  websocket,
  controlling,
  onToggleControl,
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
    if (
      !BrowserUse.control(websocket, session.sessionId, "reply", {
        text: reply,
      })
    )
      return;
    setReply("");
    setSentFor(session);
    onSent?.();
  };

  return (
    <form
      onSubmit={send}
      className="flex flex-col gap-y-2 px-3 py-3 bg-amber-500/10 border-t border-amber-500/30"
    >
      <div className="flex items-start gap-x-2">
        <HandWaving
          size={18}
          weight="fill"
          className="text-amber-400 light:text-amber-600 flex-shrink-0 mt-0.5"
        />
        <div className="flex flex-col gap-y-0.5 min-w-0">
          <p className="text-sm text-white light:text-slate-900 whitespace-pre-wrap">
            {session.question}
          </p>
          <p className="text-[11px] text-zinc-400 light:text-slate-500">
            {t("browserUse.card.signInHint")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <button
          type="button"
          onClick={onToggleControl}
          className={`border-none flex items-center gap-x-1 px-3 h-[32px] rounded-lg text-xs font-medium hover:opacity-80 flex-shrink-0 ${controlling ? "bg-amber-400 text-zinc-900" : "bg-zinc-700 light:bg-slate-200 text-white light:text-slate-900"}`}
        >
          <HandPointing size={14} weight="bold" />
          {controlling
            ? t("browserUse.card.releaseControl")
            : t("browserUse.card.takeOver")}
        </button>
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
                      <Favicon key={site.host} src={site.favicon} size={14} />
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
        <ResumedFrom
          resumedFrom={session.resumedFrom}
          className="px-2 pb-2 pl-[68px]"
        />
      </CardShell>
      {isOpen && (
        <TraceModal traceId={session.sessionId} onClose={closeModal} />
      )}
    </>
  );
}

/** "Continued from: <earlier task>" - opens the earlier session's trace. */
function ResumedFrom({ resumedFrom, className = "" }) {
  const { isOpen, openModal, closeModal } = useModal();
  if (!resumedFrom?.id) return null;
  return (
    <div className={`flex min-w-0 ${className}`}>
      <ContinuedFrom task={resumedFrom.task} onOpen={openModal} />
      {isOpen && <TraceModal traceId={resumedFrom.id} onClose={closeModal} />}
    </div>
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

function UsageLabel({ session }) {
  const { t } = useTranslation();
  const tokens = session.tokens || {};
  return (
    <span className="text-xs text-zinc-400 light:text-slate-500 whitespace-nowrap">
      {t("browserUse.card.usage", {
        steps: session.stepCount || 0,
        tokens: `${tokens.estimated ? "~" : ""}${formatTokens(tokens.total || 0)}`,
      })}
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
