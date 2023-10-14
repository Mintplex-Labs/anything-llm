import { ArrowsDownUp, CloudArrowUp, Plus } from "@phosphor-icons/react";
import DocumentRow from "./DocumentRow";
import { useEffect, useState } from "react";
import WorkspacePicker from "./WorkspacePicker";
import UploadFile from "./UploadFile";
import MyDocumentsPicker from "./MyDocumentsPicker";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";

export default function DocumentSettings({ workspace }) {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  function transformToLocalFileDocument(localFileItem) {
    return {
        id: localFileItem.id,
        name: localFileItem.title,
        date: localFileItem.published,
        size: 'Unknown', // size is not provided in the given data structure
        kind: localFileItem.docSource,
        cached: localFileItem.cached,
        location: 0, // assuming all local files are in 'My Documents'
        path: localFileItem.url,
    };
}


  // Get original documents from API (list of ids)
  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    const localFiles = await System.localFiles();
    // const currentWorkspace = refetchWorkspace
    //   ? await Workspace.bySlug(slug ?? workspace.slug)
    //   : workspace;
    // const originalDocs =
    //   currentWorkspace.documents.map((doc) => doc.docpath) || [];
    // const hasAnyFiles = localFiles.items.some(
    //   (folder) => folder?.items?.length > 0
    // );


    const transformedDocuments = localFiles.items.flatMap(folder =>
        folder.items.map(transformToLocalFileDocument)
    );
    setAllDocuments(transformedDocuments);

    setLoading(false);

    console.log(localFiles.items);


    // setDirectories(localFiles);
    // setOriginalDocuments([...originalDocs]);
    // setSelectFiles([...originalDocs]);
    // setHasFiles(hasAnyFiles);
    // setLoading(false);
  }

  useEffect(() => {
    fetchKeys();
  }, []);



  const toggleDocumentSelection = (documentId) => {
    setSelectedDocumentIds((prevSelectedDocumentIds) =>
      prevSelectedDocumentIds.includes(documentId)
        ? prevSelectedDocumentIds.filter((id) => id !== documentId)
        : [...prevSelectedDocumentIds, documentId]
    );
  };

  const moveToWorkspace = () => {
    setAllDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        selectedDocumentIds.includes(doc.id) ? { ...doc, location: 1 } : doc
      )
    );
    setSelectedDocumentIds([]);
    setHighlightWorkspace(false);
  };

  useEffect(() => {
    console.log(selectedDocumentIds);
  }, [selectedDocumentIds]);

  const myDocuments = allDocuments.filter((doc) => doc.location === 0);
  const workspaceDocuments = allDocuments.filter((doc) => doc.location === 1);

  return (
    <div className="flex gap-x-6 justify-center">
      <MyDocumentsPicker
        myDocuments={myDocuments}
        selectedDocumentIds={selectedDocumentIds}
        toggleDocumentSelection={toggleDocumentSelection}
        moveToWorkspace={moveToWorkspace}
        setHighlightWorkspace={setHighlightWorkspace}
        loading={loading}
      />
      <div className="flex items-center">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div>
      <WorkspacePicker
        workspace={workspace}
        workspaceDocuments={workspaceDocuments}
        selectedDocumentIds={selectedDocumentIds}
        toggleDocumentSelection={toggleDocumentSelection}
        highlightWorkspace={highlightWorkspace}
        loading={loading}
      />
    </div>
  );
}
