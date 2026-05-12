import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import {
  ArrowClockwise,
  CircleNotch,
  QrCode,
  SignOut,
  UserCircle,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import Toggle from "@/components/lib/Toggle";
import System from "@/models/system";
import WeChat from "@/models/wechat";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";

const DEFAULT_CONFIG = {
  active: false,
  status: "disconnected",
  qr_status: "placeholder",
  profile: {
    nickname: null,
    avatar_url: null,
    wxid: null,
    openid: null,
  },
  last_connected_at: null,
};

export default function WeChatConnectorSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeType, setQrCodeType] = useState(null);
  const [action, setAction] = useState(null);
  const isGenerating = action === "generating";
  const isDisconnecting = action === "disconnecting";
  const isBusy = Boolean(action);
  const canGenerate = !isBusy && config.status !== "connected";

  useEffect(() => {
    async function fetchData() {
      const [isMultiUserMode, configRes] = await Promise.all([
        System.isMultiUserMode(),
        WeChat.getConfig(),
      ]);

      if (isMultiUserMode) navigate(paths.home());
      setConfig(configRes?.config || DEFAULT_CONFIG);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (config.status !== "pending_scan") return;

    let cancelled = false;
    const pollStatus = async () => {
      const res = await WeChat.getStatus();
      if (cancelled) return;

      if (!res.success) {
        showToast(
          t(`wechat.errors.${res.error}`, {
            defaultValue: t("wechat.toasts.status-failed"),
          }),
          "error"
        );
        return;
      }

      setConfig(res.config || DEFAULT_CONFIG);
      if (res.status === "expired") {
        setQrCode(null);
        setQrCodeType(null);
      }
    };

    const interval = setInterval(pollStatus, 3_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [config.status, t]);

  async function handleToggle(active) {
    setConfig((prev) => ({ ...prev, active }));
    const res = await WeChat.saveConfig({ active });
    if (!res.success) {
      showToast(res.error || t("wechat.toasts.save-failed"), "error");
      setConfig((prev) => ({ ...prev, active: !active }));
      return;
    }
    setConfig(res.config || DEFAULT_CONFIG);
  }

  async function handleGenerateQrCode() {
    if (!canGenerate) return;
    setAction("generating");
    const res = await WeChat.generateQrCode();
    setAction(null);

    if (!res.success) {
      showToast(
        t(`wechat.errors.${res.error}`, {
          defaultValue: res.error || t("wechat.toasts.qr-failed"),
        }),
        "error"
      );
      return;
    }
    setConfig(res.config || DEFAULT_CONFIG);
    setQrCode(res.qr_code || res.qrcode?.qr_code || null);
    setQrCodeType(res.qr_code_type || res.qrcode?.qr_code_type || null);
  }

  async function handleDisconnect() {
    if (isBusy) return;
    setAction("disconnecting");
    const res = await WeChat.disconnect();
    setAction(null);

    if (!res.success) {
      showToast(
        `${t(`wechat.errors.${res.error}`, {
          defaultValue: res.error || t("wechat.toasts.disconnect-failed"),
        })}${res.reason ? `: ${res.reason}` : ""}`,
        "error"
      );
      return;
    }
    setConfig(res.config || DEFAULT_CONFIG);
    setQrCode(null);
    setQrCodeType(null);
  }

  return (
    <ConnectionsLayout>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <CircleNotch className="h-8 w-8 text-zinc-400 light:text-slate-400 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-8 mt-8">
          <section className="max-w-[760px] rounded-lg border border-white/10 light:border-slate-200 bg-zinc-950/30 light:bg-slate-50 p-5">
            <Toggle
              size="lg"
              enabled={config.active}
              onChange={handleToggle}
              label={t("wechat.enabled.title")}
              description={t("wechat.enabled.description")}
              variant="horizontal"
            />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 max-w-[900px]">
            <div className="rounded-lg border border-white/10 light:border-slate-200 bg-zinc-950/30 light:bg-slate-50 p-5 flex flex-col items-center gap-y-4">
              <QrCodePanel qrCode={qrCode} qrCodeType={qrCodeType} />
              <button
                type="button"
                onClick={handleGenerateQrCode}
                disabled={!canGenerate}
                className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <CircleNotch className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowClockwise className="h-4 w-4" />
                )}
                {t("wechat.qr.generate")}
              </button>
            </div>

            <div className="flex flex-col gap-y-4">
              <StatusPanel status={config.status} />
              {config.status === "connected" && <ConnectedHint />}
              {isDisconnecting && <DisconnectingHint />}
              <ProfilePanel
                profile={config.profile}
                lastConnectedAt={config.last_connected_at}
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateQrCode}
                  disabled={!canGenerate}
                  className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-zinc-800 light:bg-white border border-white/10 light:border-slate-300 text-white light:text-slate-900 rounded-lg h-9 px-4 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowClockwise className="h-4 w-4" />
                  {t("wechat.actions.relogin")}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isBusy}
                  className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-transparent border border-red-400/50 text-red-300 light:text-red-600 rounded-lg h-9 px-4 hover:bg-red-500/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDisconnecting ? (
                    <CircleNotch className="h-4 w-4 animate-spin" />
                  ) : (
                    <SignOut className="h-4 w-4" />
                  )}
                  {isDisconnecting
                    ? t("wechat.actions.disconnecting")
                    : t("wechat.actions.disconnect")}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </ConnectionsLayout>
  );
}

