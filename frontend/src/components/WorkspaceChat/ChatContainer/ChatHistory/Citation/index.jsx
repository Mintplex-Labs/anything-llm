import { memo, useState } from "react";
import { v4 } from "uuid";
import { decode as HTMLDecode } from "he";
import { CaretRight, FileText } from "@phosphor-icons/react";
import truncate from "truncate";
import ModalWrapper from "@/components/ModalWrapper";
import { middleTruncate } from "@/utils/directories";
import {
  ArrowSquareOut,
  GithubLogo,
  Link,
  X,
  YoutubeLogo,
} from "@phosphor-icons/react";

function combineLikeSources(sources) {
  const combined = {};
  sources.forEach((source) => {
    const { id, title, text, chunkSource = "" } = source;
    if (combined.hasOwnProperty(title)) {
      combined[title].text += `\n\n ---- Chunk ${id || ""} ---- \n\n${text}`;
      combined[title].references += 1;
      combined[title].chunkSource = chunkSource;
    } else {
      combined[title] = { title, text, chunkSource, references: 1 };
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
        className={`text-white/50 font-medium italic text-sm text-left ml-14 pt-2 ${
          open ? "pb-2" : ""
        } hover:text-white/75 transition-all duration-300`}
      >
        {open ? "Hide Citations" : "Show Citations"}
        <CaretRight
          className={`w-3.5 h-3.5 inline-block ml-1 transform transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <div className="flex flex-wrap md:flex-row flex-col md:items-center gap-4 overflow-x-scroll mt-1 doc__source">
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

function SkeletonLine() {
  const numOfBoxes = Math.floor(Math.random() * 5) + 2;
  return (
    <div className="flex space-x-2 mb-2">
      {Array.from({ length: numOfBoxes }).map((_, index) => (
        <div
          key={index}
          className="bg-white/20 rounded"
          style={{
            width: `${Math.random() * 150 + 50}px`,
            height: "20px",
          }}
        ></div>
      ))}
    </div>
  );
}

function CitationDetailModal({ source, onClose }) {
  const { references, title, text } = source;
  const { isUrl, text: webpageUrl, href: linkTo } = parseChunkSource(source);

  return (
    <ModalWrapper isOpen={source}>
      <div className="w-full max-w-2xl bg-main-gradient rounded-lg shadow border border-white/10 overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-gray-500/50">
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
            className="absolute top-6 right-6 transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="p-6 space-y-2 flex-col">
            {[...Array(3)].map((_, idx) => (
              <SkeletonLine key={idx} />
            ))}
            <p className="text-white whitespace-pre-line">{HTMLDecode(text)}</p>
            <div className="mb-6">
              {[...Array(3)].map((_, idx) => (
                <SkeletonLine key={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

const ICONS = {
  file: FileText,
  link: Link,
  youtube: YoutubeLogo,
  github: GithubLogo,
};

// Show the correct title and/or display text for citations
// which contain valid outbound links that can be clicked by the
// user when viewing a citation. Optionally allows various icons
// to show distinct types of sources.
function parseChunkSource({ title = "", chunkSource = "" }) {
  const nullResponse = {
    isUrl: false,
    text: null,
    href: null,
    icon: "file",
  };

  if (!chunkSource.startsWith("link://")) return nullResponse;
  try {
    const url = new URL(chunkSource.split("link://")[1]);
    let text = url.host + url.pathname;
    let icon = "link";

    if (url.host.includes("youtube.com")) {
      text = title;
      icon = "youtube";
    }

    if (url.host.includes("github.com")) {
      text = title;
      icon = "github";
    }

    return {
      isUrl: true,
      href: url.toString(),
      text,
      icon,
    };
  } catch {}
  return nullResponse;
}
