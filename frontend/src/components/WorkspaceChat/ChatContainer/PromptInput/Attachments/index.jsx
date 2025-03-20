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
import { humanFileSize, milliToHms } from "@/utils/numbers";
import { REMOVE_ATTACHMENT_EVENT } from "../../DnDWrapper";
import { Tooltip } from "react-tooltip";
import React, { useState, useEffect } from "react";

/**
 * @param {{attachments: import("../../DnDWrapper").Attachment[]}}
 * @returns
 */
export default function AttachmentManager({ attachments }) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap mt-4 mb-2 gap-y-2 gap-x-[0.5px]">
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

  const [timerMs, setTimerMs] = useState(10);
  const [progress, setProgress] = useState(0);
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  const estimatedUploadTimeBase = 10 * 1000;
  const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2);
  const estimatedUploadTime = Math.max(fileSizeInMB * estimatedUploadTimeBase, 3000);

  useEffect(() => {
    if (status === "in_progress") {
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - start;
        setTimerMs(elapsedTime);

        let calculatedProgress = Math.min(
          (elapsedTime / estimatedUploadTime) * 95,
          95
        );

        setProgress(calculatedProgress);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [status, estimatedUploadTime]);

  useEffect(() => {
    console.log("Prompt file upload status info: ", status); // status 변경될 때마다 출력

    setIsReadyToRender(false);

    if (status === "failed") {
      setProgress(0);
      return;
    }
    if (status === "success") {
      setProgress(100);
      setIsReadyToRender(true);
    }
  }, [status]);

  function removeFileFromQueue() {
    window.dispatchEvent(
      new CustomEvent(REMOVE_ATTACHMENT_EVENT, { detail: { uid, document } })
    );
  }

  if (status === "in_progress") {
    return (
      <div
        className={`h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:bg-theme-bg-sidebar border border-white/20 w-[200px]`}
      >
        <div
          className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
        >
          <CircleNotch
            size={30}
            className="text-white light:text-white animate-spin"
          />
        </div>
        <div className="flex flex-col w-[130px]">
          <p className="text-white text-xs font-medium truncate">{file.name}</p>
          <p className="text-white/80 text-xs font-medium w-[150px] turncate text-left">
            {humanFileSize(file.size)} | {milliToHms(timerMs)}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
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
          className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-error/40 light:bg-error/30 border border-transparent w-[200px] group`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="light:bg-white bg-zinc-700 hover:light:text-white hover:light:bg-red-400 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          <div
            className={`bg-error rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
          >
            <WarningOctagon size={30} className="text-white light:text-white" />
          </div>
          <div className="flex flex-col w-[130px]">
            <p className="text-white light:text-red-600 text-xs font-medium truncate">
              {file.name}
            </p>
            <p className="text-red-100 light:text-red-600 text-xs truncate">
              {error ?? "파일 업로드에 실패했습니다."} 작업공간에서 사용할 수 없습니다.
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
          data-tooltip-content={`${file.name} 파일이 프롬프트에 첨부되지만, 작업 공간에 영구적으로 삽입되지는 않습니다.`}
          className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:bg-theme-bg-sidebar border border-white/20 w-[200px] group`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="bg-zinc-700 light:bg-white hover:light:text-white hover:light:bg-red-400 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          {contentString ? (
            <img
              src={contentString}
              className={`${iconBgColor} w-[30px] h-[30px] rounded-lg flex items-center justify-center`}
            />
          ) : (
            <div
              className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
            >
              <Icon size={30} className="text-white light:text-white" />
            </div>
          )}
          <div className="flex flex-col w-[130px]">
            <p className="text-white text-xs font-medium truncate">
              {file.name}
            </p>
            <p className="text-white/80 light:text-black/80 text-xs font-medium">
              이미지가 첨부되었습니다!
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

  if (status === "success" && isReadyToRender) {
    return (
      <>
        <div
          data-tooltip-id={`attachment-uid-${uid}-success`}
          data-tooltip-content={`${file.name} 파일이 업로드되어 작업 공간에 추가되어 RAG 채팅에서 사용하실 수 있습니다.`}
          className={`relative h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:bg-theme-bg-sidebar border border-white/20 w-[200px] group`}
        >
          <div className="invisible group-hover:visible absolute -top-[5px] -right-[5px] w-fit h-fit z-[10]">
            <button
              onClick={removeFileFromQueue}
              type="button"
              className="bg-zinc-700 light:bg-white hover:light:text-white hover:light:bg-red-400 hover:bg-red-400 rounded-full p-1 flex items-center justify-center hover:border-transparent border border-white/40"
            >
              <X size={10} className="flex-shrink-0" />
            </button>
          </div>
          <div
            className={`${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0 p-1`}
          >
            <Icon size={30} className="text-white light:text-white" />
          </div>
          <div className="flex flex-col w-[130px]">
            <p className="text-white text-xs font-medium truncate">
              {file.name}
            </p>
            <p className="text-white/80 light:text-black/80 text-xs font-medium">
              파일이 첨부되었습니다!
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
