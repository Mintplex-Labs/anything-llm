function recommendedSettings(provider = null) {
  switch (provider) {
    case "mistral":
      return { temp: 0 };
    default:
      return { temp: 0.7 };
  }
}

export default function ChatTemperatureSettings({
  settings,
  workspace,
  setHasChanges,
}) {
  const defaults = recommendedSettings(settings?.LLMProvider);
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          LLM Temperature
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This setting controls how &quot;random&quot; or dynamic your chat
          responses will be.
          <br />
          The higher the number (1.0 maximum) the more random and incoherent.
          <br />
          <i>Recommended: {defaults.temp}</i>
        </p>
      </div>
      <input
        name="openAiTemp"
        type="number"
        min={0.0}
        max={1.0}
        step={0.1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiTemp ?? defaults.temp}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="0.7"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
