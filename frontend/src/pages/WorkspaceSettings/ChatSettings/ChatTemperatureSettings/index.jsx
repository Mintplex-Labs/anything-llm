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
          This setting controls how &quot;creative&quot; your LLM responses will
          be.
          <br />
          The higher the number the more creative. For some models this can lead
          to incoherent responses when set too high.
          <br />
          <br />
          <i>
            Most LLMs have various acceptable ranges of valid values. Consult
            your LLM provider for that information.
          </i>
        </p>
      </div>
      <input
        name="openAiTemp"
        type="number"
        min={0.0}
        step={0.1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiTemp ?? defaults.temp}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="0.7"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
