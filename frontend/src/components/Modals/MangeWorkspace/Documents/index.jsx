import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import WorkspacePicker from "./WorkspacePicker";
import MyDocumentsPicker from "./MyDocumentsPicker";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import Directory from "./Directory";

export default function DocumentSettings({ workspace, fileTypes }) {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isWorkspaceHighlighted, setIsWorkspaceHighlighted] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);
  const [fileDirectories, setFileDirectories] = useState([]);
  const [userHasFiles, setUserHasFiles] = useState(false);

  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
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
    setLoading(false);
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    console.log(selectedDocs);
  }, [selectedDocs]);

  return (
    <div className="flex gap-x-6 justify-center">
      {/* <MyDocumentsPicker fileDirectories={fileDirectories} loading={loading} /> */}
      <Directory
        files={fileDirectories}
        loading={loading}
        fileTypes={fileTypes}
        workspace={workspace}
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
