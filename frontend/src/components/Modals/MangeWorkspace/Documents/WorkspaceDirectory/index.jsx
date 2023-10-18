import { ArrowUUpLeft, File } from "@phosphor-icons/react";
import PreLoader from "../../../../Preloader";
import { useEffect, useRef, useState } from "react";
import {
  formatDate,
  getFileExtension,
  truncate,
} from "../../../../../utils/directories";

export default function WorkspaceDirectory({
  workspace,
  files,
  workspaceDocuments,
  selectedDocumentIds,
  toggleDocumentSelection,
  highlightWorkspace,
  loading,
}) {
  console.log("FILES: ", files.items);

  const item = {
    title: "test",
    published: "2021-10-01T00:00:00.000Z",
    size: "---",
    cached: true,
    url: "file:///Users/seanhatfield/Documents/Mintplex/anything-llm/collector/hotdir/processed/README TEST 2.md",
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
      <div
        className={`relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5 overflow-y-auto border-4 border-transparent transition-all duration-300 ${
          highlightWorkspace ? "border-cyan-300 border-opacity-80" : ""
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
          {/* <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} />
          <WorkspaceFileRow item={item} selected={false} /> */}
          {/* {files.items.map((item, index) => (
            <WorkspaceFileRow
              key={index}
              item={item}
              selected={true}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}

function WorkspaceFileRow({ item, selected }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef(null);

  const onRowClick = () => {
    console.log("row clicked");
  };

  const onTrashClick = async (event) => {
    event.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete this document?\nThis will require you to re-upload and re-embed it.\nThis document will be removed from any workspace that is currently referencing it.\nThis action is not reversible."
      )
    ) {
      return false;
    }

    try {
      await System.deleteDocument(`custom-documents/${item.name}`, item);
    } catch (error) {
      console.error("Failed to delete the document:", error);
    }
  };

  const handleMouseEnter = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`items-center transition-all duration-200 text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 border-b border-white/20 hover:bg-sky-500/20 cursor-pointer ${`${
        selected ? "bg-sky-500/20" : ""
      }`}`}
    >
      <div className="col-span-4 flex gap-x-[4px] items-center">
        <div
          className="w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
          role="checkbox"
          aria-checked={selected}
          tabIndex={0}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
        </div>
        <File className="text-base font-bold w-4 h-4 mr-[3px]" weight="fill" />
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="whitespace-nowrap overflow-hidden">
            {truncate(item.title, 17)}
          </p>
          {showTooltip && (
            <div className="absolute left-0 bg-white text-black p-1.5 rounded shadow-lg whitespace-nowrap">
              {item.title}
            </div>
          )}
        </div>
      </div>
      <p className="col-span-2 pl-3.5 whitespace-nowrap">
        {formatDate(item?.published)}
      </p>
      <p className="col-span-2 pl-3">{item?.size || "---"}</p>
      <p className="col-span-2 pl-2 uppercase">{getFileExtension(item.url)}</p>
      <div className="col-span-2 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
        <ArrowUUpLeft
          onClick={onTrashClick}
          className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
