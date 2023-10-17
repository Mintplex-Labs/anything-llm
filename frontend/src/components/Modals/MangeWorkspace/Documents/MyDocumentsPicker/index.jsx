import { Plus } from "@phosphor-icons/react";
import UploadFile from "../UploadFile";
import DocumentRow from "../DocumentRow";
import PreLoader from "../../../../Preloader";

export default function MyDocumentsPicker({
  fileDirectories,
  selectedDocumentIds,
  toggleDocumentSelection,
  moveToWorkspace,
  setHighlightWorkspace,
  loading,
}) {
  if (loading) {
    return (
      <div className="px-8 pb-8">
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between w-[560px] px-5">
            <h3 className="text-white text-base font-bold">My Documents</h3>
          </div>

          <div className="w-[560px] h-[310px] bg-zinc-900 rounded-2xl overflow-y-auto relative">
            <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 shadow-lg bg-zinc-900 sticky top-0">
              <p className="col-span-4">Name</p>
              <p className="col-span-2">Date</p>
              <p className="col-span-2">Size</p>
              <p className="col-span-2">Kind</p>
              <p className="col-span-2">Cached</p>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <PreLoader />
            </div>
          </div>

          <UploadFile />
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between w-[560px] px-5">
          <h3 className="text-white text-base font-bold">My Documents</h3>
        </div>

        <div className="w-[560px] h-[310px] bg-zinc-900 rounded-2xl overflow-y-auto relative">
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 shadow-lg bg-zinc-900 sticky top-0">
            <p className="col-span-4">Name</p>
            <p className="col-span-2">Date</p>
            <p className="col-span-2">Size</p>
            <p className="col-span-2">Kind</p>
            <p className="col-span-2">Cached</p>
          </div>
          {/* .items is each file */}
          {!!fileDirectories.items ? (
            // .item is each file's contents split
            fileDirectories.items.map((item, index) => (
              <DocumentRow
                key={index}
                item={item}
                // isSelected={selectedDocumentIds.includes(document.id)}
                // onToggleSelection={toggleDocumentSelection}
              />

              // <div className="flex flex-row gap-x-2">
              //   <p className="text-white">{item.name}</p>
              //   <p className="text-white">{item.type}</p>
              // </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-opacity-40 text-sm font-medium">
                No Documents
              </p>
            </div>
          )}
          {/* {selectedDocumentIds.length > 0 && (
            <div className="absolute bottom-0 sticky w-full flex justify-center items-center h-9 bg-white transition-all duration-300">
              {" "}
              <div className="flex gap-x-5">
                <div
                  onMouseEnter={() => setHighlightWorkspace(true)}
                  onMouseLeave={() => setHighlightWorkspace(false)}
                  onClick={moveToWorkspace}
                  className="text-sm font-semibold h-7 px-2.5 rounded-lg transition-all duration-300 hover:text-white hover:bg-neutral-800/80 cursor-pointer flex items-center"
                >
                  Move to workspace
                </div>
              </div>
            </div>
          )} */}
        </div>

        <UploadFile />
      </div>
    </div>
  );
}
