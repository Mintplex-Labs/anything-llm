import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  CircleNotch,
  Warning,
  LinkSimple,
  BookmarkSimple,
  Play,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import BrowserUse from "@/models/browserUse";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";

// How long each screenshot shows when a site's replay plays.
const REPLAY_FRAME_MS = 700;

/**
 * Full history of one browser-use session: the result, then every step grouped by the site it
 * happened on. Each site has one screenshot that replays its steps - screenshots are deleted after
 * a few days, so the steps themselves never depend on them.
 * A session that continued an earlier one links to it - following the link shows
 * that session in the same modal.
 * @param {{traceId: string, onClose: () => void}} props
 */
export default function TraceModal({ traceId, onClose }) {
  const { t } = useTranslation();
  const [shownId, setShownId] = useState(traceId);
  const [trace, setTrace] = useState(undefined);

  useEffect(() => setShownId(traceId), [traceId]);

  useEffect(() => {
    let active = true;
    setTrace(undefined);
    BrowserUse.trace(shownId).then((result) => {
      if (active) setTrace(result);
    });
    return () => {
      active = false;
    };
  }, [shownId]);

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalHeader
        title={trace?.task || t("browserUse.trace.title")}
        subtitle={trace ? traceSubtitle(trace, t) : null}
        onClose={onClose}
      />
      <ModalBody>
        {trace === undefined && (
          <div className="flex justify-center py-10">
            <CircleNotch size={24} className="animate-spin text-zinc-400" />
          </div>
        )}
        {trace === null && (
          <p className="text-sm text-zinc-400 light:text-slate-600 py-6 text-center">
            {t("browserUse.trace.missing")}
          </p>
        )}
        {trace && (
          <>
            {trace.resumedFrom && (
              <ContinuedFrom
                task={trace.resumedFromTask}
                onOpen={() => setShownId(trace.resumedFrom)}
              />
            )}
            {trace.summary && (
              <SessionResult
                key={trace.id}
                status={t(
                  `browserUse.status.${trace.status}`,
                  t("browserUse.status.ended")
                )}
                summary={trace.summary}
              />
            )}
            <Collapsible
              key={`steps-${trace.id}`}
              maxHeight="max-h-[240px]"
              limitTo="[data-replay]"
              fade="from-zinc-900 light:from-white"
              className="flex flex-col gap-y-4"
              showMore={t("browserUse.trace.showAllSteps", {
                count: trace.steps?.length || 0,
              })}
            >
              {groupBySite(trace.steps).map((group, i) => (
                <SiteGroup key={`${trace.id}-${i}`} group={group} />
              ))}
            </Collapsible>
            {trace.resume?.url && (
              <div className="flex items-start gap-x-2 rounded-lg bg-zinc-800 light:bg-slate-100 px-3 py-2">
                <BookmarkSimple
                  size={16}
                  className="text-zinc-400 light:text-slate-500 flex-shrink-0 mt-0.5"
                />
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-medium text-zinc-400 light:text-slate-500">
                    {t("browserUse.resume.savedAt")}
                  </p>
                  <p className="text-sm text-white light:text-slate-900 truncate">
                    {trace.resume.title || trace.resume.url}
                  </p>
                  <p
                    className="text-xs text-zinc-400 light:text-slate-500 truncate"
                    title={trace.resume.url}
                  >
                    {trace.resume.url}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </ModalBody>
    </Modal>
  );
}

/**
 * The session's final answer, as markdown. A long one is cut to a few lines until expanded.
 * @param {{status: string, summary: string}} props
 */
function SessionResult({ status, summary }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg bg-zinc-800 light:bg-slate-100 px-3 py-2">
      <p className="text-xs font-medium text-zinc-400 light:text-slate-500 mb-1">
        {status}
      </p>
      <Collapsible
        maxHeight="max-h-[180px]"
        fade="from-zinc-800 light:from-slate-100"
        className="flex flex-col gap-y-1 text-sm text-white light:text-slate-900"
        showMore={t("browserUse.trace.showMore")}
        html={DOMPurify.sanitize(renderMarkdown(summary))}
      />
    </div>
  );
}

/**
 * Content cut to `maxHeight` with a fade, plus an expand / collapse button - only when it is
 * actually taller than that.
 * @param {{maxHeight: string, limitTo?: string, fade: string, className?: string, showMore: string, html?: string, children?: React.ReactNode}} props
 *   maxHeight and fade are Tailwind classes; fade is the gradient's start color (the background).
 *   limitTo: a selector - when the content has a match, it is cut just below that element instead.
 */
function Collapsible({
  maxHeight,
  limitTo = null,
  fade,
  className = "",
  showMore,
  html,
  children,
}) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(null);

  // The limit element (the first site's screenshot) gets its height once its image decodes.
  useLayoutEffect(() => {
    const el = ref.current;
    const target = limitTo && el?.querySelector(limitTo);
    if (!target) return setLimit(null);
    // Cut a fade's height (h-12) below the element, so the fade never covers it.
    const measure = () =>
      setLimit(
        target.getBoundingClientRect().bottom -
          el.getBoundingClientRect().top +
          el.scrollTop +
          48
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => observer.disconnect();
  }, [limitTo, html, children]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setOverflows(el.scrollHeight > el.clientHeight + 4);
  }, [html, children, open, limit]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div
          ref={ref}
          // Not clipped once open - an overflow ancestor would stop the site headers sticking.
          className={`${open ? "" : `overflow-hidden ${limit ? "" : maxHeight}`} ${className}`}
          style={!open && limit ? { maxHeight: limit } : undefined}
          {...(html !== undefined
            ? { dangerouslySetInnerHTML: { __html: html } }
            : { children })}
        />
        {overflows && !open && (
          <div
            className={`pointer-events-none absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t ${fade} to-transparent`}
          />
        )}
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="border-none bg-transparent p-0 mt-1 self-start flex items-center gap-x-1 text-xs font-medium text-sky-400 light:text-sky-700 hover:underline"
        >
          {open ? <CaretUp size={12} /> : <CaretDown size={12} />}
          {open ? t("browserUse.trace.showLess") : showMore}
        </button>
      )}
    </div>
  );
}

