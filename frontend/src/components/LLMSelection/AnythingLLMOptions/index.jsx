import { useState, useEffect } from "react";
import System from "../../../models/system";
import { ANYTHINGLLM_OLLAMA } from "@/utils/constants";
import { DOWNLOADABLE_MODELS } from "./downloadable";
import { safeJsonParse } from "@/utils/request";
import { Info } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import paths from "../../../utils/paths";
import PreLoader from "@/components/Preloader";

export default function AnythingLLMOptions({
  settings,
  showAlert = false,
  downloadButtonRef,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
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
    setIsDownloading(true);
  }

  async function uninstallModel(modelName) {
    await System.deleteOllamaModel(modelName);
    const { models } = await System.customModels("anythingllm_ollama");
    setIsDownloading(false);
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
          setIsDownloading(true);
        }
      }
    }
    findModels();

    const handleDownloadComplete = () => {
      setIsDownloading(false);
      findModels();
    };

    const handleDownloadAbort = () => {
      window.localStorage.removeItem(ANYTHINGLLM_OLLAMA.localStorageKey);
      setIsDownloading(false);
      findModels();
    };

    window.addEventListener(
      ANYTHINGLLM_OLLAMA.completeEvent,
      handleDownloadComplete
    );
    window.addEventListener(ANYTHINGLLM_OLLAMA.abortEvent, handleDownloadAbort);

    return () => {
      window.removeEventListener(
        ANYTHINGLLM_OLLAMA.completeEvent,
        handleDownloadComplete
      );
      window.removeEventListener(
        ANYTHINGLLM_OLLAMA.abortEvent,
        handleDownloadAbort
      );
    };
  }, []);

  const isModelDownloaded = (modelId) =>
    !!downloadedModels.find((model) => model.id === modelId);

  return (
    <div className="w-full flex flex-col">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              AnythingLLM as your LLM requires you to set an embedding service.
            </p>
          </div>
          <Link
            to={paths.settings.embeddingPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            Manage embedding &rarr;
          </Link>
        </div>
      )}
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Available Models
          </label>
          <select
            disabled={isDownloading}
            name="AnythingLLMOllamaModelPref"
            value={selectedModel || ""}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              Select a model
            </option>
            {downloadedModels.length > 0 && (
              <optgroup label="Downloaded">
                {downloadedModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {DOWNLOADABLE_MODELS.find(
                      (downloadableModel) => downloadableModel.id === model.id
                    )?.name || "unknown model"}
                  </option>
                ))}
              </optgroup>
            )}
            {DOWNLOADABLE_MODELS.filter((model) => !isModelDownloaded(model.id))
              .length > 0 && (
              <optgroup label="Available to Download">
                {DOWNLOADABLE_MODELS.filter(
                  (model) => !isModelDownloaded(model.id)
                ).map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          {selectedModel && !isModelDownloaded(selectedModel) && (
            <div
              ref={downloadButtonRef}
              type="button"
              className="hidden"
              onClick={() => {
                startDownload(
                  selectedModel,
                  DOWNLOADABLE_MODELS.find(
                    (model) => model.id === selectedModel
                  ).name
                );
              }}
            />
          )}
        </div>
        <ModelInformation
          selectedModel={selectedModel}
          isDownloading={isDownloading}
          isModelDownloaded={isModelDownloaded(selectedModel)}
          uninstall={uninstallModel}
        />
      </div>
    </div>
  );
}

function ModelInformation({
  selectedModel,
  isDownloading,
  isModelDownloaded,
  uninstall,
}) {
  const modelInfo = DOWNLOADABLE_MODELS.find(
    (model) => model.id === selectedModel
  );

  if (!modelInfo) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <label className="text-white text-sm font-semibold block mb-4">
        Model Information
      </label>
      <div className="border-none bg-zinc-900 text-white text-sm rounded-lg px-4 max-w-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{modelInfo.name}</h3>
          <p className="text-sm text-white/80 mt-4">{modelInfo.description}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Licenses:</h4>
          <ul className="list-disc pl-4 text-sm">
            {modelInfo.licenses.map((license) => (
              <li key={license.link}>
                <a
                  href={license.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {license.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {!isModelDownloaded && !isDownloading && (
          <div className="flex items-center gap-x-2 mb-4">
            <div className="text-xs italic text-white/80">
              Download of model ({modelInfo.size}) will begin once changes are
              saved.
            </div>
          </div>
        )}
        {isDownloading && (
          <div className="flex items-center gap-x-2 mb-4">
            <div className="text-xs">Status: Pulling</div>
            <PreLoader size="3" />
          </div>
        )}
        {isModelDownloaded && (
          <div className="flex items-center gap-x-2 mb-4">
            <div className="text-xs">Status: Downloaded & ready to use</div>

            <button
              onClick={() => uninstall(modelInfo.id)}
              className="border-none bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1 rounded-lg text-white"
            >
              Uninstall
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
