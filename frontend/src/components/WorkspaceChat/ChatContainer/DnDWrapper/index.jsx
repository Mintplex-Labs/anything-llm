import { useState, useEffect, createContext, useContext } from "react";
import { v4 } from "uuid";
import System from "@/models/system";
import { useDropzone } from "react-dropzone";
import DndIcon from "./dnd-icon.png";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import FileUploadWarningModal from "./FileUploadWarningModal";
import pluralize from "pluralize";

export const DndUploaderContext = createContext();
export const REMOVE_ATTACHMENT_EVENT = "ATTACHMENT_REMOVE";
export const CLEAR_ATTACHMENTS_EVENT = "ATTACHMENT_CLEAR";
export const PASTE_ATTACHMENT_EVENT = "ATTACHMENT_PASTED";
export const ATTACHMENTS_PROCESSING_EVENT = "ATTACHMENTS_PROCESSING";
export const ATTACHMENTS_PROCESSED_EVENT = "ATTACHMENTS_PROCESSED";
export const PARSED_FILE_ATTACHMENT_REMOVED_EVENT =
  "PARSED_FILE_ATTACHMENT_REMOVED";

/**
 * File Attachment for automatic upload on the chat container page.
 * @typedef Attachment
 * @property {string} uid - unique file id.
 * @property {File} file - native File object
 * @property {string|null} contentString - base64 encoded string of file
 * @property {('in_progress'|'failed'|'embedded'|'added_context')} status - the automatic upload status.
 * @property {string|null} error - Error message
 * @property {{id:string, location:string}|null} document - uploaded document details
 * @property {('attachment'|'upload')} type - The type of upload. Attachments are chat-specific, uploads go to the workspace.
 */

/**
 * @typedef {Object} ParsedFile
 * @property {number} id - The id of the parsed file.
 * @property {string} filename - The name of the parsed file.
 * @property {number} workspaceId - The id of the workspace the parsed file belongs to.
 * @property {string|null} userId - The id of the user the parsed file belongs to.
 * @property {string|null} threadId - The id of the thread the parsed file belongs to.
 * @property {string} metadata - The metadata of the parsed file.
 * @property {number} tokenCountEstimate - The estimated token count of the parsed file.
 */

