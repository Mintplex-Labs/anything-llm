import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import Directory from "./Directory";
import showToast from "../../../../utils/toast";
import WorkspaceDirectory from "./WorkspaceDirectory";

export default function DocumentSettings({ workspace, fileTypes }) {
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);
  const [fileDirectories, setFileDirectories] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    const localFiles = await System.localFiles();
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(workspace.slug)
      : workspace;

    const documentsInWorkspace =
      currentWorkspace.documents.map((doc) => doc.docpath) || [];

    // Documents that are not in the workspace
    const availableDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                !documentsInWorkspace.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    // Documents that are already in the workspace
    const workspaceDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                documentsInWorkspace.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    console.log("workspaceDocs: ", workspaceDocs);
    console.log("availableDocs: ", availableDocs);

    setAvailableDocs(availableDocs);
    setWorkspaceDocs(workspaceDocs);
    setFileDirectories(localFiles);
    setLoading(false);
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const updateWorkspace = async (e) => {
    e.preventDefault();
    setLoading(true);
    showToast("Updating workspace...", "info", { autoClose: false });

    const changes = docChanges();
    setSelectedItems({});
    setHighlightWorkspace(false);
    await Workspace.modifyEmbeddings(workspace.slug, changes)
      .then((res) => {
        if (res && res.workspace) {
          showToast("Workspace updated successfully.", "success", {
            clear: true,
          });
        } else {
          showToast("Workspace update failed.", "error", { clear: true });
        }
      })
      .catch((error) => {
        showToast(`Workspace update failed: ${error}`, "error", {
          clear: true,
        });
      });

    setLoading(false);
    await fetchKeys(true);
  };

  const docChanges = () => {
    const changes = {
      adds: [],
      deletes: [],
    };

    if (!fileDirectories.items) return changes;

    fileDirectories.items.forEach((folder) => {
      if (folder.items) {
        folder.items.forEach((file) => {
          if (file.type === "file" && selectedItems[file.id]) {
            const path = `${folder.name}/${file.name}`;
            changes.adds.push(path);
          }
        });
      }
    });

    return changes;
  };

  useEffect(() => {
    console.log("SELECTED ITEMS: ", selectedItems);
    console.log("FILE DIRECTORIES: ", fileDirectories);
    console.log("CURRENT CHANGES: ", docChanges());
  }, [selectedItems, fileDirectories]);

  return (
    <div className="flex gap-x-6 justify-center">
      <Directory
        files={availableDocs}
        loading={loading}
        setLoading={setLoading}
        fileTypes={fileTypes}
        workspace={workspace}
        fetchKeys={fetchKeys}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        updateWorkspace={updateWorkspace}
        highlightWorkspace={highlightWorkspace}
        setHighlightWorkspace={setHighlightWorkspace}
        moveToWorkspace={updateWorkspace}
      />
      <div className="flex items-center">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div>
      <WorkspaceDirectory
        workspace={workspace}
        files={workspaceDocs}
        highlightWorkspace={highlightWorkspace}
        loading={loading}
        setLoading={setLoading}
        fetchKeys={fetchKeys}
      />
    </div>
  );
}
