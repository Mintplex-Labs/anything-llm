export function GoogleSearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-white/60 my-2">
        You can get a free search engine & API key{" "}
        <a
          href="https://programmablesearchengine.google.com/controlpanel/create"
          target="_blank"
          className="text-blue-300 underline"
        >
          from Google here.
        </a>
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Search engine ID
          </label>
          <input
            type="text"
            name="env::AgentGoogleSearchEngineId"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Google Search Engine Id"
            defaultValue={settings?.AgentGoogleSearchEngineId}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Programmatic Access API Key
          </label>
          <input
            type="password"
            name="env::AgentGoogleSearchEngineKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Google Search Engine API Key"
            defaultValue={
              settings?.AgentGoogleSearchEngineKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

export function SerperDotDevOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-white/60 my-2">
        You can get a free API key{" "}
        <a
          href="https://serper.dev"
          target="_blank"
          className="text-blue-300 underline"
        >
          from Serper.dev.
        </a>
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            API Key
          </label>
          <input
            type="password"
            name="env::AgentSerperApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Serper.dev API Key"
            defaultValue={settings?.AgentSerperApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}
