/**
 * Copyright 2024
 *
 * Authors:
 *  - Eugen Mayer (KontextWork)
 */

import { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function DrupalWikiOptions() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast(
        "Fetching all pages for the given Drupal Wiki spaces - this may take a while.",
        "info",
        {
          clear: true,
          autoClose: false,
        }
      );
      const { data, error } = await System.dataConnectors.drupalwiki.collect({
        baseUrl: form.get("baseUrl"),
        spaceIds: form.get("spaceIds"),
        accessToken: form.get("accessToken"),
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `Pages collected from Drupal Wiki spaces ${data.spaceIds}. Output folder is ${data.destination}.`,
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
                    <p className="font-bold text-white">Drupal Wiki base URL</p>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    This is the base URL of your&nbsp;
                    <a
                      href="https://drupal-wiki.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Drupal Wiki
                    </a>
                    .
                  </p>
                </div>
                <input
                  type="url"
                  name="baseUrl"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="eg: https://mywiki.drupal-wiki.net, https://drupalwiki.mycompany.tld, etc..."
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Drupal Wiki Space IDs
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    Comma separated Space IDs you want to extract. See the&nbsp;
                    <a
                      href="https://help.drupal-wiki.com/node/606"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      manual
                    </a>
                    &nbsp; on how to retrieve the Space IDs. Be sure that your
                    'API-Token User' has access to those spaces.
                  </p>
                </div>
                <input
                  type="text"
                  name="spaceIds"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="eg: 12,34,69"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                    <p className="font-bold text-white">
                      Drupal Wiki API Token
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
                      <p className="text-sm font-light text-theme-text-primary">
                        You need to provide an API token for authentication. See
                        the Drupal Wiki&nbsp;
                        <a
                          href="https://help.drupal-wiki.com/node/605#2-Zugriffs-Token-generieren"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          manual
                        </a>
                        &nbsp;on how to generate an API-Token for your user.
                      </p>
                    </Tooltip>
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    Access token for authentication.
                  </p>
                </div>
                <input
                  type="password"
                  name="accessToken"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="pat:123"
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
              className="mt-2 w-full justify-center border-none px-4 py-2 rounded-lg text-dark-text light:text-white text-sm font-bold items-center flex gap-x-2 bg-theme-home-button-primary hover:bg-theme-home-button-primary-hover disabled:bg-theme-home-button-primary-hover disabled:cursor-not-allowed"
            >
              {loading ? "Collecting pages..." : "Submit"}
            </button>
            {loading && (
              <p className="text-xs text-theme-text-secondary">
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
