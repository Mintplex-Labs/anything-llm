import { memo } from "react";
import FileDownloadCard from "../../FileDownloadCard";

function HistoricalOutputs({ outputs = [] }) {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {outputs.map((output, index) => (
        <FileDownloadCard
          key={`${output.type}-${index}`}
          props={{ content: output.payload }}
        />
      ))}
    </div>
  );
}

export default memo(HistoricalOutputs);
