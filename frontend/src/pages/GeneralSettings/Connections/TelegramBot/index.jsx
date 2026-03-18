import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { CircleNotch } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import Telegram from "@/models/telegram";
import ConnectedView from "./ConnectedView";
import SetupView from "./SetupView";
import { useTranslation } from "react-i18next";

export default function TelegramBotSettings() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [configRes, allWorkspaces] = await Promise.all([
        Telegram.getConfig(),
        Workspace.all(),
      ]);
      setConfig(configRes?.config || null);
      setWorkspaces(allWorkspaces || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleConnected = (newConfig) => setConfig(newConfig);
  const handleDisconnected = () => setConfig(null);

  if (loading) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6">
        <Sidebar />
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="flex items-center justify-center h-full">
            <CircleNotch className="h-8 w-8 text-theme-text-secondary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const hasConfig = config?.active && config?.bot_username;

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                {t("telegram.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              {t("telegram.description")}
            </p>
          </div>

          {hasConfig ? (
            <ConnectedView
              config={config}
              workspaces={workspaces}
              onDisconnected={handleDisconnected}
              onReconnected={handleConnected}
            />
          ) : (
            <SetupView workspaces={workspaces} onConnected={handleConnected} />
          )}
        </div>
      </div>
    </div>
  );
}
