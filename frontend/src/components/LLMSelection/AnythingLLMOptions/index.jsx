import { useState, useEffect } from "react";
import System from "../../../models/system";
import { DOWNLOADABLE_MODELS } from "./downloadable";
import { safeJsonParse } from "@/utils/request";
import { Info } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import paths from "../../../utils/paths";

export default function AnythingLLMOptions({ settings, showAlert = false }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedModels, setDownloadedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(
    settings?.AnythingLLMOllamaModelPref
  );

  const navigate = useNavigate();

  function startDownload(modelId, modelName) {
    localStorage.setItem(
      "anythingllm_model_download",
      JSON.stringify({ isDownloading: true, modelName, modelId })
    );
    setIsDownloading(true);
  }

  useEffect(() => {
    async function findModels() {
      const { models } = await System.customModels("anythingllm_ollama");
      setDownloadedModels(models || []);
      const downloadState = localStorage.getItem("anythingllm_model_download");

      if (downloadState) {
        const parsedData = safeJsonParse(downloadState);
        if (parsedData?.isDownloading) {
          setIsDownloading(true);
        }
      }
    }
    findModels();
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
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Available Models
          </label>
          <select
            name="AnythingLLMOllamaModelPref"
            value={selectedModel || ""}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border-none bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option value="" disabled>
              Select a model
            </option>
            {downloadedModels.length > 0 && (
              <optgroup label="Downloaded">
                {downloadedModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {
                      DOWNLOADABLE_MODELS.find(
                        (downloadableModel) => downloadableModel.id === model.id
                      ).name
                    }
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
            <button
              type="button"
              disabled={isDownloading}
              className={`mt-4 text-white text-sm font-semibold block p-2.5 rounded-lg ${
                isDownloading ? "bg-zinc-600 cursor-not-allowed" : "bg-blue-600"
              }`}
              onClick={() => {
                startDownload(selectedModel, selectedModel);
                navigate(0, { replace: false });
              }}
            >
              {isDownloading ? "Downloading..." : "Download"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
