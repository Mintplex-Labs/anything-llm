import { useTranslation } from "react-i18next";
import WorkspaceThread from "@/models/workspaceThread";
import printChatThread from "@/utils/chat/printThread";

export default function ExportRow({
  history = [],
  workspace = null,
  threadSlug = null,
  onClose,
}) {
  const { t } = useTranslation();

  async function handleClick() {
    let threadName = "";
    if (threadSlug && workspace?.slug) {
      const { threads = [] } = await WorkspaceThread.all(workspace.slug);
      threadName = threads.find((t) => t.slug === threadSlug)?.name ?? "";
    }
    printChatThread({ history, workspaceName: workspace?.name, threadName });
    onClose();
  }

  if (history.length === 0) return null;

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200"
    >
      <span className="text-sm font-normal text-white light:text-slate-800">
        {t("chat_window.export")}
      </span>
    </div>
  );
}
