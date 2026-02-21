import { Fragment } from "react";
import { decode as HTMLDecode } from "he";
import truncate from "truncate";
import ModalWrapper from "@/components/ModalWrapper";
import {
  FileText,
  Info,
  ArrowSquareOut,
  GithubLogo,
  X,
  YoutubeLogo,
  LinkSimple,
  GitlabLogo,
} from "@phosphor-icons/react";
import { toPercentString } from "@/utils/numbers";
import { useSourcesSidebar } from "../../SourcesSidebar";

const CIRCLE_ICONS = {
  file: FileText,
  link: LinkSimple,
  youtube: YoutubeLogo,
  github: GithubLogo,
  gitlab: GitlabLogo,
  confluence: LinkSimple,
  drupalwiki: FileText,
  obsidian: FileText,
  paperlessNgx: FileText,
};

/**
 * Renders a circle with a source type icon inside.
 * @param {"file"|"link"|"youtube"|"github"|"gitlab"|"confluence"|"drupalwiki"|"obsidian"|"paperlessNgx"} props.type
 * @param {number} [props.size] - Circle diameter in px
 * @param {number} [props.iconSize] - Icon size in px
 */
export function SourceTypeCircle({ type = "file", size = 22, iconSize = 12 }) {
  const Icon = CIRCLE_ICONS[type] || CIRCLE_ICONS.file;
  return (
    <div
      className="bg-white light:bg-slate-100 rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Icon size={iconSize} weight="bold" className="text-black" />
    </div>
  );
}

export function combineLikeSources(sources) {
  const combined = {};
  sources.forEach((source) => {
    const { id, title, text, chunkSource = "", score = null } = source;
    if (combined.hasOwnProperty(title)) {
      combined[title].chunks.push({ id, text, chunkSource, score });
      combined[title].references += 1;
    } else {
      combined[title] = {
        title,
        chunks: [{ id, text, chunkSource, score }],
        references: 1,
      };
    }
  });
  return Object.values(combined);
}

export default function Citations({ sources = [] }) {
  const { openSources, setOpenSources } = useSourcesSidebar();
  if (sources.length === 0) return null;

  const combined = combineLikeSources(sources);
  const visibleSources = combined.slice(0, 3);
  const remainingCount = Math.max(0, combined.length - 3);

  return (
    <button
      onClick={() => setOpenSources(openSources ? null : sources)}
      className="w-fit flex items-center gap-[5px] px-[10px] py-[4px] rounded-full hover:bg-white/5 light:hover:bg-black/5 transition-colors"
      type="button"
    >
      <span className="text-xs text-white light:text-slate-800">Sources</span>
      <div
        className="relative h-[22px]"
        style={{ width: `${visibleSources.length * 17 + 5}px` }}
      >
        {visibleSources.map((source, idx) => {
          const info = parseChunkSource(source);
          return (
            <div
              key={source.title || idx}
              className="absolute top-0 size-[22px] rounded-full border-2 border-zinc-800 light:border-white"
              style={{ left: `${idx * 17}px`, zIndex: 3 - idx }}
            >
              <SourceTypeCircle type={info.icon} size={18} iconSize={10} />
            </div>
          );
        })}
      </div>
      {remainingCount > 0 && (
        <span className="text-xs text-white light:text-slate-800">
          + {remainingCount}
        </span>
      )}
    </button>
  );
}

function omitChunkHeader(text) {
  if (!text.includes("<document_metadata>")) return text;
  return text.split("</document_metadata>")[1].trim();
}

