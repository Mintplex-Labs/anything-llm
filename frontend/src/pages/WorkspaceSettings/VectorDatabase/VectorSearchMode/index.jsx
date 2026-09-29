import { useState } from "react";
import { SavedIndicator } from "@/components/AutosaveForm";

// We dont support all vectorDBs yet for reranking due to complexities of how each provider
// returns information. We need to normalize the response data so Reranker can be used for each provider.
const supportedVectorDBs = ["lancedb", "weaviate"];
const SELECT_CLASS =
  "border-none bg-theme-settings-input-bg text-white text-sm mt-2 rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";
const hint = {
  default: {
    title: "Default",
    description:
      "This is the fastest performance, but may not return the most relevant results leading to model hallucinations.",
  },
  rerank: {
    title: "Accuracy Optimized",
    description:
      "LLM responses may take longer to generate, but your responses will be more accurate and relevant.",
  },
};
const weaviateHint = {
  default: "Uses the search mode from the Weaviate settings.",
  vector: "Finds chunks with a similar meaning to the question.",
  hybrid:
    "Combines keyword matching with vector search. Better for names, codes and exact terms. The document similarity threshold does not apply; max context snippets limits the results.",
};

export default function VectorSearchMode({ workspace }) {
  const [selection, setSelection] = useState(
    workspace?.vectorSearchMode ?? "default"
  );
  if (!workspace?.vectorDB || !supportedVectorDBs.includes(workspace?.vectorDB))
    return null;
  if (workspace.vectorDB === "weaviate")
    return (
      <WeaviateSearchMode
        workspace={workspace}
        selection={selection}
        setSelection={setSelection}
      />
    );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-y-[8px]">
        <label htmlFor="name" className="block input-label">
          Search Preference
          <SavedIndicator name="vectorSearchMode" />
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {hint[selection]?.description}
        </p>
      </div>
      <select
        name="vectorSearchMode"
        value={selection}
        className={SELECT_CLASS}
        onChange={(e) => setSelection(e.target.value)}
        required={true}
      >
        <option value="default">Default</option>
        <option value="rerank">Accuracy Optimized</option>
      </select>
    </div>
  );
}

function WeaviateSearchMode({ workspace, selection, setSelection }) {
  const appMode =
    workspace?.weaviateSearchMode === "hybrid" ? "hybrid" : "vector";
  // Stored values from other providers (e.g. "rerank") follow the app setting.
  const value = ["vector", "hybrid"].includes(selection)
    ? selection
    : "default";
  const effectiveMode = value === "default" ? appMode : value;

  return (
    <div className="flex flex-col gap-y-[24px]">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-[8px]">
          <label htmlFor="vectorSearchMode" className="block input-label">
            Search Preference
            <SavedIndicator name="vectorSearchMode" />
          </label>
          <p className="text-white text-opacity-60 text-xs font-medium">
            {weaviateHint[value]}
          </p>
        </div>
        <select
          name="vectorSearchMode"
          value={value}
          className={SELECT_CLASS}
          onChange={(e) => setSelection(e.target.value)}
          required={true}
        >
          <option value="default">
            App default ({appMode === "hybrid" ? "Hybrid" : "Vector"})
          </option>
          <option value="vector">Vector</option>
          <option value="hybrid">Hybrid (keyword + vector)</option>
        </select>
      </div>

      {effectiveMode === "hybrid" && (
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-[8px]">
            <label htmlFor="vectorSearchAlpha" className="block input-label">
              Hybrid alpha
              <SavedIndicator name="vectorSearchAlpha" />
            </label>
            <p className="text-white text-opacity-60 text-xs font-medium">
              0 = keyword only, 1 = vector only. Leave empty to use the app
              setting (
              {workspace?.weaviateHybridAlpha || "Weaviate default 0.75"}
              ).
            </p>
          </div>
          <input
            type="number"
            name="vectorSearchAlpha"
            min={0}
            max={1}
            step="0.05"
            defaultValue={workspace?.vectorSearchAlpha ?? ""}
            placeholder={workspace?.weaviateHybridAlpha || "0.75"}
            className={SELECT_CLASS}
          />
        </div>
      )}
    </div>
  );
}
