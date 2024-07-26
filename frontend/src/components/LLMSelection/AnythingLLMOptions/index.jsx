import { useState, useEffect, useRef } from "react";
import System from "@/models/system";
import { ANYTHINGLLM_OLLAMA, _APP_PLATFORM } from "@/utils/constants";
import { DOWNLOADABLE_MODELS } from "./downloadable";
import { safeJsonParse } from "@/utils/request";
import ModelCard from "./ModelCard";
import showToast from "@/utils/toast";
import { refocusApplication } from "@/ipc/node-api";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CircleNotch, Plus } from "@phosphor-icons/react";

function getCustomModels(models = []) {
  const OFFICIAL_TAGS = DOWNLOADABLE_MODELS.map((model) => model.id);
  return models.filter((model) => !OFFICIAL_TAGS.includes(model.id));
}

// Highlighted and/or recommended models for use.
const SHORT_MODELS = ["llama3.1:latest", "mistral:latest", "gemma2:latest"];

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
  const [importedModels, setImportedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(
    settings?.AnythingLLMOllamaModelPref
  );
  function startDownload(modelId, modelName) {
    if (modelDownloading !== modelId) {
      window.localStorage.setItem(
        ANYTHINGLLM_OLLAMA.localStorageKey,
        JSON.stringify({ isDownloading: true, modelName, modelId })
      );
      window.dispatchEvent(new CustomEvent(ANYTHINGLLM_OLLAMA.startEvent));
      setModelDownloading(modelId);

      showToast(
        `${modelName} will download in the background. You can check its progress or cancel the download via the progress bar at the top. Chatting will be disabled until the model is ready.`,
        "info",
        { clear: true }
      );
    }
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
    setImportedModels(getCustomModels(models) || []);
  }

  async function refreshModelSelection() {
    const { models } = await System.customModels("anythingllm_ollama");
    setDownloadedModels(models || []);
    setImportedModels(getCustomModels(models) || []);
  }

  useEffect(() => {
    async function findModels() {
      const { models } = await System.customModels("anythingllm_ollama");
      setDownloadedModels(models || []);
      setImportedModels(getCustomModels(models) || []);
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
        setImportedModels(getCustomModels(models) || []);
      };

      const handleDownloadAbort = async () => {
        window.localStorage.removeItem(ANYTHINGLLM_OLLAMA.localStorageKey);
        setModelDownloading(null);
        const { models } = await System.customModels("anythingllm_ollama");
        setDownloadedModels(models || []);
        setImportedModels(getCustomModels(models) || []);
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
      <div className="flex flex-col gap-y-4 w-fit">
        <div className="flex w-fit items-start justify-between">
          <div className="flex flex-col">
            {!showShortList && (
              <UploadCustomModelButton onSuccess={refreshModelSelection} />
            )}
            {hasComponentChanges && (
              <p className="text-white italic font-thin text-sm text-gray-200">
                {short
                  ? "Model will begin downloading in background"
                  : "Pressing save changes will begin the model download"}
              </p>
            )}
          </div>
        </div>

        {/* Short mode is onboarding only where the user will have no downloads */}
        {loading && !short ? (
          <Skeleton.default
            height={130}
            width={280}
            count={12}
            baseColor="#18181b"
            highlightColor="#4c4948"
            enableAnimation={true}
            containerClassName="w-fill flex gap-[12px] flex-wrap p-0"
          />
        ) : (
          <>
            {["windows", "mac"].includes(_APP_PLATFORM.value) ? (
              <>
                <input
                  className="hidden"
                  type="text"
                  name="AnythingLLMOllamaModelPref"
                  readOnly={true}
                  value={selectedModel}
                />

                {importedModels.length !== 0 && (
                  <>
                    <label className="text-white text-base font-bold">
                      Imported Models
                    </label>
                    <div className="flex gap-[12px] w-fill flex-wrap p-0">
                      {importedModels.map((model) => {
                        if (showShortList) return null; // never show this on shortlist
                        return (
                          <ModelCard
                            key={model.id}
                            isCustom={true}
                            model={{
                              ...model,
                              name: model.name.split(":")[0],
                              description:
                                "This is an imported GGUF model from your computer.",
                              licenses: [],
                            }}
                            disabled={false}
                            isActive={model.id === selectedModel}
                            downloaded={true}
                            downloading={false}
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
                  </>
                )}

                <label className="text-white text-base font-bold">
                  Official Models
                </label>
                <div className="flex gap-[12px] w-fill flex-wrap p-0">
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
          </>
        )}
      </div>
    </div>
  );
}

function UploadCustomModelButton({ onSuccess }) {
  const filePicker = useRef(null);
  const [loading, setLoading] = useState("");

  async function handleSelection(e) {
    try {
      e.preventDefault();
      if (!e.target.files.length) return false;
      const filePath = e.target.files[0].path;
      if (!filePath.toLowerCase().endsWith(".gguf")) {
        showToast("Not a valid GGUF file", "error", { clear: true });
        return;
      }

      const filename = filePath.split("/").splice(-1)[0];
      setLoading(`Importing ${filename} from file...`);
      await System.uploadCustomOllamaModel(filePath, (message) =>
        setLoading(message)
      ).then(({ success, error }) => {
        showToast(
          error ?? "Model imported successfully!",
          success ? "success" : "error",
          { clear: true }
        );
        if (success) onSuccess?.();
      });
    } catch (e) {
      showToast(e.message, "error", { clear: true });
      return false;
    } finally {
      // Show last message for a few seconds.
      setTimeout(() => {
        setLoading("");
      }, 2500);
      if (!filePicker.current) return;
      filePicker.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={filePicker}
        multiple={false}
        type="file"
        hidden={true}
        accept=".gguf,.GGUF"
        onChange={handleSelection}
      />
      <div className="flex flex-col w-fit ">
        <button
          type="button"
          onClick={() => filePicker?.current?.click()}
          className="w-fit relative flex h-[40px] items-center border-none hover:bg-slate-600/20 rounded-lg"
        >
          <div className="flex w-full gap-x-2 items-center">
            <div className="border-none bg-zinc-600 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
              {loading ? (
                <CircleNotch
                  weight="bold"
                  size={14}
                  className="shrink-0 animate-spin text-slate-100"
                />
              ) : (
                <Plus
                  weight="bold"
                  size={14}
                  className="shrink-0 text-slate-100"
                />
              )}
            </div>
            <p className="text-left text-slate-100 text-sm">
              Import custom model
            </p>
          </div>
        </button>
        {!!loading && (
          <p className="animate-pulse text-white italic font-thin text-sm text-gray-200">
            {loading}
          </p>
        )}
      </div>
    </>
  );
}
