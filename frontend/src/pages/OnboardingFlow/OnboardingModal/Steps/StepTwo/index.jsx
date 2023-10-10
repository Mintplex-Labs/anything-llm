import React, { useEffect, useState } from "react";

import VectorDBOption from "../../../../../components/VectorDBOption";
import ChromaLogo from "../../../../../media/vectordbs/chroma.png";
import PineconeLogo from "../../../../../media/vectordbs/pinecone.png";
import LanceDbLogo from "../../../../../media/vectordbs/lancedb.png";
import WeaviateLogo from "../../../../../media/vectordbs/weaviate.png";
import QDrantLogo from "../../../../../media/vectordbs/qdrant.png";
import System from "../../../../../models/system";
import showToast from "../../../../../utils/toast";

// Vector Database Step
export default function StepTwo() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [vectorDB, setVectorDB] = useState("lancedb");
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setVectorDB(_settings?.VectorDB || "lancedb");
      setLoading(false);
    }
    fetchKeys();
  }, []);

  const updateVectorChoice = (selection) => {
    setHasChanges(true);
    setVectorDB(selection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save settings: ${error}`, "error");
    } else {
      showToast("Settings saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error ? true : false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onChange={() => setHasChanges(true)}
        className="flex w-full"
      >
        <div className="flex flex-col w-full px-1 md:px-8 py-12">
          <div className="text-white text-sm font-medium pb-4">
            Select your preferred vector database provider
          </div>
          <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-[900px]">
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
          <div className="mt-10 flex flex-wrap gap-4 max-w-[800px]">
            {vectorDB === "pinecone" && (
              <>
                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Pinecone DB API Key
                  </label>
                  <input
                    type="password"
                    name="PineConeKey"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="Pinecone API Key"
                    defaultValue={settings?.PineConeKey ? "*".repeat(20) : ""}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Pinecone Index Environment
                  </label>
                  <input
                    type="text"
                    name="PineConeEnvironment"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="us-gcp-west-1"
                    defaultValue={settings?.PineConeEnvironment}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Pinecone Index Name
                  </label>
                  <input
                    type="text"
                    name="PineConeIndex"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Chroma Endpoint
                  </label>
                  <input
                    type="url"
                    name="ChromaEndpoint"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="http://localhost:8000"
                    defaultValue={settings?.ChromaEndpoint}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    API Header
                  </label>
                  <input
                    name="ChromaApiHeader"
                    autoComplete="off"
                    type="text"
                    defaultValue={settings?.ChromaApiHeader}
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="X-Api-Key"
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    API Key
                  </label>
                  <input
                    name="ChromaApiKey"
                    autoComplete="off"
                    type="password"
                    defaultValue={settings?.ChromaApiKey ? "*".repeat(20) : ""}
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="sk-myApiKeyToAccessMyChromaInstance"
                  />
                </div>
              </>
            )}

            {vectorDB === "lancedb" && (
              <div className="w-full h-10 items-center justify-center flex">
                <p className="text-sm font-base text-white text-opacity-60">
                  There is no configuration needed for LanceDB.
                </p>
              </div>
            )}

            {vectorDB === "qdrant" && (
              <>
                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    QDrant API Endpoint
                  </label>
                  <input
                    type="url"
                    name="QdrantEndpoint"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="http://localhost:6633"
                    defaultValue={settings?.QdrantEndpoint}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    API Key
                  </label>
                  <input
                    type="password"
                    name="QdrantApiKey"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    Weaviate Endpoint
                  </label>
                  <input
                    type="url"
                    name="WeaviateEndpoint"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="http://localhost:8080"
                    defaultValue={settings?.WeaviateEndpoint}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-60">
                  <label className="text-white text-sm font-semibold block mb-4">
                    API Key
                  </label>
                  <input
                    type="password"
                    name="WeaviateApiKey"
                    className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
      </form>
    </>
  );
}
