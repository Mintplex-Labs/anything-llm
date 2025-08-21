import { useState } from "react";

// We dont support all vectorDBs yet for reranking due to complexities of how each provider
// returns information. We need to normalize the response data so Reranker can be used for each provider.
const supportedVectorDBs = ["lancedb"];
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

export default function VectorSearchMode({ workspace, setHasChanges }) {
  const [selection, setSelection] = useState(
    workspace?.vectorSearchMode ?? "default"
  );
  if (!workspace?.vectorDB || !supportedVectorDBs.includes(workspace?.vectorDB))
    return null;

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
        <option value="rerank">Accuracy Optimized</option>
      </select>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        {hint[selection]?.description}
      </p>
    </div>
  );
}
