import PreLoader from "../../../../Preloader";

export default function WorkspaceDirectory({
  workspace,
  workspaceDocuments,
  selectedDocumentIds,
  toggleDocumentSelection,
  highlightWorkspace,
  loading,
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
          <div
            className={`absolute inset-0 border-4 border-transparent rounded-2xl transition-all duration-300 ${
              highlightWorkspace ? "border-cyan-300 border-opacity-80" : ""
            }`}
          ></div>
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20">
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
      <div className="relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5">
        <div
          className={`absolute inset-0 border-4 border-transparent rounded-2xl transition-all duration-300 ${
            highlightWorkspace ? "border-cyan-300 border-opacity-80" : ""
          }`}
        ></div>
        <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20">
          <p className="col-span-4">Name</p>
          <p className="col-span-2">Date</p>
          <p className="col-span-2">Size</p>
          <p className="col-span-2">Kind</p>
          <p className="col-span-2">Cached</p>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {/* RENDER ROWS HERE */}
          <p className="text-white">NOT LOADING</p>
        </div>
      </div>
    </div>
  );
}
