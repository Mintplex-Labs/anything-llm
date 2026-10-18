import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  CircleNotch,
  Warning,
  LinkSimple,
  BookmarkSimple,
} from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import BrowserUse from "@/models/browserUse";

/**
 * Full history of one browser-use session: every step, grouped by the site it
 * happened on, with the page and a snapshot of what the browser showed.
 * A session that continued an earlier one links to it - following the link shows
 * that session in the same modal.
 * @param {{traceId: string, onClose: () => void}} props
 */
export default function TraceModal({ traceId, onClose }) {
  const { t } = useTranslation();
  const [shownId, setShownId] = useState(traceId);
  const [trace, setTrace] = useState(undefined);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => setShownId(traceId), [traceId]);

  useEffect(() => {
    let active = true;
    setTrace(undefined);
    setExpanded(null);
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
              <div className="rounded-lg bg-zinc-800 light:bg-slate-100 px-3 py-2">
                <p className="text-xs font-medium text-zinc-400 light:text-slate-500 mb-1">
                  {t(
                    `browserUse.status.${trace.status}`,
                    t("browserUse.status.ended")
                  )}
                </p>
                <p className="text-sm text-white light:text-slate-900 whitespace-pre-wrap">
                  {trace.summary}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-y-4">
              {groupBySite(trace.steps).map((group, i) => (
                <div key={i} className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-2 sticky top-0 z-10 py-1 bg-zinc-900 light:bg-white">
                    <Favicon src={group.favicon} size={16} />
                    <p className="text-sm font-semibold text-white light:text-slate-900 truncate">
                      {group.host || t("browserUse.trace.noSite")}
                    </p>
                  </div>
                  <div className="flex flex-col border-l border-zinc-700 light:border-slate-300 ml-2 pl-4 gap-y-2">
                    {group.steps.map((step) => (
                      <div
                        key={step.index}
                        className="flex items-start gap-x-3"
                      >
                        {step.thumbnail ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded(
                                expanded === step.index ? null : step.index
                              )
                            }
                            className={`border-none p-0 flex-shrink-0 rounded overflow-hidden bg-zinc-950 ${expanded === step.index ? "w-full max-w-[640px]" : "w-[96px]"}`}
                          >
                            <img
                              src={`data:image/jpeg;base64,${step.thumbnail}`}
                              alt=""
                              className="w-full h-auto"
                            />
                          </button>
                        ) : (
                          <div className="w-[96px] h-[60px] flex-shrink-0 rounded bg-zinc-800 light:bg-slate-100" />
                        )}
                        {expanded !== step.index && (
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm text-white light:text-slate-900 flex items-center gap-x-1">
                              {step.ok === false && (
                                <Warning
                                  size={14}
                                  className="text-amber-400 flex-shrink-0"
                                />
                              )}
                              <span className="truncate">{step.label}</span>
                            </p>
                            {step.title && (
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
                            <p className="text-[10px] text-zinc-500">
                              {new Date(step.at).toLocaleTimeString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

/** A site's favicon, falling back to a globe when it is missing or fails to load. */
export function Favicon({ src, size = 16 }) {
  // The src that failed to load, so a new src gets its own attempt.
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src)
    return (
      <Globe
        size={size}
        className="text-zinc-400 light:text-slate-500 flex-shrink-0"
      />
    );
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setFailedSrc(src)}
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