function ConnectedHint() {
  const { t } = useTranslation();
  return (
    <section className="rounded-lg border border-green-400/30 bg-green-500/10 light:bg-green-50 light:border-green-200 p-4">
      <p className="text-sm text-green-200 light:text-green-800">
        {t("wechat.status.connected-hint")}
      </p>
    </section>
  );
}

function DisconnectingHint() {
  const { t } = useTranslation();
  return (
    <section className="rounded-lg border border-yellow-400/30 bg-yellow-500/10 light:bg-yellow-50 light:border-yellow-200 p-4">
      <p className="text-sm text-yellow-100 light:text-yellow-800">
        {t("wechat.status.disconnecting-hint")}
      </p>
    </section>
  );
}

function QrCodePanel({ qrCode, qrCodeType }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-y-3">
      <div className="w-[220px] h-[220px] rounded-lg border border-dashed border-zinc-600 light:border-slate-300 bg-zinc-900 light:bg-white flex flex-col items-center justify-center gap-y-3 text-zinc-400 light:text-slate-500 overflow-hidden">
        {qrCode && qrCodeType === "image" ? (
          <img
            src={qrCode}
            alt={t("wechat.qr.alt")}
            className="h-full w-full object-contain bg-white p-2"
          />
        ) : qrCode && qrCodeType === "url" ? (
          <div className="bg-white p-3 rounded">
            <QRCodeSVG value={qrCode} size={180} />
          </div>
        ) : qrCode && qrCodeType === "ascii" ? (
          <pre className="text-[7px] leading-[7px] text-white light:text-slate-900 whitespace-pre overflow-auto max-w-full max-h-full p-2">
            {qrCode}
          </pre>
        ) : (
          <>
            <QrCode className="h-16 w-16" />
            <p className="text-xs text-center leading-5 px-4">
              {t("wechat.qr.placeholder")}
            </p>
          </>
        )}
      </div>
      {qrCode && qrCodeType === "url" && (
        <div className="w-[220px] text-center">
          <p className="text-[11px] leading-4 text-zinc-400 light:text-slate-500">
            {t("wechat.qr.open-link-helper")}
          </p>
          <a
            href={qrCode}
            target="_blank"
            rel="noreferrer"
            className="block text-[11px] leading-4 text-blue-300 light:text-blue-700 underline break-all mt-1"
          >
            {qrCode}
          </a>
        </div>
      )}
    </div>
  );
}

function StatusPanel({ status }) {
  const { t } = useTranslation();
  return (
    <section className="rounded-lg border border-white/10 light:border-slate-200 bg-zinc-950/30 light:bg-slate-50 p-5">
      <p className="text-sm font-semibold text-white light:text-slate-900">
        {t("wechat.status.title")}
      </p>
      <p className="text-sm text-zinc-300 light:text-slate-700 mt-2">
        {t(`wechat.status.${status || "disconnected"}`)}
      </p>
    </section>
  );
}

function ProfilePanel({ profile = {}, lastConnectedAt = null }) {
  const { t } = useTranslation();
  const rows = [
    [t("wechat.profile.nickname"), profile.nickname],
    [t("wechat.profile.wxid"), profile.wxid],
    [t("wechat.profile.openid"), profile.openid],
    [t("wechat.profile.last-connected"), lastConnectedAt],
  ];

  return (
    <section className="rounded-lg border border-white/10 light:border-slate-200 bg-zinc-950/30 light:bg-slate-50 p-5">
      <p className="text-sm font-semibold text-white light:text-slate-900">
        {t("wechat.profile.title")}
      </p>
      <p className="text-xs text-zinc-400 light:text-slate-500 mt-1">
        {t("wechat.profile.best-effort")}
      </p>
      <div className="flex items-center gap-x-4 mt-4">
        <div className="h-14 w-14 rounded-full bg-zinc-800 light:bg-white border border-white/10 light:border-slate-200 flex items-center justify-center overflow-hidden">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={t("wechat.profile.avatar")}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle className="h-9 w-9 text-zinc-500 light:text-slate-400" />
          )}
        </div>
        <div className="flex flex-col gap-y-2 min-w-0">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-wrap gap-x-2 text-sm">
              <span className="text-zinc-400 light:text-slate-500">
                {label}
              </span>
              <span className="text-white light:text-slate-900 break-all">
                {value || t("wechat.profile.placeholder")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
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
              {t("wechat.title")}
            </p>
            <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
              {t("wechat.description")}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
