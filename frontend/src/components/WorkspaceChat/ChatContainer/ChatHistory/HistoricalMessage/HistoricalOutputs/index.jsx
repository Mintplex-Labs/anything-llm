import { memo } from "react";
import { saveAs } from "file-saver";
import { DownloadSimple } from "@phosphor-icons/react";
import { humanFileSize } from "@/utils/numbers";

const OUTPUT_RENDERERS = {
  PptxFileDownload: PptxFileDownloadOutput,
};

function HistoricalOutputs({ outputs = [] }) {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {outputs.map((output, index) => {
        const Renderer = OUTPUT_RENDERERS[output.type];
        if (!Renderer) {
          console.warn(`No renderer found for output type: ${output.type}`);
          return null;
        }
        return (
          <Renderer key={`${output.type}-${index}`} payload={output.payload} />
        );
      })}
    </div>
  );
}

function PptxFileDownloadOutput({ payload }) {
  const { filename, b64Content, fileSize } = payload || {};
  const { badge, badgeBg, badgeText, fileType } = getFileDisplayInfo(filename);

  const handleDownload = () => {
    if (b64Content && filename) saveAs(b64Content, filename);
  };

  return (
    <div className="flex justify-start w-full my-2">
      <div className="w-full max-w-[750px]">
        <div className="flex items-center justify-between bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50 rounded-xl px-2 py-1">
          <div className="flex items-center gap-x-3 min-w-0">
            <div
              className={`${badgeBg} ${badgeText} rounded-lg flex items-center justify-center flex-shrink-0 h-[48px] w-[48px] text-xs font-bold`}
            >
              {badge}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white light:text-slate-900 text-sm font-medium truncate leading-snug">
                {filename || "Unknown file"}
              </p>
              <p className="text-zinc-400 light:text-slate-500 text-xs leading-snug">
                {humanFileSize(fileSize, true, 1)}
                {fileSize && fileType ? " · " : ""}
                {fileType}
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-x-2 px-4 py-2 rounded-lg border border-zinc-600 light:border-theme-sidebar-border hover:bg-zinc-700 light:hover:bg-theme-bg-secondary transition-colors text-white light:text-theme-text-primary text-sm font-medium flex-shrink-0 ml-4"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getFileDisplayInfo(filename) {
  const extension = filename?.split(".")?.pop()?.toLowerCase() ?? "txt";
  switch (extension) {
    case "pptx":
    case "ppt":
      return {
        badge: "PPT",
        badgeBg: "bg-orange-100",
        badgeText: "text-orange-700",
        fileType: "PowerPoint",
      };
    case "pdf":
      return {
        badge: "PDF",
        badgeBg: "bg-red-100",
        badgeText: "text-red-700",
        fileType: "PDF Document",
      };
    case "doc":
    case "docx":
      return {
        badge: "DOC",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-700",
        fileType: "Word Document",
      };
    case "xls":
    case "xlsx":
      return {
        badge: "XLS",
        badgeBg: "bg-green-100",
        badgeText: "text-green-700",
        fileType: "Spreadsheet",
      };
    case "csv":
      return {
        badge: "CSV",
        badgeBg: "bg-green-100",
        badgeText: "text-green-700",
        fileType: "Spreadsheet",
      };
    default:
      return {
        badge: extension.toUpperCase().slice(0, 4),
        badgeBg: "bg-slate-200",
        badgeText: "text-slate-700",
        fileType: "File",
      };
  }
}

export default memo(HistoricalOutputs);
