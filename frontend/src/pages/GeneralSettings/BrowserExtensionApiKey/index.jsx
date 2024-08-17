import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import BrowserExtensionApiKeyRow from "./BrowserExtensionApiKeyRow";

export default function BrowserExtensionApiKeys() {
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
          <BrowserExtensionApiKeysContainer />
        </div>
      </div>
    </div>
  );
}

function BrowserExtensionApiKeysContainer() {
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExistingKeys();
  }, []);

  const fetchExistingKeys = async () => {
    const result = await BrowserExtensionApiKey.getAll();
    if (result.success) {
      setApiKeys(result.apiKeys);
    } else {
      setError(result.error || "Failed to fetch API keys");
    }
    setLoading(false);
  };

  const updateApiKeyStatus = (key, accepted) => {
    setApiKeys((prevKeys) =>
      prevKeys.map((apiKey) =>
        apiKey.key === key ? { ...apiKey, accepted } : apiKey
      )
    );
  };

  const removeApiKey = (key) => {
    setApiKeys((prevKeys) => prevKeys.filter((apiKey) => apiKey.key !== key));
  };

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

  if (error) {
    return <div className="text-red-500 mt-6">Error: {error}</div>;
  }

  return (
    <table className="w-full text-sm text-left rounded-lg mt-6">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            API Key
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
          <th scope="col" className="px-6 py-3">
            Verification Code
          </th>
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
            <td colSpan="5" className="px-6 py-4 text-center">
              No API keys found
            </td>
          </tr>
        ) : (
          apiKeys.map((apiKey) => (
            <BrowserExtensionApiKeyRow
              key={apiKey.key}
              apiKey={apiKey}
              updateApiKeyStatus={updateApiKeyStatus}
              removeApiKey={removeApiKey}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
