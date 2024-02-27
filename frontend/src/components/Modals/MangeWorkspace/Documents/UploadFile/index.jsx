import { CloudArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import showToast from "../../../../../utils/toast";
import System from "../../../../../models/system";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import FileUploadProgress from "./FileUploadProgress";
import Workspace from "../../../../../models/workspace";

export default function UploadFile({ workspace, fetchKeys, setLoading }) {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFetchingUrl(true);
    const formEl = e.target;
    const form = new FormData(formEl);
    const { response, data } = await Workspace.uploadLink(
      workspace.slug,
      form.get("link")
    );
    if (!response.ok) {
      showToast(`Error uploading link: ${data.error}`, "error");
    } else {
      fetchKeys(true);
      showToast("Link uploaded successfully", "success");
      formEl.reset();
    }
    setLoading(false);
    setFetchingUrl(false);
  };

  const handleUploadSuccess = () => {
    fetchKeys(true);
    showToast("File uploaded successfully", "success", { clear: true });
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
              supports text files, csv's, spreadsheets, audio files, and more!
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
      <form onSubmit={handleSendLink} className="flex gap-x-2">
        <input
          disabled={fetchingUrl}
          name="link"
          type="url"
          className="disabled:bg-zinc-600 disabled:text-slate-300 bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5"
          placeholder={"https://example.com"}
          autoComplete="off"
        />
        <button
          disabled={fetchingUrl}
          type="submit"
          className="disabled:bg-white/20 disabled:text-slate-300 disabled:border-slate-400 disabled:cursor-wait bg bg-transparent hover:bg-slate-200 hover:text-slate-800 w-auto border border-white text-sm text-white p-2.5 rounded-lg transition-all duration-300"
        >
          {fetchingUrl ? "Fetching..." : "Fetch website"}
        </button>
      </form>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        These files will be uploaded to the document processor running on this
        AnythingLLM instance. These files are not sent or shared with a third
        party.
      </div>
    </div>
  );
}
