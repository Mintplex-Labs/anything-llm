export default function DocumentSimilarityThreshold({
  workspace,
  setHasChanges,
}) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          Document similarity threshold
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          The minimum similarity score required for a source to be considered
          related to the chat. The higher the number, the more similar the
          source must be to the chat.
        </p>
      </div>
      <select
        name="similarityThreshold"
        defaultValue={workspace?.similarityThreshold ?? 0.25}
        className="bg-zinc-900 text-white text-sm mt-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={() => setHasChanges(true)}
        required={true}
      >
        <option value={0.0}>No restriction</option>
        <option value={0.25}>Low (similarity score &ge; .25)</option>
        <option value={0.5}>Medium (similarity score &ge; .50)</option>
        <option value={0.75}>High (similarity score &ge; .75)</option>
      </select>
    </div>
  );
}
