import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { CircleNotch } from "@phosphor-icons/react";
import Sidebar from "@/components/SettingsSidebar";
import Admin from "@/models/admin";
import System from "@/models/system";
import Lark from "@/models/lark";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import SetupView from "./SetupView";
import ConnectedView from "./ConnectedView";
import UsersSection from "./UsersSection";

export default function LarkSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [lifecycleAction, setLifecycleAction] = useState(null);
  const lifecycleOwner = useRef(null);
  const lastError = useRef(null);
  const revision = useRef(0);
  const usersRequest = useRef(0);
  const mounted = useRef(false);

  const reportError = useCallback((message) => {
    if (!mounted.current) return;
    setError(message);
    if (message && lastError.current !== message) showToast(message, "error");
    lastError.current = message;
  }, []);

  const changeConfig = useCallback((next) => {
    if (!mounted.current) return;
    revision.current += 1;
    setConfig(next);
    setError(null);
    lastError.current = null;
    if (!next) {
      setPendingUsers([]);
      setApprovedUsers([]);
    }
  }, []);

  const runLifecycle = useCallback(
    async (action, request) => {
      // Own the configuration before sending a lifecycle request. In-flight polls
      // and callbacks from older generations must not replace this request's view.
      if (!mounted.current || lifecycleOwner.current !== null) return;
      const owner = ++revision.current;
      lifecycleOwner.current = owner;
      setLifecycleAction(action);
      reportError(null);
      const isCurrent = () =>
        mounted.current &&
        lifecycleOwner.current === owner &&
        revision.current === owner;
      try {
        const response = await request();
        if (!isCurrent()) return;
        if (!response?.success)
          return reportError(response?.error || t(`lark.errors.${action}`));
        changeConfig(action === "disconnect" ? null : response.config);
      } catch {
        if (isCurrent()) reportError(t(`lark.errors.${action}`));
      } finally {
        if (lifecycleOwner.current === owner) {
          lifecycleOwner.current = null;
          if (mounted.current) setLifecycleAction(null);
        }
      }
    },
    [changeConfig, reportError, t]
  );

  const refreshUsers = useCallback(async () => {
    const current = revision.current;
    const request = ++usersRequest.current;
    try {
      const [pending, approved] = await Promise.all([
        Lark.getPendingUsers(),
        Lark.getApprovedUsers(),
      ]);
      if (
        !mounted.current ||
        current !== revision.current ||
        request !== usersRequest.current
      )
        return;
      if (pending.error || approved.error) {
        reportError(pending.error || approved.error);
        return;
      }
      setPendingUsers(pending.users || []);
      setApprovedUsers(approved.users || []);
    } catch {
      if (current === revision.current && request === usersRequest.current)
        reportError(t("lark.errors.users"));
    }
  }, [reportError, t]);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    async function load() {
      try {
        if (await System.isMultiUserMode()) {
          if (!cancelled) navigate(paths.home());
          return;
        }
        if (cancelled) return;
        const [result, available] = await Promise.all([
          Lark.getConfig(),
          Admin.workspaces(),
        ]);
        if (cancelled) return;
        setConfig(result?.config || null);
        setWorkspaces(available || []);
        if (result?.error) reportError(result.error);
      } catch {
        if (!cancelled) reportError(t("lark.errors.load"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      mounted.current = false;
      lifecycleOwner.current = null;
      revision.current += 1;
    };
    // This is the page lifetime, not a translation-change subscription. A new
    // translator must not abandon an in-flight lifecycle owner or reload config.
  }, []);

  const hasConfig = Boolean(config?.app_id);
  const shouldPoll =
    hasConfig &&
    (config.active ||
      config.connected ||
      config.connection_state === "reconnecting");
  useEffect(() => {
    if (hasConfig) refreshUsers();
  }, [hasConfig, refreshUsers]);

  useEffect(() => {
    if (!shouldPoll) return;
    let cancelled = false;
    let refreshing = false;
    const interval = setInterval(async () => {
      if (refreshing || lifecycleOwner.current !== null) return;
      refreshing = true;
      const current = revision.current;
      try {
        const status = await Lark.status();
        if (cancelled || current !== revision.current) return;
        if (status.error) reportError(status.error);
        else setConfig(status);
        await refreshUsers();
      } catch {
        if (
          !cancelled &&
          current === revision.current &&
          lifecycleOwner.current === null
        )
          reportError(t("lark.errors.status"));
      } finally {
        refreshing = false;
      }
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [shouldPoll, refreshUsers, reportError, t]);

  const state = config?.connection_state || "disconnected";
  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-2xl bg-zinc-900 light:bg-white light:border light:border-slate-300 w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16 text-white light:text-slate-900">
          <div className="flex flex-col gap-y-2 pb-6 border-b border-white/20 light:border-slate-300">
            <h1 className="text-lg font-semibold leading-7">
              {t("lark.title")}
            </h1>
            <p className="text-xs text-zinc-400 light:text-slate-600 max-w-[700px]">
              {t("lark.description")}
            </p>
          </div>
          {loading ? (
            <div aria-busy="true" className="flex justify-center py-20">
              <CircleNotch className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : (
            <>
              {hasConfig && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-zinc-700 light:border-slate-200 p-4 text-sm"
                >
                  <p>{t(`lark.status.${state}`)}</p>
                  {config.last_error && (
                    <p className="mt-2 text-zinc-400 light:text-slate-600">
                      {t(`lark.errors.${config.last_error.category}`)} ·{" "}
                      {new Date(config.last_error.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-400/40 p-3 text-sm text-red-400 light:text-red-600"
                >
                  {error}
                </div>
              )}
              {config?.connected ? (
                <ConnectedView
                  config={config}
                  workspaces={workspaces}
                  busy={Boolean(lifecycleAction)}
                  runLifecycle={runLifecycle}
                />
              ) : (
                <SetupView
                  config={config}
                  workspaces={workspaces}
                  lifecycleAction={lifecycleAction}
                  runLifecycle={runLifecycle}
                />
              )}
              {hasConfig && (
                <>
                  <button
                    type="button"
                    disabled={Boolean(lifecycleAction)}
                    onClick={() =>
                      runLifecycle("disconnect", () => Lark.disconnect())
                    }
                    className="mt-4 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 w-fit hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("lark.connected.disconnect")}
                  </button>
                  <UsersSection
                    pendingUsers={pendingUsers}
                    approvedUsers={approvedUsers}
                    refreshUsers={refreshUsers}
                    reportError={reportError}
                    disabled={Boolean(lifecycleAction)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
