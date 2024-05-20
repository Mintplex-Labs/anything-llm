import { useState } from "react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function ResetDatabase({ workspace }) {
  const [deleting, setDeleting] = useState(false);
  const { t } = useTranslation();
  const resetVectorDatabase = async () => {
    if (!window.confirm(`${t("vector-workspace.reset.confirm")}`)) return false;

    setDeleting(true);
    const success = await Workspace.wipeVectorDb(workspace.slug);
    if (!success) {
      showToast(
        t("vector-workspace.reset.error"),
        t("vector-workspace.common.error"),
        {
          clear: true,
        }
      );
      setDeleting(false);
      return;
    }

    showToast(
      t("vector-workspace.reset.success"),
      t("vector-workspace.common.success"),
      {
        clear: true,
      }
    );
    setDeleting(false);
  };

  return (
    <button
      disabled={deleting}
      onClick={resetVectorDatabase}
      type="button"
      className="border-none w-fit transition-all duration-300 border border-transparent rounded-lg whitespace-nowrap text-sm px-5 py-2.5 focus:z-10 bg-red-500/25 text-red-200 hover:text-white hover:bg-red-600 disabled:bg-red-600 disabled:text-red-200 disabled:animate-pulse"
    >
      {deleting
        ? t("vector-workspace.reset.resetting")
        : t("vector-workspace.reset.reset")}
    </button>
  );
}
