import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import System from "@/models/system";

export default function DeleteWorkspace({ workspace }) {
  const { slug } = useParams();
  const [deleting, setDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    async function fetchKeys() {
      const canDelete = await System.getCanDeleteWorkspaces();
      setCanDelete(canDelete);
    }
    fetchKeys();
  }, [workspace?.slug]);

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;

    setDeleting(true);
    const success = await Workspace.delete(workspace.slug);
    if (!success) {
      showToast("Workspace could not be deleted!", "error", { clear: true });
      setDeleting(false);
      return;
    }

    workspace.slug === slug
      ? (window.location = paths.home())
      : window.location.reload();
  };

  if (!canDelete) return null;
  return (
    <button
      disabled={deleting}
      onClick={deleteWorkspace}
      type="button"
      className="w-60 mt-[40px] transition-all duration-300 border border-transparent rounded-lg whitespace-nowrap text-sm px-5 py-2.5 focus:z-10 bg-red-500/25 text-red-200 hover:text-white hover:bg-red-600 disabled:bg-red-600 disabled:text-red-200 disabled:animate-pulse"
    >
      {deleting ? "Deleting Workspace..." : "Delete Workspace"}
    </button>
  );
}
