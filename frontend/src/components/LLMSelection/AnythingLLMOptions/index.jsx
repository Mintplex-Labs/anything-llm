import { useState, useEffect, memo } from "react";
import System from "@/models/system";
import { ANYTHINGLLM_OLLAMA } from "@/utils/constants";
import { DOWNLOADABLE_MODELS } from "./downloadable";
import { safeJsonParse } from "@/utils/request";
import ModelCard from "./ModelCard";
import showToast from "@/utils/toast";
import { refocusApplication } from "@/ipc/node-api";

function AnythingLLMOptions({ settings, setHasChanges }) {
  const [hasComponentChanges, setHasComponentChanges] = useState(false);
  const [modelDownloading, setModelDownloading] = useState(null);
  const [downloadedModels, setDownloadedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(
    settings?.AnythingLLMOllamaModelPref
  );

  function startDownload(modelId, modelName) {
    window.localStorage.setItem(
      ANYTHINGLLM_OLLAMA.localStorageKey,
      JSON.stringify({ isDownloading: true, modelName, modelId })
    );
    window.dispatchEvent(new CustomEvent(ANYTHINGLLM_OLLAMA.startEvent));
    setModelDownloading(modelId);
  }

  const autoDownloadModel = () => {
    const formInputValue = document.getElementsByName(
      "AnythingLLMOllamaModelPref"
    )?.[0]?.value;
    const downloaded = !!downloadedModels.find(
      (mdl) => mdl.id === formInputValue
    );
    if (!formInputValue) return;

    // If model is downloaded, skip auto-downloading.
    if (downloaded) {
      setHasComponentChanges(false);
      return;
    }

    if (downloaded || !formInputValue) return;
    const modelInfo = DOWNLOADABLE_MODELS.find(
      (mdl) => mdl.id === formInputValue
    );

    startDownload(formInputValue, modelInfo.name);
    setHasComponentChanges(false);
    showToast(
      `${modelInfo.name} will download in the background. You can check it's progress or cancel the download via the progress bar at the top. Chatting will be disabled until the model is ready.`,
      "info"
    );
  };

  async function uninstallModel(modelName) {
    if (
      !window.confirm(
        `Are you sure you want to uninstall ${modelName}? You will have to re-download it again.`
      )
    ) {
      refocusApplication();
      return false;
    }

    refocusApplication();
    await System.deleteOllamaModel(modelName);
    const { models } = await System.customModels("anythingllm_ollama");
    setModelDownloading(null);
    setDownloadedModels(models || []);
  }

  useEffect(() => {
    async function findModels() {
      const { models } = await System.customModels("anythingllm_ollama");
      setDownloadedModels(models || []);
      const downloadState = window.localStorage.getItem(
        ANYTHINGLLM_OLLAMA.localStorageKey
      );

      if (downloadState) {
        const parsedData = safeJsonParse(downloadState);
        if (parsedData?.isDownloading) {
          setModelDownloading(parsedData.modelId);
        }
      }
    }
    findModels();

    const handleDownloadComplete = () => {
      setModelDownloading(null);
      findModels();
    };

    const handleDownloadAbort = () => {
      window.localStorage.removeItem(ANYTHINGLLM_OLLAMA.localStorageKey);
      setModelDownloading(null);
      findModels();
    };

    const formEl = document.getElementsByName("LLMPreferenceForm")[0];
    window.addEventListener(
      ANYTHINGLLM_OLLAMA.completeEvent,
      handleDownloadComplete
    );
    window.addEventListener(ANYTHINGLLM_OLLAMA.abortEvent, handleDownloadAbort);

    formEl?.addEventListener("submit", autoDownloadModel);
    return () => {
      window.removeEventListener(
        ANYTHINGLLM_OLLAMA.completeEvent,
        handleDownloadComplete
      );
      window.removeEventListener(
        ANYTHINGLLM_OLLAMA.abortEvent,
        handleDownloadAbort
      );
      formEl.removeEventListener("submit", autoDownloadModel);
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-y-4">
        <div className="flex w-fit items-center gap-x-2">
          <label className="text-white text-base font-bold">
            Available Models
          </label>
          {hasComponentChanges && (
            <p className="text-white italic font-thin text-sm text-gray-200">
              Pressing save changes will begin the model download
            </p>
          )}
        </div>

        <div className="flex gap-[12px] w-fit flex-wrap p-0">
          <input
            className="hidden"
            type="text"
            name="AnythingLLMOllamaModelPref"
            readOnly={true}
            value={selectedModel}
          />
          {DOWNLOADABLE_MODELS.map((model) => {
            const downloaded = !!downloadedModels.find(
              (mdl) => mdl.id === model.id
            );
            return (
              <ModelCard
                key={model.id}
                model={model}
                disabled={modelDownloading !== null}
                isActive={model.id === selectedModel}
                downloaded={downloaded}
                downloading={model.id === modelDownloading}
                uninstallModel={uninstallModel}
                handleClick={() => {
                  setSelectedModel(model.id);
                  setHasComponentChanges(true);
                  setHasChanges(true);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(AnythingLLMOptions);
