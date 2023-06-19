import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "react-feather";
import System from "../../models/system";

const noop = () => false;
export default function KeysModal({ hideModal = noop }) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function fetchKeys() {
      const settings = await System.keys();
      setSettings(settings);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="flex fixed top-0 left-0 right-0 w-full h-full"
        onClick={hideModal}
      />
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Settings
            </h3>
            <button
              onClick={hideModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="p-6 space-y-6 flex h-full w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-800 dark:text-gray-200 text-base">
                  loading system settings
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-y-4">
                <div className="bg-orange-300 p-4 rounded-lg border border-orange-600 text-orange-700 w-full items-center flex gap-x-2">
                  <AlertCircle className="h-8 w-8" />
                  <p className="text-sm md:text-base ">
                    Ensure all fields are green before attempting to use
                    AnythingLLM or it may not function as expected!
                  </p>
                </div>
                <ShowKey
                  name="OpenAI API Key"
                  value={settings?.OpenAiKey ? "*".repeat(20) : ""}
                  valid={settings?.OpenAiKey}
                />
                <ShowKey
                  name="OpenAI Model for chats"
                  value={settings?.OpenAiModelPref}
                  valid={!!settings?.OpenAiModelPref}
                />
                <div className="h-[2px] w-full bg-gray-200 dark:bg-stone-600" />
                <ShowKey
                  name="Vector DB Choice"
                  value={settings?.VectorDB}
                  valid={!!settings?.VectorDB}
                />
                {settings?.VectorDB === "pinecone" && (
                  <>
                    <ShowKey
                      name="Pinecone DB API Key"
                      value={settings?.PineConeKey ? "*".repeat(20) : ""}
                      valid={!!settings?.PineConeKey}
                    />
                    <ShowKey
                      name="Pinecone DB Environment"
                      value={settings?.PineConeEnvironment}
                      valid={!!settings?.PineConeEnvironment}
                    />
                    <ShowKey
                      name="Pinecone DB Index"
                      value={settings?.PineConeIndex}
                      valid={!!settings?.PineConeIndex}
                    />
                  </>
                )}
                {settings?.VectorDB === "chroma" && (
                  <>
                    <ShowKey
                      name="Chroma Endpoint"
                      value={settings?.ChromaEndpoint}
                      valid={!!settings?.ChromaEndpoint}
                    />
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={hideModal}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowKey({ name, value, valid }) {
  if (!valid) {
    return (
      <div>
        <label
          htmlFor="error"
          className="block mb-2 text-sm font-medium text-red-700 dark:text-red-500"
        >
          {name}
        </label>
        <input
          type="text"
          id="error"
          disabled={true}
          className="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
          placeholder={name}
          defaultValue={value}
        />
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          Need setup in .env file.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label
        htmlFor="success"
        className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200"
      >
        {name}
      </label>
      <input
        type="text"
        id="success"
        disabled={true}
        className="border border-white text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
        defaultValue={value}
      />
    </div>
  );
}

export function useKeysModal() {
  const [showing, setShowing] = useState(false);
  const showModal = () => {
    setShowing(true);
  };
  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
