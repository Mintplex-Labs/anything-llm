import { CloudArrowUp } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import showToast from "../../../../../utils/toast";
import { useDropzone } from "react-dropzone";
import FileUploadProgress from "./FileUploadProgress";
import Workspace from "../../../../../models/workspace";
import debounce from "lodash.debounce";
import { getFilesFromUploadEvent } from "../../../../../utils/folderUpload";

/**
 * Fills in a missing protocol so the user can type "example.com/docs" instead
 * of the full URL. Anything already carrying a scheme is left alone.
 * @param {string} value raw input value
 * @returns {string|null} the URL to scrape, or null if it cannot be one
 */
function withProtocol(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    new URL(candidate);
    return candidate;
  } catch {
    return null;
  }
}

/**
 * @param {object} props
 * @param {ReturnType<import("../hooks/useUploadQueue").default>} props.queue
 * the upload queue shared with the picker's per-folder drop targets, so both
 * report progress in this one list.
 * @param {() => Promise<void>} props.onUploadComplete called (coalesced) once a
 * burst of file uploads settles, so the picker can hydrate in place.
 * @param {() => Promise<void>} props.onLinkScraped called after a link scrape.
 */
export default function UploadFile({
  workspace,
  queue,
  onUploadComplete,
  onLinkScraped,
}) {
  const { t } = useTranslation();
  const { ready, files, setFiles, enqueueDrop } = queue;
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleSendLink = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    const form = new FormData(formEl);
    const link = withProtocol(form.get("link"));
    if (!link) return showToast("Please enter a valid link", "error");

    setFetchingUrl(true);
    const { response, data } = await Workspace.uploadLink(workspace.slug, link);
    if (!response.ok) {
      showToast(`Error uploading link: ${data.error}`, "error");
    } else {
      await onLinkScraped();
      showToast("Link uploaded successfully", "success");
      formEl.reset();
    }
    setFetchingUrl(false);
  };

  // Uploads finish one at a time; coalesce their completions into a single
  // picker sync so a 50-file folder drop does not fire 50 refreshes.
  const syncPicker = useMemo(
    () => debounce(() => onUploadComplete?.(), 750),
    [onUploadComplete]
  );
  useEffect(() => () => syncPicker.cancel(), [syncPicker]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: enqueueDrop,
    disabled: !ready,
    getFilesFromEvent: getFilesFromUploadEvent,
  });

  return (
    <div>
      <div
        className={`w-[560px] border-dashed border-[2px] border-theme-modal-border light:border-[#686C6F] rounded-2xl bg-theme-bg-primary transition-colors duration-300 p-3 ${
          ready
            ? " light:bg-[#E0F2FE] cursor-pointer hover:bg-theme-bg-secondary light:hover:bg-transparent"
            : "cursor-not-allowed"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {ready === false ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CloudArrowUp className="w-8 h-8 text-white/80 light:invert" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              {t("connectors.upload.processor-offline")}
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1 px-20 text-center">
              {t("connectors.upload.processor-offline-desc")}
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <CloudArrowUp className="w-8 h-8 text-white/80 light:invert" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              {t("connectors.upload.click-upload")}
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1">
              {t("connectors.upload.file-types")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[180px] p-1 overflow-y-scroll no-scroll">
            {files.map((file) => (
              <FileUploadProgress
                key={file.uid}
                file={file.file}
                uuid={file.uid}
                setFiles={setFiles}
                slug={workspace.slug}
                rejected={file?.rejected}
                reason={file?.reason}
                folderName={file?.folderName}
                relativePath={file?.relativePath}
                onSettled={syncPicker}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-center text-white text-opacity-50 text-xs font-medium w-[560px] py-2">
        {t("connectors.upload.or-submit-link")}
      </div>
      <form onSubmit={handleSendLink} className="flex gap-x-2">
        <input
          disabled={fetchingUrl}
          name="link"
          // Not type="url" - that would force the user to type the protocol.
          type="text"
          inputMode="url"
          className="border-none disabled:bg-theme-settings-input-bg disabled:text-theme-settings-input-placeholder bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-3/4 p-2.5"
          placeholder={t("connectors.upload.placeholder-link")}
          autoComplete="off"
        />
        <button
          disabled={fetchingUrl}
          type="submit"
          className="disabled:bg-white/20 disabled:text-slate-300 disabled:border-slate-400 disabled:cursor-wait bg bg-transparent hover:bg-slate-200 hover:text-slate-800 w-auto border border-white light:border-theme-modal-border text-sm text-white p-2.5 rounded-lg"
        >
          {fetchingUrl
            ? t("connectors.upload.fetching")
            : t("connectors.upload.fetch-website")}
        </button>
      </form>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        {t("connectors.upload.privacy-notice")}
      </div>
    </div>
  );
}
