import { humanFileSize, milliToHms } from "@/utils/numbers";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import React, { memo, useEffect, useState } from "react";

import PreLoader from "@/components/Preloader";
import truncate from "truncate";

function InsightBotFileUploadProgressComponent({
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
        setTimerMs(Number(new Date()) - start);
      }, 100);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          setStatus("failed");
          clearInterval(timer);
          onUploadError(data.error);
          setError(data.error);
        } else {
          setLoading(false);
          setLoadingMessage("");
          setStatus("complete");
          clearInterval(timer);
          onUploadSuccess();
        }
      } catch (error) {
        setStatus("failed");
        clearInterval(timer);
        onUploadError(error.message);
        setError(error.message);
      }

      setTimeout(() => {
        fadeOut(() => setTimeout(() => beginFadeOut(), 300));
      }, 5000);
    }
    !!file && !rejected && uploadFile();
  }, []);

  if (rejected) {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle className="w-6 h-6 stroke-white bg-red-500 rounded-full p-1 w-full h-full" />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs font-medium">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-400 text-xs font-medium">{reason}</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`${
          isFadingOut ? "file-upload-fadeout" : "file-upload"
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40 overflow-y-auto`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle className="w-6 h-6 stroke-white bg-red-500 rounded-full p-1 w-full h-full" />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs font-medium">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-400 text-xs font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFadingOut ? "file-upload-fadeout" : "file-upload"
      } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40`}
    >
      <div className="w-6 h-6 flex-shrink-0">
        {status !== "complete" ? (
          <div className="flex items-center justify-center">
            <PreLoader size="6" />
          </div>
        ) : (
          <CheckCircle className="w-6 h-6 stroke-white bg-green-500 rounded-full p-1 w-full h-full" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-white text-xs font-medium">
          {truncate(file.name, 30)}
        </p>
        <p className="text-white/60 text-xs font-medium">
          {humanFileSize(file.size)} | {milliToHms(timerMs)}
        </p>
      </div>
    </div>
  );
}

export default memo(InsightBotFileUploadProgressComponent);
