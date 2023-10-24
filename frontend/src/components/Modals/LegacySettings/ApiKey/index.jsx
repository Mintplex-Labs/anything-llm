import { useEffect, useState } from "react";
import System from "../../../../models/system";
import PreLoader from "../../../Preloader";
import paths from "../../../../utils/paths";
import showToast from "../../../../utils/toast";
import { CheckCircle, Copy, RefreshCcw, Trash } from "react-feather";

export default function ApiKey() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    async function fetchExistingApiKey() {
      const { apiKey: _apiKey } = await System.getApiKey();
      setApiKey(_apiKey);
      setLoading(false);
    }
    fetchExistingApiKey();
  }, []);

  const generateApiKey = async () => {
    setGenerating(true);
    const isRefresh = !!apiKey;
    const { apiKey: newApiKey, error } = await System.generateApiKey();
    if (!!error) {
      showToast(error, "error");
    } else {
      showToast(
        isRefresh ? "API key regenerated!" : "API key generated!",
        "info"
      );
      setApiKey(newApiKey);
    }
    setGenerating(false);
  };

  const removeApiKey = async () => {
    setDeleting(true);
    const ok = await System.deleteApiKey();
    if (ok) {
      showToast("API key deleted from instance.", "info");
      setApiKey(null);
    } else {
      showToast("API key could not be deleted.", "error");
    }
    setDeleting(false);
  };

  const copyToClipboard = async () => {
    window.navigator.clipboard.writeText(apiKey.secret);
    showToast("API key copied to clipboard!", "info");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="relative w-full w-full max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between px-6 py-4">
            <p className="text-gray-800 dark:text-stone-200 text-base ">
              Generate an API Key for your AnythingLLM instance.
            </p>
          </div>
          <div className="px-1 md:px-8 pb-10 ">
            <PreLoader />
          </div>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="relative w-full w-full max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between px-6 py-4">
            <p className="text-gray-800 dark:text-stone-200 text-base ">
              Generate an API Key for your AnythingLLM instance.
            </p>
          </div>
          <div className="md:px-8 pb-10 ">
            <div className="flex flex-col gap-y-1 text-gray-800 dark:text-stone-200 mb-2">
              <p>
                No api key for this instance exists. Create one by clicking the
                button below.
              </p>
              <a
                href={paths.apiDocs()}
                target="_blank"
                className="dark:text-blue-300 text-blue-600 hover:underline"
              >
                View endpoint documentation &rarr;
              </a>
            </div>
            <button
              disabled={generating}
              type="button"
              onClick={generateApiKey}
              className="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              {generating ? "Generating..." : "Generate new API key"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex flex-col items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
            Use this API key for interacting with your AnythingLLM instance
            programmatically.
          </p>
          <a
            href={paths.apiDocs()}
            target="_blank"
            className="dark:text-blue-300 text-blue-600 hover:underline"
          >
            View endpoint documentation &rarr;
          </a>
        </div>

        <div className="md:px-8 pb-10">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex md:flex-row flex-col gap-y-2 w-full gap-x-2 items-center px-4 md:px-0">
                <input
                  key={apiKey.secret}
                  type="text"
                  disabled={true}
                  className="w-full md:w-1/2 bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                  defaultValue={apiKey.secret}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={copyToClipboard}
                  disabled={copied}
                  className="w-full flex justify-center items-center gap-x-2 md:w-fit disabled:bg-green-300 dark:disabled:bg-green-600 bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200 group hover:bg-gray-100 dark:hover:bg-stone-600"
                >
                  {copied ? (
                    <CheckCircle className="stroke-green-800 dark:stroke-green-300" />
                  ) : (
                    <Copy />
                  )}
                  <p className="block md:hidden text-base">Copy API Key</p>
                </button>
                <button
                  onClick={() => {
                    if (
                      !confirm(
                        "Are you sure you want to refresh the API key? The old key will no longer work!"
                      )
                    )
                      return false;
                    generateApiKey();
                  }}
                  disabled={generating}
                  className="w-full flex justify-center items-center gap-x-2 md:w-fit disabled:bg-green-300 dark:disabled:bg-green-600 bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200 group hover:bg-gray-100 dark:hover:bg-stone-600"
                >
                  <RefreshCcw />
                  <p className="block md:hidden text-base">
                    Regenerate API Key
                  </p>
                </button>
                <button
                  onClick={() => {
                    if (
                      !confirm(
                        "Are you sure you want to delete the API key? All API keys will be deleted."
                      )
                    )
                      return false;
                    removeApiKey();
                  }}
                  disabled={deleting}
                  className="w-full flex justify-center items-center gap-x-2 md:w-fit disabled:bg-red-300 dark:disabled:bg-red-600 border border-red-500 text-red-900 placeholder-red-500 text-sm rounded-lg dark:bg-transparent focus:border-red-500 block p-2.5 dark:text-red-200 dark:placeholder-red-500 dark:border-red-200 group hover:bg-red-100 dark:hover:bg-red-600"
                >
                  <Trash />
                  <p className="block md:hidden text-base">Delete API Key</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