export function CitationDetailModal({ source, onClose }) {
  const { references, title, chunks } = source;
  const { isUrl, text: webpageUrl, href: linkTo } = parseChunkSource(source);

  return (
    <ModalWrapper isOpen={!!source}>
      <div className="w-full max-w-2xl bg-zinc-900 light:bg-white rounded-lg shadow border-2 border-zinc-700 light:border-slate-300 overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-zinc-700 light:border-slate-300">
          <div className="w-full flex gap-x-2 items-center">
            {isUrl ? (
              <a
                href={linkTo}
                target="_blank"
                rel="noreferrer"
                className="text-xl w-[90%] font-semibold text-white light:text-slate-900 whitespace-nowrap hover:underline hover:text-blue-300 light:hover:text-blue-600 flex items-center gap-x-1"
              >
                <div className="flex items-center gap-x-1 max-w-full overflow-hidden">
                  <h3 className="truncate text-ellipsis whitespace-nowrap overflow-hidden w-full">
                    {webpageUrl}
                  </h3>
                  <ArrowSquareOut className="flex-shrink-0" />
                </div>
              </a>
            ) : (
              <h3 className="text-xl font-semibold text-white light:text-slate-900 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {truncate(title, 45)}
              </h3>
            )}
          </div>
          {references > 1 && (
            <p className="text-xs text-zinc-400 light:text-slate-500 mt-2">
              Referenced {references} times.
            </p>
          )}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-zinc-700 light:hover:bg-slate-200 border-transparent border"
          >
            <X
              size={24}
              weight="bold"
              className="text-white light:text-slate-900"
            />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="py-7 px-9 space-y-2 flex-col">
            {chunks.map(({ text, score }, idx) => (
              <Fragment key={idx}>
                <div className="pt-6 text-white light:text-slate-900">
                  <div className="flex flex-col w-full justify-start pb-6 gap-y-1">
                    <p className="text-white light:text-slate-900 whitespace-pre-line">
                      {HTMLDecode(omitChunkHeader(text))}
                    </p>

                    {!!score && (
                      <div className="w-full flex items-center text-xs text-white/60 light:text-slate-500 gap-x-2 cursor-default">
                        <div
                          data-tooltip-id="similarity-score"
                          data-tooltip-content={`This is the semantic similarity score of this chunk of text compared to your query calculated by the vector database.`}
                          className="flex items-center gap-x-1"
                        >
                          <Info size={14} />
                          <p>{toPercentString(score)} match</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {idx !== chunks.length - 1 && (
                  <hr className="border-zinc-700 light:border-slate-300" />
                )}
              </Fragment>
            ))}
            <div className="mb-6"></div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

const supportedSources = [
  "link://",
  "confluence://",
  "github://",
  "gitlab://",
  "drupalwiki://",
  "youtube://",
  "obsidian://",
  "paperless-ngx://",
];

/**
 * Parses the chunk source to get the correct title and/or display text for citations
 * which contain valid outbound links that can be clicked by the
 * user when viewing a citation. Optionally allows various icons
 * to show distinct types of sources.
 * @param {{title: string, chunks: {text: string, chunkSource: string}[]}} options
 * @returns {{isUrl: boolean, text: string, href: string, icon: string}}
 */
export function parseChunkSource({ title = "", chunks = [] }) {
  const nullResponse = {
    isUrl: false,
    text: null,
    href: null,
    icon: "file",
  };

  if (
    !chunks.length ||
    !supportedSources.some((source) =>
      chunks[0].chunkSource?.startsWith(source)
    )
  )
    return nullResponse;

  try {
    const sourceID = supportedSources.find((source) =>
      chunks[0].chunkSource?.startsWith(source)
    );
    let url, text, icon;

    // Try to parse the URL from the chunk source
    // If it fails, we'll use the title as the text and the link icon
    // but the document will not be linkable
    try {
      url = new URL(chunks[0].chunkSource.split(sourceID)[1]);
    } catch {}

    switch (sourceID) {
      case "link://":
        text = url.host + url.pathname;
        icon = "link";
        break;

      case "youtube://":
        text = title;
        icon = "youtube";
        break;

      case "github://":
        text = title;
        icon = "github";
        break;

      case "gitlab://":
        text = title;
        icon = "gitlab";
        break;

      case "confluence://":
        text = title;
        icon = "confluence";
        break;

      case "drupalwiki://":
        text = title;
        icon = "drupalwiki";
        break;

      case "obsidian://":
        text = title;
        icon = "obsidian";
        break;

      case "paperless-ngx://":
        text = title;
        icon = "paperlessNgx";
        break;

      default:
        text = url.host + url.pathname;
        icon = "link";
        break;
    }

    return {
      isUrl: !!url,
      href: url?.toString() ?? "#",
      text,
      icon,
    };
  } catch (err) {
    console.warn(`Unsupported source identifier ${chunks[0].chunkSource}`, err);
  }
  return nullResponse;
}
