import { useState, useEffect } from "react";
import { v4 } from "uuid";
import System from "@/models/system";
import { useDropzone } from "react-dropzone";
import { FileText } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import useUser from "@/hooks/useUser";
export const REMOVE_ATTACHMENT_EVENT = "ATTACHMENT_REMOVE";
export const CLEAR_ATTACHMENTS_EVENT = "ATTACHMENT_CLEAR";

/**
 * File Attachment for automatic upload on the chat container page.
 * @typedef Attachment
 * @property {string} uid - unique file id.
 * @property {File} file - native File object
 * @property {('in_progress'|'failed'|'success')} status - the automatic upload status.
 * @property {string|null} error - Error message
 * @property {{id:string, location:string}|null} document - uploaded document details
 */

export default function DnDFileUploaderWrapper({ workspace, children }) {
  /** @type {[Attachment[], Function]} */
  const [files, setFiles] = useState([]);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!!user && user.role === "default") return false;
    System.checkDocumentProcessorOnline().then((status) => setReady(status));
  }, [user]);

  useEffect(() => {
    window.addEventListener(REMOVE_ATTACHMENT_EVENT, handleRemove);
    window.addEventListener(CLEAR_ATTACHMENTS_EVENT, resetAttachments);

    return () => {
      window.removeEventListener(REMOVE_ATTACHMENT_EVENT, handleRemove);
      window.removeEventListener(CLEAR_ATTACHMENTS_EVENT, resetAttachments);
    };
  }, []);

  /**
   * Remove file from uploader queue.
   * @param {CustomEvent<{uid: string}>} event
   */
  async function handleRemove(event) {
    /** @type {{uid: Attachment['uid'], document: Attachment['document']}} */
    const { uid, document } = event.detail;
    setFiles((prev) => prev.filter((prevFile) => prevFile.uid !== uid));
    await Workspace.deleteAndUnembedFile(workspace.slug, document.location);
  }

  /**
   * Clear queue of attached files currently in prompt box
   */
  function resetAttachments() {
    setFiles([]);
  }

  async function onDrop(acceptedFiles, _rejections) {
    setDragging(false);
    /** @type {Attachment[]} */
    const newAccepted = acceptedFiles.map((file) => {
      return {
        uid: v4(),
        file,
        status: "in_progress",
        error: null,
      };
    });
    setFiles((prev) => [...prev, ...newAccepted]);

    for (const attachment of newAccepted) {
      const formData = new FormData();
      formData.append("file", attachment.file, attachment.file.name);
      Workspace.uploadAndEmbedFile(workspace.slug, formData).then(
        ({ response, data }) => {
          const updates = {
            status: response.ok ? "success" : "failed",
            error: data?.error ?? null,
            document: data?.document,
          };

          setFiles((prev) => {
            return prev.map(
              (
                /** @type {Attachment} */
                prevFile
              ) => {
                if (prevFile.uid !== attachment.uid) return prevFile;
                return { ...prevFile, ...updates };
              }
            );
          });
        }
      );
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: !ready,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
  });

  return (
    <div
      className={`relative flex flex-col h-full w-full md:mt-0 mt-[40px]`}
      {...getRootProps()}
    >
      <div
        hidden={!dragging}
        className="absolute top-0 w-full h-full bg-zinc-900/75 z-[9999]"
      >
        <div className="w-full h-full flex justify-center items-center rounded-xl">
          <div className="flex flex-col gap-y-1 justify-center items-center">
            <FileText className="text-zinc-100" size={80} />
            <p className="text-white/80 text-xl font-semibold">Add anything</p>
            <p className="text-white/80 text-sm">
              Drop your file here to embed it into your workspace
              auto-magically.
            </p>
          </div>
        </div>
      </div>
      <input {...getInputProps()} />
      {children(files, setFiles)}
    </div>
  );
}
