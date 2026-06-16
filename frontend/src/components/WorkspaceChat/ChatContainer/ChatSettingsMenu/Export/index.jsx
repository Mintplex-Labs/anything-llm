import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import moment from "moment";

const EXPORT_FORMATS = [
  { key: "pdf", label: "PDF", ext: "pdf" },
  { key: "markdown", label: "Markdown", ext: "md" },
];

export default function ExportRow({
  history = [],
  workspace = null,
  threadSlug = null,
  onClose,
}) {
  const { t } = useTranslation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleExport(format) {
    if (exporting || !workspace?.slug) return;
    setExporting(true);
    const blob = await Workspace.exportChatsToType(
      workspace.slug,
      threadSlug,
      format.key
    );
    if (blob) {
      const stamp = moment().format("YYYY-MM-DD HH:mm:ss");
      saveAs(blob, `AnythingLLM Export - ${stamp}.${format.ext}`);
    } else {
      showToast("Failed to export chat.", "error");
    }
    setExporting(false);
    onClose();
  }

  if (history.length === 0) return null;
  return (
    <div
      className="relative"
      onMouseEnter={() => setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <div
        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
          showSubmenu
            ? "bg-zinc-700 light:bg-slate-200"
            : "hover:bg-zinc-700 light:hover:bg-slate-200"
        }`}
      >
        <span className="text-sm font-normal text-zinc-50 light:text-slate-800">
          {exporting ? t("chat_window.exporting") : t("chat_window.export")}
        </span>
        <CaretRight
          size={14}
          weight="bold"
          className="text-zinc-50 light:text-slate-800"
        />
      </div>
      {showSubmenu && (
        <ExportSubmenu onSelect={handleExport} exporting={exporting} />
      )}
    </div>
  );
}

function ExportSubmenu({ onSelect, exporting }) {
  return (
    <div className="absolute right-full top-0 -mr-2 pr-2 pt-0">
      <div className="bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3.5 w-[120px] flex flex-col gap-1.5 shadow-lg">
        {EXPORT_FORMATS.map((format) => (
          <div
            key={format.key}
            onClick={() => !exporting && onSelect(format)}
            className={`px-2 py-1 rounded text-sm font-normal text-white light:text-slate-800 ${
              exporting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100"
            }`}
          >
            {format.label}
          </div>
        ))}
      </div>
    </div>
  );
}
