import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import Observability from "@/models/observability";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

const PROVIDERS = [
  { value: "none", label: "None" },
  { value: "langfuse", label: "Langfuse" },
];

export default function ObservabilitySettings() {
  const [settings, setSettings] = useState({ provider: null, config: {} });
  const [provider, setProvider] = useState("none");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await Observability.getSettings();
      setSettings(_settings);
      setProvider(_settings?.provider || "none");
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.target);
    const config =
      provider === "langfuse"
        ? {
            publicKey: form.get("publicKey") || "",
            secretKey: form.get("secretKey") || "",
            host: form.get("host") || "",
          }
        : {};
    const { success, error } = await Observability.updateSettings(
      provider === "none" ? null : provider,
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
          <form
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-4 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
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
              <div className="flex flex-col w-full mt-4 gap-y-6 max-w-[500px]">
                <div className="flex flex-col gap-y-1">
                  <label className="text-white text-sm font-semibold block">
                    Provider
                  </label>
                  <select
                    name="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                {provider === "langfuse" && (
                  <LangfuseOptions config={settings.config} />
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function LangfuseOptions({ config = {} }) {
  const inputClasses =
    "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2";
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <label className="text-white text-sm font-semibold block">
          Public key
        </label>
        <input
          type="text"
          name="publicKey"
          defaultValue={config.publicKey || ""}
          className={inputClasses}
          placeholder="pk-lf-..."
          autoComplete="off"
          spellCheck={false}
          required
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label className="text-white text-sm font-semibold block">
          Secret key
        </label>
        <input
          type="password"
          name="secretKey"
          defaultValue={config.secretKey || ""}
          className={inputClasses}
          placeholder="sk-lf-..."
          autoComplete="new-password"
          spellCheck={false}
          required
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label className="text-white text-sm font-semibold block">
          Host URL
        </label>
        <input
          type="url"
          name="host"
          defaultValue={config.host || ""}
          className={inputClasses}
          placeholder="https://cloud.langfuse.com"
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-white text-opacity-60 text-xs mt-1">
          Leave blank to use Langfuse Cloud, or set the URL of your self-hosted
          Langfuse instance.
        </p>
      </div>
    </>
  );
}
