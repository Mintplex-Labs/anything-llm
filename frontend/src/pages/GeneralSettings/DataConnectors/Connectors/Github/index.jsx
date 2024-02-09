import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { DATA_CONNECTORS } from "@/components/DataConnectorOption";
import System from "@/models/system";
import showToast from "@/utils/toast";
import pluralize from "pluralize";
import { TagsInput } from "react-tag-input-component";
import { Info } from "@phosphor-icons/react";

const DEFAULT_BRANCHES = ["main", "master"];
export default function GithubConnectorSetup() {
  const { image } = DATA_CONNECTORS.github;
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
        `${data.files} ${pluralize("file", data.files)} collected from ${data.author
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
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        <div className="flex w-full">
          <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
            <div className="flex w-full gap-x-4 items-center  pb-6 border-white border-b-2 border-opacity-10">
              <img src={image} alt="Github" className="rounded-lg h-16 w-16" />
              <div className="w-full flex flex-col gap-y-1">
                <div className="items-center flex gap-x-4">
                  <p className="text-2xl font-semibold text-white">
                    Import GitHub Repository
                  </p>
                </div>
                <p className="text-sm font-base text-white text-opacity-60">
                  Import all files from a public or private Github repository
                  and have its files be available in your workspace.
                </p>
              </div>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              {!accessToken && (
                <div className="flex flex-col gap-y-1 py-4 ">
                  <div className="flex flex-col w-fit gap-y-2 bg-blue-600/20 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-x-2">
                      <Info size={20} className="shrink-0 text-blue-400" />
                      <p className="text-blue-400 text-sm">
                        Trying to collect a GitHub repo without a{" "}
                        <a
                          href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                          rel="noreferrer"
                          target="_blank"
                          className="underline"
                        >
                          Personal Access Token
                        </a>{" "}
                        will fail to collect all files due to GitHub API limits.
                      </p>
                    </div>
                    <a
                      href="https://github.com/settings/personal-access-tokens/new"
                      rel="noreferrer"
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      Create a temporary Access Token for this data connector
                      &rarr;
                    </a>
                  </div>
                </div>
              )}

              <div className="w-full flex flex-col py-2">
                <div className="w-full flex items-center gap-4">
                  <div className="flex flex-col w-60">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm font-semibold block">
                        GitHub Repo URL
                      </label>
                      <p className="text-xs text-zinc-300">
                        Url of the GitHub repo you wish to collect.
                      </p>
                    </div>
                    <input
                      type="url"
                      name="repo"
                      className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                      placeholder="https://github.com/Mintplex-Labs/anything-llm"
                      required={true}
                      autoComplete="off"
                      onChange={(e) => setRepo(e.target.value)}
                      onBlur={() => setSettings({ ...settings, repo })}
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex flex-col w-60">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm block flex gap-x-2 items-center">
                        <p className="font-semibold ">Github Access Token</p>{" "}
                        <p className="text-xs text-zinc-300 font-base!">
                          <i>optional</i>
                        </p>
                      </label>
                      <p className="text-xs text-zinc-300 flex gap-x-2">
                        Access Token to prevent rate limiting.
                      </p>
                    </div>
                    <input
                      type="text"
                      name="accessToken"
                      className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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

                <div className="flex flex-col w-1/2 py-4">
                  <div className="flex flex-col gap-y-1 mb-4">
                    <label className="text-white text-sm block flex gap-x-2 items-center">
                      <p className="font-semibold ">File Ignores</p>
                    </label>
                    <p className="text-xs text-zinc-300 flex gap-x-2">
                      List in .gitignore format to ignore specific files during
                      collection. Press enter after each entry you want to save.
                    </p>
                  </div>
                  <TagsInput
                    value={ignores}
                    onChange={setIgnores}
                    name="ignores"
                    placeholder="!*.js, images/*, .DS_Store, bin/*"
                    classNames={{
                      tag: "bg-blue-300/10 text-zinc-800 m-1",
                      input:
                        "flex bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white p-2.5",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-2 w-fit">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 text-lg w-fit border border-slate-200 px-4 py-1 rounded-lg text-slate-200 items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:bg-slate-200 disabled:text-slate-800"
                >
                  {loading
                    ? "Collecting files..."
                    : "Collect all files from GitHub repo"}
                </button>
                {loading && (
                  <p className="text-xs text-zinc-300">
                    Once complete, all files will be available for embedding
                    into workspaces in the document picker.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function GitHubBranchSelection({ repo, accessToken }) {
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
          <label className="text-white text-sm font-semibold block">
            Branch
          </label>
          <p className="text-xs text-zinc-300">
            Branch you wish to collect files of
          </p>
        </div>
        <select
          name="branch"
          required={true}
          className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="text-white text-sm font-semibold block">Branch</label>
        <p className="text-xs text-zinc-300">
          Branch you wish to collect files of
        </p>
      </div>
      <select
        name="branch"
        required={true}
        className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
