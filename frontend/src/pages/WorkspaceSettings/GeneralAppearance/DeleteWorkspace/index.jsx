import { useState } from "react";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";
import showToast from "@/utils/toast";

export default function DeleteWorkspace({ workspace }) {
  const { slug } = useParams();
  const [deleting, setDeleting] = useState(false);
  const { t } = useTranslation();

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `${t("general.delete.confirm-start")} ${workspace.name} ${t(
          "general.delete.confirm-end"
        )}`
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
  return (
    <div className="flex flex-col mt-10">
      <label className="block input-label">{t("general.delete.title")}</label>
      <p className="text-theme-text-secondary text-xs font-medium py-1.5">
        {t("general.delete.description")}
      </p>
      <button
        disabled={deleting}
        onClick={deleteWorkspace}
        type="button"
        className="w-60 mt-4 transition-all duration-300 border border-transparent rounded-lg whitespace-nowrap text-sm px-5 py-2.5 focus:z-10 bg-red-500/25 text-red-200 light:text-red-500 hover:light:text-[#FFFFFF] hover:text-[#FFFFFF] hover:bg-red-600 disabled:bg-red-600 disabled:text-red-200 disabled:animate-pulse"
      >
        {deleting ? t("general.delete.deleting") : t("general.delete.delete")}
      </button>
    </div>
  );
}
