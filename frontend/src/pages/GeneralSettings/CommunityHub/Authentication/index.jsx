import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
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
      setOriginalConnectionKey(connectionKey);
    } catch (error) {
      console.error(error);
      showToast("Failed to save API key", "error");
    } finally {
      setLoading(false);
    }
  }

  async function disconnectHub() {
    setLoading(true);
    try {
      const response = await CommunityHub.updateSettings({
        hub_api_key: "",
      });
      if (!response.success)
        return showToast("Failed to disconnect from hub", "error");
      setHasChanges(false);
      showToast(`Disconnected from ${process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub", "success`);
      setOriginalConnectionKey("");
      setConnectionKey("");
    } catch (error) {
      console.error(error);
      showToast("Failed to disconnect from hub", "error");
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
    originalConnectionKey,
    loading,
    onConnectionKeyChange,
    updateConnectionKey,
    hasChanges,
    resetChanges,
    disconnectHub,
  };
}

export default function CommunityHubAuthentication() {
  const {
    connectionKey,
    originalConnectionKey,
    loading,
    onConnectionKeyChange,
    updateConnectionKey,
    hasChanges,
    resetChanges,
    disconnectHub,
  } = useCommunityHubAuthentication();
  if (loading) return <FullScreenLoader />;
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex custom-theme-bg-container">
      <Sidebar />
      <ContextualSaveBar
        showing={hasChanges}
        onSave={updateConnectionKey}
        onCancel={resetChanges}
      />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 custom-theme-bg-secondary"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10 custom-border-secondary" style={{ borderTop: 0, borderRight: 0, borderLeft: 0 }}>
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-theme-text-primary custom-text-secondary">
                Your {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub Account
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary custom-text-secondary">
              Connecting your {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub account allows you to
              access your <b>private</b> {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub items as well
              as upload your own items to the {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub.
            </p>
          </div>

          {!connectionKey && (
            <div className="border border-theme-border my-2 flex flex-col md:flex-row md:items-center gap-x-2 text-theme-text-primary mb-4 bg-theme-settings-input-bg w-1/2 rounded-lg px-4 py-2 custom-button-secondary">
              <div className="flex flex-col gap-y-2">
                <div className="gap-x-2 flex items-center custom-text-secondary">
                  <Info size={25} />
                  <h1 className="text-lg font-semibold">
                    Why connect my {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub account?
                  </h1>
                </div>
                <p className="text-sm text-theme-text-secondary custom-text-secondary">
                  Connecting your {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub account allows you
                  to pull in your <b>private</b> items from the {process.env.APPLICATION_FALLBACK_NAME || "Prism"}
                  Community Hub as well as upload your own items to the
                  {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub.
                  <br />
                  <br />
                  <i>
                    You do not need to connect your {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub
                    account to pull in public items from the {process.env.APPLICATION_FALLBACK_NAME || "Prism"}
                    Community Hub.
                  </i>
                </p>
              </div>
            </div>
          )}

          {/* API Key Section */}
          <div className="mt-6 mb-12">
            <div className="flex flex-col w-full max-w-[400px]">
              <label className="text-theme-text-primary text-sm font-semibold block mb-2 custom-text-secondary">
                {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Hub API Key
              </label>
              <input
                type="password"
                value={connectionKey || ""}
                onChange={onConnectionKeyChange}
                className="border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
                placeholder={`Enter your ${process.env.APPLICATION_FALLBACK_NAME || "Prism"} Hub API key`}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-theme-text-secondary text-xs custom-text-secondary">
                  You can get your API key from your{" "}
                  <a
                    href={paths.communityHub.profile()}
                    className="underline text-primary-button"
                  >
                    {process.env.APPLICATION_FALLBACK_NAME || "Prism"} Community Hub profile page
                  </a>
                  .
                </p>
                {!!originalConnectionKey && (
                  <button
                    onClick={disconnectHub}
                    className="border-none text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>

          {!!originalConnectionKey && (
            <div className="mt-6">
              <UserItems connectionKey={originalConnectionKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
