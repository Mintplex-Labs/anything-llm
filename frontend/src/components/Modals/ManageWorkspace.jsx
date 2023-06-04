import React, { useState, useEffect } from "react";
import {
  FileMinus,
  FilePlus,
  Folder,
  FolderMinus,
  FolderPlus,
  X,
  Zap,
} from "react-feather";
import System from "../../models/system";
import Workspace from "../../models/workspace";
import { nFormatter } from "../../utils/numbers";
import { dollarFormat } from "../../utils/numbers";
import paths from "../../utils/paths";
import { useParams } from "react-router-dom";

const noop = () => false;
export default function ManageWorkspace({ hideModal = noop, workspace }) {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [directories, setDirectories] = useState(null);
  const [originalDocuments, setOriginalDocuments] = useState([]);
  const [selectedFiles, setSelectFiles] = useState([]);

  useEffect(() => {
    async function fetchKeys() {
      const _workspace = await Workspace.bySlug(workspace.slug);
      const localFiles = await System.localFiles();
      const originalDocs = _workspace.documents.map((doc) => doc.docpath) || [];
      setDirectories(localFiles);
      setOriginalDocuments([...originalDocs]);
      setSelectFiles([...originalDocs]);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remiain untouched. This action is irreversible.`
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

  const toggleSelection = (filepath) => {
    const isFolder = !filepath.includes("/");
    const parent = isFolder ? filepath : filepath.split("/")[0];

    if (isSelected(filepath)) {
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

function Directory({
  files,
  parent = null,
  nested = 0,
  toggleSelection,
  isSelected,
}) {
  const [isExpanded, toggleExpanded] = useState(false);
  const [showDetails, toggleDetails] = useState(false);
  const [showZap, setShowZap] = useState(false);

  if (files.type === "folder") {
    return (
      <div style={{ marginLeft: nested }} className="mb-2">
        <div
          className={`flex items-center hover:bg-gray-100 gap-x-2 text-gray-800 dark:text-stone-200 dark:hover:bg-stone-800 px-2 rounded-lg`}
        >
          {files.items.some((files) => files.type === "folder") ? (
            <Folder className="w-6 h-6" />
          ) : (
            <button onClick={() => toggleSelection(files.name)}>
              {isSelected(files.name) ? (
                <FolderMinus className="w-6 h-6 stroke-red-800 hover:fill-red-500" />
              ) : (
                <FolderPlus className="w-6 h-6 hover:stroke-green-800 hover:fill-green-500" />
              )}
            </button>
          )}

          <div
            className="flex gap-x-2 items-center  cursor-pointer w-full"
            onClick={() => toggleExpanded(!isExpanded)}
          >
            <h2 className="text-2xl">{files.name}</h2>
            {files.items.some((files) => files.type === "folder") ? (
              <p className="text-xs italic">{files.items.length} folders</p>
            ) : (
              <p className="text-xs italic">
                {files.items.length} documents |{" "}
                {nFormatter(
                  files.items.reduce((a, b) => a + b.token_count_estimate, 0)
                )}{" "}
                tokens
              </p>
            )}
          </div>
        </div>
        {isExpanded &&
          files.items.map((item) => (
            <Directory
              key={item.name}
              parent={files.name}
              files={item}
              nested={nested + 20}
              toggleSelection={toggleSelection}
              isSelected={isSelected}
            />
          ))}
      </div>
    );
  }

  const { name, type: _type, ...meta } = files;
  return (
    <div className="ml-[20px] my-2">
      <div className="flex items-center">
        {meta?.cached && (
          <button
            type="button"
            onClick={() => setShowZap(true)}
            className="rounded-full p-1 hover:bg-stone-500 hover:bg-opacity-75"
          >
            <Zap className="h-4 w-4 stroke-yellow-500 fill-yellow-400" />
          </button>
        )}
        {showZap && (
          <dialog
            open={true}
            style={{ zIndex: 100 }}
            className="fixed top-0 flex bg-black bg-opacity-50 w-[100vw] h-full items-center justify-center "
          >
            <div className="w-fit px-10 py-4 w-[25%] rounded-lg bg-white shadow dark:bg-stone-700 text-black dark:text-slate-200">
              <div className="flex flex-col w-full">
                <p className="font-semibold text-xl flex items-center gap-x-1 justify-left">
                  What does{" "}
                  <Zap className="h-4 w-4 stroke-yellow-500 fill-yellow-400" />{" "}
                  mean?
                </p>
                <p className="text-base mt-4">
                  This symbol indicates that you have embed this document before
                  and will not have to pay to re-embed this document.
                </p>
                <div className="flex w-full justify-center items-center mt-4">
                  <button
                    onClick={() => setShowZap(false)}
                    className="border border-gray-800 text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:border-slate-200 dark:hover:bg-stone-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}

        <div
          className={`flex items-center gap-x-2 text-gray-800 dark:text-stone-200 hover:bg-gray-100 dark:hover:bg-stone-800 px-2 rounded-lg`}
        >
          <button onClick={() => toggleSelection(`${parent}/${name}`)}>
            {isSelected(`${parent}/${name}`) ? (
              <FileMinus className="w-6 h-6 stroke-red-800 hover:fill-red-500" />
            ) : (
              <FilePlus className="w-6 h-6 hover:stroke-green-800 hover:fill-green-500" />
            )}
          </button>
          <div
            className="w-full items-center flex cursor-pointer"
            onClick={() => toggleDetails(!showDetails)}
          >
            <h3 className="text-sm">{name}</h3>
            <br />
          </div>
        </div>
      </div>
      {showDetails && (
        <div className="ml-[20px] flex flex-col gap-y-1 my-1 p-2 rounded-md bg-slate-200 font-mono text-sm overflow-x-scroll">
          {Object.entries(meta).map(([key, value]) => {
            if (key === "cached") return null;
            return (
              <p className="whitespace-pre">
                {key}: {value}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ConfirmationModal({
  directories,
  hideConfirm,
  additions,
  updateWorkspace,
}) {
  function estimateCosts() {
    const cachedTokens = additions.map((filepath) => {
      const [parent, filename] = filepath.split("/");
      const details = directories.items
        .find((folder) => folder.name === parent)
        .items.find((file) => file.name === filename);

      const { token_count_estimate = 0, cached = false } = details;
      return cached ? token_count_estimate : 0;
    });
    const tokenEstimates = additions.map((filepath) => {
      const [parent, filename] = filepath.split("/");
      const details = directories.items
        .find((folder) => folder.name === parent)
        .items.find((file) => file.name === filename);

      const { token_count_estimate = 0 } = details;
      return token_count_estimate;
    });

    const totalTokens = tokenEstimates.reduce((a, b) => a + b, 0);
    const cachedTotal = cachedTokens.reduce((a, b) => a + b, 0);
    const dollarValue = 0.0004 * ((totalTokens - cachedTotal) / 1_000);

    return {
      dollarValue,
      dollarText:
        dollarValue < 0.01 ? "< $0.01" : `about ${dollarFormat(dollarValue)}`,
    };
  }

  const { dollarValue, dollarText } = estimateCosts();
  return (
    <dialog
      open={true}
      style={{ zIndex: 100 }}
      className="fixed top-0 flex bg-black bg-opacity-50 w-[100vw] h-full items-center justify-center "
    >
      <div className="w-fit px-10 p-4 min-w-1/2 rounded-lg bg-white shadow dark:bg-stone-700 text-black dark:text-slate-200">
        <div className="flex flex-col w-full">
          <p className="font-semibold">
            Are you sure you want to embed these documents?
          </p>

          <div className="flex flex-col gap-y-1">
            {dollarValue <= 0 ? (
              <p className="text-base mt-4">
                You will be embedding {additions.length} new documents into this
                workspace.
                <br />
                This will not incur any costs for OpenAI credits.
              </p>
            ) : (
              <p className="text-base mt-4">
                You will be embedding {additions.length} new documents into this
                workspace. <br />
                This will cost {dollarText} in OpenAI credits.
              </p>
            )}
          </div>

          <div className="flex w-full justify-between items-center mt-4">
            <button
              onClick={hideConfirm}
              className="text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:hover:bg-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={updateWorkspace}
              className="border border-gray-800 text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:border-slate-200 dark:hover:bg-stone-900"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </dialog>
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
