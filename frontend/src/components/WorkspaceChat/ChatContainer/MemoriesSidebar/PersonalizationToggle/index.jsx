import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { useTranslation } from "react-i18next";
import Admin from "@/models/admin";
import { useMemoriesContext } from "../MemoriesContext";

export default function PersonalizationToggle() {
  const {
    canToggle,
    enabled,
    setEnabled,
    autoExtraction,
    setAutoExtraction,
    loadingEnabled,
  } = useMemoriesContext();
  const { t } = useTranslation();

  async function handleToggle(checked) {
    const value = checked ? "true" : "false";
    const { success } = await Admin.updateSystemPreferences({
      memory_enabled: value,
    });
    if (!success) return;
    setEnabled(checked);
  }

  async function handleAutoExtractionToggle(checked) {
    const value = checked ? "true" : "false";
    const { success } = await Admin.updateSystemPreferences({
      memory_auto_extraction: value,
    });
    if (!success) return;
    setAutoExtraction(checked);
  }

  if (!canToggle || loadingEnabled) return null;

  return (
    <div className="shrink-0 bg-zinc-900 light:bg-white light:border light:border-slate-300 rounded-2xl p-4 space-y-3">
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
      {enabled && (
        <div className="flex items-start gap-3 pt-2 border-t border-zinc-800 light:border-slate-200">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-50 light:text-slate-900">
              {t("chat_window.memories.auto_extraction.label")}
            </p>
            <p className="text-xs leading-4 text-zinc-400 light:text-slate-500">
              {t("chat_window.memories.auto_extraction.description")}
            </p>
          </div>
          <SimpleToggleSwitch
            size="md"
            enabled={autoExtraction}
            onChange={handleAutoExtractionToggle}
          />
        </div>
      )}
    </div>
  );
}
