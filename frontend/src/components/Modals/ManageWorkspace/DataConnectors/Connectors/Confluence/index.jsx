import { useState } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function ConfluenceOptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [accessType, setAccessType] = useState("username");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast(
        "Fetching all pages for Confluence space - this may take a while.",
        "info",
        {
          clear: true,
          autoClose: false,
        }
      );
      const { data, error } = await System.dataConnectors.confluence.collect({
        baseUrl: form.get("baseUrl"),
        spaceKey: form.get("spaceKey"),
        username: form.get("username"),
        accessToken: form.get("accessToken"),
        cloud: form.get("isCloud") === "true",
        personalAccessToken: form.get("personalAccessToken"),
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `Pages collected from Confluence space ${data.spaceKey}. Output folder is ${data.destination}.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setLoading(false);
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
                  <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                    <p className="font-bold text-theme-text-primary">
                      {t("connectors.confluence.deployment_type")}
                    </p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.confluence.deployment_type_explained")}
                  </p>
                </div>
                <select
                  name="isCloud"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                  defaultValue="true"
                >
                  <option value="true">Atlassian Cloud</option>
                  <option value="false">Self-hosted</option>
                </select>
              </div>

              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                    <p className="font-bold text-white">
                      {t("connectors.confluence.base_url")}
                    </p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.confluence.base_url_explained")}
                  </p>
                </div>
                <input
                  type="url"
                  name="baseUrl"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="eg: https://example.atlassian.net, http://localhost:8211, etc..."
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    {t("connectors.confluence.space_key")}
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.confluence.space_key_explained")}
                  </p>
                </div>
                <input
                  type="text"
                  name="spaceKey"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="eg: ~7120208c08555d52224113949698b933a3bb56"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    {t("connectors.confluence.auth_type")}
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.confluence.auth_type_explained")}
                  </p>
                </div>
                <select
                  name="accessType"
                  className="border-none bg-theme-settings-input-bg w-fit mt-2 px-4 border-gray-500 text-white text-sm rounded-lg block py-2"
                  defaultValue={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                >
                  {[
                    {
                      name: t("connectors.confluence.auth_type_username"),
                      value: "username",
                    },
                    {
                      name: t("connectors.confluence.auth_type_personal"),
                      value: "personalToken",
                    },
                  ].map((type) => {
                    return (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {accessType === "username" && (
                <>
                  <div className="flex flex-col pr-10">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm font-bold">
                        {t("connectors.confluence.username")}
                      </label>
                      <p className="text-xs font-normal text-theme-text-secondary">
                        {t("connectors.confluence.username_explained")}
                      </p>
                    </div>
                    <input
                      type="text"
                      name="username"
                      className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                      placeholder="jdoe@example.com"
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex flex-col pr-10">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                        <p className="font-bold text-white">
                          {t("connectors.confluence.token")}
                        </p>
                        <Warning
                          size={14}
                          className="ml-1 text-orange-500 cursor-pointer"
                          data-tooltip-id="access-token-tooltip"
                          data-tooltip-place="right"
                        />
                        <Tooltip
                          delayHide={300}
                          id="access-token-tooltip"
                          className="max-w-xs z-99"
                          clickable={true}
                        >
                          <p className="text-sm">
                            {t("connectors.confluence.token_explained_start")}
                            <a
                              href="https://id.atlassian.com/manage-profile/security/api-tokens"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {t("connectors.confluence.token_explained_link")}
                            </a>
                            .
                          </p>
                        </Tooltip>
                      </label>
                      <p className="text-xs font-normal text-theme-text-secondary">
                        {t("connectors.confluence.token_desc")}
                      </p>
                    </div>
                    <input
                      type="password"
                      name="accessToken"
                      className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                      placeholder="abcd1234"
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}
              {accessType === "personalToken" && (
                <div className="flex flex-col pr-10">
                  <div className="flex flex-col gap-y-1 mb-4">
                    <label className="text-white text-sm font-bold">
                      {t("connectors.confluence.pat_token")}
                    </label>
                    <p className="text-xs font-normal text-theme-text-secondary">
                      {t("connectors.confluence.pat_token_explained")}
                    </p>
                  </div>
                  <input
                    type="password"
                    name="personalAccessToken"
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="abcd1234"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full justify-center border-none px-4 py-2 rounded-lg text-dark-text light:text-white text-sm font-bold items-center flex gap-x-2 bg-theme-home-button-primary hover:bg-theme-home-button-primary-hover disabled:bg-theme-home-button-primary-hover disabled:cursor-not-allowed"
            >
              {loading ? "Collecting pages..." : "Submit"}
            </button>
            {loading && (
              <p className="text-xs text-theme-text-secondary">
                {t("connectors.confluence.task_explained")}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
