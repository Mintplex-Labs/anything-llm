import { useState } from "react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";

export default function ResetDatabase({ workspace }) {
  const [deleting, setDeleting] = useState(false);

  const resetVectorDatabase = async () => {
    if (
      !window.confirm(
        `You are about to reset this workspace's vector database. This will remove all vector embeddings currently embedded.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;

    setDeleting(true);
    const success = await Workspace.wipeVectorDb(workspace.slug);
    if (!success) {
      showToast("Workspace vector database could not be reset!", "error", {
        clear: true,
      });
      setDeleting(false);
      return;
    }

    showToast("Workspace vector database was reset!", "success", {
      clear: true,
    });
    setDeleting(false);
  };

  return (
    <button
      disabled={deleting}
      onClick={resetVectorDatabase}
      type="button"
      className="border-none w-fit transition-all duration-300 border border-transparent rounded-lg whitespace-nowrap text-sm px-5 py-2.5 focus:z-10 bg-red-500/25 text-red-200 hover:text-white hover:bg-red-600 disabled:bg-red-600 disabled:text-red-200 disabled:animate-pulse"
    >
      {deleting ? "Clearing vectors..." : "Reset Workspace Vector Database"}
    </button>
  );
}
