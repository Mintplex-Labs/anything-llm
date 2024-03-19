import { CircleNotch, FileText } from "@phosphor-icons/react";
import { useState } from "react";
import truncate from "truncate";
import { DOWNLOADABLE_MODELS } from "../downloadable";
import { middleTruncate } from "@/utils/directories";
import showToast from "@/utils/toast";
import { openElectronWindow } from "@/ipc/node-api";

export default function ModelCard({
  model,
  disabled = false,
  isActive = false,
  downloaded = false,
  downloading = false,
  handleClick,
  uninstallModel,
}) {
  const onClick = (e) => {
    if (disabled) {
      showToast(
        "You cannot change models while downloading a model. Cancel your download first by clicking on the progress bar in the top right",
        "info",
        { clear: true }
      );
      return false;
    }
    handleClick(e);
  };

  const modelInfo = DOWNLOADABLE_MODELS.find(
    (availableModel) => availableModel.id === model?.id
  );
  if (!modelInfo) return null;

  return (
    <>
      <div
        onClick={onClick}
        className={`transition-all duration-300 w-[300px] min-h-[130px] rounded-[8px] border-2 hover:cursor-pointer hover:border-[#46C8FF] ${
          isActive ? "border-[#46C8FF]" : "border-transparent"
        } bg-zinc-900 p-[12px]`}
      >
        {/* Model Header */}
        <div className="flex items-center justify-between">
          {/* Model Header details */}
          <div className="flex items-center gap-x-[9px]">
            <img
              src="https://avatars.githubusercontent.com/u/151674099?s=48&v=4"
              className="w-[28px] h-[28px] rounded-[6px] bg-white"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-x-1">
                <p className="text-white font-bold text-[14px]">
                  {isActive
                    ? middleTruncate(modelInfo.name, 15)
                    : modelInfo.name}
                </p>
                <p className="text-gray-300 font-thin text-[14px]">
                  {modelInfo.size}
                </p>
              </div>
              <p className="text-[10px] italic text-gray-300">
                Compiled by Ollama
              </p>
            </div>
          </div>

          {isActive && (
            <div className="rounded-full px-2 py-1 bg-[#46C8FF] font-bold flex items-center justify-center text-zinc-950 text-[12px]">
              Active
            </div>
          )}
        </div>
        {/* End Model Header */}
        <ModelDescription description={modelInfo.description} />
        <div className="flex w-full items-center justify-between">
          {modelInfo.licenses?.length > 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                modelInfo.licenses.forEach(({ link }) =>
                  openElectronWindow(link)
                );
                return;
              }}
              className="p-0 border-none gap-x-[2px] items-center flex text-[#58A6FF]"
            >
              <FileText size={20} />
              <p className="font-base text-[12px]">View Licenses</p>
            </button>
          ) : (
            <div className="invisible" />
          )}
          {downloaded ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                uninstallModel(model.id);
                return;
              }}
              className="px-2 py-1 items-center border-[1px] rounded-full flex text-white"
            >
              Uninstall
            </button>
          ) : (
            <>
              {downloading && (
                <CircleNotch size={20} className="animate-spin text-white" />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ModelDescription({ description }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-[8px]">
      <p className="text-gray-400 text-[12px]">
        {truncate(description, expanded ? Number.POSITIVE_INFINITY : 69)}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(!expanded);
            return;
          }}
          className="border-none"
        >
          <p className="text-white font-bold">
            {expanded ? "Show less" : "Read more"}
          </p>
        </button>
      </p>
    </div>
  );
}
