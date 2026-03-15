import { Fragment, useEffect, useState } from "react";
import { ArrowSquareOut, Info, SpinnerGap } from "@phosphor-icons/react";
import { decode as HTMLDecode } from "he";
import Workspace from "@/models/workspace";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { toPercentString } from "@/utils/numbers";
import { omitChunkHeader } from "../ChatHistory/Citation";

function decodeChunkText(text = "") {
  return HTMLDecode(omitChunkHeader(text)).trim();
}

function isHttpUrl(value = "") {
  return /^https?:\/\//i.test(String(value).trim());
}

function isSourceFieldUrl(label = "", value = "") {
  return label.trim().toLowerCase() === "kilde" && isHttpUrl(value);
}

function parseLeadingSourceHeader(pageContent = "") {
  const lines = pageContent.split(/\r?\n/);
  let start = 0;

  while (start < lines.length && !lines[start].trim()) start += 1;
  if (start >= lines.length) return null;

  const titleLine = lines[start].trim();
  if (!titleLine || titleLine.includes(":")) return null;

  const fields = [];
  let cursor = start + 1;

  while (cursor < lines.length) {
    const currentLine = lines[cursor].trim();
    if (!currentLine) {
      cursor += 1;
      if (fields.length) break;
      continue;
    }

    const match = currentLine.match(/^([^:]{1,80}):\s*(.+)$/);
    if (!match) break;

    fields.push({
      label: match[1].trim(),
      value: match[2].trim(),
    });
    cursor += 1;
  }

  if (
    fields.length < 2 ||
    !fields.some((field) => field.label.toLowerCase() === "kilde")
  ) {
    return null;
  }

  return {
    titleLine,
    fields,
    body: lines.slice(cursor).join("\n").trim(),
  };
}

function normalizeSourceText(text = "") {
  return text.replace(
    /^(Kilde:\s*)(https?:\/\/\S+)(.*)$/gim,
    (_, label, url, suffix = "") => `${label}[${url}](${url})${suffix}`
  );
}

