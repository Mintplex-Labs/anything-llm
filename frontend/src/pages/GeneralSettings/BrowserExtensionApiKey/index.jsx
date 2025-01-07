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
import { Tooltip } from "react-tooltip";

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
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Browser Extension API Keys
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              Manage API keys for browser extensions connecting to your
              AnythingLLM instance.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-3 mr-0 mb-4 md:-mb-14 z-10"
            >
              <PlusCircle className="h-4 w-4" weight="bold" />
              Generate New API Key
            </CTAButton>
          </div>
          <div className="overflow-x-auto mt-6">
            {loading ? (
              <Skeleton.default
                height="80vh"
                width="100%"
                highlightColor="var(--theme-bg-primary)"
                baseColor="var(--theme-bg-secondary)"
                count={1}
                className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
                containerClassName="flex w-full"
              />
            ) : error ? (
              <div className="text-red-500 mt-6">Error: {error}</div>
            ) : (
              <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0 md:mt-6 mt-0">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
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
                    <tr className="bg-transparent text-theme-text-secondary text-sm font-medium">
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
      </div>
      <ModalWrapper isOpen={isOpen}>
        <NewBrowserExtensionApiKeyModal
          closeModal={closeModal}
          onSuccess={fetchExistingKeys}
          isMultiUser={isMultiUser}
        />
      </ModalWrapper>
      <Tooltip
        id="auto-connection"
        place="bottom"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
      <Tooltip
        id="copy-connection-text"
        place="bottom"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </div>
  );
}
