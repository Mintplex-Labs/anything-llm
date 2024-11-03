export default function VertexLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            GCP Project Name
          </label>
          <input
            type="text"
            name="VertexProjectName"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="eg: your-project-name"
            defaultValue={settings?.VertexProjectName ?? ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            GCP Region
          </label>
          <input
            type="text"
            name="VertexRegion"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="eg: europe-west4"
            defaultValue={settings?.VertexRegion ?? ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {!settings?.credentialsOnly && (
          <VertexLLMModelSelection settings={settings} />
        )}
      </div>
    </div>
  );

  function VertexLLMModelSelection({ settings }) {
    console.log(settings);
    return (
      <>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Chat Model Selection
          </label>
          <select
            name="VertexLLMModelPref"
            defaultValue={settings?.VertexLLMModelPref || "gemini-1.5-flash"}
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label="Stable Models">
              {[
                "gemini-1.5-flash",
                "gemini-1.5-pro",
                "gemini-1.5-flash-001",
                "gemini-1.5-pro-001",
                "gemini-1.5-flash-002",
                "gemini-1.5-pro-002",
              ].map((model) => {
                return (
                  <option key={model} value={model}>
                    {model}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Safety Setting
          </label>
          <select
            name="VertexSafetySetting"
            defaultValue={
              settings?.VertexSafetySetting || "BLOCK_MEDIUM_AND_ABOVE"
            }
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option value="BLOCK_NONE">None</option>
            <option value="BLOCK_ONLY_HIGH">Block few</option>
            <option value="BLOCK_MEDIUM_AND_ABOVE">Block some (default)</option>
            <option value="BLOCK_LOW_AND_ABOVE">Block most</option>
          </select>
        </div>
      </>
    );
  }
}
