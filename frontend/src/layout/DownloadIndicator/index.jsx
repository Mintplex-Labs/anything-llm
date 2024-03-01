import { _APP_VERSION } from "@/utils/constants";
import { DownloadSimple } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

// TODO: Have this really link to a download indication
export default function DownloadIndicator() {
  return <DownloadingModel />;
}

function DownloadingModel() {
  return (
    <>
      <button
        type="button"
        data-tooltip-id="download-alert"
        data-tooltip-content="Your LLM model is downloading in the background"
        className="border-none flex items-center gap-x-1 hover:bg-blue-600/10 rounded-lg px-2 animate-pulse"
      >
        <DownloadSimple size={14} weight="bold" className="text-white" />
        <p className="text-xs text-white">downloading...</p>
      </button>
      <Tooltip
        id="download-alert"
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs z-99"
      />
    </>
  );
}
