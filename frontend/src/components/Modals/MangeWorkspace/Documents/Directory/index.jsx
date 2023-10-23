import UploadFile from "../UploadFile";
import PreLoader from "../../../../Preloader";
import { useEffect, useState } from "react";
import FolderRow from "./FolderRow";
import pluralize from "pluralize";

export default function Directory({
  files,
  loading,
  setLoading,
  fileTypes,
  workspace,
  fetchKeys,
  selectedItems,
  setSelectedItems,
  setHighlightWorkspace,
  moveToWorkspace,
  setLoadingMessage,
  loadingMessage,
}) {
  const [amountSelected, setAmountSelected] = useState(0);

  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = { ...prevSelectedItems };

      if (item.type === "folder") {
        const isCurrentlySelected = isFolderCompletelySelected(item);
        if (isCurrentlySelected) {
          item.items.forEach((file) => delete newSelectedItems[file.id]);
        } else {
          item.items.forEach((file) => (newSelectedItems[file.id] = true));
        }
      } else {
        if (newSelectedItems[item.id]) {
          delete newSelectedItems[item.id];
        } else {
          newSelectedItems[item.id] = true;
        }
      }

      return newSelectedItems;
    });
  };

  const isFolderCompletelySelected = (folder) => {
    if (folder.items.length === 0) {
      return false;
    }
    return folder.items.every((file) => selectedItems[file.id]);
  };

  const isSelected = (id, item) => {
    if (item && item.type === "folder") {
      return isFolderCompletelySelected(item);
    }

    return !!selectedItems[id];
  };

  useEffect(() => {
    setAmountSelected(Object.keys(selectedItems).length);
  }, [selectedItems]);

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between w-[560px] px-5">
          <h3 className="text-white text-base font-bold">My Documents</h3>
        </div>

        <div className="relative w-[560px] h-[310px] bg-zinc-900 rounded-2xl">
          <div className="rounded-t-2xl text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 shadow-lg bg-zinc-900 sticky top-0 z-10">
            <p className="col-span-4">Name</p>
            <p className="col-span-2">Date</p>
            <p className="col-span-2">Size</p>
            <p className="col-span-2">Kind</p>
            <p className="col-span-2">Cached</p>
          </div>

          <div
            className="overflow-y-auto pb-9"
            style={{ height: "calc(100% - 40px)" }}
          >
            {loading ? (
              <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
                <PreLoader />
                <p className="text-white/80 text-sm font-semibold animate-pulse text-center w-1/3">
                  {loadingMessage}
                </p>
              </div>
            ) : !!files.items ? (
              files.items.map(
                (item, index) =>
                  item.type === "folder" && (
                    <FolderRow
                      key={index}
                      item={item}
                      selected={isSelected(
                        item.id,
                        item.type === "folder" ? item : null
                      )}
                      fetchKeys={fetchKeys}
                      onRowClick={() => toggleSelection(item)}
                      toggleSelection={toggleSelection}
                      isSelected={isSelected}
                      setLoading={setLoading}
                      setLoadingMessage={setLoadingMessage}
                    />
                  )
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-opacity-40 text-sm font-medium">
                  No Documents
                </p>
              </div>
            )}
          </div>

          {amountSelected !== 0 && (
            <div className="absolute bottom-0 left-0 w-full flex justify-center items-center h-9 bg-white rounded-b-2xl">
              <div className="flex gap-x-5">
                <div
                  onMouseEnter={() => setHighlightWorkspace(true)}
                  onMouseLeave={() => setHighlightWorkspace(false)}
                  onClick={moveToWorkspace}
                  className="text-sm font-semibold h-7 px-2.5 rounded-lg transition-all duration-300 hover:text-white hover:bg-neutral-800/80 cursor-pointer flex items-center"
                >
                  Move {amountSelected} {pluralize("file", amountSelected)} to
                  workspace
                </div>
              </div>
            </div>
          )}
        </div>

        <UploadFile
          fileTypes={fileTypes}
          workspace={workspace}
          fetchKeys={fetchKeys}
        />
      </div>
    </div>
  );
}
