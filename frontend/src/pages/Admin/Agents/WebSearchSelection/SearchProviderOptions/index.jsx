import { useTranslation, Trans } from "react-i18next";
export function GoogleSearchOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <>
      <p
        className="text-sm text-white/60 my-2"
        dangerouslySetInnerHTML={{
          __html: t("searchProvidesOption.googleSearch.description"),
        }}
      ></p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("searchProvidesOption.googleSearch.searchEngineId")}
          </label>
          <input
            type="text"
            name="env::AgentGoogleSearchEngineId"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t(
              "searchProvidesOption.googleSearch.placeholderEngineId"
            )}
            defaultValue={settings?.AgentGoogleSearchEngineId}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("searchProvidesOption.googleSearch.apiKey")}
          </label>
          <input
            type="password"
            name="env::AgentGoogleSearchEngineKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t(
              "searchProvidesOption.googleSearch.placeholderApiKey"
            )}
            defaultValue={
              settings?.AgentGoogleSearchEngineKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

export function SerperDotDevOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <>
      <p
        className="text-sm text-white/60 my-2"
        dangerouslySetInnerHTML={{
          __html: t("searchProvidesOption.serperDotDev.description"),
        }}
      ></p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("searchProvidesOption.serperDotDev.apiKey")}
          </label>
          <input
            type="password"
            name="env::AgentSerperApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t(
              "searchProvidesOption.serperDotDev.placeholderApiKey"
            )}
            defaultValue={settings?.AgentSerperApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

export function BingSearchOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <>
      <p
        className="text-sm text-white/60 my-2"
        dangerouslySetInnerHTML={{
          __html: t("searchProvidesOption.bingSearch.description"),
        }}
      ></p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("searchProvidesOption.bingSearch.apiKey")}
          </label>
          <input
            type="password"
            name="env::AgentBingSearchApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("searchProvidesOption.bingSearch.placeholderApiKey")}
            defaultValue={settings?.AgentBingSearchApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
      <p className="text-sm text-white/60 my-2">
        {t("searchProvidesOption.bingSearch.setupDescription")}
      </p>
      <ol className="list-decimal text-sm text-white/60 ml-6">
        <li
          dangerouslySetInnerHTML={{
            __html: t("searchProvidesOption.bingSearch.steps.step1"),
          }}
        ></li>
        <li>{t("searchProvidesOption.bingSearch.steps.step2")}</li>
        <li>{t("searchProvidesOption.bingSearch.steps.step3")}</li>
        <li>{t("searchProvidesOption.bingSearch.steps.step4")}</li>
        <li>{t("searchProvidesOption.bingSearch.steps.step5")}</li>
        <li>{t("searchProvidesOption.bingSearch.steps.step6")}</li>
      </ol>
    </>
  );
}

export function SerplySearchOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <>
      <p
        className="text-sm text-white/60 my-2"
        dangerouslySetInnerHTML={{
          __html: t("searchProvidesOption.serply.description"),
        }}
      ></p>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("searchProvidesOption.serply.apiKey")}
          </label>
          <input
            type="password"
            name="env::AgentSerplyApiKey"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("searchProvidesOption.serply.placeholderApiKey")}
            defaultValue={settings?.AgentSerplyApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}

export function SearXNGOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {t("searchProvidesOption.searxng.baseUrl")}
        </label>
        <input
          type="url"
          name="env::AgentSearXNGApiUrl"
          className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder={t("searchProvidesOption.searxng.placeholderUrl")}
          defaultValue={settings?.AgentSearXNGApiUrl}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
