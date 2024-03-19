import { useState, useEffect } from "react";
import System from "@/models/system";
import { ANYTHINGLLM_OLLAMA, _APP_PLATFORM } from "@/utils/constants";
import { DOWNLOADABLE_MODELS } from "./downloadable";
import { safeJsonParse } from "@/utils/request";
import ModelCard from "./ModelCard";
import showToast from "@/utils/toast";
import { refocusApplication } from "@/ipc/node-api";

// Highlighted and/or recommended models for use.
const SHORT_MODELS = ["llama2:latest", "mistral:latest", "gemma:2b"];

export default function AnythingLLMOptions({
  short = false,
  settings,
  setHasChanges,
}) {
  const [loading, setLoading] = useState(true);
  const [showShortList, setShowShortList] = useState(short);
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
      setLoading(false);
    }
    findModels();
  }, []);

  useEffect(() => {
    async function setListeners() {
      if (loading) return;

      const handleDownloadComplete = async () => {
        setModelDownloading(null);
        const { models } = await System.customModels("anythingllm_ollama");
        setDownloadedModels(models || []);
      };

      const handleDownloadAbort = async () => {
        window.localStorage.removeItem(ANYTHINGLLM_OLLAMA.localStorageKey);
        setModelDownloading(null);
        const { models } = await System.customModels("anythingllm_ollama");
        setDownloadedModels(models || []);
      };

      const formEl = document.getElementsByName("LLMPreferenceForm")?.[0];
      window.addEventListener(
        ANYTHINGLLM_OLLAMA.completeEvent,
        handleDownloadComplete
      );
      window.addEventListener(
        ANYTHINGLLM_OLLAMA.abortEvent,
        handleDownloadAbort
      );

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
        formEl?.removeEventListener("submit", autoDownloadModel);
      };
    }
    setListeners();
  }, [loading]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-y-4">
        <div className="flex w-fit items-center gap-x-2">
          <label className="text-white text-base font-bold">
            Available Models
          </label>
          {hasComponentChanges && (
            <p className="text-white italic font-thin text-sm text-gray-200">
              {short
                ? "Model will begin downloading in background"
                : "Pressing save changes will begin the model download"}
            </p>
          )}
        </div>

        {["windows", "mac"].includes(_APP_PLATFORM.value) ? (
          <>
            <div className="flex gap-[12px] w-fill flex-wrap p-0">
              <input
                className="hidden"
                type="text"
                name="AnythingLLMOllamaModelPref"
                readOnly={true}
                value={selectedModel}
              />
              {DOWNLOADABLE_MODELS.map((model) => {
                if (showShortList && !SHORT_MODELS.includes(model.id))
                  return null;
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
                      setHasChanges?.(true);
                    }}
                  />
                );
              })}
            </div>
            {showShortList && (
              <button
                type="button"
                className="mx-auto w-fit border-none text-[12px] text-gray-400 font-base"
                onClick={() => setShowShortList(false)}
              >
                Show all models
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-10 items-center justify-center flex">
            <p className="text-sm font-base text-white text-opacity-60">
              This feature is disabled on Linux operating systems.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
