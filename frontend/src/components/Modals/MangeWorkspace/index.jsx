import React, { useState, useEffect } from "react";
import { X } from "react-feather";
import System from "../../../models/system";
import Workspace from "../../../models/workspace";
import paths from "../../../utils/paths";
import { useParams } from "react-router-dom";
import Directory from "./Directory";
import ConfirmationModal from "./ConfirmationModal";
import CannotRemoveModal from "./CannotRemoveModal";

const noop = () => false;
export default function ManageWorkspace({ hideModal = noop, workspace }) {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [directories, setDirectories] = useState(null);
  const [originalDocuments, setOriginalDocuments] = useState([]);
  const [selectedFiles, setSelectFiles] = useState([]);
  const [vectordb, setVectorDB] = useState(null);
  const [showingNoRemovalModal, setShowingNoRemovalModal] = useState(false);

  useEffect(() => {
    async function fetchKeys() {
      const _workspace = await Workspace.bySlug(workspace.slug);
      const localFiles = await System.localFiles();
      const settings = await System.keys();
      const originalDocs = _workspace.documents.map((doc) => doc.docpath) || [];
      setDirectories(localFiles);
      setOriginalDocuments([...originalDocs]);
      setSelectFiles([...originalDocs]);
      setVectorDB(settings?.VectorDB);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;
    await Workspace.delete(workspace.slug);
    workspace.slug === slug
      ? (window.location = paths.home())
      : window.location.reload();
  };

  const docChanges = () => {
    const changes = {
      adds: [],
      deletes: [],
    };

    selectedFiles.map((doc) => {
      const inOriginal = !!originalDocuments.find((oDoc) => oDoc === doc);
      if (!inOriginal) {
        changes.adds.push(doc);
      }
    });

    originalDocuments.map((doc) => {
      const selected = !!selectedFiles.find((oDoc) => oDoc === doc);
      if (!selected) {
        changes.deletes.push(doc);
      }
    });

    return changes;
  };

  const confirmChanges = (e) => {
    e.preventDefault();
    const changes = docChanges();
    changes.adds.length > 0 ? setShowConfirmation(true) : updateWorkspace(e);
  };

  const updateWorkspace = async (e) => {
    e.preventDefault();
    setSaving(true);
    setShowConfirmation(false);
    const changes = docChanges();
    await Workspace.modifyEmbeddings(workspace.slug, changes);
    setSaving(false);
    window.location.reload();
  };

  const isSelected = (filepath) => {
    const isFolder = !filepath.includes("/");
    return isFolder
      ? selectedFiles.some((doc) => doc.includes(filepath.split("/")[0]))
      : selectedFiles.some((doc) => doc.includes(filepath));
  };

  const isOriginalDoc = (filepath) => {
    const isFolder = !filepath.includes("/");
    return isFolder
      ? originalDocuments.some((doc) => doc.includes(filepath.split("/")[0]))
      : originalDocuments.some((doc) => doc.includes(filepath));
  };

  const toggleSelection = (filepath) => {
    const isFolder = !filepath.includes("/");
    const parent = isFolder ? filepath : filepath.split("/")[0];

    if (isSelected(filepath)) {
      // Certain vector DBs do not contain the ability to delete vectors
      // so we cannot remove from these. The user will have to clear the entire workspace.
      if (["lancedb"].includes(vectordb) && isOriginalDoc(filepath)) {
        setShowingNoRemovalModal(true);
        return false;
      }

      const updatedDocs = isFolder
        ? selectedFiles.filter((doc) => !doc.includes(parent))
        : selectedFiles.filter((doc) => !doc.includes(filepath));
      setSelectFiles([...new Set(updatedDocs)]);
    } else {
      var newDocs = [];
      if (isFolder) {
        const folderItems = directories.items.find(
          (item) => item.name === parent
        ).items;
        newDocs = folderItems.map((item) => parent + "/" + item.name);
      } else {
        newDocs = [filepath];
      }

      const combined = [...selectedFiles, ...newDocs];
      setSelectFiles([...new Set(combined)]);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div
          className="flex fixed top-0 left-0 right-0 w-full h-full"
          onClick={hideModal}
        />
        <div className="relative w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {workspace.name} Settings
              </h3>
              <button
                onClick={hideModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="staticModal"
              >
                <X className="text-gray-300 text-lg" />
              </button>
            </div>
            <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
              <div className="flex flex-col gap-y-1 w-full">
                <p className="text-slate-200 dark:text-stone-300 text-center">
                  loading workspace files
                </p>
              </div>
            </div>
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConfirmation && (
        <ConfirmationModal
          directories={directories}
          hideConfirm={() => setShowConfirmation(false)}
          additions={docChanges().adds}
          updateWorkspace={updateWorkspace}
        />
      )}
      {showingNoRemovalModal && (
        <CannotRemoveModal
          hideModal={() => setShowingNoRemovalModal(false)}
          vectordb={vectordb}
        />
      )}
      <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div
          className="flex fixed top-0 left-0 right-0 w-full h-full"
          onClick={hideModal}
        />
        <div className="relative w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                "{workspace.name}" workspace settings
              </h3>
              <button
                onClick={hideModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="staticModal"
              >
                <X className="text-gray-300 text-lg" />
              </button>
            </div>
            <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex flex-col mb-2">
                  <p className="text-gray-800 dark:text-stone-200 text-base ">
                    Select folders to add or remove from workspace.
                  </p>
                  <p className="text-gray-800 dark:text-stone-400 text-xs italic">
                    {selectedFiles.length} documents in workspace selected.
                  </p>
                </div>
                <div className="w-full h-auto border border-slate-200 dark:border-stone-600 rounded-lg px-4 py-2">
                  {!!directories && (
                    <Directory
                      files={directories}
                      toggleSelection={toggleSelection}
                      isSelected={isSelected}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={deleteWorkspace}
                type="button"
                className="border border-transparent text-gray-500 bg-white hover:bg-red-100 rounded-lg text-sm font-medium px-5 py-2.5 hover:text-red-900 focus:z-10 dark:bg-transparent dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-600"
              >
                Delete Workspace
              </button>
              <div className="flex items-center">
                <button
                  disabled={saving}
                  onClick={confirmChanges}
                  type="submit"
                  className="text-slate-200 bg-black-900 px-4 py-2 rounded-lg hover:bg-gray-900"
                >
                  {saving ? "Saving..." : "Confirm Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function useManageWorkspaceModal() {
  const [showing, setShowing] = useState(false);
  const showModal = () => {
    setShowing(true);
  };
  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
