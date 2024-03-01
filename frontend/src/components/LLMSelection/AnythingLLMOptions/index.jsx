import { useState, useEffect } from "react";
import System from "../../../models/system";
import { DOWNLOADABLE_MODELS } from "./downloadable";

export default function AnythingLLMOptions({ settings }) {
  const [downloadedModels, setDownloadedModels] = useState([]);
  const [selection, setSelection] = useState(
    settings?.AnythingLLMOllamaModelPref
  );

  useEffect(() => {
    async function findModels() {
      const { models } = await System.customModels("anythingllm_ollama");
      setDownloadedModels(models || []);
    }
    findModels();
  }, []);

  return (
    <div className="flex gap-x-4">
      <input
        name="AnythingLLMOllamaModelPref"
        type="hidden"
        value={selection}
      />
      <ModelPicker downloaded={downloadedModels} select={setSelection} />
    </div>
  );
}

// TODO: Display models and their download state
function ModelPicker({ downloaded, select }) {
  // const knownModelTags = DOWNLOADABLE_MODELS.map((model) => model.id);
  // const unknownModels = downloaded.filter((model) => !knownModelTags.includes(model.id));
  return (
    <div className="flex gap-2 flex-wrap">
      {DOWNLOADABLE_MODELS.map((model) => {
        const isDownloaded = !!downloaded.find(
          (curModel) => curModel.id === model.id
        );
        return (
          <button type="button" onClick={() => select(model.id)}>
            {model.name} {isDownloaded ? "yes" : "no"}
          </button>
        );
      })}
    </div>
  );
}