/**
 * One site the session was on: its steps, and a screenshot that replays them.
 * @param {{group: {host: string|null, favicon: string|null, steps: Object[]}}} props
 */
function SiteGroup({ group }) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(null);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2 sticky top-0 z-10 py-1 bg-zinc-900 light:bg-white">
        <Favicon src={group.favicon} host={group.host} size={16} />
        <p className="text-sm font-semibold text-white light:text-slate-900 truncate">
          {group.host || t("browserUse.trace.noSite")}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 ml-2">
        <Replay frames={framesOf(group.steps)} onFrame={setPlaying} />
        <ol className="flex flex-col gap-y-1.5 min-w-0 flex-1 border-l border-zinc-700 light:border-slate-300 pl-4">
          {group.steps.map((step, i) => (
            <li
              key={step.index}
              className={`flex flex-col min-w-0 rounded px-1 -mx-1 transition-colors ${playing === i ? "bg-sky-500/15" : ""}`}
            >
              <p className="text-sm text-white light:text-slate-900 flex items-center gap-x-1 min-w-0">
                {step.ok === false && (
                  <Warning size={14} className="text-amber-400 flex-shrink-0" />
                )}
                <span className="truncate flex-1">{step.label}</span>
                <span className="text-[10px] text-zinc-500 flex-shrink-0">
                  {new Date(step.at).toLocaleTimeString()}
                </span>
              </p>
              {step.title && step.title !== group.steps[i - 1]?.title && (
                <p
                  className="text-xs text-zinc-400 light:text-slate-500 truncate"
                  title={step.url}
                >
                  {step.title}
                </p>
              )}
              {step.sent?.length > 0 && (
                <p className="text-[11px] text-sky-300 light:text-sky-700 truncate">
                  {t("browserUse.trace.sent")}{" "}
                  {step.sent
                    .map(
                      (r) =>
                        `${r.label} ${r.ok === false ? "✗" : r.ok ? "✓" : "…"}`
                    )
                    .join(", ")}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * A site's screenshots as a click-to-play slideshow, one frame per step. At rest it shows the first
 * one. Nothing is shown once the screenshots are gone.
 * @param {{frames: Array<string|null>, onFrame: (index: number|null) => void}} props
 */
function Replay({ frames, onFrame }) {
  const { t } = useTranslation();
  const first = frames.findIndex(Boolean);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    onFrame(index);
    if (index === null) return;
    const timer = setTimeout(
      () => setIndex(index + 1 < frames.length ? index + 1 : null),
      REPLAY_FRAME_MS
    );
    return () => clearTimeout(timer);
  }, [index]);

  if (first === -1) return null;
  const playing = index !== null;
  const label = playing
    ? t("browserUse.trace.stop")
    : t("browserUse.trace.replay");
  return (
    <button
      type="button"
      onClick={() => setIndex(playing ? null : first)}
      aria-label={label}
      title={label}
      data-replay
      className="group relative border-none p-0 w-full sm:w-[240px] self-start flex-shrink-0 rounded overflow-hidden bg-zinc-950 light:bg-slate-100 light:ring-1 light:ring-slate-300"
    >
      <img
        src={`data:image/jpeg;base64,${frames[playing ? index : first]}`}
        alt=""
        className="w-full h-auto"
      />
      {playing ? (
        <span className="absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-black/70 text-white light:bg-white/90 light:text-slate-900 light:shadow">
          {index + 1} / {frames.length}
        </span>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 light:bg-white/10 light:group-hover:bg-slate-900/10 transition-colors">
          <span className="rounded-full p-2 bg-black/60 light:bg-white/90 light:shadow">
            <Play
              size={18}
              weight="fill"
              className="text-white light:text-slate-900"
            />
          </span>
        </span>
      )}
    </button>
  );
}

/**
 * "Continued from: <earlier task>" - shown on sessions that resumed a saved one.
 * @param {{task?: string|null, onOpen?: () => void}} props
 */
export function ContinuedFrom({ task, onOpen }) {
  const { t } = useTranslation();
  const label = t("browserUse.resume.continuedFrom", {
    task: task || t("browserUse.resume.earlierSession"),
  });
  const content = (
    <>
      <LinkSimple size={12} weight="bold" className="flex-shrink-0" />
      <span className="truncate">{label}</span>
    </>
  );
  const className =
    "flex items-center gap-x-1 min-w-0 text-xs text-zinc-400 light:text-slate-500";
  if (!onOpen) return <p className={className}>{content}</p>;
  return (
    <button
      type="button"
      onClick={onOpen}
      title={label}
      className={`${className} border-none bg-transparent p-0 text-left hover:text-white light:hover:text-slate-900 hover:underline`}
    >
      {content}
    </button>
  );
}

/**
 * A site's favicon: the one the page declared, else the favicon service chat
 * citations use for the host, else a globe.
 */
export function Favicon({ src, host, size = 16 }) {
  // Sources that failed to load - a new src or host gets its own attempt.
  const [failed, setFailed] = useState([]);
  const candidates = [
    src,
    host && `https://www.google.com/s2/favicons?domain=${host}&sz=64`,
  ].filter((url) => url && !failed.includes(url));
  const current = candidates[0];
  if (!current)
    return (
      <Globe
        size={size}
        className="text-zinc-400 light:text-slate-500 flex-shrink-0"
      />
    );
  return (
    <img
      key={current}
      src={current}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed((list) => [...list, current])}
      className="rounded-sm flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function formatTokens(count = 0) {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(count < 10_000 ? 1 : 0)}k`;
}

function traceSubtitle(trace, t) {
  const started = new Date(trace.startedAt);
  const seconds = trace.endedAt
    ? Math.max(1, Math.round((new Date(trace.endedAt) - started) / 1000))
    : null;
  return [
    started.toLocaleString(),

    seconds &&
      (seconds < 60
        ? t("browserUse.trace.seconds", { count: seconds })
        : t("browserUse.trace.minutes", { count: Math.round(seconds / 60) })),
    t("browserUse.trace.tokens", { tokens: formatTokens(trace.tokens?.total) }),
    trace.model,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * One screenshot per step. A step without one (never taken, or deleted) shows the one before it;
 * steps before the first screenshot have none.
 * @returns {Array<string|null>}
 */
function framesOf(steps = []) {
  let last = null;
  return steps.map((step) => (last = step.thumbnail || last));
}

/** Consecutive steps on the same host form one group. */
function groupBySite(steps = []) {
  const groups = [];
  steps.forEach((step, index) => {
    let host = null;
    try {
      host = step.url ? new URL(step.url).host : null;
    } catch {}
    const last = groups.at(-1);
    if (last && (last.host === host || !host))
      last.steps.push({ ...step, index });
    else
      groups.push({ host, favicon: step.favicon, steps: [{ ...step, index }] });
  });
  return groups;
}
