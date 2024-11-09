import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import CommunityHub from "@/models/communityHub";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import showToast from "@/utils/toast";
import { FullScreenLoader } from "@/components/Preloader";
import paths from "@/utils/paths";
import { Info } from "@phosphor-icons/react";
import UserItems from "./UserItems";

function useCommunityHubAuthentication() {
  const [originalConnectionKey, setOriginalConnectionKey] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [connectionKey, setConnectionKey] = useState("");
  const [loading, setLoading] = useState(true);

  async function resetChanges() {
    setConnectionKey(originalConnectionKey);
    setHasChanges(false);
  }

  async function onConnectionKeyChange(e) {
    const newConnectionKey = e.target.value;
    setConnectionKey(newConnectionKey);
    setHasChanges(true);
  }

  async function updateConnectionKey() {
    if (connectionKey === originalConnectionKey) return;
    setLoading(true);
    try {
      const response = await CommunityHub.updateSettings({
        hub_api_key: connectionKey,
      });
      if (!response.success)
        return showToast("Failed to save API key", "error");
      setHasChanges(false);
      showToast("API key saved successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to save API key", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { connectionKey } = await CommunityHub.getSettings();
        setOriginalConnectionKey(connectionKey || "");
        setConnectionKey(connectionKey || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    connectionKey,
    loading,
    onConnectionKeyChange,
    updateConnectionKey,
    hasChanges,
    resetChanges,
  };
}

export default function CommunityHubAuthentication() {
  const { t } = useTranslation();
  const {
    connectionKey,
    loading,
    onConnectionKeyChange,
    updateConnectionKey,
    hasChanges,
    resetChanges,
  } = useCommunityHubAuthentication();
  if (loading) return <FullScreenLoader />;
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <ContextualSaveBar
        showing={hasChanges}
        onSave={updateConnectionKey}
        onCancel={resetChanges}
      />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                Your AnythingLLM Community Hub Account
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              Connecting your AnythingLLM Community Hub account allows you to
              access your <b>private</b> AnythingLLM Community Hub items as well
              as upload your own items to the AnythingLLM Community Hub.
            </p>
          </div>

          {!connectionKey && (
            <div className="border border-white/10 my-2 flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-1/2 rounded-lg px-4 py-2">
              <div className="flex flex-col gap-y-2">
                <div className="gap-x-2 flex items-center">
                  <Info size={25} />
                  <h1 className="text-lg font-semibold">
                    {" "}
                    Why connect my AnythingLLM Community Hub account?{" "}
                  </h1>
                </div>
                <p className="text-sm">
                  Connecting your AnythingLLM Community Hub account allows you
                  to pull in your <b>private</b> items from the AnythingLLM
                  Community Hub as well as upload your own items to the
                  AnythingLLM Community Hub.
                  <br />
                  <br />
                  <i>
                    You do not need to connect your AnythingLLM Community Hub
                    account to pull in public items from the AnythingLLM
                    Community Hub.
                  </i>
                </p>
              </div>
            </div>
          )}

          {/* API Key Section */}
          <div className="mt-6 mb-12">
            <div className="flex flex-col w-full max-w-[400px]">
              <label className="text-white text-sm font-semibold block mb-2">
                AnythingLLM Hub API Key
              </label>
              <input
                type={"password"}
                value={connectionKey || ""}
                onChange={onConnectionKeyChange}
                className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Enter your AnythingLLM Hub API key"
              />
              <p className="text-white/60 text-xs mt-2">
                You can get your API key from your{" "}
                <a
                  href={paths.communityHub.profile()}
                  className="underline text-primary-button"
                >
                  AnythingLLM Community Hub profile page
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-6">
            <UserItems />
          </div>
        </div>
      </div>
    </div>
  );
}
