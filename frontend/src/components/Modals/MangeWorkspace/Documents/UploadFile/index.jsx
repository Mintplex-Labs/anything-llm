import { CloudArrowUp } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import showToast from "../../../../../utils/toast";
import System from "../../../../../models/system";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import FileUploadProgress from "./FileUploadProgress";

export default function UploadFile({ workspace, fileTypes }) {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);

  const handleUploadSuccess = () => {
    showToast("File uploaded successfully", "success");
  };

  const handleUploadError = (message) => {
    showToast(`Error uploading file: ${message}`, "error");
  };

  const onDrop = useCallback(async (acceptedFiles, rejections) => {
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

    setFiles([...files, ...newAccepted, ...newRejected]);
  }, []);

  useEffect(() => {
    async function checkProcessorOnline() {
      const online = await System.checkDocumentProcessorOnline();
      setReady(online);
      console.log("PROCESSOR ONLINE: ", online);
    }
    checkProcessorOnline();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      ...fileTypes,
    },
  });

  return (
    <div>
      <div
        className="transition-all duration-300 w-[560px] border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3 cursor-pointer hover:bg-zinc-900/90"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <CloudArrowUp className="w-8 h-8 text-white/80" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              Click to upload or drag and drop
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1">
              Supported file extensions are .mbox .pdf .odt .docx .txt .md
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full p-4 gap-y-2">
            {files.map((file) => (
              <FileUploadProgress
                key={file.uid}
                file={file.file}
                slug={workspace.slug}
                rejected={file?.rejected}
                reason={file?.reason}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        These files will be uploaded to the document processor running on this
        AnythingLLM instance. These files are not sent or shared with a third
        party.
      </div>
    </div>
  );
}
