import { CloudArrowUp } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import showToast from "../../../../../utils/toast";
import System from "../../../../../models/system";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import FileUploadProgress from "./FileUploadProgress";
import Workspace from "../../../../../models/workspace";

export default function UploadFile({ workspace, fileTypes, fetchKeys, setLoading }) {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [validLink, setValidLink] = useState(false);

  const handleSendLink = async () => {
    setLoading(true);
    const { response, data } = await Workspace.uploadLink(workspace.slug, link);
    if (!response.ok) {
      showToast(`Error uploading link: ${data.error}`, "error");
    } else {
      fetchKeys(true);
      showToast("Link uploaded successfully", "success");
    }
    setLoading(false);
  };

  const handleUploadSuccess = () => {
    fetchKeys(true);
    showToast("File uploaded successfully", "success");
  };

  const handleUploadError = (message) => {
    showToast(`Error uploading file: ${message}`, "error");
  };

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

    setFiles([...files, ...newAccepted, ...newRejected]);
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
    accept: {
      ...fileTypes,
    },
    disabled: !ready,
  });

  return (
    <div>
      <div
        className={`transition-all duration-300 w-[560px] border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3 ${
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
              Supported file extensions are{" "}
              {Object.values(fileTypes ?? [])
                .flat()
                .join(" ")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[400px] p-1 overflow-y-auto">
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
      <div className="text-center text-white text-opacity-50 text-xs font-medium w-[560px] py-2">
        or submit a link
      </div>
      <div className="flex gap-x-2">
        <input
          className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          placeholder={"https://en.wikipedia.org/wiki/Node.js"}
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
        <button
          onClick={handleSendLink}
          className="bg-transparent hover:bg-slate-200 hover:text-slate-800 border border-white text-sm text-white p-2.5 rounded-lg transition-all duration-300"
        >
          Process
        </button>
      </div>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        These files will be uploaded to the document processor running on this
        AnythingLLM instance. These files are not sent or shared with a third
        party.
      </div>
    </div>
  );
}
