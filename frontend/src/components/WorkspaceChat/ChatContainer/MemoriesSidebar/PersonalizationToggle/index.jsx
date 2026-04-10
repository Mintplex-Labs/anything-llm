import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import Admin from "@/models/admin";

/**
 * @param {Object} props
 * @param {boolean} props.enabled
 * @param {boolean} props.loading
 * @param {function} props.onToggle - Called with the new enabled value
 */
export default function PersonalizationToggle({ enabled, loading, onToggle }) {
  async function handleToggle(checked) {
    const value = checked ? "on" : "off";
    const { success } = await Admin.updateSystemPreferences({
      memory_enabled: value,
    });
    if (!success) return;
    onToggle(checked);
  }

  if (loading) return null;

  return (
    <div className="shrink-0 bg-zinc-900 light:bg-white light:border light:border-slate-300 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-50 light:text-slate-900">
            Enable Personalization
          </p>
          <p className="text-xs leading-4 text-zinc-400 light:text-slate-500">
            When enabled, AnythingLLM will learn user preferences and context
            from conversations
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
