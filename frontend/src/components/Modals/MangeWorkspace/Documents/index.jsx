import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import WorkspacePicker from "./WorkspacePicker";
import MyDocumentsPicker from "./MyDocumentsPicker";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import Directory from "./Directory";
import showToast from "../../../../utils/toast";

export default function DocumentSettings({ workspace, fileTypes }) {
  const [isWorkspaceHighlighted, setIsWorkspaceHighlighted] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);
  const [fileDirectories, setFileDirectories] = useState([]);
  const [userHasFiles, setUserHasFiles] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    const localFiles = await System.localFiles();
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(workspace.slug)
      : workspace;

    const documentsInWorkspace =
      currentWorkspace.documents.map((doc) => doc.docpath) || [];
    const isAnyLocalFiles = localFiles.items.some(
      (folder) => folder?.items?.length > 0
    );

    console.log("documentsInWorkspace: ", documentsInWorkspace);
    console.log("localFiles: ", localFiles);

    setFileDirectories(localFiles);
    setWorkspaceDocs(documentsInWorkspace);
    setUserHasFiles(isAnyLocalFiles);
    setLoading(false);
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const updateWorkspace = async (e) => {
    e.preventDefault();
    // setSaving(true);
    showToast("Updating workspace...", "info", { autoClose: false });
    // setShowConfirmation(false);

    const changes = docChanges();
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

    // setSaving(false);
    await fetchKeys(true);
  };


  const docChanges = () => {
    const changes = {
      adds: [
        "file:///Users/seanhatfield/Documents/Mintplex/anything-llm/collector/hotdir/processed/Aisq Pitch Deck.pdf",
        "file:///Users/seanhatfield/Documents/Mintplex/anything-llm/collector/hotdir/processed/Individual Report Amanda Hatfield.docx",
        "file:///Users/seanhatfield/Documents/Mintplex/anything-llm/collector/hotdir/processed/README TEST 2.md"
    ],
      deletes: [],
    };

    // selectedFiles.map((doc) => {
    //   const inOriginal = !!originalDocuments.find((oDoc) => oDoc === doc);
    //   if (!inOriginal) {
    //     changes.adds.push(doc);
    //   }
    // });

    // originalDocuments.map((doc) => {
    //   const selected = !!selectedFiles.find((oDoc) => oDoc === doc);
    //   if (!selected) {
    //     changes.deletes.push(doc);
    //   }
    // });

    return changes;
  };

  useEffect(() => {
    console.log("SELECTED ITEMS: ", selectedItems);
  }, [selectedItems]);

  return (
    <div className="flex gap-x-6 justify-center">
      {/* <MyDocumentsPicker fileDirectories={fileDirectories} loading={loading} /> */}
      <button onClick={updateWorkspace}>Update Workspace</button>
      <Directory
        files={fileDirectories}
        loading={loading}
        fileTypes={fileTypes}
        workspace={workspace}
        fetchKeys={fetchKeys}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <div className="flex items-center">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div>
      {/* <WorkspacePicker
        workspace={workspace}
        workspaceDocs={documentsInWorkspace}
        selectedDocs={selectedDocs}
        toggleDocSelection={toggleDocSelection}
        isWorkspaceHighlighted={isWorkspaceHighlighted}
        isLoading={isLoading}
      /> */}
    </div>
  );
}
