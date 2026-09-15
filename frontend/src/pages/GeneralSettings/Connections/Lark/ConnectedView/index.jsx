import { useState } from "react";
import { useTranslation } from "react-i18next";
import Lark from "@/models/lark";
import ConfigurationFields from "../components/ConfigurationFields";

export default function ConnectedView({
  config,
  workspaces,
  onConfigChange,
  reportError,
}) {
  const { t } = useTranslation();
  const [workspace, setWorkspace] = useState(config.default_workspace || "");
  const [limit, setLimit] = useState(config.attachment_size_limit ?? "");
  const [busy, setBusy] = useState(false);
  const valid =
    workspaces.some((item) => item.slug === workspace) &&
    (limit === "" ||
      (Number.isSafeInteger(Number(limit)) && Number(limit) > 0));
  async function mutate(action) {
    if (busy) return;
    setBusy(true);
    reportError(null);
    try {
      const response =
        action === "disconnect"
          ? await Lark.disconnect()
          : await Lark.updateConfig({
              default_workspace: workspace,
              attachment_size_limit: limit === "" ? null : Number(limit),
            });
      if (!response.success)
        return reportError(response.error || t(`lark.errors.${action}`));
      onConfigChange(action === "disconnect" ? null : response.config);
    } catch {
      reportError(t(`lark.errors.${action}`));
    } finally {
      setBusy(false);
    }
  }
  const buttonClass =
    "text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 w-fit hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <div className="flex flex-col gap-y-6 mt-8 max-w-[700px]">
      <div className="border border-zinc-700 light:border-slate-200 rounded-xl p-4 flex flex-col gap-y-3 text-sm">
        <h2 className="text-base font-semibold">
          {config.bot_name || t("lark.connected.unknown-bot")}
        </h2>
        <p>{config.platform === "feishu" ? "Feishu" : "Lark"}</p>
        <p>
          {t("lark.setup.app-id")}: {config.app_id}
        </p>
        <p>
          {t("lark.setup.app-secret")}:{" "}
          <span>
            {config.has_app_secret ? "••••••••" : t("lark.connected.no-secret")}
          </span>
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) mutate("save");
        }}
        className="flex flex-col gap-y-[18px]"
      >
        <ConfigurationFields
          workspaces={workspaces}
          workspace={workspace}
          setWorkspace={setWorkspace}
          limit={limit}
          setLimit={setLimit}
          disabled={busy}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy || !valid}
            className={buttonClass}
          >
            {t("lark.connected.save")}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => mutate("disconnect")}
            className={buttonClass}
          >
            {t("lark.connected.disconnect")}
          </button>
        </div>
      </form>
    </div>
  );
}
