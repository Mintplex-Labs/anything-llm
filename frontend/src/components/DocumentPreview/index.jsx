import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import { X, DownloadSimple, CircleNotch } from "@phosphor-icons/react";
import { humanFileSize } from "@/utils/numbers";
import StorageFiles from "@/models/files";
import { usePreview } from "./PreviewContext";

/**
 * DocumentPreviewModal
 * ----------------------------------------------------------------------------
 * Panel xem trước trượt từ bên phải (desktop ~nửa màn hình, mobile full).
 * Vì API yêu cầu token trong header (iframe không gắn header được), ta TẢI PDF
 * xem-trước thành Blob qua StorageFiles.preview() rồi tạo objectURL cho iframe.
 *
 * Quy ước theme của dự án: mặc định là dark, biến thể `light:` cho light-mode.
 */
export default function DocumentPreviewModal() {
  const { t } = useTranslation();
  const { current, close } = usePreview();

  const [shown, setShown] = useState(false); // điều khiển hiệu ứng trượt
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);
  const urlRef = useRef(null);

  // Tải blob PDF xem trước mỗi khi mở file mới
  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    setObjectUrl(null);

    (async () => {
      const blob = await StorageFiles.preview(current.storageFilename);
      if (cancelled) return;
      if (!blob) {
        setError(true);
        setLoading(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setObjectUrl(url);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [current]);

  // Hiệu ứng trượt vào + Esc để đóng + khoá cuộn nền
  useEffect(() => {
    if (!current) {
      setShown(false);
      return;
    }
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [current, close]);

  if (!current) return null;

  const previewUrl = `/agent-skills/generated-files/${current.storageFilename}/preview`;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await StorageFiles.download(current.storageFilename);
      if (!blob) throw new Error("Failed to download file");
      saveAs(blob, current.filename || current.storageFilename);
    } catch {
      console.error("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true">
      {/* Nền mờ */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel bên phải */}
      <div
        className={`relative ml-auto flex h-full w-full flex-col bg-zinc-900 light:bg-white shadow-2xl transition-transform duration-300 ease-out md:w-[55%] lg:w-[48%] xl:w-[44%] ${
          shown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-x-3 border-b border-zinc-700 light:border-slate-200 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white light:text-slate-900">
              {current.filename || t("filePreview.title", "Xem trước tài liệu")}
            </p>
            {current.fileSize ? (
              <p className="truncate text-xs text-zinc-400 light:text-slate-500">
                {humanFileSize(current.fileSize, true, 1)}
              </p>
            ) : null}
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-x-2 rounded-lg border border-zinc-600 light:border-theme-sidebar-border px-4 py-2 text-sm font-medium text-white light:text-theme-text-primary transition-colors hover:bg-zinc-700 light:hover:bg-theme-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? (
              <CircleNotch size={16} weight="bold" className="animate-spin" />
            ) : (
              <DownloadSimple size={16} weight="bold" />
            )}
            <span className="hidden sm:inline">
              {downloading
                ? t("filePreview.downloading", "Đang tải...")
                : t("filePreview.download", "Tải xuống")}
            </span>
          </button>

          <button
            onClick={close}
            aria-label={t("filePreview.close", "Đóng")}
            className="rounded-lg p-2 text-zinc-400 light:text-slate-500 transition-colors hover:bg-zinc-700 light:hover:bg-slate-100 hover:text-white light:hover:text-slate-900"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="relative flex-1 overflow-hidden bg-zinc-800 light:bg-slate-100">
          {objectUrl && !error && (
            <iframe
              key={objectUrl}
              src={objectUrl}
              title={current.filename || "preview"}
              className="h-full w-full border-0 bg-white"
            />
          )}

          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-3">
              <CircleNotch
                size={28}
                weight="bold"
                className="animate-spin text-white light:text-slate-500"
              />
              <p className="text-sm text-zinc-400 light:text-slate-500">
                {t("filePreview.loading", "Đang tải bản xem trước…")}
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 px-6 text-center">
              <p className="text-sm text-zinc-300 light:text-slate-600">
                {t(
                  "filePreview.error",
                  "Không tạo được bản xem trước cho tệp này."
                )}
              </p>
              <div className="flex gap-x-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-zinc-600 light:border-slate-300 px-3 py-1.5 text-sm text-white light:text-slate-700 hover:bg-zinc-700 light:hover:bg-slate-100"
                >
                  {t("filePreview.openNewTab", "Mở ở tab mới")}
                </a>
                <button
                  onClick={handleDownload}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  {t("filePreview.download", "Tải xuống")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
