import React, { useEffect, useState, useRef } from "react";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import PineconeLogo from "@/media/vectordbs/pinecone.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import WeaviateLogo from "@/media/vectordbs/weaviate.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";
import MilvusLogo from "@/media/vectordbs/milvus.png";
import ZillizLogo from "@/media/vectordbs/zilliz.png";
import AstraDBLogo from "@/media/vectordbs/astraDB.png";
import System from "@/models/system";
import paths from "@/utils/paths";
import PineconeDBOptions from "@/components/VectorDBSelection/PineconeDBOptions";
import ChromaDBOptions from "@/components/VectorDBSelection/ChromaDBOptions";
import QDrantDBOptions from "@/components/VectorDBSelection/QDrantDBOptions";
import WeaviateDBOptions from "@/components/VectorDBSelection/WeaviateDBOptions";
import LanceDBOptions from "@/components/VectorDBSelection/LanceDBOptions";
import MilvusOptions from "@/components/VectorDBSelection/MilvusDBOptions";
import ZillizCloudOptions from "@/components/VectorDBSelection/ZillizCloudOptions";
import AstraDBOptions from "@/components/VectorDBSelection/AstraDBOptions";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import VectorDBItem from "@/components/VectorDBSelection/VectorDBItem";

const TITLE = "Vector Database Connection";
const DESCRIPTION =
  "These are the credentials and settings for your vector database of choice.";

export default function VectorDatabaseConnection({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVDBs, setFilteredVDBs] = useState([]);
  const [selectedVDB, setSelectedVDB] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(true);
  const searchInputRef = useRef(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    data.VectorDB = selectedVDB;
    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save Vector Database settings: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.customLogo());
  };

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.embeddingPreference());
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const updateVDBChoice = (selection) => {
    setSearchQuery("");
    setSelectedVDB(selection);
    setSearchMenuOpen(false);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedVDB(_settings?.VectorDB || "lancedb");
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    const filtered = VECTOR_DBS.filter((vdb) =>
      vdb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVDBs(filtered);
  }, [searchQuery, selectedVDB]);

  const VECTOR_DBS = [
    {
      name: "LanceDB",
      value: "lancedb",
      logo: LanceDbLogo,
      options: <LanceDBOptions />,
      description:
        "100% local vector DB that runs on the same instance as AnythingLLM.",
    },
    {
      name: "Chroma",
      value: "chroma",
      logo: ChromaLogo,
      options: <ChromaDBOptions settings={settings} />,
      description:
        "Open source vector database you can host yourself or on the cloud.",
    },
    {
      name: "Pinecone",
      value: "pinecone",
      logo: PineconeLogo,
      options: <PineconeDBOptions settings={settings} />,
      description: "100% cloud-based vector database for enterprise use cases.",
    },
    {
      name: "Zilliz Cloud",
      value: "zilliz",
      logo: ZillizLogo,
      options: <ZillizCloudOptions settings={settings} />,
      description:
        "Cloud hosted vector database built for enterprise with SOC 2 compliance.",
    },
    {
      name: "QDrant",
      value: "qdrant",
      logo: QDrantLogo,
      options: <QDrantDBOptions settings={settings} />,
      description: "Open source local and distributed cloud vector database.",
    },
    {
      name: "Weaviate",
      value: "weaviate",
      logo: WeaviateLogo,
      options: <WeaviateDBOptions settings={settings} />,
      description:
        "Open source local and cloud hosted multi-modal vector database.",
    },
    {
      name: "Milvus",
      value: "milvus",
      logo: MilvusLogo,
      options: <MilvusOptions settings={settings} />,
      description: "Open-source, highly scalable, and blazing fast.",
    },
    {
      name: "AstraDB",
      value: "astra",
      logo: AstraDBLogo,
      options: <AstraDBOptions settings={settings} />,
      description: "Vector Search for Real-world GenAI.",
    },
  ];

  const selectedVDBObject = VECTOR_DBS.find((vdb) => vdb.value === selectedVDB);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center"
    >
      <div className="relative">
        {searchMenuOpen ? (
          <div className="w-full max-w-[753px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-[#18181B] rounded-lg flex flex-col justify-between cursor-pointer border-2 border-[#46C8FF] z-20">
            <div className="w-full flex flex-col gap-y-1">
              <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-[#18181B]">
                <MagnifyingGlass
                  size={20}
                  weight="bold"
                  className="absolute left-4 z-30 text-white -ml-4 my-2"
                />
                <input
                  type="text"
                  name="vdb-search"
                  placeholder="Search all vector databases"
                  className="-ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:border-white text-white placeholder:text-white placeholder:font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <X
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-white hover:text-[#9CA3AF]"
                  onClick={handleXButton}
                />
              </div>
              <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                {filteredVDBs.map((vdb) => (
                  <VectorDBItem
                    key={vdb.name}
                    name={vdb.name}
                    value={vdb.value}
                    image={vdb.logo}
                    description={vdb.description}
                    checked={selectedVDB === vdb.value}
                    onClick={() => updateVDBChoice(vdb.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            className="w-full max-w-[753px] h-[64px] bg-[#18181B] rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-[#46C8FF] transition-all duration-300"
            type="button"
            onClick={() => setSearchMenuOpen(true)}
          >
            <div className="flex gap-x-4 items-center">
              <img
                src={selectedVDBObject.logo}
                alt={`${selectedVDBObject.name} logo`}
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col text-left">
                <div className="text-sm font-semibold text-white">
                  {selectedVDBObject.name}
                </div>
                <div className="mt-1 text-xs text-[#D2D5DB]">
                  {selectedVDBObject.description}
                </div>
              </div>
            </div>
            <CaretUpDown size={24} weight="bold" className="text-white" />
          </button>
        )}
        <div className="mt-4 flex flex-col gap-y-1 justify-start w-full">
          {selectedVDBObject && selectedVDBObject.options}
        </div>
      </div>

      <button
        type="submit"
        ref={hiddenSubmitButtonRef}
        hidden
        aria-hidden="true"
      ></button>
    </form>
  );
}
