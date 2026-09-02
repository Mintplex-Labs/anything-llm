import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import Observability from "@/models/observability";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import LangfuseLogo from "@/media/observability/langfuse.png";
import LLMItem from "@/components/LLMSelection/LLMItem";
import LangfuseOptions from "@/components/ObservabilitySelection/LangfuseOptions";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";

const PROVIDERS = [
  {
    name: "None",
    value: "none",
    logo: AnythingLLMIcon,
    options: () => null,
    description: "Observability is disabled. Traces will not be sent anywhere.",
  },
  {
    name: "Langfuse",
    value: "langfuse",
    logo: LangfuseLogo,
    options: (config) => <LangfuseOptions config={config} />,
    description:
      "Send traces to Langfuse Cloud or your self-hosted Langfuse instance.",
  },
];

export default function ObservabilitySettings() {
  const [settings, setSettings] = useState({ provider: null, config: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("none");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await Observability.getSettings();
      setSettings(_settings);
      setSelectedProvider(_settings?.provider || "none");
      setLoading(false);
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    setFilteredProviders(
      PROVIDERS.filter((provider) =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, selectedProvider]);

  const updateProviderChoice = (selection) => {
    setSearchQuery("");
    setSelectedProvider(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const config = {};
    const formData = new FormData(e.target);
    for (var [key, value] of formData.entries()) config[key] = value;

    const { success, error } = await Observability.updateSettings(
      selectedProvider === "none" ? null : selectedProvider,
      config
    );
    if (success) {
      showToast("Observability settings saved.", "success");
      setHasChanges(false);
    } else {
      showToast(`Failed to save observability settings: ${error}`, "error");
    }
    setSaving(false);
  };

  const selectedProviderObject = PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    {t("settings.observability")}
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  Send LLM inference traces (prompts, responses, token usage,
                  and latency) to an external observability platform. Tracing is
                  fully asynchronous and will never block or fail a chat if the
                  observability endpoint is unreachable.
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton className="mt-3 mr-0 -mb-14 z-10">
                    {saving ? t("common.saving") : t("common.save")}
                  </CTAButton>
                )}
              </div>
              <div className="text-base font-bold text-white mt-6 mb-4">
                Provider
              </div>
              <div className="relative">
                {searchMenuOpen && (
                  <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
                    onClick={() => setSearchMenuOpen(false)}
                  />
                )}
                {searchMenuOpen ? (
                  <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="flex items-center sticky top-0 z-10 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                        <MagnifyingGlass
                          size={20}
                          weight="bold"
                          className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                        />
                        <input
                          type="text"
                          name="observability-provider-search"
                          autoComplete="off"
                          placeholder="Search observability providers"
                          className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          ref={searchInputRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                        />
                        <X
                          size={20}
                          weight="bold"
                          className="cursor-pointer text-white hover:text-x-button"
                          onClick={handleXButton}
                        />
                      </div>
                      <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4 max-h-[245px]">
                        {filteredProviders.map((provider) => (
                          <LLMItem
                            key={provider.name}
                            name={provider.name}
                            value={provider.value}
                            image={provider.logo}
                            description={provider.description}
                            checked={selectedProvider === provider.value}
                            onClick={() => updateProviderChoice(provider.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
                    type="button"
                    onClick={() => setSearchMenuOpen(true)}
                  >
                    <div className="flex gap-x-4 items-center">
                      <img
                        src={selectedProviderObject?.logo || AnythingLLMIcon}
                        alt={`${selectedProviderObject?.name} logo`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-white">
                          {selectedProviderObject?.name || "None selected"}
                        </div>
                        <div className="mt-1 text-xs text-description">
                          {selectedProviderObject?.description ||
                            "You need to select an observability provider"}
                        </div>
                      </div>
                    </div>
                    <CaretUpDown
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </button>
                )}
              </div>
              <div
                onChange={() => setHasChanges(true)}
                className="mt-4 flex flex-col gap-y-1"
              >
                {selectedProviderObject?.options(settings.config)}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
