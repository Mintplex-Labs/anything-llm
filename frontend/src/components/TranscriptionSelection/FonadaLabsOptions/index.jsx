export default function FonadaLabsOptions({ settings }) {
  return (
    <div className="flex gap-x-7 gap-[36px] mt-1.5 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          FonadaLabs API Key
        </label>
        <input
          type="password"
          name="WhisperFonadaLabsApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="API Key"
          defaultValue={settings?.WhisperFonadaLabsApiKey ? "*".repeat(20) : ""}
          required={!settings?.WhisperFonadaLabsApiKey}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Your FonadaLabs API key. It is stored as a protected server setting.
        </p>
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Language ID
        </label>
        <input
          type="text"
          name="WhisperFonadaLabsLanguageId"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="en"
          defaultValue={settings?.WhisperFonadaLabsLanguageId || "en"}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          FonadaLabs language_id, for example <code>en</code> or <code>hi</code>.
        </p>
      </div>
    </div>
  );
}
