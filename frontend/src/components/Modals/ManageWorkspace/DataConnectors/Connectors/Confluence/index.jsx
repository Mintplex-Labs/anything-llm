import { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function ConfluenceOptions() {
  const [loading, setLoading] = useState(false);

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
                    <p className="font-bold text-white">
                      Confluence deployment type
                    </p>
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    Determine if your Confluence instance is hosted on Atlassian
                    cloud or self-hosted.
                  </p>
                </div>
                <select
                  name="isCloud"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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
                    <p className="font-bold text-white">Confluence base URL</p>
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    This is the base URL of your Confluence space.
                  </p>
                </div>
                <input
                  type="url"
                  name="baseUrl"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="eg: https://example.atlassian.net, http://localhost:8211, etc..."
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Confluence space key
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    This is the spaces key of your confluence instance that will
                    be used. Usually begins with ~
                  </p>
                </div>
                <input
                  type="text"
                  name="spaceKey"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="eg: ~7120208c08555d52224113949698b933a3bb56"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Confluence Username
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    Your Confluence username.
                  </p>
                </div>
                <input
                  type="text"
                  name="username"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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
                      Confluence Access Token
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
                      className="max-w-xs"
                      clickable={true}
                    >
                      <p className="text-sm">
                        You need to provide an access token for authentication.
                        You can generate an access token{" "}
                        <a
                          href="https://id.atlassian.com/manage-profile/security/api-tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          here
                        </a>
                        .
                      </p>
                    </Tooltip>
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    Access token for authentication.
                  </p>
                </div>
                <input
                  type="password"
                  name="accessToken"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="abcd1234"
                  required={true}
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
              className="mt-2 w-full justify-center border border-slate-200 px-4 py-2 rounded-lg text-dark-text text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? "Collecting pages..." : "Submit"}
            </button>
            {loading && (
              <p className="text-xs text-white/50">
                Once complete, all pages will be available for embedding into
                workspaces.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
