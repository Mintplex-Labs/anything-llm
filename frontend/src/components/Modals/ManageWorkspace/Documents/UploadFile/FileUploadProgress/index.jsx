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
  folderName = null,
  relativePath = null,
  onSettled,
}) {
  const [timerMs, setTimerMs] = useState(10);
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!file || rejected) return;

    let unmounted = false;
    let timer;
    let fadeTimer;
    let removeTimer;

    async function uploadFile() {
      const start = Number(new Date());
      const formData = new FormData();

      // folderName/metadata MUST be appended before the file part - multer
      // only populates request.body with text fields it saw before the file,
      // so reordering these silently breaks folder uploads server-side.
      if (!!folderName && !!relativePath) {
        formData.append("folderName", folderName);
        formData.append(
          "metadata",
          JSON.stringify({ title: relativePath, docSource: relativePath })
        );
        // Flatten the relative path into the upload name so files from
        // different subfolders that share a basename cannot clobber each
        // other in the document processor's hotdir mid-upload.
        formData.append("file", file, relativePath.replace(/\//g, "_"));
      } else {
        formData.append("file", file, file.name);
      }

      timer = setInterval(() => {
        setTimerMs(Number(new Date()) - start);
      }, 100);

      const fallbackError = "This file failed to upload.";
      let uploadError = null;
      try {
        const { response, data } = await Workspace.uploadFile(slug, formData);
        if (!response.ok) uploadError = data?.error || fallbackError;
      } catch {
        uploadError = fallbackError;
      } finally {
        clearInterval(timer);
      }

      if (!unmounted) {
        setStatus(uploadError ? "failed" : "complete");
        if (uploadError) setError(uploadError);

        // Let the result sit for a beat, fade it, then drop it from the queue.
        fadeTimer = setTimeout(() => {
          setIsFadingOut(true);
          removeTimer = setTimeout(
            () => setFiles((prev) => prev.filter((i) => i.uid !== uuid)),
            300
          );
        }, 5000);
      }
      onSettled?.();
    }

    uploadFile();
    return () => {
      unmounted = true;
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
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
            {truncate(relativePath || file.name, 30)}
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
            {truncate(relativePath || file.name, 30)}
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
      <div className="flex flex-col">
        <p className="text-white light:text-theme-text-primary text-xs font-medium">
          {truncate(relativePath || file.name, 30)}
        </p>
        <p className="text-white/80 light:text-theme-text-secondary text-xs font-medium">
          {humanFileSize(file.size)} | {milliToHms(timerMs)}
        </p>
      </div>
    </div>
  );
}

export default memo(FileUploadProgressComponent);