function SourceMarkdownText({ text, className = "" }) {
  const sourceHtml = DOMPurify.sanitize(
    renderMarkdown(normalizeSourceText(text))
  );

  return (
    <div
      className={`markdown whitespace-pre-line ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: sourceHtml }}
    />
  );
}

function renderSourceFieldValue(field = {}) {
  if (isSourceFieldUrl(field.label, field.value)) {
    return (
      <a
        href={field.value}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-blue-300 light:text-blue-600 hover:underline break-all"
      >
        {field.value}
        <ArrowSquareOut size={14} />
      </a>
    );
  }

  return (
    <SourceMarkdownText
      text={field.value}
      className="text-white light:text-slate-900 break-words"
    />
  );
}

function renderSourceBodyText(sourceDocument = {}, parsedSource = null) {
  const text = parsedSource ? parsedSource.body : sourceDocument.pageContent;
  if (!text) return null;

  return (
    <SourceMarkdownText
      text={text}
      className="text-sm leading-7 text-white light:text-slate-900 break-words"
    />
  );
}

function getExternalSourceLink(source = {}, sourceDocument = null) {
  const candidates = [
    source?.url,
    source?.docSource,
    sourceDocument?.metadata?.url,
    sourceDocument?.metadata?.docSource,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (isHttpUrl(candidate)) return candidate;
  }

  return null;
}

function SourceDocumentSection({ sourceDocument }) {
  const parsedSource = parseLeadingSourceHeader(
    sourceDocument?.pageContent || ""
  );

  if (!sourceDocument?.pageContent) return null;

  return (
    <div className="rounded-xl border border-zinc-700 light:border-slate-300 bg-black/10 light:bg-doctor px-4 py-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-700 light:border-slate-300">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/50 light:text-[rgba(7,16,55,0.55)]">
            Source document
          </p>
          <p className="text-sm font-medium text-white light:text-slate-900">
            {parsedSource?.titleLine || sourceDocument.title}
          </p>
        </div>
        {sourceDocument?.metadata?.location && (
          <span className="text-[11px] text-white/40 light:text-[rgba(7,16,55,0.55)] text-right">
            {sourceDocument.metadata.location}
          </span>
        )}
      </div>

      {!!parsedSource?.fields?.length && (
        <div className="py-4 border-b border-zinc-700 light:border-slate-300">
          <div className="flex flex-col gap-2">
            {parsedSource.fields.map((field) => (
              <div
                key={`${field.label}-${field.value}`}
                className="flex flex-col gap-1 text-sm"
              >
                <span className="text-white/55 light:text-[rgba(7,16,55,0.55)]">
                  {field.label}
                </span>
                {renderSourceFieldValue(field)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        {renderSourceBodyText(sourceDocument, parsedSource)}
      </div>
    </div>
  );
}

export default function SourceDetailBody({
  source,
  workspaceSlug = null,
  threadSlug = null,
}) {
  const [loadState, setLoadState] = useState({
    status: "idle",
    sourceDocument: null,
  });

  useEffect(() => {
    setLoadState({
      status: "idle",
      sourceDocument: null,
    });
  }, [
    source?.title,
    source?.published,
    source?.location,
    source?.chunks?.[0]?.id,
  ]);

  async function loadSourceDocument() {
    if (loadState.status === "loading" || loadState.status === "loaded") return;
    if (!workspaceSlug) {
      setLoadState({ status: "unavailable", sourceDocument: null });
      return;
    }

    setLoadState({ status: "loading", sourceDocument: null });
    try {
      const primaryChunk = source?.chunks?.[0] || {};
      const { response, data } = await Workspace.getCitationSource(
        workspaceSlug,
        {
          title: source?.title || null,
          published: source?.published || null,
          chunkSource: primaryChunk.chunkSource || null,
          location: source?.location || null,
        },
        threadSlug
      );

      if (response.ok && data?.mode === "full" && data?.pageContent) {
        setLoadState({
          status: "loaded",
          sourceDocument: data,
        });
        return;
      }

      setLoadState({ status: "unavailable", sourceDocument: null });
    } catch (error) {
      console.error("Failed to load citation source document.", error);
      setLoadState({ status: "unavailable", sourceDocument: null });
    }
  }

  const externalSourceLink = getExternalSourceLink(
    source,
    loadState.sourceDocument
  );

  return (
    <div className="flex flex-col gap-4">
      {externalSourceLink && (
        <div className="rounded-xl border border-zinc-700 light:border-slate-300 bg-black/10 light:bg-doctor px-4 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-white/50 light:text-[rgba(7,16,55,0.55)]">
            Original source
          </p>
          <a
            href={externalSourceLink}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-sm text-blue-300 light:text-blue-600 hover:underline break-all"
          >
            {externalSourceLink}
            <ArrowSquareOut size={14} />
          </a>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-white/50 light:text-[rgba(7,16,55,0.55)]">
              Relevant excerpts
            </p>
            <p className="text-sm text-white/70 light:text-[rgba(7,16,55,0.55)]">
              Chunks are shown first so the cited passages stay easy to scan.
            </p>
          </div>
          <button
            type="button"
            onClick={loadSourceDocument}
            disabled={loadState.status === "loading"}
            className="shrink-0 rounded-lg border border-zinc-700 light:border-slate-300 px-3 py-2 text-sm text-white light:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            {loadState.status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <SpinnerGap size={16} className="animate-spin" />
                Loading source
              </span>
            ) : loadState.status === "loaded" ? (
              "Source loaded"
            ) : (
              "Read source document"
            )}
          </button>
        </div>

        {source.chunks.map(({ text, score }, idx) => {
          const decodedText = decodeChunkText(text);
          return (
            <Fragment key={`${source.title}-${idx}`}>
              <div className="rounded-xl border border-zinc-700 light:border-slate-300 px-4 py-4 bg-black/10 light:bg-doctor">
                <SourceMarkdownText
                  text={decodedText}
                  className="text-sm leading-7 text-white light:text-slate-900 break-words"
                />
                {!!score && (
                  <div className="pt-3 flex items-center text-xs text-white/60 light:text-[rgba(7,16,55,0.55)] gap-x-2 cursor-default">
                    <div className="flex items-center gap-x-1">
                      <Info size={14} />
                      <p>{toPercentString(score)} similarity match</p>
                    </div>
                  </div>
                )}
              </div>
              {idx !== source.chunks.length - 1 && (
                <hr className="border-zinc-700 light:border-slate-300" />
              )}
            </Fragment>
          );
        })}
      </div>

      {loadState.status === "unavailable" && (
        <div className="rounded-xl border border-dashed border-zinc-700 light:border-slate-300 px-4 py-4 text-sm text-white/70 light:text-[rgba(7,16,55,0.55)]">
          Full source text is unavailable for this citation. The excerpts above
          are still the retrieved passages used in the answer.
        </div>
      )}

      {loadState.status === "loaded" && (
        <SourceDocumentSection sourceDocument={loadState.sourceDocument} />
      )}
    </div>
  );
}
