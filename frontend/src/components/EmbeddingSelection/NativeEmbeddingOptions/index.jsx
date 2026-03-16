import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import System from "@/models/system";

export default function NativeEmbeddingOptions({ settings }) {
  const [loading, setLoading] = useState(true);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(
    settings?.EmbeddingModelPref
  );
  const [selectedModelInfo, setSelectedModelInfo] = useState();

  useEffect(() => {
    System.customModels("native-embedder")
      .then(({ models }) => {
        if (models?.length > 0) {
          setAvailableModels(models);
          const _selectedModel =
            models.find((model) => model.id === settings?.EmbeddingModelPref) ??
            models[0];
          setSelectedModel(_selectedModel.id);
          setSelectedModelInfo(_selectedModel);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!availableModels?.length || !selectedModel) return;
    setSelectedModelInfo(
      availableModels.find((model) => model.id === selectedModel)
    );
  }, [selectedModel, availableModels]);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex flex-col mt-1.5">
        <div className="flex flex-col w-96">
          <label className="text-white text-sm font-semibold block mb-3">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            defaultValue={selectedModel}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-theme-text-primary text-sm rounded-lg block w-60 p-2.5"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {loading ? (
              <option
                value="--loading-available-models--"
                disabled={true}
                selected={true}
              >
                --loading available models--
              </option>
            ) : (
              <optgroup label="Available embedding models">
                {availableModels.map((model) => {
                  return (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={selectedModel === model.id}
                    >
                      {model.name}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>
        </div>
        {selectedModelInfo && (
          <div className="flex flex-col gap-y-2 mt-2">
            <p className="text-theme-text-secondary text-xs font-normal block">
              {selectedModelInfo?.description}
            </p>
            <p className="text-theme-text-secondary text-xs font-normal block">
              Trained on: {selectedModelInfo?.lang}
            </p>
            <p className="text-theme-text-secondary text-xs font-normal block">
              Download Size: {selectedModelInfo?.size}
            </p>
            <Link
              to={selectedModelInfo?.modelCard}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-text-secondary text-xs font-normal block underline hover:text-theme-text-primary"
            >
              View model card on Hugging Face &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
