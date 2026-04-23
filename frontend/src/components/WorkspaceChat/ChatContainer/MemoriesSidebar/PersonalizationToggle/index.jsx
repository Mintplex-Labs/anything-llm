import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { useTranslation } from "react-i18next";
import Admin from "@/models/admin";
import { useMemoriesContext } from "../MemoriesContext";

export default function PersonalizationToggle() {
  const { canToggle, enabled, setEnabled, loadingEnabled } =
    useMemoriesContext();
  const { t } = useTranslation();

  async function handleToggle(checked) {
    const value = checked ? "on" : "off";
    const { success } = await Admin.updateSystemPreferences({
      memory_enabled: value,
    });
    if (!success) return;
    setEnabled(checked);
  }

  if (!canToggle || loadingEnabled) return null;

  return (
    <div className="shrink-0 bg-zinc-900 light:bg-white light:border light:border-slate-300 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-50 light:text-slate-900">
            {t("chat_window.memories.toggle.label")}
          </p>
          <p className="text-xs leading-4 text-zinc-400 light:text-slate-500">
            {t("chat_window.memories.toggle.description")}
          </p>
        </div>
        <SimpleToggleSwitch
          size="md"
          enabled={enabled}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
}
