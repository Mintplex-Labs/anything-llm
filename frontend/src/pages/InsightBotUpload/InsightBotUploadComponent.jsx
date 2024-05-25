import { useEffect, useState } from "react";

import System from "@/models/system";
import { CloudArrowUp } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import InsightBotFileUploadProgressComponent from "./InsightBotFileUploadProgressComponent";

export default function InsightBotUploadFile({
  fetchKeys,
  setLoading,
  setLoadingMessage,
}) {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = async (acceptedFiles, rejections) => {
    const newAccepted = acceptedFiles.map((file) => {
      return {
        uid: v4(),
        file,
      };
    });
    const newRejected = rejections.map((file) => {
      return {
        uid: v4(),
        file: file.file,
        rejected: true,
        reason: file.errors[0].code,
      };
    });
    setFiles([...newAccepted, ...newRejected]);
  };

  useEffect(() => {
    async function checkProcessorOnline() {
      const online = await System.checkDocumentProcessorOnline();
      setReady(online);
    }
    checkProcessorOnline();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: !ready,
  });

  const handleUploadSuccess = debounce(() => fetchKeys(true), 1000);
  const handleUploadError = (_msg) => null;

  return (
    <div>
      <div
        className={`w-[560px] border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3 ${
          ready ? "cursor-pointer" : "cursor-not-allowed"
        } hover:bg-zinc-900/90`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {ready === false ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CloudArrowUp className="w-8 h-8 text-white/80" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              Document Processor Unavailable
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1 px-20 text-center">
              We can't upload your files right now because the document
              processor is offline. Please try again later.
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <CloudArrowUp className="w-8 h-8 text-white/80" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              Click to upload or drag and drop
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1">
              supports text files, csv's, spreadsheets, audio files, and more!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[180px] p-1 overflow-y-scroll no-scroll">
            {files.map((file) => (
              <InsightBotFileUploadProgressComponent
                key={file.uid}
                file={file.file}
                uuid={file.uid}
                setFiles={setFiles}
                rejected={file?.rejected}
                reason={file?.reason}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                setLoading={setLoading}
                setLoadingMessage={setLoadingMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
