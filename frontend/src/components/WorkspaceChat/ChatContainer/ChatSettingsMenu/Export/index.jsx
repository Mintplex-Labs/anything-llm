import { useState } from "react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import moment from "moment";

export default function ExportRow({
  history = [],
  workspace = null,
  threadSlug = null,
  onClose,
}) {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  async function handleClick() {
    if (exporting || !workspace?.slug) return;
    setExporting(true);
    const blob = await Workspace.exportChatsToType(
      workspace.slug,
      threadSlug,
      "pdf"
    );
    if (blob) {
      const stamp = moment().format("YYYY-MM-DD HH:mm:ss");
      saveAs(blob, `AnythingLLM Export - ${stamp}.pdf`);
    } else showToast("Failed to export chat.", "error");
    setExporting(false);
    onClose();
  }

  if (history.length === 0) return null;
  return (
    <div
      onClick={handleClick}
      className="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200"
    >
      <span className="text-sm font-normal text-white light:text-slate-800">
        {exporting ? t("chat_window.exporting") : t("chat_window.export")}
      </span>
    </div>
  );
}
