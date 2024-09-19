import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function LiveSyncToggle({ enabled = false, onToggle }) {
  const [status, setStatus] = useState(enabled);
  const { t } = useTranslation();
  async function toggleFeatureFlag() {
    const updated = await System.experimentalFeatures.liveSync.toggleFeature(
      !status
    );
    if (!updated) {
      showToast(t("liveSyncToggle.toastMessage.failed"), "error", {
        clear: true,
      });
      return false;
    }

    setStatus(!status);
    showToast(
      t(`liveSyncToggle.toastMessage.${!status ? "enabled" : "disabled"}`),
      "success",
      { clear: true }
    );
    onToggle();
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-6 max-w-[500px]">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-md font-bold">
            {t("liveSyncToggle.title")}
          </h2>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              onClick={toggleFeatureFlag}
              checked={status}
              className="peer sr-only pointer-events-none"
            />
            <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
          </label>
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-white/90 text-sm">
            {t("liveSyncToggle.description1")}
          </p>
          <p className="text-white/90 text-sm">
            {t("liveSyncToggle.description2")}
          </p>
          <p className="text-white/80 text-xs italic">
            {t("liveSyncToggle.descriptionNote")}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.useanything.com/beta-preview/active-features/live-document-sync"
              target="_blank"
              className="text-sm text-blue-400 hover:underline flex items-center gap-x-1"
            >
              <ArrowSquareOut size={14} />
              <span>{t("liveSyncToggle.featureDocumentation")}</span>
            </a>
          </li>
          <li>
            <Link
              to={paths.experimental.liveDocumentSync.manage()}
              className="text-sm text-blue-400 hover:underline"
            >
              {t("liveSyncToggle.manageWatchedDocuments")} &rarr;
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
