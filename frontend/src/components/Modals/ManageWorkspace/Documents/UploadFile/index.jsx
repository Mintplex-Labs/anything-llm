import { CloudArrowUp } from "@phosphor-icons/react";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import showToast from "../../../../../utils/toast";
import System from "../../../../../models/system";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import { FixedSizeList as List } from "react-window";
import FileUploadProgress from "./FileUploadProgress";
import PreflightModal from "./PreflightModal";
import Workspace from "../../../../../models/workspace";
import debounce from "lodash.debounce";

export default function UploadFile({
  workspace,
  fetchKeys,
  setLoading,
  setLoadingMessage,
  libraryEnabled = false,
}) {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState({});
  const [showPreflight, setShowPreflight] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Scraping link...");
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

  // Queue all fetchKeys calls through the same debouncer to prevent spamming the server.
  // either a success or error will trigger a fetchKeys call so the UI is not stuck loading.
  const debouncedFetchKeys = debounce(() => fetchKeys(true), 1000);
  const handleUploadSuccess = () => debouncedFetchKeys();
  const handleUploadError = () => debouncedFetchKeys();

  const onDrop = async (acceptedFiles, rejections) => {
    setPendingFiles({ accepted: acceptedFiles, rejected: rejections });
    if (acceptedFiles.length > 0) {
      setShowPreflight(true);
    } else {
      const newRejected = rejections.map((file) => ({
        uid: v4(),
        file: file.file,
        rejected: true,
        reason: file.errors[0].code,
      }));
      setFiles(newRejected);
    }
  };

  const confirmUpload = (policy) => {
    const newAccepted = (pendingFiles.accepted || []).map((file) => ({
      uid: v4(),
      file,
      policy,
    }));
    const newRejected = (pendingFiles.rejected || []).map((file) => ({
      uid: v4(),
      file: file.file,
      rejected: true,
      reason: file.errors[0].code,
    }));
    setFiles([...newAccepted, ...newRejected]);
    setPendingFiles({});
    setShowPreflight(false);
  };

  const cancelUpload = () => {
    setPendingFiles({});
    setShowPreflight(false);
  };

  useEffect(() => {
    async function checkProcessorOnline() {
      const online = await System.checkDocumentProcessorOnline();
      setReady(online);
    }
    checkProcessorOnline();
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    disabled: !ready,
  });

  const Row = ({ index, style, data }) => {
    const {
      files,
      slug,
      setFiles,
      handleUploadSuccess,
      handleUploadError,
      setLoading,
      setLoadingMessage,
    } = data;
    const left = files[index * 2];
    const right = files[index * 2 + 1];
    return (
      <div style={style} className="flex gap-2 px-1">
        {left && (
          <FileUploadProgress
            key={left.uid}
            file={left.file}
            policy={left.policy}
            uuid={left.uid}
            setFiles={setFiles}
            slug={slug}
            rejected={left?.rejected}
            reason={left?.reason}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            setLoading={setLoading}
            setLoadingMessage={setLoadingMessage}
          />
        )}
        {right && (
          <FileUploadProgress
            key={right.uid}
            file={right.file}
            policy={right.policy}
            uuid={right.uid}
            setFiles={setFiles}
            slug={slug}
            rejected={right?.rejected}
            reason={right?.reason}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            setLoading={setLoading}
            setLoadingMessage={setLoadingMessage}
          />
        )}
      </div>
    );
  };

  const rowCount = useMemo(() => Math.ceil(files.length / 2), [files]);

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
        <input {...getInputProps({ webkitdirectory: true })} />
        {ready === false ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CloudArrowUp className="w-8 h-8 text-foreground/80 light:invert" />
            <div className="text-foreground text-opacity-80 text-sm font-semibold py-1">
              {t("connectors.upload.processor-offline")}
            </div>
            <div className="text-foreground text-opacity-60 text-xs font-medium py-1 px-20 text-center">
              {t("connectors.upload.processor-offline-desc")}
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <CloudArrowUp className="w-8 h-8 text-foreground/80 light:invert" />
            <div className="text-foreground text-opacity-80 text-sm font-semibold py-1">
              {t("connectors.upload.click-upload")}
            </div>
            <div className="text-foreground text-opacity-60 text-xs font-medium py-1">
              {t("connectors.upload.file-types")}
            </div>
          </div>
        ) : (
          <List
            height={180}
            itemCount={rowCount}
            itemSize={64}
            width={560}
            itemData={{
              files,
              slug: workspace.slug,
              setFiles,
              handleUploadSuccess,
              handleUploadError,
              setLoading,
              setLoadingMessage,
            }}
            className="overflow-auto no-scroll"
          >
            {Row}
          </List>
        )}
      </div>
      <button
        type="button"
        onClick={open}
        disabled={!ready}
        className="mt-3 w-[560px] bg-primary-button text-foreground rounded-sm py-2 disabled:opacity-50"
      >
        {t("connectors.upload.upload-button", "Upload")}
      </button>
      <div className="text-center text-foreground text-opacity-50 text-xs font-medium w-[560px] py-2">
        {t("connectors.upload.or-submit-link")}
      </div>
      <form onSubmit={handleSendLink} className="flex gap-x-2">
        <input
          disabled={fetchingUrl}
          name="link"
          type="url"
          className="border-none disabled:bg-theme-settings-input-bg disabled:text-theme-settings-input-placeholder bg-theme-settings-input-bg text-foreground placeholder:text-theme-settings-input-placeholder text-sm rounded-sm focus:outline-primary-button active:outline-primary-button outline-none block w-3/4 p-2.5"
          placeholder={t("connectors.upload.placeholder-link")}
          autoComplete="off"
        />
        <button
          disabled={fetchingUrl}
          type="submit"
          className="disabled:bg-card disabled:text-foreground disabled:border-slate-400 disabled:cursor-wait bg bg-transparent hover:bg-card hover:text-foreground w-auto border border-border light:border-theme-modal-border text-sm text-foreground p-2.5 rounded-sm"
        >
          {fetchingUrl
            ? t("connectors.upload.fetching")
            : t("connectors.upload.fetch-website")}
        </button>
      </form>
      <div className="mt-6 text-center text-foreground text-opacity-80 text-xs font-medium w-[560px]">
        {t("connectors.upload.privacy-notice")}
      </div>
      {showPreflight && (
        <PreflightModal
          files={pendingFiles.accepted || []}
          onConfirm={confirmUpload}
          onCancel={cancelUpload}
          libraryEnabled={libraryEnabled}
        />
      )}
    </div>
  );
}
