import { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

/**
 * Live-sync watch state for a document embedded in a workspace.
 * @param {object} params
 * @param {{slug: string}} params.workspace
 * @param {string} params.docPath `folder/file.json` path of the document
 * @param {object} params.item the document record
 * @returns {{watched: boolean, toggleWatch: (e?: Event) => Promise<void>}}
 */
export default function useWatchDocument({ workspace, docPath, item }) {
  const [watched, setWatched] = useState(item?.watched || false);

  const toggleWatch = async (e) => {
    try {
      e?.stopPropagation();
      if (!watched)
        window.dispatchEvent(new CustomEvent("watch_document_for_changes"));
      const success =
        await System.experimentalFeatures.liveSync.setWatchStatusForDocument(
          workspace.slug,
          docPath,
          !watched
        );

      if (!success) {
        showToast(
          `Failed to ${!watched ? "watch" : "unwatch"} document.`,
          "error",
          {
            clear: true,
          }
        );
        return;
      }

      showToast(
        `Document ${
          !watched
            ? "will be watched for changes"
            : "will no longer be watched for changes"
        }.`,
        "success",
        { clear: true }
      );
      setWatched(!watched);
    } catch (error) {
      showToast(`Failed to watch document. ${error.message}`, "error", {
        clear: true,
      });
      return;
    }
  };

  return { watched, toggleWatch };
}
