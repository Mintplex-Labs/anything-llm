export function GoogleSearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-white/60 my-2">
        You can get a free search engine & API key{" "}
        <a
          href="https://programmablesearchengine.google.com/controlpanel/create"
          target="_blank"
          rel="noreferrer"
          className="text-blue-300 underline"
        >
          from Google here.
        </a>
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Search engine ID
          </label>
          <input
            type="text"
            name="env::AgentGoogleSearchEngineId"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Google Search Engine Id"
            defaultValue={settings?.AgentGoogleSearchEngineId}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Programmatic Access API Key
          </label>
          <input
            type="password"
            name="env::AgentGoogleSearchEngineKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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
          rel="noreferrer"
          className="text-blue-300 underline"
        >
          from Serper.dev.
        </a>
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="env::AgentSerperApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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

export function BingSearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-white/60 my-2">
        You can get a Bing Web Search API subscription key{" "}
        <a
          href="https://portal.azure.com/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-300 underline"
        >
          from the Azure portal.
        </a>
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="env::AgentBingSearchApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Bing Web Search API Key"
            defaultValue={settings?.AgentBingSearchApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <p className="text-sm text-white/60 my-2">
        To set up a Bing Web Search API subscription:
      </p>
      <ol className="list-decimal text-sm text-white/60 ml-6">
        <li>
          Go to the Azure portal:{" "}
          <a
            href="https://portal.azure.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-300 underline"
          >
            https://portal.azure.com/
          </a>
        </li>
        <li>Create a new Azure account or sign in with an existing one.</li>
        <li>
          Navigate to the "Create a resource" section and search for "Bing
          Search v7".
        </li>
        <li>
          Select the "Bing Search v7" resource and create a new subscription.
        </li>
        <li>
          Choose the pricing tier that suits your needs (free tier available).
        </li>
        <li>Obtain the API key for your Bing Web Search subscription.</li>
      </ol>
    </>
  );
}

export function SerplySearchOptions({ settings }) {
  return (
    <>
      <p className="text-sm text-white/60 my-2">
        You can get a free API key{" "}
        <a
          href="https://serply.io"
          target="_blank"
          rel="noreferrer"
          className="text-blue-300 underline"
        >
          from Serply.io.
        </a>
      </p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="env::AgentSerplyApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Serply API Key"
            defaultValue={settings?.AgentSerplyApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

export function SearXNGOptions({ settings }) {
  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          SearXNG API base URL
        </label>
        <input
          type="url"
          name="env::AgentSearXNGApiUrl"
          className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="SearXNG API Key"
          defaultValue={settings?.AgentSearXNGApiUrl}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
