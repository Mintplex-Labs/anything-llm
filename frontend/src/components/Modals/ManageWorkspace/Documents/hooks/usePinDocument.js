import { useState } from "react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";

/**
 * Pin state for a document embedded in a workspace.
 * @param {object} params
 * @param {{slug: string, id: number}} params.workspace
 * @param {string} params.docPath `folder/file.json` path of the document
 * @param {object} params.item the document record
 * @returns {{pinned: boolean, togglePin: (e?: Event) => Promise<void>}}
 */
export default function usePinDocument({ workspace, docPath, item }) {
  const [pinned, setPinned] = useState(
    item?.pinnedWorkspaces?.includes(workspace.id) || false
  );

  const togglePin = async (e) => {
    try {
      e?.stopPropagation();
      if (!pinned) window.dispatchEvent(new CustomEvent("pinned_document"));
      const success = await Workspace.setPinForDocument(
        workspace.slug,
        docPath,
        !pinned
      );

      if (!success) {
        showToast(`Failed to ${!pinned ? "pin" : "unpin"} document.`, "error", {
          clear: true,
        });
        return;
      }

      showToast(
        `Document ${!pinned ? "pinned to" : "unpinned from"} workspace`,
        "success",
        { clear: true }
      );
      setPinned(!pinned);
    } catch (error) {
      showToast(`Failed to pin document. ${error.message}`, "error", {
        clear: true,
      });
      return;
    }
  };

  return { pinned, togglePin };
}
