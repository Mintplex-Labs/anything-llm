import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LiveSyncToggle({ enabled = false }) {
  const [status, setStatus] = useState(enabled);

  async function toggleFeatureFlag() {
    const updated = await System.experimentalFeatures.liveSync.toggleFeature(
      !status
    );
    if (!updated) {
      showToast(`Failed to update status of feature.`, "error", {
        clear: true,
      });
      return false;
    }

    setStatus(!status);
    showToast(
      `Live document content sync has been ${
        !status ? "enabled" : "disabled"
      }.`,
      "success",
      { clear: true }
    );
  }

  return (
    <div className="relative w-full max-h-full">
      <div className="relative rounded-lg">
        <div className="flex items-start justify-between px-6 py-4"></div>
        <div className="space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div className="">
              <label className="mb-2.5 block font-medium text-white">
                Automatic document content sync
              </label>
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
          </div>
        </div>
        <div className="flex flex-col items-left space-y-2">
          <p className="text-white/80 text-xs rounded-lg w-96">
            Enable the ability to specify a document to be "watched". Watched
            document's content will be regularly fetched and updated in
            AnythingLLM.
          </p>
          <p className="text-white/80 text-xs rounded-lg w-96">
            Watched documents will automatically update the in all workspaces it
            is referenced in at the same time of update.
          </p>
          <p className="text-white/80 text-xs rounded-lg w-96 italic">
            this feature only applies to web-based content. eg: Websites,
            Confluence, YouTube, and Github files.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 my-2">
        <a
          href="https://docs.useanything.com/beta-preview/active-features/live-document-sync"
          target="_blank"
          className="text-sm text-white rounded-full hover:underline flex items-center gap-x-2"
        >
          Feature documentation and warnings <ArrowSquareOut size={14} />
        </a>
        <Link
          to={paths.experimental.liveDocumentSync.manage()}
          className="text-sm text-white rounded-full hover:underline"
        >
          Manage watched documents &rarr;
        </Link>
      </div>
    </div>
  );
}
