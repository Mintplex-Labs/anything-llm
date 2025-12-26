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
  X,
  YoutubeLogo,
  LinkSimple,
  GitlabLogo,
} from "@phosphor-icons/react";
import ConfluenceLogo from "@/media/dataConnectors/confluence.png";
import DrupalWikiLogo from "@/media/dataConnectors/drupalwiki.png";
import ObsidianLogo from "@/media/dataConnectors/obsidian.png";
import PaperlessNgxLogo from "@/media/dataConnectors/paperlessngx.png";
import { toPercentString } from "@/utils/numbers";
import { useTranslation } from "react-i18next";
import pluralize from "pluralize";
import useTextSize from "@/hooks/useTextSize";

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
  const { t } = useTranslation();
  const { textSizeClass } = useTextSize();

  return (
    <div className="flex flex-col mt-4 justify-left">
      <button
        onClick={() => setOpen(!open)}
        className={`border-none font-semibold text-white/50 light:text-black/50 font-medium italic ${textSizeClass} text-left ml-14 pt-2 ${
          open ? "pb-2" : ""
        } hover:text-white/75 hover:light:text-black/75 transition-all duration-300`}
      >
        {open
          ? t("chat_window.hide_citations")
          : t("chat_window.show_citations")}
        <CaretRight
          weight="bold"
          size={14}
          className={`inline-block ml-1 transform transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <div className="flex flex-wrap flex-col items-start overflow-x-scroll no-scroll mt-1 ml-14 gap-y-2">
          {combineLikeSources(sources).map((source) => (
            <Citation
              key={v4()}
              source={source}
              onClick={() => setSelectedSource(source)}
              textSizeClass={textSizeClass}
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

const Citation = memo(({ source, onClick, textSizeClass }) => {
  const { title, references = 1 } = source;
  if (!title) return null;
  const chunkSourceInfo = parseChunkSource(source);
  const truncatedTitle = chunkSourceInfo?.text ?? middleTruncate(title, 25);
  const CitationIcon = ICONS.hasOwnProperty(chunkSourceInfo?.icon)
    ? ICONS[chunkSourceInfo.icon]
    : ICONS.file;

  return (
    <button
      className={`flex doc__source gap-x-1 ${textSizeClass}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start flex-1 pt-[4px]">
        <CitationIcon size={16} />
      </div>
      <div className="flex flex-col items-start gap-y-[0.2px] px-1">
        <p
          className={`!m-0 font-semibold whitespace-nowrap text-theme-text-primary hover:opacity-55 ${textSizeClass}`}
        >
          {truncatedTitle}
        </p>
        <p
          className={`!m-0 text-[10px] font-medium text-theme-text-secondary ${textSizeClass}`}
        >{`${references} ${pluralize("Reference", Number(references) || 1)}`}</p>
      </div>
    </button>
  );
});

function omitChunkHeader(text) {
  if (!text.includes("<document_metadata>")) return text;
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
                className="text-xl w-[90%] font-semibold text-white whitespace-nowrap hover:underline hover:text-blue-300 flex items-center gap-x-1"
              >
                <div className="flex items-center gap-x-1 max-w-full overflow-hidden">
                  <h3 className="truncate text-ellipsis whitespace-nowrap overflow-hidden w-full">
                    {webpageUrl}
                  </h3>
                  <ArrowSquareOut className="flex-shrink-0" />
                </div>
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

const ConfluenceIcon = ({ size = 16, ...props }) => (
  <img src={ConfluenceLogo} {...props} width={size} height={size} />
);
const DrupalWikiIcon = ({ size = 16, ...props }) => (
  <img src={DrupalWikiLogo} {...props} width={size} height={size} />
);
const ObsidianIcon = ({ size = 16, ...props }) => (
  <img src={ObsidianLogo} {...props} width={size} height={size} />
);
const PaperlessNgxIcon = ({ size = 16, ...props }) => (
  <img
    src={PaperlessNgxLogo}
    {...props}
    width={size}
    height={size}
    className="rounded-sm bg-white"
  />
);
const ICONS = {
  file: FileText,
  link: LinkSimple,
  youtube: YoutubeLogo,
  github: GithubLogo,
  gitlab: GitlabLogo,
  confluence: ConfluenceIcon,
  drupalwiki: DrupalWikiIcon,
  obsidian: ObsidianIcon,
  paperlessNgx: PaperlessNgxIcon,
};
