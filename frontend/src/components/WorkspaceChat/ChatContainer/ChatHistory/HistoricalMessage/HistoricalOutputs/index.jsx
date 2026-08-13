import { memo } from "react";
import FileDownloadCard from "../../FileDownloadCard";
import ImageGenerationCard from "../../ImageGenerationCard";
import ScheduledJobCreatedCard from "../../ScheduledJobCreatedCard";

function HistoricalOutputs({ outputs = [] }) {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {outputs.map((output, index) => {
        const key = `${output.type}-${index}`;
        const cardProps = { content: output.payload };
        if (output.type === "imageGenerationCard")
          return <ImageGenerationCard key={key} props={cardProps} />;
        if (output.type === "scheduledJobCreated")
          return <ScheduledJobCreatedCard key={key} props={cardProps} />;
        return <FileDownloadCard key={key} props={cardProps} />;
      })}
    </div>
  );
}

export default memo(HistoricalOutputs);
