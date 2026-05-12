import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import {
  CircleNotch,
  Eye,
  EyeSlash,
  FloppyDisk,
  Plugs,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import Toggle from "@/components/lib/Toggle";
import AdvancedGateway from "@/models/advancedGateway";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";

const DEFAULT_CONFIG = {
  active: false,
  gateway_url: "",
  has_api_key: false,
  has_api_secret: false,
};

export default function AdvancedGatewayConnectorSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [isMultiUserMode, configRes] = await Promise.all([
        System.isMultiUserMode(),
        AdvancedGateway.getConfig(),
      ]);

      if (isMultiUserMode) navigate(paths.home());
      setConfig(configRes?.config || DEFAULT_CONFIG);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    const res = await AdvancedGateway.saveConfig({
      active: config.active,
      gateway_url: config.gateway_url,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    setSaving(false);

    if (!res.success) {
      showToast(res.error || t("advancedGateway.toasts.save-failed"), "error");
      return;
    }

    setConfig(res.config || DEFAULT_CONFIG);
    setApiKey("");
    setApiSecret("");
    showToast(t("advancedGateway.toasts.saved"), "success");
  }

  async function handleTest() {
    setTesting(true);
    const res = await AdvancedGateway.testConnection();
    setTesting(false);

    if (!res.success) {
      showToast(
        res.message || res.error || t("advancedGateway.toasts.test-failed"),
        "error"
      );
      return;
    }
    showToast(res.message || t("advancedGateway.toasts.tested"), "success");
  }

  return (
    <ConnectionsLayout>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <CircleNotch className="h-8 w-8 text-zinc-400 light:text-slate-400 animate-spin" />
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-y-6 mt-8 max-w-[760px]"
        >
          <section className="rounded-lg border border-sky-400/20 light:border-sky-200 bg-sky-950/20 light:bg-sky-50 p-5">
            <p className="text-sm font-semibold text-sky-100 light:text-sky-950 mb-3">
              {t("advancedGateway.notes.title")}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs leading-5 text-sky-100/80 light:text-sky-900">
              <li>{t("advancedGateway.notes.api-secret")}</li>
              <li>{t("advancedGateway.notes.gateway-url")}</li>
              <li>{t("advancedGateway.notes.no-wechat-state")}</li>
              <li>{t("advancedGateway.notes.external-gateway")}</li>
            </ul>
          </section>

          <section className="rounded-lg border border-white/10 light:border-slate-200 bg-zinc-950/30 light:bg-slate-50 p-5">
            <Toggle
              size="lg"
              enabled={config.active}
              onChange={(active) => setConfig((prev) => ({ ...prev, active }))}
              label={t("advancedGateway.enabled.title")}
              description={t("advancedGateway.enabled.description")}
              variant="horizontal"
            />
          </section>

          <section className="rounded-lg border border-white/10 light:border-slate-200 bg-zinc-950/30 light:bg-slate-50 p-5 flex flex-col gap-y-5">
            <TextInput
              label={t("advancedGateway.fields.gateway-url")}
              value={config.gateway_url}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, gateway_url: value }))
              }
              placeholder="https://gateway.example.com"
            />
            <SecretInput
              label={t("advancedGateway.fields.api-key")}
              value={apiKey}
              onChange={setApiKey}
              placeholder={
                config.has_api_key
                  ? t("advancedGateway.fields.secret-saved")
                  : "gw-key"
              }
            />
            <SecretInput
              label={t("advancedGateway.fields.api-secret")}
              value={apiSecret}
              onChange={setApiSecret}
              placeholder={
                config.has_api_secret
                  ? t("advancedGateway.fields.secret-saved")
                  : "gw-secret"
              }
            />
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-zinc-800 light:bg-white border border-white/10 light:border-slate-300 text-white light:text-slate-900 rounded-lg h-9 px-4 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <CircleNotch className="h-4 w-4 animate-spin" />
              ) : (
                <Plugs className="h-4 w-4" />
              )}
              {t("advancedGateway.actions.test")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <CircleNotch className="h-4 w-4 animate-spin" />
              ) : (
                <FloppyDisk className="h-4 w-4" />
              )}
              {t("advancedGateway.actions.save")}
            </button>
          </div>
        </form>
      )}
    </ConnectionsLayout>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {label}
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-zinc-800 light:bg-white light:border light:border-slate-300 h-9 rounded-lg px-3.5 text-sm text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 outline-none"
      />
    </div>
  );
}

function SecretInput({ label, value, onChange, placeholder }) {
  const [showSecret, setShowSecret] = useState(false);
  const Icon = showSecret ? Eye : EyeSlash;

  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {label}
      </label>
      <div className="bg-zinc-800 light:bg-white light:border light:border-slate-300 h-9 rounded-lg px-3.5 flex items-center gap-x-2">
        <button
          type="button"
          onClick={() => setShowSecret(!showSecret)}
          className="text-zinc-400 light:text-slate-500 hover:text-zinc-300 light:hover:text-slate-700 transition-colors shrink-0"
        >
          <Icon className="h-4 w-4" />
        </button>
        <input
          type={showSecret ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent flex-1 text-sm text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 outline-none min-w-0"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

function ConnectionsLayout({ children }) {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-2xl bg-zinc-900 light:bg-white light:border light:border-slate-300 w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-2 pb-6 border-b border-white/20 light:border-slate-300">
            <p className="text-lg font-semibold leading-7 text-white light:text-slate-900">
              {t("advancedGateway.title")}
            </p>
            <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
              {t("advancedGateway.description")}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
