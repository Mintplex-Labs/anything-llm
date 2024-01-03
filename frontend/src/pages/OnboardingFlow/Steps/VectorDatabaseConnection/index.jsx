import React, { useEffect, useState } from "react";
const TITLE = "Vector Database Connection";
const DESCRIPTION =
  "These are the credentials and settings for your vector database of choice.";
import { MagnifyingGlass } from "@phosphor-icons/react";

import ChromaLogo from "@/media/vectordbs/chroma.png";
import PineconeLogo from "@/media/vectordbs/pinecone.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import WeaviateLogo from "@/media/vectordbs/weaviate.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";

// TODO: Replace with your vector database options
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import System from "@/models/system";
import VectorDatabaseItem from "./VectorDatabaseItem";

export default function VectorDatabaseConnection({ setHeader, setForwardBtn }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVDBs, setFilteredVDBs] = useState([]);
  const [selectedVDB, setSelectedVDB] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  const VECTOR_DBS = [
    {
      name: "Chroma",
      logo: ChromaLogo,
      options: <OpenAiOptions settings={settings} />,
      description:
        "Open source vector database you can host yourself or on the cloud.",
    },
    {
      name: "Pinecone",
      logo: PineconeLogo,
      options: <AzureAiOptions settings={settings} />,
      description: "100% cloud-based vector database for enterprise use cases.",
    },
    {
      name: "QDrant",
      logo: QDrantLogo,
      options: <AnthropicAiOptions settings={settings} />,
      description: "Open source local and distributed cloud vector database.",
    },
    {
      name: "Weaviate",
      logo: WeaviateLogo,
      options: <GeminiLLMOptions settings={settings} />,
      description:
        "Open source local and cloud hosted multi-modal vector database.",
    },
    {
      name: "LanceDB",
      logo: LanceDbLogo,
      options: <OllamaLLMOptions settings={settings} />,
      description:
        "100% local vector DB that runs on the same instance as AnythingLLM.",
    },
  ];

  function handleForward() {
    console.log("Go forward");
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVDBs(VECTOR_DBS);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = VECTOR_DBS.filter((vdb) =>
        vdb.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredVDBs(filtered);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="w-full border-slate-300/40 shadow border-2 rounded-lg p-4 text-white overflow-y-auto">
        <div className="relative flex items-center">
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-4 z-10 text-white"
          />
          <input
            type="text"
            placeholder="Chroma"
            className="bg-white/10 pl-10 rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="mt-4 flex flex-col">
          {filteredVDBs.map((vdb) => (
            <div key={vdb.name} onClick={() => setSelectedVDB(vdb)}>
              <VectorDatabaseItem
                name={vdb.name}
                image={vdb.logo}
                description={vdb.description}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedVDB && <div className="mt-4">{selectedVDB.options}</div>}
    </>
  );
}
