import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import { _APP_VERSION } from "@/utils/constants";
import { safeJsonParse } from "@/utils/request";
import showToast from "@/utils/toast";
import { DownloadSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function DownloadIndicator() {
  return <DownloadingModel />;
}

function DownloadingModel() {
  const [downloadPercentage, setDownloadPercentage] = useState(-1);
  const [status, setStatus] = useState("");
  const [showIndicator, setShowIndicator] = useState(false);
  const [modelName, setModelName] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [indicatorText, setIndicatorText] = useState("");

  function pullModel(modelId) {
    System.downloadOllamaModel(modelId, (percentage, status) => {
      setDownloadPercentage(percentage);
      setStatus(status);
    }).then(({ success, error, killed = false }) => {
      if (killed) {
        return;
      }
      if (
        success &&
        window.localStorage.getItem("anythingllm_model_download")
      ) {
        const parsedData = safeJsonParse(
          window.localStorage.getItem("anythingllm_model_download")
        );
        const modelName = parsedData?.modelName;
        showToast(`${modelName} downloaded successfully!`, "success");
        window.localStorage.removeItem("anythingllm_model_download");
        setShowIndicator(false);
        window.dispatchEvent(new CustomEvent("modelDownloadComplete"));
      } else if (error) {
        showToast(`Error downloading model: ${error}`, "error");
        setShowIndicator(false);
      }
    });
  }

  useEffect(() => {
    const handleDownloadStart = () => {
      const data = window.localStorage.getItem("anythingllm_model_download");
      const parsedData = safeJsonParse(data);
      const isDownloading = parsedData?.isDownloading;
      const modelName = parsedData?.modelName;
      const modelId = parsedData?.modelId;

      setShowIndicator(isDownloading === true);
      if (isDownloading && modelId) {
        setModelName(modelName);
        pullModel(modelId);
      }
    };

    handleDownloadStart();

    window.addEventListener("modelDownloadStart", handleDownloadStart);

    return () => {
      window.removeEventListener("modelDownloadStart", handleDownloadStart);
    };
  }, []);

  useEffect(() => {
    if (downloadPercentage !== -1 && downloadPercentage < 100) {
      setTooltipText(`Downloading ${modelName}: ${status}`);
      setIndicatorText(`Downloading ${downloadPercentage}%`);
    } else if (downloadPercentage === 100) {
      setTooltipText(`Unpacking ${modelName}: ${status}`);
      setIndicatorText("Unpacking");
    } else {
      setTooltipText("Downloading");
      setIndicatorText("Downloading");
    }
  }, [downloadPercentage]);

  if (!showIndicator) return null;

  return (
    <>
      <button
        type="button"
        data-tooltip-id="download-alert"
        data-tooltip-content={tooltipText}
        className="border-none z-30 flex items-center gap-x-1 hover:bg-blue-600/10 rounded-lg px-2 animate-pulse hover:cursor-pointer"
      >
        <DownloadSimple size={14} weight="bold" className="text-white" />
        <p className="text-xs text-white">{indicatorText}</p>
        <PreLoader size="3" />
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
