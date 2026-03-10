import { useState } from "react";

const hint = {
  off: {
    title: "Off",
    description:
      "Follow-up queries are sent to vector search as-is. This is the default behavior.",
  },
  on: {
    title: "On",
    description:
      "Follow-up queries are rewritten into standalone search queries using chat history, improving RAG results in multi-turn conversations.",
  },
};

export default function QueryRewriteMode({ workspace, setHasChanges }) {
  const [selection, setSelection] = useState(
    workspace?.queryRewriteMode ?? "off"
  );

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="queryRewriteMode" className="block input-label">
          Query Rewriting
        </label>
      </div>
      <select
        name="queryRewriteMode"
        value={selection}
        className="border-none bg-theme-settings-input-bg text-white text-sm mt-2 rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        onChange={(e) => {
          setSelection(e.target.value);
          setHasChanges(true);
        }}
        required={true}
      >
        <option value="off">Off (default)</option>
        <option value="on">On</option>
      </select>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        {hint[selection]?.description}
      </p>
    </div>
  );
}
