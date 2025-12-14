export default function AiBadgrOptions({ settings }) {
  return (
    <div className="flex gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          AI Badgr API Key
        </label>
        <input
          type="password"
          name="AiBadgrApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="AI Badgr API Key"
          defaultValue={settings?.AiBadgrApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {!settings?.credentialsOnly && (
        <>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Model Selection
            </label>
            <input
              type="text"
              name="AiBadgrModelPref"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="premium"
              defaultValue={settings?.AiBadgrModelPref || "premium"}
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
            <p className="text-xs text-theme-text-secondary mt-2">
              Use tier names (basic, normal, premium) or any OpenAI-compatible
              model name
            </p>
          </div>
        </>
      )}
    </div>
  );
}
