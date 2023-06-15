import React, { useState, useEffect, memo } from "react";
import Workspace from "../../../../../models/workspace";
import truncate from "truncate";
import { humanFileSize } from "../../../../../utils/numbers";
import { CheckCircle } from "react-feather";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function FileUploadProgressComponent({ slug, file }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("uploading");

  useEffect(() => {
    async function uploadFile() {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await Workspace.uploadFile(slug, formData);

      const total = Number(file.size / 1_000); // approximate size
      let loaded = 0;

      const _res = new Response(
        new ReadableStream({
          async start(controller) {
            const reader = response.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              loaded += value.byteLength;
              setProgress(parseFloat(loaded / total) * 100);
              controller.enqueue(value);
            }
            controller.close();
          },
        })
      );
      setStatus("complete");
    }
    !!file && uploadFile();
  }, []);

  return (
    <div className="w-fit px-2 py-2 flex items-center gap-x-4 rounded-lg bg-blue-100 border-blue-600 dark:bg-stone-800 bg-opacity-50 border dark:border-stone-600">
      <div className="w-6 h-6">
        {status !== "complete" ? (
          <CircularProgressbar
            value={progress}
            strokeWidth={50}
            styles={buildStyles({
              pathColor: `#0891b2`,
              strokeLinecap: "butt",
            })}
          />
        ) : (
          <CheckCircle className="stroke-white bg-green-500 rounded-full p-1 w-full h-full" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-black dark:text-stone-200 text-sm font-mono overflow-x-scroll">
          {truncate(file.name, 30)}
        </p>
        <p className="text-gray-700 dark:text-stone-400 text-xs font-mono">
          {humanFileSize(file.size)} | {progress >= 100 ? 100 : progress}%
        </p>
      </div>
    </div>
  );
}

export default memo(FileUploadProgressComponent);
