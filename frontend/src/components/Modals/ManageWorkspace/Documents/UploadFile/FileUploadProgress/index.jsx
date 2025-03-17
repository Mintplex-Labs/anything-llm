import React, { useState, useEffect, memo } from "react";
import truncate from "truncate";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import Workspace from "../../../../../../models/workspace";
import { humanFileSize, milliToHms } from "../../../../../../utils/numbers";
import PreLoader from "../../../../../Preloader";

function FileUploadProgressComponent({
  slug,
  uuid,
  file,
  setFiles,
  rejected = false,
  reason = null,
  onUploadSuccess,
  onUploadError,
  setLoading,
  setLoadingMessage,
}) {
  const [timerMs, setTimerMs] = useState(10);
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const estimatedUploadTime = 200 * 1000;

  const fadeOut = (cb) => {
    setIsFadingOut(true);
    cb?.();
  };

  const beginFadeOut = () => {
    setIsFadingOut(false);
    setFiles((prev) => {
      return prev.filter((item) => item.uid !== uuid);
    });
  };

  useEffect(() => {
    async function uploadFile() {
      setLoading(true);
      setLoadingMessage("Uploading file...");
      const start = Number(new Date());
      const formData = new FormData();
      formData.append("file", file, file.name);

      const timer = setInterval(() => {
        const elapsedTime = Date.now() - start;
        setTimerMs(elapsedTime);

        const calculatedProgress = Math.min((elapsedTime / estimatedUploadTime) * 90, 95);
        setProgress(calculatedProgress);
      }, 100);

      // Chunk streaming not working in production so we just sit and wait
      const { response, data } = await Workspace.uploadFile(slug, formData);
      clearInterval(timer);

      if (!response.ok) {
        setStatus("failed");
        onUploadError(data.error);
        setError(data.error);
        setProgress(0);
      } else {
        setStatus("complete");
        setProgress(100);
        onUploadSuccess();
      }

      setLoading(false);
      setLoadingMessage("");

      // Begin fadeout timer to clear uploader queue.
      setTimeout(() => fadeOut(() => setTimeout(() => beginFadeOut(), 300)), 5000);
    }
    !!file && !rejected && uploadFile();
  }, []);

  if (rejected) {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-error/40 light:bg-error/30 light:border-solid light:border-error/40 border border-transparent`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle
            color="var(--theme-bg-primary)"
            className="w-6 h-6 stroke-white bg-error rounded-full p-1 w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-white light:text-red-600 text-xs font-semibold">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-100 light:text-red-600 text-xs font-medium">
            {reason || "this file failed to upload"}
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-error/40 light:bg-error/30 light:border-solid light:border-error/40 border border-transparent`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle
            color="var(--theme-bg-primary)"
            className="w-6 h-6 stroke-white bg-error rounded-full p-1 w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-white light:text-red-600 text-xs font-semibold">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-100 light:text-red-600 text-xs font-medium">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFadingOut ? "file-upload-fadeout" : "file-upload"
      } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-zinc-800 light:border-solid light:border-theme-modal-border light:bg-theme-bg-sidebar border border-white/20 shadow-md`}
    >
      <div className="w-6 h-6 flex-shrink-0">
        {status !== "complete" ? (
          <div className="flex items-center justify-center">
            <PreLoader size="6" />
          </div>
        ) : (
          <CheckCircle
            color="var(--theme-bg-primary)"
            className="w-6 h-6 stroke-white bg-green-500 rounded-full p-1 w-full h-full"
          />
        )}
      </div>
      {/* <div className="flex flex-col">
        <p className="text-white light:text-theme-text-primary text-xs font-medium">
          {truncate(file.name, 30)}
        </p>
        <p className="text-white/80 light:text-theme-text-secondary text-xs font-medium">
          {humanFileSize(file.size)} | {milliToHms(timerMs)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div> */}
      <div className="flex flex-col w-full">
        <p className="text-white light:text-theme-text-primary text-xs font-medium truncate">
          {truncate(file.name, 30)}
        </p>
        <p className="text-white/80 light:text-theme-text-secondary text-xs font-medium w-[120px] truncate text-left">
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

export default memo(FileUploadProgressComponent);
