export default function MaxContextSnippets({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Max Context Snippets
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This setting controls the maximum amount of context snippets the will
          be sent to the LLM for per chat or query.
          <br />
          <i>Recommended: 4</i>
        </p>
      </div>
      <input
        name="topN"
        type="number"
        min={1}
        max={12}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.topN ?? 4}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2"
        placeholder="4"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
