import { memo } from "react";
import FileDownloadCard from "../../FileDownloadCard";

function HistoricalOutputs({ outputs = [] }) {
  if (!outputs || outputs.length === 0) return null;

  // Older chats could store the same generated file twice (once as a raw
  // fileDownloadCard payload, once as a typed output) - keep one card per file.
  const seen = new Set();
  const files = outputs
    .map((output) => output?.payload || output)
    .filter((payload) => {
      const key = payload?.storageFilename || payload?.filename;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return (
    <div className="flex flex-col gap-2 mt-4">
      {files.map((payload, index) => (
        <FileDownloadCard key={index} props={{ content: payload }} />
      ))}
    </div>
  );
}

export default memo(HistoricalOutputs);
