import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import LanceDBLogo from "@/media/vectordbs/lancedb.png";

import LanceDBOptions from "@/components/VectorDBSelection/LanceDBOptions";

import VectorDBItem from "@/components/VectorDBSelection/VectorDBItem";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VECTOR_DBS = [
  {
    name: "LanceDB",
    value: "lancedb",
    logo: LanceDBLogo,
    options: (settings) => <LanceDBOptions settings={settings} />,
    description:
      "100% local vector DB that runs on the same instance as HempGPT.",
  },
];

export default function VectorDatabase({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVectorDBs, setFilteredVectorDBs] = useState([]);
  const [selectedVectorDB, setSelectedVectorDB] = useState(null);
  const [settings, setSettings] = useState(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const navigate = useNavigate();

  const TITLE = "Vector Database";
  const DESCRIPTION = "Choose your vector database provider for HempGPT.";

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedVectorDB(_settings?.VectorDB || "lancedb");
    }
    fetchKeys();
  }, []);

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.embeddingPreference());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    data.VectorDB = selectedVectorDB;
    for (var [key, value] of formData.entries()) data[key] = value;

    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save vector database settings: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.userSetup());
  };

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    const filtered = VECTOR_DBS.filter((vdb) =>
      vdb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVectorDBs(filtered);
  }, [searchQuery, selectedVectorDB]);

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="card-hemp w-full relative shadow-md">
          <div className="w-full p-4 absolute top-0 rounded-t-xl backdrop-blur-sm">
            <div className="w-full flex items-center sticky top-0">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-4 z-30 text-hemp-earth"
              />
              <input
                type="text"
                placeholder="Search vector databases"
                className="input-hemp pl-10 h-[38px] rounded-full w-full"
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="px-4 pt-[70px] flex flex-col gap-y-1 max-h-[390px] overflow-y-auto no-scroll pb-4">
            {filteredVectorDBs.map((vdb) => (
              <VectorDBItem
                key={vdb.name}
                name={vdb.name}
                value={vdb.value}
                image={vdb.logo}
                description={vdb.description}
                checked={selectedVectorDB === vdb.value}
                onClick={() => setSelectedVectorDB(vdb.value)}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-y-1">
          {selectedVectorDB &&
            VECTOR_DBS.find((vdb) => vdb.value === selectedVectorDB)?.options(
              settings
            )}
        </div>
        <button
          type="submit"
          ref={hiddenSubmitButtonRef}
          hidden
          aria-hidden="true"
        ></button>
      </form>
    </div>
  );
}