export function DnDFileUploaderProvider({
  workspace,
  threadSlug = null,
  children,
}) {
  const [files, setFiles] = useState([]);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedProgress, setEmbedProgress] = useState(0);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [maxTokens, setMaxTokens] = useState(Number.POSITIVE_INFINITY);

  useEffect(() => {
    System.checkDocumentProcessorOnline().then((status) => setReady(status));
  }, []);

  useEffect(() => {
    window.addEventListener(REMOVE_ATTACHMENT_EVENT, handleRemove);
    window.addEventListener(CLEAR_ATTACHMENTS_EVENT, resetAttachments);
    window.addEventListener(PASTE_ATTACHMENT_EVENT, handlePastedAttachment);
    window.addEventListener(
      PARSED_FILE_ATTACHMENT_REMOVED_EVENT,
      handleRemoveParsedFile
    );

    return () => {
      window.removeEventListener(REMOVE_ATTACHMENT_EVENT, handleRemove);
      window.removeEventListener(CLEAR_ATTACHMENTS_EVENT, resetAttachments);
      window.removeEventListener(
        PARSED_FILE_ATTACHMENT_REMOVED_EVENT,
        handleRemoveParsedFile
      );
      window.removeEventListener(
        PASTE_ATTACHMENT_EVENT,
        handlePastedAttachment
      );
    };
  }, []);

  /**
   * Handles the removal of a parsed file attachment from the uploader queue.
   * Only uses the document id to remove the file from the queue
   * @param {CustomEvent<{document: ParsedFile}>} event
   */
  async function handleRemoveParsedFile(event) {
    const { document } = event.detail;
    setFiles((prev) =>
      prev.filter((prevFile) => prevFile.document.id !== document.id)
    );
  }

  /**
   * Remove file from uploader queue.
   * @param {CustomEvent<{uid: string}>} event
   */
  async function handleRemove(event) {
    /** @type {{uid: Attachment['uid'], document: Attachment['document']}} */
    const { uid, document } = event.detail;
    setFiles((prev) => prev.filter((prevFile) => prevFile.uid !== uid));
    if (!document?.location) return;
    await Workspace.deleteAndUnembedFile(workspace.slug, document.location);
  }

  /**
   * Clear queue of attached files currently in prompt box
   */
  function resetAttachments() {
    setFiles([]);
  }

  /**
   * Turns files into attachments we can send as body request to backend
   * for a chat.
   * @returns {{name:string,mime:string,contentString:string}[]}
   */
  function parseAttachments() {
    return (
      files
        ?.filter((file) => file.type === "attachment")
        ?.map(
          (
            /** @type {Attachment} */
            attachment
          ) => {
            return {
              name: attachment.file.name,
              mime: attachment.file.type,
              contentString: attachment.contentString,
            };
          }
        ) || []
    );
  }

  /**
   * Handle pasted attachments.
   * @param {CustomEvent<{files: File[]}>} event
   */
  async function handlePastedAttachment(event) {
    const { files = [] } = event.detail;
    if (!files.length) return;
    const newAccepted = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        newAccepted.push({
          uid: v4(),
          file,
          contentString: await toBase64(file),
          status: "success",
          error: null,
          type: "attachment",
        });
      } else {
        newAccepted.push({
          uid: v4(),
          file,
          contentString: null,
          status: "in_progress",
          error: null,
          type: "upload",
        });
      }
    }
    setFiles((prev) => [...prev, ...newAccepted]);
    embedEligibleAttachments(newAccepted);
  }

  /**
   * Handle dropped files.
   * @param {Attachment[]} acceptedFiles
   * @param {any[]} _rejections
   */
  async function onDrop(acceptedFiles, _rejections) {
    setDragging(false);

    /** @type {Attachment[]} */
    const newAccepted = [];
    for (const file of acceptedFiles) {
      if (file.type.startsWith("image/")) {
        newAccepted.push({
          uid: v4(),
          file,
          contentString: await toBase64(file),
          status: "success",
          error: null,
          type: "attachment",
        });
      } else {
        newAccepted.push({
          uid: v4(),
          file,
          contentString: null,
          status: "in_progress",
          error: null,
          type: "upload",
        });
      }
    }

    setFiles((prev) => [...prev, ...newAccepted]);
    embedEligibleAttachments(newAccepted);
  }

  /**
   * Embeds attachments that are eligible for embedding - basically files that are not images.
   * @param {Attachment[]} newAttachments
   */
  async function embedEligibleAttachments(newAttachments = []) {
    window.dispatchEvent(new CustomEvent(ATTACHMENTS_PROCESSING_EVENT));
    const promises = [];

    const { currentContextTokenCount, contextWindow } =
      await Workspace.getParsedFiles(workspace.slug, threadSlug);
    const workspaceContextWindow = contextWindow
      ? Math.floor(contextWindow * Workspace.maxContextWindowLimit)
      : Number.POSITIVE_INFINITY;
    setMaxTokens(workspaceContextWindow);

    let totalTokenCount = currentContextTokenCount;
    let batchPendingFiles = [];

    for (const attachment of newAttachments) {
      // Images/attachments are chat specific.
      if (attachment.type === "attachment") continue;

      const formData = new FormData();
      formData.append("file", attachment.file, attachment.file.name);
      formData.append("threadSlug", threadSlug || null);
      promises.push(
        Workspace.parseFile(workspace.slug, formData).then(
          async ({ response, data }) => {
            if (!response.ok) {
              const updates = {
                status: "failed",
                error: data?.error ?? null,
              };
              setFiles((prev) =>
                prev.map(
                  (
                    /** @type {Attachment} */
                    prevFile
                  ) =>
                    prevFile.uid !== attachment.uid
                      ? prevFile
                      : { ...prevFile, ...updates }
                )
              );
              return;
            }
            // Will always be one file in the array
            /** @type {ParsedFile} */
            const file = data.files[0];

            // Add token count for this file
            // and add it to the batch pending files
            totalTokenCount += file.tokenCountEstimate;
            batchPendingFiles.push({
              attachment,
              parsedFileId: file.id,
              tokenCount: file.tokenCountEstimate,
            });

            if (totalTokenCount > workspaceContextWindow) {
              setTokenCount(totalTokenCount);
              setPendingFiles(batchPendingFiles);
              setShowWarningModal(true);
              return;
            }

            // File is within limits, keep in parsed files
            const result = { success: true, document: file };
            const updates = {
              status: result.success ? "added_context" : "failed",
              error: result.error ?? null,
              document: result.document,
            };

            setFiles((prev) =>
              prev.map(
                (
                  /** @type {Attachment} */
                  prevFile
                ) =>
                  prevFile.uid !== attachment.uid
                    ? prevFile
                    : { ...prevFile, ...updates }
              )
            );
          }
        )
      );
    }

    // Wait for all promises to resolve in some way before dispatching the event to unlock the send button
    Promise.all(promises).finally(() =>
      window.dispatchEvent(new CustomEvent(ATTACHMENTS_PROCESSED_EVENT))
    );
  }

  // Handle modal actions
  const handleCloseModal = async () => {
    if (!pendingFiles.length) return;

    // Delete all files from this batch
    await Workspace.deleteParsedFiles(
      workspace.slug,
      pendingFiles.map((file) => file.parsedFileId)
    );

    // Remove all files from this batch from the UI
    setFiles((prev) =>
      prev.filter(
        (prevFile) =>
          !pendingFiles.some((file) => file.attachment.uid === prevFile.uid)
      )
    );
    setShowWarningModal(false);
    setPendingFiles([]);
    setTokenCount(0);
    window.dispatchEvent(new CustomEvent(ATTACHMENTS_PROCESSED_EVENT));
  };

  const handleContinueAnyway = async () => {
    if (!pendingFiles.length) return;
    const results = pendingFiles.map((file) => ({
      success: true,
      document: { id: file.parsedFileId },
    }));

    const fileUpdates = pendingFiles.map((file, i) => ({
      uid: file.attachment.uid,
      updates: {
        status: results[i].success ? "success" : "failed",
        error: results[i].error ?? null,
        document: results[i].document,
      },
    }));

    setFiles((prev) =>
      prev.map((prevFile) => {
        const update = fileUpdates.find((f) => f.uid === prevFile.uid);
        return update ? { ...prevFile, ...update.updates } : prevFile;
      })
    );
    setShowWarningModal(false);
    setPendingFiles([]);
    setTokenCount(0);
  };

  const handleEmbed = async () => {
    if (!pendingFiles.length) return;
    setIsEmbedding(true);
    setEmbedProgress(0);

    // Embed all pending files
    let completed = 0;
    const results = await Promise.all(
      pendingFiles.map((file) =>
        Workspace.embedParsedFile(workspace.slug, file.parsedFileId).then(
          (result) => {
            completed++;
            setEmbedProgress(completed);
            return result;
          }
        )
      )
    );

    // Update status for all files
    const fileUpdates = pendingFiles.map((file, i) => ({
      uid: file.attachment.uid,
      updates: {
        status: results[i].response.ok ? "embedded" : "failed",
        error: results[i].data?.error ?? null,
        document: results[i].data?.document,
      },
    }));

    setFiles((prev) =>
      prev.map((prevFile) => {
        const update = fileUpdates.find((f) => f.uid === prevFile.uid);
        return update ? { ...prevFile, ...update.updates } : prevFile;
      })
    );
    setShowWarningModal(false);
    setPendingFiles([]);
    setTokenCount(0);
    setIsEmbedding(false);
    window.dispatchEvent(new CustomEvent(ATTACHMENTS_PROCESSED_EVENT));
    showToast(
      `${pendingFiles.length} ${pluralize("file", pendingFiles.length)} embedded successfully`,
      "success"
    );
  };

  return (
    <DndUploaderContext.Provider
      value={{ files, ready, dragging, setDragging, onDrop, parseAttachments }}
    >
      <FileUploadWarningModal
        show={showWarningModal}
        onClose={handleCloseModal}
        onContinue={handleContinueAnyway}
        onEmbed={handleEmbed}
        tokenCount={tokenCount}
        maxTokens={maxTokens}
        fileCount={pendingFiles.length}
        isEmbedding={isEmbedding}
        embedProgress={embedProgress}
      />
      {children}
    </DndUploaderContext.Provider>
  );
}

export default function DnDFileUploaderWrapper({ children }) {
  const { onDrop, ready, dragging, setDragging } =
    useContext(DndUploaderContext);
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
      className={`relative flex flex-col h-full w-full md:mt-0 mt-[40px] p-[1px]`}
      {...getRootProps()}
    >
      <div
        hidden={!dragging}
        className="absolute top-0 w-full h-full bg-dark-text/90 light:bg-[#C2E7FE]/90 rounded-2xl border-[4px] border-white z-[9999]"
      >
        <div className="w-full h-full flex justify-center items-center rounded-xl">
          <div className="flex flex-col gap-y-[14px] justify-center items-center">
            <img
              src={DndIcon}
              width={69}
              height={69}
              alt="Drag and drop icon"
            />
            <p className="text-white text-[24px] font-semibold">Add anything</p>
            <p className="text-white text-[16px] text-center">
              Drop a file or image here to attach it to your <br />
              workspace auto-magically.
            </p>
          </div>
        </div>
      </div>
      <input id="dnd-chat-file-uploader" {...getInputProps()} />
      {children}
    </div>
  );
}

/**
 * Convert image types into Base64 strings for requests.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(`data:${file.type};base64,${base64String}`);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
