import PreLoader from "../../../../Preloader";
import { dollarFormat } from "../../../../../utils/numbers";
import WorkspaceFileRow from "./WorkspaceFileRow";

export default function WorkspaceDirectory({
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
  if (loading) {
    return (
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5">
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20">
            <p className="col-span-4">Name</p>
            <p className="col-span-2">Date</p>
            <p className="col-span-2">Size</p>
            <p className="col-span-2">Kind</p>
            <p className="col-span-2">Cached</p>
          </div>
          <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
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
    <div className="px-8">
      <div className="flex items-center justify-start w-[560px]">
        <h3 className="text-white text-base font-bold ml-5">
          {workspace.name}
        </h3>
      </div>
      <div
        className={`relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5 overflow-y-auto border-4 transition-all duration-300 ${
          highlightWorkspace ? "border-cyan-300/80" : "border-transparent"
        }`}
      >
        <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 bg-zinc-900 sticky top-0 z-10">
          <p className="col-span-4">Name</p>
          <p className="col-span-2">Date</p>
          <p className="col-span-2">Size</p>
          <p className="col-span-2">Kind</p>
          <p className="col-span-2">Cached</p>
        </div>
        <div className="w-full h-full flex flex-col z-0">
          {Object.values(files.items).some(
            (folder) => folder.items.length > 0
          ) || movedItems.length > 0 ? (
            <>
              {files.items.map((folder) =>
                folder.items.map((item, index) => (
                  <WorkspaceFileRow
                    key={index}
                    item={item}
                    folderName={folder.name}
                    workspace={workspace}
                    setLoading={setLoading}
                    setLoadingMessage={setLoadingMessage}
                    fetchKeys={fetchKeys}
                    hasChanges={hasChanges}
                    movedItems={movedItems}
                  />
                ))
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-opacity-40 text-sm font-medium">
                No Documents
              </p>
            </div>
          )}
        </div>
      </div>
      {hasChanges && (
        <div className="flex items-center justify-between py-6 transition-all duration-300">
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
            onClick={saveChanges}
            className="transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            Save and Embed
          </button>
        </div>
      )}
    </div>
  );
}
