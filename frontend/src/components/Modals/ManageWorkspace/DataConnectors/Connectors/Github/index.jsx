import React, { useEffect, useState } from "react";
import System from "@/models/system";
import { useTranslation } from "react-i18next";
import showToast from "@/utils/toast";
import pluralize from "pluralize";
import { TagsInput } from "react-tag-input-component";
import { Info, Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

const DEFAULT_BRANCHES = ["main", "master"];
export default function GithubOptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [ignores, setIgnores] = useState([]);

  const [settings, setSettings] = useState({
    repo: null,
    accessToken: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast(
        "Fetching all files for repo - this may take a while.",
        "info",
        { clear: true, autoClose: false }
      );
      const { data, error } = await System.dataConnectors.github.collect({
        repo: form.get("repo"),
        accessToken: form.get("accessToken"),
        branch: form.get("branch"),
        ignorePaths: ignores,
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `${data.files} ${pluralize("file", data.files)} collected from ${
          data.author
        }/${data.repo}:${data.branch}. Output folder is ${data.destination}.`,
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
                    {t("connectors.github.URL")}
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.github.URL_explained")}
                  </p>
                </div>
                <input
                  type="url"
                  name="repo"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="https://github.com/Mintplex-Labs/anything-llm"
                  required={true}
                  autoComplete="off"
                  onChange={(e) => setRepo(e.target.value)}
                  onBlur={() => setSettings({ ...settings, repo })}
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white font-bold text-sm flex gap-x-2 items-center">
                    <p className="font-bold text-white">
                      {t("connectors.github.token")}
                    </p>{" "}
                    <p className="text-xs font-light flex items-center">
                      <span className="text-theme-text-secondary">
                        {t("connectors.github.optional")}
                      </span>
                      <PATTooltip accessToken={accessToken} />
                    </p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.github.token_explained")}
                  </p>
                </div>
                <input
                  type="text"
                  name="accessToken"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="github_pat_1234_abcdefg"
                  required={false}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => setAccessToken(e.target.value)}
                  onBlur={() => setSettings({ ...settings, accessToken })}
                />
              </div>
              <GitHubBranchSelection
                repo={settings.repo}
                accessToken={settings.accessToken}
              />
            </div>

            <div className="flex flex-col w-full py-4 pr-10">
              <div className="flex flex-col gap-y-1 mb-4">
                <label className="text-white text-sm flex gap-x-2 items-center">
                  <p className="text-white text-sm font-bold">
                    {t("connectors.github.ignores")}
                  </p>
                </label>
                <p className="text-xs font-normal text-theme-text-secondary">
                  {t("connectors.github.git_ignore")}
                </p>
              </div>
              <TagsInput
                value={ignores}
                onChange={setIgnores}
                name="ignores"
                placeholder="!*.js, images/*, .DS_Store, bin/*"
                classNames={{
                  tag: "bg-theme-settings-input-bg light:bg-black/10 bg-blue-300/10 text-zinc-800",
                  input:
                    "flex p-1 !bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <PATAlert accessToken={accessToken} />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full justify-center border-none px-4 py-2 rounded-lg text-dark-text light:text-white text-sm font-bold items-center flex gap-x-2 bg-theme-home-button-primary hover:bg-theme-home-button-primary-hover disabled:bg-theme-home-button-primary-hover disabled:cursor-not-allowed"
            >
              {loading ? "Collecting files..." : "Submit"}
            </button>
            {loading && (
              <p className="text-xs text-white/50">
                {t("connectors.github.task_explained")}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function GitHubBranchSelection({ repo, accessToken }) {
  const { t } = useTranslation();
  const [allBranches, setAllBranches] = useState(DEFAULT_BRANCHES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllBranches() {
      if (!repo) {
        setAllBranches(DEFAULT_BRANCHES);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { branches } = await System.dataConnectors.github.branches({
        repo,
        accessToken,
      });
      setAllBranches(branches.length > 0 ? branches : DEFAULT_BRANCHES);
      setLoading(false);
    }
    fetchAllBranches();
  }, [repo, accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <div className="flex flex-col gap-y-1 mb-4">
          <label className="text-white text-sm font-bold">Branch</label>
          <p className="text-xs font-normal text-theme-text-secondary">
            {t("connectors.github.branch")}
          </p>
        </div>
        <select
          name="branch"
          required={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {t("connectors.github.branch_loading")}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="text-white text-sm font-bold">Branch</label>
        <p className="text-xs font-normal text-theme-text-secondary">
          {t("connectors.github.branch_explained")}
        </p>
      </div>
      <select
        name="branch"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg block w-full p-2.5"
      >
        {allBranches.map((branch) => {
          return (
            <option key={branch} value={branch}>
              {branch}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function PATAlert({ accessToken }) {
  const { t } = useTranslation();
  if (!!accessToken) return null;
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
      <div className="gap-x-2 flex items-center">
        <Info className="shrink-0" size={25} />
        <p className="text-sm">
          <span
            dangerouslySetInnerHTML={{
              __html: t("connectors.github.token_information"),
            }}
          />
          <br />
          <br />
          <a
            href="https://github.com/settings/personal-access-tokens/new"
            rel="noreferrer"
            target="_blank"
            className="underline"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            {t("connectors.github.token_personal")}
          </a>
        </p>
      </div>
    </div>
  );
}

function PATTooltip({ accessToken }) {
  const { t } = useTranslation();
  if (!!accessToken) return null;
  return (
    <>
      {!accessToken && (
        <Warning
          size={14}
          className="ml-1 text-orange-500 cursor-pointer"
          data-tooltip-id="access-token-tooltip"
          data-tooltip-place="right"
        />
      )}
      <Tooltip
        delayHide={300}
        id="access-token-tooltip"
        className="max-w-xs z-99"
        clickable={true}
      >
        <p className="text-sm">
          {t("connectors.github.token_explained_start")}
          <a
            href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
            rel="noreferrer"
            target="_blank"
            className="underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t("connectors.github.token_explained_link1")}
          </a>
          {t("connectors.github.token_explained_middle")}
          <a
            href="https://github.com/settings/personal-access-tokens/new"
            rel="noreferrer"
            target="_blank"
            className="underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t("connectors.github.token_explained_link2")}
          </a>
          {t("connectors.github.token_explained_end")}
        </p>
      </Tooltip>
    </>
  );
}
