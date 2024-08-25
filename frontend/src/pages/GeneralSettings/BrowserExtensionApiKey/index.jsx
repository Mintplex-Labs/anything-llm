import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PlusCircle } from "@phosphor-icons/react";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import BrowserExtensionApiKeyRow from "./BrowserExtensionApiKeyRow";
import CTAButton from "@/components/lib/CTAButton";
import NewBrowserExtensionApiKeyModal from "./NewBrowserExtensionApiKeyModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { fullApiUrl } from "@/utils/constants";

export default function BrowserExtensionApiKeys() {
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [isMultiUser, setIsMultiUser] = useState(false);

  useEffect(() => {
    fetchExistingKeys();
  }, []);

  const fetchExistingKeys = async () => {
    const result = await BrowserExtensionApiKey.getAll();
    if (result.success) {
      setApiKeys(result.apiKeys);
      setIsMultiUser(result.apiKeys.some((key) => key.user !== null));
    } else {
      setError(result.error || "Failed to fetch API keys");
    }
    setLoading(false);
  };

  const removeApiKey = (id) => {
    setApiKeys((prevKeys) => prevKeys.filter((apiKey) => apiKey.id !== id));
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                Browser Extension API Keys
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              Manage API keys for browser extensions connecting to your
              AnythingLLM instance.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton onClick={openModal} className="mt-3 mr-0 -mb-6 z-10">
              <PlusCircle className="h-4 w-4" weight="bold" />
              Generate New API Key
            </CTAButton>
          </div>
          {loading ? (
            <Skeleton.default
              height="80vh"
              width="100%"
              highlightColor="#3D4147"
              baseColor="#2C2F35"
              count={1}
              className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
              containerClassName="flex w-full"
            />
          ) : error ? (
            <div className="text-red-500 mt-6">Error: {error}</div>
          ) : (
            <table className="w-full text-sm text-left rounded-lg mt-6">
              <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">
                    Extension Connection String
                  </th>
                  {isMultiUser && (
                    <th scope="col" className="px-6 py-3">
                      Created By
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.length === 0 ? (
                  <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium">
                    <td
                      colSpan={isMultiUser ? "4" : "3"}
                      className="px-6 py-4 text-center"
                    >
                      No API keys found
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((apiKey) => (
                    <BrowserExtensionApiKeyRow
                      key={apiKey.id}
                      apiKey={apiKey}
                      removeApiKey={removeApiKey}
                      connectionString={`${fullApiUrl()}|${apiKey.key}`}
                      isMultiUser={isMultiUser}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ModalWrapper isOpen={isOpen}>
        <NewBrowserExtensionApiKeyModal
          closeModal={closeModal}
          onSuccess={fetchExistingKeys}
          isMultiUser={isMultiUser}
        />
      </ModalWrapper>
    </div>
  );
}
