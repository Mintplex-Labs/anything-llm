import React, { useState } from "react";
import System from "../../../../models/system";
import ChromaLogo from "../../../../media/vectordbs/chroma.png";
import PineconeLogo from "../../../../media/vectordbs/pinecone.png";
import LanceDbLogo from "../../../../media/vectordbs/lancedb.png";
import WeaviateLogo from "../../../../media/vectordbs/weaviate.png";
import QDrantLogo from "../../../../media/vectordbs/qdrant.png";

const noop = () => false;
export default function VectorDBSelection({
  hideModal = noop,
  user,
  settings = {},
}) {
  const [hasChanges, setHasChanges] = useState(false);
  const [vectorDB, setVectorDB] = useState(settings?.VectorDB || "lancedb");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const canDebug = settings.MultiUserMode
    ? settings?.CanDebug && user?.role === "admin"
    : settings?.CanDebug;

  function updateVectorChoice(selection) {
    if (!canDebug || selection === vectorDB) return false;
    setHasChanges(true);
    setVectorDB(selection);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setError(error);
    setSaving(false);
    setHasChanges(!!error ? true : false);
  };
  return (
    <div className="relative w-full w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
            These are the credentials and settings for how your AnythingLLM
            instance will function. Its important these keys are current and
            correct.
          </p>
        </div>

        {!!error && (
          <div className="mb-8 bg-red-700 dark:bg-orange-800 bg-opacity-30 border border-red-800 dark:border-orange-600 p-4 rounded-lg w-[90%] flex mx-auto">
            <p className="text-red-800 dark:text-orange-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} onChange={() => setHasChanges(true)}>
          <div className="px-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <p className="block text-sm font-medium text-gray-800 dark:text-slate-200">
                Vector database providers
              </p>
              <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4">
                <input hidden={true} name="VectorDB" value={vectorDB} />
                <VectorDBOption
                  name="Chroma"
                  value="chroma"
                  link="trychroma.com"
                  description="Open source vector database you can host yourself or on the cloud."
                  checked={vectorDB === "chroma"}
                  image={ChromaLogo}
                  onClick={updateVectorChoice}
                />
                <VectorDBOption
                  name="Pinecone"
                  value="pinecone"
                  link="pinecone.io"
                  description="100% cloud-based vector database for enterprise use cases."
                  checked={vectorDB === "pinecone"}
                  image={PineconeLogo}
                  onClick={updateVectorChoice}
                />
                <VectorDBOption
                  name="QDrant"
                  value="qdrant"
                  link="qdrant.tech"
                  description="Open source local and distributed cloud vector database."
                  checked={vectorDB === "qdrant"}
                  image={QDrantLogo}
                  onClick={updateVectorChoice}
                />
                <VectorDBOption
                  name="Weaviate"
                  value="weaviate"
                  link="weaviate.io"
                  description="Open source local and cloud hosted multi-modal vector database."
                  checked={vectorDB === "weaviate"}
                  image={WeaviateLogo}
                  onClick={updateVectorChoice}
                />
                <VectorDBOption
                  name="LanceDB"
                  value="lancedb"
                  link="lancedb.com"
                  description="100% local vector DB that runs on the same instance as AnythingLLM."
                  checked={vectorDB === "lancedb"}
                  image={LanceDbLogo}
                  onClick={updateVectorChoice}
                />
              </div>
              {vectorDB === "pinecone" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Pinecone DB API Key
                    </label>
                    <input
                      type="password"
                      name="PineConeKey"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="Pinecone API Key"
                      defaultValue={settings?.PineConeKey ? "*".repeat(20) : ""}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Pinecone Index Environment
                    </label>
                    <input
                      type="text"
                      name="PineConeEnvironment"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="us-gcp-west-1"
                      defaultValue={settings?.PineConeEnvironment}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Pinecone Index Name
                    </label>
                    <input
                      type="text"
                      name="PineConeIndex"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="my-index"
                      defaultValue={settings?.PineConeIndex}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}

              {vectorDB === "chroma" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Chroma Endpoint
                    </label>
                    <input
                      type="url"
                      name="ChromaEndpoint"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="http://localhost:8000"
                      defaultValue={settings?.ChromaEndpoint}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}
              {vectorDB === "lancedb" && (
                <div className="w-full h-40 items-center justify-center flex">
                  <p className="text-gray-800 dark:text-slate-400">
                    There is no configuration needed for LanceDB.
                  </p>
                </div>
              )}
              {vectorDB === "qdrant" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      QDrant API Endpoint
                    </label>
                    <input
                      type="url"
                      name="QdrantEndpoint"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="http://localhost:6633"
                      defaultValue={settings?.QdrantEndpoint}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Api Key
                    </label>
                    <input
                      type="password"
                      name="QdrantApiKey"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="wOeqxsYP4....1244sba"
                      defaultValue={settings?.QdrantApiKey}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}
              {vectorDB === "weaviate" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Weaviate Endpoint
                    </label>
                    <input
                      type="url"
                      name="WeaviateEndpoint"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="http://localhost:8080"
                      defaultValue={settings?.WeaviateEndpoint}
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200">
                      Api Key
                    </label>
                    <input
                      type="password"
                      name="WeaviateApiKey"
                      disabled={!canDebug}
                      className="bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-500 text-sm rounded-lg dark:bg-stone-700 focus:border-stone-500 block w-full p-2.5 dark:text-slate-200 dark:placeholder-stone-500 dark:border-slate-200"
                      placeholder="sk-123Abcweaviate"
                      defaultValue={settings?.WeaviateApiKey}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full p-4">
            <button
              hidden={!hasChanges}
              disabled={saving}
              type="submit"
              className="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
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
  );
}

const VectorDBOption = ({
  name,
  link,
  description,
  value,
  image,
  checked = false,
  onClick,
}) => {
  return (
    <div onClick={() => onClick(value)}>
      <input
        type="checkbox"
        value={value}
        className="peer hidden"
        checked={checked}
        readOnly={true}
        formNoValidate={true}
      />
      <label className="transition-all duration-300 inline-flex h-full w-60 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:dark:bg-stone-800 peer-checked:text-gray-600 dark:border-slate-200 dark:bg-stone-800 dark:text-slate-400 dark:hover:bg-stone-700 dark:hover:text-slate-300 dark:peer-checked:text-slate-300">
        <div className="block">
          <img src={image} alt={name} className="mb-2 h-10 w-10 rounded-full" />
          <div className="w-full text-lg font-semibold">{name}</div>
          <div className="flex w-full flex-col gap-y-1 text-sm">
            <p className="text-xs text-slate-400">{link}</p>
            {description}
          </div>
        </div>
      </label>
    </div>
  );
};
