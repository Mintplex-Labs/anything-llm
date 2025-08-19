import {
  CircleNotch,
  FileCode,
  FileCsv,
  FileDoc,
  FileHtml,
  FileText,
  FileImage,
  FilePdf,
  WarningOctagon,
  X,
} from "@phosphor-icons/react";
import { REMOVE_ATTACHMENT_EVENT } from "../../DnDWrapper";
import { Tooltip } from "react-tooltip";

/**
 * @param {{attachments: import("../../DnDWrapper").Attachment[]}}
 * @returns
 */
export default function AttachmentManager({ attachments }) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
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
  const { uid, file, status, error, document, type, contentString } =
    attachment;
  const { iconBgColor, Icon } = displayFromFile(file);

  function removeFileFromQueue() {
    window.dispatchEvent(
      new CustomEvent(REMOVE_ATTACHMENT_EVENT, { detail: { uid, document } })
    );
  }

  if (status === "in_progress") {
    return (
      <div className="relative flex items-center gap-x-1 rounded-lg bg-theme-attachment-bg border-none w-[180px] group">
        <div
          className={`bg-theme-attachment-icon-spinner-bg rounded-md flex items-center justify-center flex-shrink-0 h-[32px] w-[32px] m-1`}
        >
          <CircleNotch
            size={18}
            weight="bold"
            className="text-theme-attachment-icon-spinner animate-spin"
          />
        </div>
        <div className="flex flex-col w-[125px]">
          <p className="text-theme-attachment-text text-xs font-semibold truncate">
            {file.name}
          </p>
          <p className="text-theme-attachment-text-secondary text-[10px] leading-[14px] font-medium">
            Uploading...
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
          className={`relative flex items-center gap-x-1 rounded-lg bg-theme-attachment-error-bg border-none w-[180px] group`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="bg-white hover:bg-error hover:text-theme-attachment-text rounded-full p-1 flex items-center justify-center hover:border-transparent border border-theme-attachment-bg"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          <div
            className={`bg-error rounded-md flex items-center justify-center flex-shrink-0 h-[32px] w-[32px] m-1`}
          >
            <WarningOctagon size={24} className="text-theme-attachment-icon" />
          </div>
          <div className="flex flex-col w-[125px]">
            <p className="text-theme-attachment-text text-xs font-semibold truncate">
              {file.name}
            </p>
            <p className="text-theme-attachment-text-secondary text-[10px] leading-[14px] font-medium truncate">
              {error ?? "File not embedded!"}
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

  if (type === "attachment") {
    return (
      <>
        <div
          data-tooltip-id={`attachment-uid-${uid}-success`}
          data-tooltip-content={`${file.name} will be attached to this prompt. It will not be embedded into the workspace permanently.`}
          className={`relative flex items-center gap-x-1 rounded-lg bg-theme-attachment-success-bg border-none w-[180px] group`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="bg-white hover:bg-error hover:text-theme-attachment-text rounded-full p-1 flex items-center justify-center hover:border-transparent border border-theme-attachment-bg"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          {contentString ? (
            <img
              alt={`Preview of ${file.name}`}
              src={contentString}
              className={`${iconBgColor} w-[30px] h-[30px] rounded-lg flex items-center justify-center m-1`}
            />
          ) : (
            <div
              className={`${iconBgColor} rounded-md flex items-center justify-center flex-shrink-0 h-[32px] w-[32px] m-1`}
            >
              <Icon size={24} className="text-theme-attachment-icon" />
            </div>
          )}
          <div className="flex flex-col w-[125px]">
            <p className="text-theme-attachment-text text-xs font-semibold truncate">
              {file.name}
            </p>
            <p className="text-theme-attachment-text-secondary text-[10px] leading-[14px] font-medium">
              Image attached!
            </p>
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

  return (
    <>
      <div
        data-tooltip-id={`attachment-uid-${uid}-success`}
        data-tooltip-content={
          status === "embedded"
            ? `${file.name} was uploaded and embedded into this workspace. It will be available for RAG chat now.`
            : `${file.name} will be used as context for this chat only.`
        }
        className={`relative flex items-center gap-x-1 rounded-lg bg-theme-attachment-bg border-none w-[180px] group`}
      >
        <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
          <button
            onClick={removeFileFromQueue}
            type="button"
            className="bg-white hover:bg-error hover:text-theme-attachment-text rounded-full p-1 flex items-center justify-center hover:border-transparent border border-theme-attachment-bg"
          >
            <X size={10} className="flex-shrink-0" />
          </button>
        </div>
        <div
          className={`${iconBgColor} rounded-md flex items-center justify-center flex-shrink-0 h-[32px] w-[32px] m-1`}
        >
          <Icon
            size={24}
            weight="light"
            className="text-theme-attachment-icon"
          />
        </div>
        <div className="flex flex-col w-[125px]">
          <p className="text-white text-xs font-semibold truncate">
            {file.name}
          </p>
          <p className="text-theme-attachment-text-secondary text-[10px] leading-[14px] font-medium">
            {status === "embedded" ? "File embedded!" : "Added as context!"}
          </p>
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
      return { iconBgColor: "bg-purple", Icon: FileHtml };
    case "csv":
    case "xlsx":
      return { iconBgColor: "bg-success", Icon: FileCsv };
    case "json":
    case "sql":
    case "js":
    case "jsx":
    case "cpp":
    case "c":
      return { iconBgColor: "bg-warn", Icon: FileCode };
    case "png":
    case "jpg":
    case "jpeg":
      return { iconBgColor: "bg-royalblue", Icon: FileImage };
    default:
      return { iconBgColor: "bg-royalblue", Icon: FileText };
  }
}
