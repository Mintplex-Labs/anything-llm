import { memo } from "react";
import FileDownloadCard from "../../FileDownloadCard";

function FileDownloadOutput({ payload }) {
  return <FileDownloadCard props={{ content: payload }} />;
}

const OUTPUT_RENDERERS = {
  PptxFileDownload: FileDownloadOutput,
  TextFileDownload: FileDownloadOutput,
};

function HistoricalOutputs({ outputs = [] }) {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {outputs.map((output, index) => {
        const Renderer = OUTPUT_RENDERERS[output.type];
        if (!Renderer) return null;
        return (
          <Renderer key={`${output.type}-${index}`} payload={output.payload} />
        );
      })}
    </div>
  );
}

export default memo(HistoricalOutputs);
