import { useState } from "react";
import { useTranslation } from "react-i18next";
import Lark from "@/models/lark";
import PlatformSelector from "../components/PlatformSelector";
import ConfigurationFields from "../components/ConfigurationFields";

export default function SetupView({
  config,
  workspaces,
  lifecycleAction,
  runLifecycle,
}) {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState(config?.platform || "lark");
  const [appId, setAppId] = useState(config?.app_id || "");
  const [secret, setSecret] = useState("");
  const [workspace, setWorkspace] = useState(config?.default_workspace || "");
  const [limit, setLimit] = useState(config?.attachment_size_limit ?? "");
  const busy = Boolean(lifecycleAction);
  const connecting = lifecycleAction === "connect";
  const canReuseSecret = config?.has_app_secret;
  const validLimit =
    limit === "" || (Number.isSafeInteger(Number(limit)) && Number(limit) > 0);
  const canConnect =
    appId.trim() &&
    (secret.trim() || canReuseSecret) &&
    workspaces.some((item) => item.slug === workspace) &&
    validLimit;

  async function connect(event) {
    event.preventDefault();
    if (busy || !canConnect) return;
    await runLifecycle("connect", async () => {
      try {
        return await Lark.connect({
          platform,
          app_id: appId.trim(),
          ...(secret.trim() ? { app_secret: secret.trim() } : {}),
          default_workspace: workspace,
          attachment_size_limit: limit === "" ? null : Number(limit),
        });
      } finally {
        // Clear credentials before the page applies the result or changes views.
        setSecret("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-y-6 mt-8 max-w-[700px]">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-base font-semibold">{t("lark.setup.title")}</h2>
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("lark.setup.instructions")}
        </p>
      </div>
      <form onSubmit={connect} className="flex flex-col gap-y-[18px]">
        <PlatformSelector
          value={platform}
          onChange={setPlatform}
          disabled={busy}
        />
        <label className="flex flex-col gap-y-1.5 text-sm font-medium w-full max-w-[400px]">
          {t("lark.setup.app-id")}
          <input
            value={appId}
            onChange={(event) => setAppId(event.target.value)}
            required
            disabled={busy}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 rounded-lg h-9 px-3"
          />
        </label>
        <label className="flex flex-col gap-y-1.5 text-sm font-medium w-full max-w-[400px]">
          {t("lark.setup.app-secret")}
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            autoComplete="new-password"
            required={!canReuseSecret}
            disabled={busy}
            placeholder={canReuseSecret ? "••••••••" : ""}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 rounded-lg h-9 px-3"
          />
        </label>
        {canReuseSecret && (
          <p className="text-xs text-zinc-400 light:text-slate-600">
            {t("lark.setup.saved-secret")}
          </p>
        )}
        <ConfigurationFields
          workspaces={workspaces}
          workspace={workspace}
          setWorkspace={setWorkspace}
          limit={limit}
          setLimit={setLimit}
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !canConnect}
          className="text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 w-fit hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t(
            connecting
              ? "lark.setup.connecting"
              : config?.app_id
                ? "lark.setup.reconnect"
                : "lark.setup.connect"
          )}
        </button>
      </form>
    </div>
  );
}
