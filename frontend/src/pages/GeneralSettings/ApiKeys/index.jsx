import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PlusCircle } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import ApiKeyRow from "./ApiKeyRow";
import NewApiKeyModal from "./NewApiKeyModal";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";

export default function AdminApiKeys() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
      >
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">API Keys</p>
              <button
                onClick={openModal}
                className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
              >
                <PlusCircle className="h-4 w-4" /> Generate New API Key
              </button>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              API keys allow the holder to programmatically access and manage
              this AnythingLLM instance.
            </p>
            <a
              href={paths.apiDocs()}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-base text-blue-300 hover:underline"
            >
              Read the API documentation &rarr;
            </a>
          </div>
          <ApiKeysContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewApiKeyModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function ApiKeysContainer() {
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  useEffect(() => {
    async function fetchExistingKeys() {
      const user = userFromStorage();
      const Model = !!user ? Admin : System;

      const { apiKeys: foundKeys } = await Model.getApiKeys();
      setApiKeys(foundKeys);
      setLoading(false);
    }
    fetchExistingKeys();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="md:w-3/4 w-full text-sm text-left rounded-lg mt-5">
      <thead className="text-white text-opacity-80 text-sm font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            API Key
          </th>
          <th scope="col" className="px-6 py-3">
            Created By
          </th>
          <th scope="col" className="px-6 py-3">
            Created
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((apiKey) => (
          <ApiKeyRow key={apiKey.id} apiKey={apiKey} />
        ))}
      </tbody>
    </table>
  );
}
