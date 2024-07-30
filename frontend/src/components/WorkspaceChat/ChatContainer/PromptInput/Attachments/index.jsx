import {
  CircleNotch,
  FileCode,
  FileCsv,
  FileDoc,
  FileHtml,
  FilePdf,
  WarningOctagon,
  X,
} from "@phosphor-icons/react";
import { humanFileSize } from "@/utils/numbers";
import { FileText } from "@phosphor-icons/react/dist/ssr";
import { REMOVE_ATTACHMENT_EVENT } from "../../DnDWrapper";
import { Tooltip } from "react-tooltip";

/**
 * @param {{attachments: import("../../DnDWrapper").Attachment[]}}
 * @returns
 */
export default function AttachmentManager({ attachments }) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap my-2">
      {attachments.map((attachment) => (
        <AttachmentItem key={attachment.uid} attachment={attachment} />
      ))}
    </div>
  );
}

/**
 * @param {{attachment: import("../../DnDWrapper").Attachment}}
 */
function AttachmentItem({ attachment }) {
  const { uid, file, status, error, document } = attachment;
  const { iconBgColor, Icon } = displayFromFile(file);

  function removeFileFromQueue() {
    window.dispatchEvent(
      new CustomEvent(REMOVE_ATTACHMENT_EVENT, { detail: { uid, document } })
    );
  }

  if (status === "in_progress") {
    return (
      <div
        className={`h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 border border-white/20 w-[200px]`}
      >
        <div
          className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
        >
          <CircleNotch size={30} className="text-white animate-spin" />
        </div>
        <div className="flex flex-col w-[130px]">
          <p className="text-white text-xs font-medium truncate">{file.name}</p>
          <p className="text-white/60 text-xs font-medium">
            {humanFileSize(file.size)}
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <>
        <div
          data-tooltip-id={`attachment-uid-${uid}-error`}
          data-tooltip-content={error}
          className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-[#4E140B] border border-transparent w-[200px] group`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="bg-zinc-700 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40"
            >
              <X
                size={10}
                className="flex-shrink-0 text-zinc-200 group-hover:text-white"
              />
            </button>
          </div>
          <div
            className={`bg-danger rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
          >
            <WarningOctagon size={30} className="text-white" />
          </div>
          <div className="flex flex-col w-[130px]">
            <p className="text-white text-xs font-medium truncate">
              {file.name}
            </p>
            <p className="text-red-100 text-xs truncate">
              {error ?? "this file failed to upload"}. It will not be available
              in the workspace.
            </p>
          </div>
        </div>
        <Tooltip
          id={`attachment-uid-${uid}-error`}
          place="top"
          delayShow={300}
          className="allm-tooltip !allm-text-xs"
        />
      </>
    );
  }

  return (
    <>
      <div
        data-tooltip-id={`attachment-uid-${uid}-success`}
        data-tooltip-content={`${file.name} was uploaded and embedded into this workspace. It will be available for RAG chat now.`}
        className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 border border-white/20 w-[200px] group`}
      >
        <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
          <button
            onClick={removeFileFromQueue}
            type="button"
            className="bg-zinc-700 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40"
          >
            <X
              size={10}
              className="flex-shrink-0 text-zinc-200 group-hover:text-white"
            />
          </button>
        </div>
        <div
          className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
        >
          <Icon size={30} className="text-white" />
        </div>
        <div className="flex flex-col w-[130px]">
          <p className="text-white text-xs font-medium truncate">{file.name}</p>
          <p className="text-white/80 text-xs font-medium">File embedded!</p>
        </div>
      </div>
      <Tooltip
        id={`attachment-uid-${uid}-success`}
        place="top"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </>
  );
}

/**
 * @param {File} file
 * @returns {{iconBgColor:string, Icon: React.Component}}
 */
function displayFromFile(file) {
  const extension = file?.name?.split(".")?.pop()?.toLowerCase() ?? "txt";
  switch (extension) {
    case "pdf":
      return { iconBgColor: "bg-magenta", Icon: FilePdf };
    case "doc":
    case "docx":
      return { iconBgColor: "bg-royalblue", Icon: FileDoc };
    case "html":
      return { iconBgColor: "bg-warn", Icon: FileHtml };
    case "csv":
    case "xlsx":
      return { iconBgColor: "bg-success", Icon: FileCsv };
    case "json":
    case "sql":
    case "js":
    case "jsx":
    case "cpp":
    case "c":
    case "c":
      return { iconBgColor: "bg-warn", Icon: FileCode };
    default:
      return { iconBgColor: "bg-royalblue", Icon: FileText };
  }
}
