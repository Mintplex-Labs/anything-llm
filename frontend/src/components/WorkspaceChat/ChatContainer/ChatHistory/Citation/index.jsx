import { memo, useState } from "react";
import { v4 } from "uuid";
import { decode as HTMLDecode } from "he";
import truncate from "truncate";
import ModalWrapper from "@/components/ModalWrapper";
import { middleTruncate } from "@/utils/directories";
import {
  CaretRight,
  FileText,
  Info,
  ArrowSquareOut,
  GithubLogo,
  Link,
  X,
  YoutubeLogo,
  GitlabLogo,
} from "@phosphor-icons/react";
import ConfluenceLogo from "@/media/dataConnectors/confluence.png";
import DrupalWikiLogo from "@/media/dataConnectors/drupalwiki.png";
import ObsidianLogo from "@/media/dataConnectors/obsidian.png";
import { toPercentString } from "@/utils/numbers";

function combineLikeSources(sources) {
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
  if (sources.length === 0) return null;
  const [open, setOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  return (
    <div className="flex flex-col mt-4 justify-left">
      <button
        onClick={() => setOpen(!open)}
        className={`border-none text-white/50 light:text-black/50 font-medium italic text-sm text-left ml-14 pt-2 ${
          open ? "pb-2" : ""
        } hover:text-white/75 hover:light:text-black/75 transition-all duration-300`}
      >
        {open ? "Hide Citations" : "Show Citations"}
        <CaretRight
          className={`w-3.5 h-3.5 inline-block ml-1 transform transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <div className="flex flex-wrap md:flex-row md:items-center gap-4 overflow-x-scroll mt-1 doc__source ml-14">
          {combineLikeSources(sources).map((source) => (
            <Citation
              key={v4()}
              source={source}
              onClick={() => setSelectedSource(source)}
            />
          ))}
        </div>
      )}
      {selectedSource && (
        <CitationDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
}

const Citation = memo(({ source, onClick }) => {
  const { title } = source;
  if (!title) return null;
  const chunkSourceInfo = parseChunkSource(source);
  const truncatedTitle = chunkSourceInfo?.text ?? middleTruncate(title, 25);
  const CitationIcon = ICONS.hasOwnProperty(chunkSourceInfo?.icon)
    ? ICONS[chunkSourceInfo.icon]
    : ICONS.file;

  return (
    <div
      className="w-fit flex flex-row justify-center items-center cursor-pointer text-sky-400"
      onClick={onClick}
    >
      <CitationIcon className="w-6 h-6" weight="bold" />
      <p className="text-sm font-medium whitespace-nowrap">{truncatedTitle}</p>
    </div>
  );
});

function omitChunkHeader(text) {
  if (!text.startsWith("<document_metadata>")) return text;
  return text.split("</document_metadata>")[1].trim();
}

function CitationDetailModal({ source, onClose }) {
  const { references, title, chunks } = source;
  const { isUrl, text: webpageUrl, href: linkTo } = parseChunkSource(source);

  return (
    <ModalWrapper isOpen={source}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            {isUrl ? (
              <a
                href={linkTo}
                target="_blank"
                rel="noreferrer"
                className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap hover:underline hover:text-blue-300 flex items-center gap-x-1"
              >
                <h3 className="flex items-center gap-x-1">
                  {webpageUrl}
                  <ArrowSquareOut />
                </h3>
              </a>
            ) : (
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                {truncate(title, 45)}
              </h3>
            )}
          </div>
          {references > 1 && (
            <p className="text-xs text-gray-400 mt-2">
              Referenced {references} times.
            </p>
          )}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="py-7 px-9 space-y-2 flex-col">
            {chunks.map(({ text, score }, idx) => (
              <>
                <div key={idx} className="pt-6 text-white">
                  <div className="flex flex-col w-full justify-start pb-6 gap-y-1">
                    <p className="text-white whitespace-pre-line">
                      {HTMLDecode(omitChunkHeader(text))}
                    </p>

                    {!!score && (
                      <div className="w-full flex items-center text-xs text-white/60 gap-x-2 cursor-default">
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
                  <hr className="border-theme-modal-border" />
                )}
              </>
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
];

/**
 * Parses the chunk source to get the correct title and/or display text for citations
 * which contain valid outbound links that can be clicked by the
 * user when viewing a citation. Optionally allows various icons
 * to show distinct types of sources.
 * @param {{title: string, chunks: {text: string, chunkSource: string}[]}} options
 * @returns {{isUrl: boolean, text: string, href: string, icon: string}}
 */
function parseChunkSource({ title = "", chunks = [] }) {
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
    console.log({ sourceID });
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

// Patch to render Confluence icon as a element like we do with Phosphor
const ConfluenceIcon = ({ ...props }) => (
  <img src={ConfluenceLogo} {...props} />
);

// Patch to render DrupalWiki icon as a element like we do with Phosphor
const DrupalWikiIcon = ({ ...props }) => (
  <img src={DrupalWikiLogo} {...props} />
);

const ObsidianIcon = ({ ...props }) => <img src={ObsidianLogo} {...props} />;

const ICONS = {
  file: FileText,
  link: Link,
  youtube: YoutubeLogo,
  github: GithubLogo,
  gitlab: GitlabLogo,
  confluence: ConfluenceIcon,
  drupalwiki: DrupalWikiIcon,
  obsidian: ObsidianIcon,
};
