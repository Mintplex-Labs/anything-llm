import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function TwelveLabsOptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast("Analyzing video with TwelveLabs Pegasus.", "info", {
        clear: true,
        autoClose: false,
      });

      const { data, error } = await System.dataConnectors.twelvelabs.collect({
        url: form.get("url"),
        apiKey: form.get("apiKey") || undefined,
        indexName: form.get("indexName") || undefined,
        prompt: form.get("prompt") || undefined,
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `Video analysis complete. Output folder is ${data.destination}.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setLoading(false);
      return;
    } catch (e) {
      console.error(e);
      showToast(e.message, "error", { clear: true });
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pb-6 pb-16">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col py-2">
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    {t("connectors.twelvelabs.URL")}
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.twelvelabs.URL_explained")}
                  </p>
                </div>
                <input
                  type="url"
                  name="url"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="https://example.com/video.mp4"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                    {t("connectors.twelvelabs.api_key")}
                    <p className="!text-xs !font-normal !text-theme-text-secondary">
                      {t("connectors.twelvelabs.optional")}
                    </p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.twelvelabs.api_key_explained")}
                  </p>
                </div>
                <input
                  type="password"
                  name="apiKey"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="tlk_..."
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                    {t("connectors.twelvelabs.index_name")}
                    <p className="!text-xs !font-normal !text-theme-text-secondary">
                      {t("connectors.twelvelabs.optional")}
                    </p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.twelvelabs.index_name_explained")}
                  </p>
                </div>
                <input
                  type="text"
                  name="indexName"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="anythingllm-pegasus"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                    {t("connectors.twelvelabs.prompt")}
                    <p className="!text-xs !font-normal !text-theme-text-secondary">
                      {t("connectors.twelvelabs.optional")}
                    </p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.twelvelabs.prompt_explained")}
                  </p>
                </div>
                <textarea
                  name="prompt"
                  rows={3}
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder={t("connectors.twelvelabs.prompt_placeholder")}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full justify-center border-none px-4 py-2 rounded-lg text-dark-text light:text-white text-sm font-bold items-center flex gap-x-2 bg-theme-home-button-primary hover:bg-theme-home-button-primary-hover disabled:bg-theme-home-button-primary-hover disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing video..." : "Analyze video"}
            </button>
            {loading && (
              <p className="text-xs text-theme-text-secondary max-w-sm">
                {t("connectors.twelvelabs.task_explained")}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
