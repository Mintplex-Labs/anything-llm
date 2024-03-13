import { refocusApplication } from "@/ipc/node-api";
import System from "@/models/system";
import { ANYTHINGLLM_OLLAMA } from "@/utils/constants";
import { safeJsonParse } from "@/utils/request";
import showToast from "@/utils/toast";
import { CircleNotch, DownloadSimple, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function DownloadIndicator() {
  const [downloadPercentage, setDownloadPercentage] = useState(-1);
  const [showIndicator, setShowIndicator] = useState(false);
  const [modelName, setModelName] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [indicatorText, setIndicatorText] = useState("");

  function pullModel(modelId) {
    System.downloadOllamaModel(modelId, (percentage, _status) => {
      setDownloadPercentage(percentage);
    }).then(({ success, error, killed = false }) => {
      if (killed) {
        return;
      }
      if (
        success &&
        window.localStorage.getItem(ANYTHINGLLM_OLLAMA.localStorageKey)
      ) {
        const parsedData = safeJsonParse(
          window.localStorage.getItem(ANYTHINGLLM_OLLAMA.localStorageKey)
        );
        const modelName = parsedData?.modelName;
        showToast(`${modelName} downloaded successfully!`, "success");
        window.localStorage.removeItem(ANYTHINGLLM_OLLAMA.localStorageKey);
        setShowIndicator(false);
        window.dispatchEvent(new CustomEvent(ANYTHINGLLM_OLLAMA.completeEvent));
      } else if (error) {
        showToast(`Error downloading model: ${error}`, "error");
        setShowIndicator(false);
      }
    });
  }

  useEffect(() => {
    const handleDownloadStart = () => {
      const data = window.localStorage.getItem(
        ANYTHINGLLM_OLLAMA.localStorageKey
      );
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

    window.addEventListener(ANYTHINGLLM_OLLAMA.startEvent, handleDownloadStart);

    return () => {
      window.removeEventListener(
        ANYTHINGLLM_OLLAMA.startEvent,
        handleDownloadStart
      );
    };
  }, []);

  useEffect(() => {
    if (downloadPercentage !== -1 && downloadPercentage < 100) {
      setTooltipText(`Downloading ${modelName}.\nClick to cancel`);
      setIndicatorText(`${modelName} ${downloadPercentage}%`);
    } else if (downloadPercentage === 100) {
      setTooltipText(`Unpacking ${modelName}...`);
      setIndicatorText("Unpacking");
    } else {
      setTooltipText("Downloading");
      setIndicatorText("Downloading");
    }
  }, [downloadPercentage]);

  async function cancelAlert() {
    if (
      !window.confirm(
        "Are you sure you want to cancel this download? It can be resumed later by selecting the model again."
      )
    ) {
      refocusApplication();
      return false;
    }

    refocusApplication();
    window.localStorage.removeItem(ANYTHINGLLM_OLLAMA.localStorageKey);
    window.dispatchEvent(new CustomEvent(ANYTHINGLLM_OLLAMA.abortEvent));
    await System.abortOllamaModelDownload();
    showToast(`${modelName} download canceled.`, "info", { clear: true });
    setShowIndicator(false);
    setModelName("");
    setTooltipText("");
    setIndicatorText("");
  }

  if (!showIndicator) return null;

  return (
    <>
      <button
        type="button"
        data-tooltip-id="download-alert"
        data-tooltip-content={tooltipText}
        onClick={cancelAlert}
        className="border-none z-30 flex items-center gap-x-1 hover:bg-blue-600/10 rounded-lg px-2 animate-pulse hover:cursor-pointer"
      >
        <DownloadSimple size={14} weight="bold" className="text-white" />
        <p className="text-xs text-white">{indicatorText}</p>
        <CircleNotch size={12} className="text-white animate-spin" />
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
