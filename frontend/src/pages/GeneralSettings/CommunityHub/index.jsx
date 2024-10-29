import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import ImportModal from "./ImportModal";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
import Hub from "@/models/hub";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import showToast from "@/utils/toast";
import { FullScreenLoader } from "@/components/Preloader";
import HubItemRow from "./HubItemRow";
import paths from "@/utils/paths";

export default function CommunityHub() {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [exploreItems, setExploreItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settingsResponse, fetchedItems, exploreResponse] =
          await Promise.all([Hub.getSettings(), Hub.getItems(), Hub.explore()]);

        setHasApiKey(!!settingsResponse?.settings?.hasApiKey);
        setItems(fetchedItems);
        if (exploreResponse.success) {
          setExploreItems(exploreResponse.items || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Hub.updateSettings({ hub_api_key: apiKey });
      if (!response.success) {
        showToast("Failed to save API key", "error");
        return;
      }

      setHasApiKey(!!apiKey);
      setApiKey("");
      setHasChanges(false);
      showToast("API key saved successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to save API key", "error");
    }
  };

  const handleChange = (e) => {
    setApiKey(e.target.value);
    setHasChanges(true);
  };

  const handleDiscard = () => {
    setApiKey("");
    setHasChanges(false);
  };

  const handleDelete = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <ContextualSaveBar
        showing={hasChanges}
        onSave={handleSubmit}
        onCancel={handleDiscard}
      />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                {t("community-hub.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("community-hub.description")}
            </p>
          </div>

          {/* Hub Interface Section */}
          <div className="w-full flex flex-col gap-y-1 pb-6 pt-6">
            <div className="items-center flex justify-between">
              <p className="text-base font-semibold text-white mb-4">
                Trending on AnythingLLM Hub
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["prompt", "skill", "workspace", "command"].map((type) => (
                <div key={type} className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="text-white capitalize font-medium mb-3">
                    {type}s
                  </h3>
                  <div className="space-y-2">
                    {exploreItems
                      .filter((item) => item.type === type)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-all duration-200"
                        >
                          <p className="text-white text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="text-white/60 text-xs mt-1">
                            {item.content}
                          </p>
                          <div className="flex justify-end mt-2">
                            <button
                              className="text-primary-button hover:text-primary-button/80 text-xs"
                              onClick={() => {
                                /* TODO: Add import action */
                              }}
                            >
                              Import →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={paths.external.hub()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-primary-button hover:underline text-md"
            >
              Visit Hub Website →
            </a>
          </div>

          {/* API Key Section */}
          <div className="mt-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full max-w-[400px]"
            >
              <label className="text-white text-sm font-semibold block mb-2">
                AnythingLLM Hub API Key
              </label>
              <input
                type="password"
                value={apiKey || (hasApiKey ? "••••••••••••••••••••" : "")}
                onChange={handleChange}
                className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Enter your AnythingLLM Hub API key"
              />
              <p className="text-white/60 text-xs mt-2">
                Connect your AnythingLLM Hub account to automatically sync your
                shared items.
              </p>
            </form>
          </div>

          {/* Import Section */}
          <div className="mt-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-base font-semibold">
                  Import Items
                </h2>
                <p className="text-white/60 text-xs mt-1">
                  Import prompts, skills, workspaces, and commands shared by the
                  community.
                </p>
              </div>
              <CTAButton onClick={openModal}>
                <Plus className="h-4 w-4" />
                Import Item
              </CTAButton>
            </div>
          </div>

          {/* Items Table Section */}
          <div className="mt-8">
            <table className="w-full text-sm text-left rounded-lg mt-6">
              <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
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
                {items.length === 0 ? (
                  <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium">
                    <td colSpan="4" className="px-6 py-4 text-center">
                      No items found
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <HubItemRow
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <ImportModal isOpen={isOpen} closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
}
