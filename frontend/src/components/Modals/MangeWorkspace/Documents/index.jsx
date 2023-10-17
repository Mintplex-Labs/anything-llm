import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import WorkspacePicker from "./WorkspacePicker";
import MyDocumentsPicker from "./MyDocumentsPicker";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";

export default function DocumentSettings({ workspace }) {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isWorkspaceHighlighted, setIsWorkspaceHighlighted] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);

  // State for the active workspace, might be used for further workspace-specific operations
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  const [fileDirectories, setFileDirectories] = useState([]);

  // State indicating if the user has any files in their local system or specific directory
  const [userHasFiles, setUserHasFiles] = useState(false);

  // Fetching documents and determining their initial state
  async function initializeDocuments(refetchWorkspace = false) {
    setIsLoading(true);
    const localFiles = await System.localFiles();
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(workspace.slug)
      : workspace;

    console.log("FILE DIRECTORIES: ", localFiles);
    console.log(currentWorkspace);

    const documentsInWorkspace =
      currentWorkspace.documents.map((doc) => doc.docpath) || [];
    const isAnyLocalFiles = localFiles.items.some(
      (folder) => folder?.items?.length > 0
    );

    setFileDirectories(localFiles);
    setWorkspaceDocs(documentsInWorkspace);
    setUserHasFiles(isAnyLocalFiles);
    setIsLoading(false);
  }

  useEffect(() => {
    initializeDocuments();
  }, []);

  const toggleDocSelection = (docId) => {
    setSelectedDocs((prevSelectedDocs) =>
      prevSelectedDocs.includes(docId)
        ? prevSelectedDocs.filter((id) => id !== docId)
        : [...prevSelectedDocs, docId]
    );
  };

  const handleMoveToWorkspace = () => {
    setAvailableDocs((prevDocs) =>
      prevDocs.map((doc) =>
        selectedDocs.includes(doc.id) ? { ...doc, location: 1 } : doc
      )
    );
    setSelectedDocs([]);
    setIsWorkspaceHighlighted(false);
  };

  useEffect(() => {
    console.log(selectedDocs);
  }, [selectedDocs]);

  return (
    <div className="flex gap-x-6 justify-center">
      <MyDocumentsPicker fileDirectories={fileDirectories} />
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
