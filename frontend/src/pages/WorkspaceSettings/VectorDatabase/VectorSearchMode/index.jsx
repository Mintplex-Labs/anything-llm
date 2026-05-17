import { useState } from "react";

// Providers below ship a native hybrid path. Other providers transparently use
// the app-side BM25 fallback in the HybridSearch orchestrator, so we still allow
// the option for them — but reranker mode stays restricted to LanceDB.
const rerankSupportedVectorDBs = ["lancedb"];

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
  hybrid: {
    title: "Hybrid Search",
    description:
      "Combines keyword (BM25) and semantic (vector) retrieval. Use the slider below to weight one over the other. Recommended when exact terms or document names matter.",
  },
};

export default function VectorSearchMode({ workspace, setHasChanges }) {
  const [selection, setSelection] = useState(
    workspace?.vectorSearchMode ?? "default"
  );
  const [alpha, setAlpha] = useState(
    typeof workspace?.hybridSearchAlpha === "number"
      ? workspace.hybridSearchAlpha
      : 0.5
  );

  if (!workspace?.vectorDB) return null;

  const showRerank = rerankSupportedVectorDBs.includes(workspace.vectorDB);

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          Search Preference
        </label>
      </div>
      <select
        name="vectorSearchMode"
        value={selection}
        className="border-none bg-theme-settings-input-bg text-white text-sm mt-2 rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        onChange={(e) => {
          setSelection(e.target.value);
          setHasChanges(true);
        }}
        required={true}
      >
        <option value="default">Default</option>
        {showRerank && <option value="rerank">Accuracy Optimized</option>}
        <option value="hybrid">Hybrid (Keyword + Semantic)</option>
      </select>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        {hint[selection]?.description}
      </p>

      {selection === "hybrid" && (
        <div className="mt-3">
          <label htmlFor="hybridSearchAlpha" className="block input-label">
            Hybrid Weight (semantic ↔ keyword)
          </label>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-white text-opacity-60 text-xs w-20">
              Keyword
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              name="hybridSearchAlpha"
              value={alpha}
              onChange={(e) => {
                setAlpha(parseFloat(e.target.value));
                setHasChanges(true);
              }}
              className="flex-1"
            />
            <span className="text-white text-opacity-60 text-xs w-20 text-right">
              Semantic
            </span>
            <span className="text-white text-sm w-12 text-right">
              {alpha.toFixed(2)}
            </span>
          </div>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            0 = pure keyword (BM25). 1 = pure semantic (vector). 0.5 = balanced.
          </p>
        </div>
      )}
    </div>
  );
}
