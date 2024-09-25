import PreLoader from "@/components/Preloader";
import { dollarFormat } from "@/utils/numbers";
import WorkspaceFileRow from "./WorkspaceFileRow";
import { memo, useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { Eye, PushPin } from "@phosphor-icons/react";
import { SEEN_DOC_PIN_ALERT, SEEN_WATCH_ALERT } from "@/utils/constants";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import Workspace from "@/models/workspace";

function WorkspaceDirectory({
  workspace,
  files,
  highlightWorkspace,
  loading,
  loadingMessage,
  setLoadingMessage,
  setLoading,
  fetchKeys,
  hasChanges,
  saveChanges,
  embeddingCosts,
  movedItems,
}) {
  const [selectedItems, setSelectedItems] = useState({});

  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = { ...prevSelectedItems };
      if (newSelectedItems[item.id]) {
        delete newSelectedItems[item.id];
      } else {
        newSelectedItems[item.id] = true;
      }
      return newSelectedItems;
    });
  };

  const toggleSelectAll = () => {
    const allItems = files.items.flatMap((folder) => folder.items);
    const allSelected = allItems.every((item) => selectedItems[item.id]);
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newSelectedItems = {};
      allItems.forEach((item) => {
        newSelectedItems[item.id] = true;
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const removeSelectedItems = async () => {
    setLoading(true);
    setLoadingMessage("Removing selected files from workspace");

    const itemsToRemove = Object.keys(selectedItems).map((itemId) => {
      const folder = files.items.find((f) =>
        f.items.some((i) => i.id === itemId)
      );
      const item = folder.items.find((i) => i.id === itemId);
      return `${folder.name}/${item.name}`;
    });

    try {
      await Workspace.modifyEmbeddings(workspace.slug, {
        adds: [],
        deletes: itemsToRemove,
      });
      await fetchKeys(true);
      setSelectedItems({});
    } catch (error) {
      console.error("Failed to remove documents:", error);
    }

    setLoadingMessage("");
    setLoading(false);
  };

  const handleSaveChanges = (e) => {
    setSelectedItems({});
    saveChanges(e);
  };

  if (loading) {
    return (
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5">
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-3.5 border-b border-white/20 bg-zinc-900 sticky top-0 z-10 rounded-t-2xl">
            <div className="col-span-10 flex items-center gap-x-[4px]">
              <div className="shrink-0 w-3 h-3" />
              <p className="ml-[7px]">Name</p>
            </div>
            <p className="col-span-2" />
          </div>
          <div className="w-full h-[calc(100%-40px)] flex items-center justify-center flex-col gap-y-5">
            <PreLoader />
            <p className="text-white/80 text-sm font-semibold animate-pulse text-center w-1/3">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] mt-5">
          <div
            className={`absolute inset-0 rounded-2xl  ${
              highlightWorkspace ? "border-4 border-cyan-300/80 z-[999]" : ""
            }`}
          />
          <div className="relative w-full h-full bg-zinc-900 rounded-2xl overflow-hidden">
            <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-3.5 border-b border-white/20 bg-zinc-900 sticky top-0 z-10">
              <div className="col-span-10 flex items-center gap-x-[4px]">
                {!hasChanges &&
                files.items.some((folder) => folder.items.length > 0) ? (
                  <div
                    className="shrink-0 w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
                    role="checkbox"
                    aria-checked={
                      Object.keys(selectedItems).length ===
                      files.items.reduce(
                        (sum, folder) => sum + folder.items.length,
                        0
                      )
                    }
                    tabIndex={0}
                    onClick={toggleSelectAll}
                  >
                    {Object.keys(selectedItems).length ===
                      files.items.reduce(
                        (sum, folder) => sum + folder.items.length,
                        0
                      ) && <div className="w-2 h-2 bg-white rounded-[2px]" />}
                  </div>
                ) : (
                  <div className="shrink-0 w-3 h-3" />
                )}
                <p className="ml-[7px]">Name</p>
              </div>
              <p className="col-span-2" />
            </div>
            <div className="overflow-y-auto h-[calc(100%-40px)]">
              {files.items.some((folder) => folder.items.length > 0) ||
              movedItems.length > 0 ? (
                <RenderFileRows files={files} movedItems={movedItems}>
                  {({ item, folder }) => (
                    <WorkspaceFileRow
                      key={item.id}
                      item={item}
                      folderName={folder.name}
                      workspace={workspace}
                      setLoading={setLoading}
                      setLoadingMessage={setLoadingMessage}
                      fetchKeys={fetchKeys}
                      hasChanges={hasChanges}
                      movedItems={movedItems}
                      selected={selectedItems[item.id]}
                      toggleSelection={() => toggleSelection(item)}
                      disableSelection={hasChanges}
                      setSelectedItems={setSelectedItems}
                    />
                  )}
                </RenderFileRows>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-opacity-40 text-sm font-medium">
                    No Documents
                  </p>
                </div>
              )}
            </div>
            {Object.keys(selectedItems).length > 0 && !hasChanges && (
              <div className="absolute bottom-[12px] left-0 right-0 flex justify-center pointer-events-none">
                <div className="mx-auto bg-white/40 rounded-lg py-1 px-2 pointer-events-auto">
                  <div className="flex flex-row items-center gap-x-2">
                    <button
                      onClick={toggleSelectAll}
                      className="border-none text-sm font-semibold bg-white h-[30px] px-2.5 rounded-lg hover:text-white hover:bg-neutral-800/80"
                    >
                      {Object.keys(selectedItems).length ===
                      files.items.reduce(
                        (sum, folder) => sum + folder.items.length,
                        0
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                    <button
                      onClick={removeSelectedItems}
                      className="border-none text-sm font-semibold bg-white h-[30px] px-2.5 rounded-lg hover:text-white hover:bg-neutral-800/80"
                    >
                      Remove Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasChanges && (
          <div className="flex items-center justify-between py-6">
            <div className="text-white/80">
              <p className="text-sm font-semibold">
                {embeddingCosts === 0
                  ? ""
                  : `Estimated Cost: ${
                      embeddingCosts < 0.01
                        ? `< $0.01`
                        : dollarFormat(embeddingCosts)
                    }`}
              </p>
              <p className="mt-2 text-xs italic" hidden={embeddingCosts === 0}>
                *One time cost for embeddings
              </p>
            </div>

            <button
              onClick={(e) => handleSaveChanges(e)}
              className="border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Save and Embed
            </button>
          </div>
        )}
      </div>
      <PinAlert />
      <DocumentWatchAlert />
    </>
  );
}

const PinAlert = memo(() => {
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_DOC_PIN_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    window?.addEventListener("pinned_document", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex items-center gap-2">
              <PushPin className="text-red-600 text-lg w-6 h-6" weight="fill" />
              <h3 className="text-xl font-semibold text-white">
                What is document pinning?
              </h3>
            </div>
          </div>
          <div className="w-full p-6 text-white text-md flex flex-col gap-y-2">
            <p>
              When you <b>pin</b> a document in AnythingLLM we will inject the
              entire content of the document into your prompt window for your
              LLM to fully comprehend.
            </p>
            <p>
              This works best with <b>large-context models</b> or small files
              that are critical to its knowledge-base.
            </p>
            <p>
              If you are not getting the answers you desire from AnythingLLM by
              default then pinning is a great way to get higher quality answers
              in a click.
            </p>
          </div>

          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button disabled={true} className="invisible" />
            <button
              onClick={dismissAlert}
              className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Okay, got it
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
});

const DocumentWatchAlert = memo(() => {
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_WATCH_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_WATCH_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_WATCH_ALERT)) return;
    window?.addEventListener("watch_document_for_changes", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex items-center gap-2">
              <Eye
                className="text-yellow-600 text-lg w-6 h-6"
                weight="regular"
              />
              <h3 className="text-xl font-semibold text-white">
                What does watching a document do?
              </h3>
            </div>
          </div>
          <div className="w-full p-6 text-white text-md flex flex-col gap-y-2">
            <p>
              When you <b>watch</b> a document in AnythingLLM we will{" "}
              <i>automatically</i> sync your document content from it's original
              source on regular intervals. This will automatically update the
              content in every workspace where this file is managed.
            </p>
            <p>
              This feature currently supports online-based content and will not
              be available for manually uploaded documents.
            </p>
            <p>
              You can manage what documents are watched from the{" "}
              <Link
                to={paths.experimental.liveDocumentSync.manage()}
                className="text-blue-600 underline"
              >
                File manager
              </Link>{" "}
              admin view.
            </p>
          </div>

          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button disabled={true} className="invisible" />
            <button
              onClick={dismissAlert}
              className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Okay, got it
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
});

function RenderFileRows({ files, movedItems, children }) {
  function sortMovedItemsAndFiles(a, b) {
    const aIsMovedItem = movedItems.some((movedItem) => movedItem.id === a.id);
    const bIsMovedItem = movedItems.some((movedItem) => movedItem.id === b.id);
    if (aIsMovedItem && !bIsMovedItem) return -1;
    if (!aIsMovedItem && bIsMovedItem) return 1;
    return 0;
  }

  return files.items
    .flatMap((folder) => folder.items)
    .sort(sortMovedItemsAndFiles)
    .map((item) => {
      const folder = files.items.find((f) => f.items.includes(item));
      return children({ item, folder });
    });
}

export default memo(WorkspaceDirectory);
