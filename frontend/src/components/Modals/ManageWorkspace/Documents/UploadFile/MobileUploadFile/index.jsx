import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LinkSimple, UploadSimple } from "@phosphor-icons/react";
import FileUploadProgress from "../FileUploadProgress";

/**
 * Touch layout of the uploader. Upload logic stays in `UploadFile`.
 *
 * @param {Object} props
 * @param {boolean} props.ready - Document processor is online
 * @param {object} props.inputProps - `getInputProps()` from the dropzone
 */
export default function MobileUploadFile({
  ready,
  uploads,
  setFiles,
  slug,
  openFilePicker,
  inputProps,
  fetchingUrl,
  onSubmitLink,
  onSettled,
}) {
  const { t } = useTranslation();
  const [showLinkForm, setShowLinkForm] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <input {...inputProps} />
      <div className="grid grid-cols-2 gap-x-2">
        <UploadButton
          icon={UploadSimple}
          label={t("connectors.directory.upload-files")}
          disabled={!ready}
          onClick={openFilePicker}
        />
        <UploadButton
          icon={LinkSimple}
          label={t("connectors.directory.add-link")}
          active={showLinkForm}
          onClick={() => setShowLinkForm(!showLinkForm)}
        />
      </div>
      {!ready && (
        <p className="text-xs text-zinc-400 light:text-slate-500">
          {t("connectors.upload.processor-offline")}
        </p>
      )}
      {showLinkForm && (
        <form onSubmit={onSubmitLink} className="flex gap-x-2">
          <input
            disabled={fetchingUrl}
            name="link"
            // Not type="url" - that would force the user to type the protocol.
            type="text"
            inputMode="url"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            placeholder={t("connectors.upload.placeholder-link")}
            className="flex-1 min-w-0 h-11 px-3.5 rounded-xl text-base outline-none border border-transparent bg-zinc-800 light:bg-slate-100 text-slate-50 light:text-slate-900 placeholder:text-zinc-500 light:placeholder:text-slate-400 focus:border-sky-500 disabled:opacity-50"
          />
          <button
            disabled={fetchingUrl}
            type="submit"
            className="border-none h-11 px-4 rounded-xl text-sm font-semibold shrink-0 bg-zinc-50 light:bg-slate-900 text-zinc-950 light:text-white transition-transform duration-100 active:scale-[0.97] disabled:opacity-50"
          >
            {fetchingUrl
              ? t("connectors.upload.fetching")
              : t("connectors.upload.fetch-website")}
          </button>
        </form>
      )}
      {uploads.length > 0 && (
        <div className="flex flex-col gap-y-2 max-h-[136px] overflow-y-auto no-scroll">
          {uploads.map((file) => (
            <FileUploadProgress
              key={file.uid}
              file={file.file}
              uuid={file.uid}
              setFiles={setFiles}
              slug={slug}
              rejected={file?.rejected}
              reason={file?.reason}
              folderName={file?.folderName}
              relativePath={file?.relativePath}
              onSettled={onSettled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UploadButton({ icon: Icon, label, onClick, disabled, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border-none h-11 rounded-xl flex items-center justify-center gap-x-2 text-sm font-medium transition-[transform,background-color] duration-150 active:scale-[0.97] disabled:opacity-50 ${
        active
          ? "bg-sky-500/15 text-sky-300 light:bg-sky-50 light:text-sky-700"
          : "bg-zinc-800 light:bg-slate-100 text-slate-50 light:text-slate-900"
      }`}
    >
      <Icon size={18} weight="bold" />
      {label}
    </button>
  );
}
