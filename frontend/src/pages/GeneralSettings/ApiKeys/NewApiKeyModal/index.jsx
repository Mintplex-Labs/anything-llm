import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import { useTranslation } from "react-i18next";

export default function NewApiKeyModal({ closeModal }) {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const user = userFromStorage();
    const Model = !!user ? Admin : System;

    const { apiKey: newApiKey, error } = await Model.generateApiKey();
    if (!!newApiKey) setApiKey(newApiKey);
    setError(error);
  };
  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
    setCopied(true);
  };
  useEffect(() => {
    function resetStatus() {
      if (!copied) return false;
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    resetStatus();
  }, [copied]);

  return (
    <div className="relative w-[500px] max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            {t("newApiKeyModal.title")}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="p-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              {error && (
                <p className="text-red-400 text-sm">
                  {t("newApiKeyModal.errorMessage", { error })}
                </p>
              )}
              {apiKey && (
                <input
                  type="text"
                  defaultValue={`${apiKey.secret}`}
                  disabled={true}
                  className="rounded-lg px-4 py-2 text-white bg-zinc-900 border border-gray-500/50"
                />
              )}
              <p className="text-white text-xs md:text-sm">
                {t("newApiKeyModal.apiKeyDescription")}
              </p>
              <a
                href={paths.apiDocs()}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                {t("newApiKeyModal.apiDocsLink")} &rarr;
              </a>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            {!apiKey ? (
              <>
                <button
                  onClick={closeModal}
                  type="button"
                  className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
                >
                  {t("newApiKeyModal.cancelButton")}
                </button>
                <button
                  type="submit"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  {t("newApiKeyModal.createButton")}
                </button>
              </>
            ) : (
              <button
                onClick={copyApiKey}
                type="button"
                disabled={copied}
                className="w-full transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 text-center justify-center"
              >
                {copied
                  ? t("newApiKeyModal.copiedButton")
                  : t("newApiKeyModal.copyButton")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
