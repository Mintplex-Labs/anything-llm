import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import System from "@/models/system";

export default function MaxToolCallStack() {
  const { t } = useTranslation();
  const [maxCallStack, setMaxCallStack] = useState(10);
  const [loading, setLoading] = useState(true);

  const debouncedUpdateMaxCallStack = useMemo(
    () =>
      debounce(async (newMaxCallStack) => {
        await System.updateSystem({
          AgentSkillMaxToolCalls: newMaxCallStack.toString(),
        });
      }, 800),
    []
  );

  useEffect(() => {
    System.keys()
      .then((res) => {
        setMaxCallStack(parseInt(res.AgentSkillMaxToolCalls));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => debouncedUpdateMaxCallStack.cancel();
  }, [debouncedUpdateMaxCallStack]);

  return (
    <div className="flex flex-col gap-y-2 mt-4">
      <div className="flex items-center gap-x-4 mt-2">
        <div className="flex flex-col gap-y-1 flex-1">
          <label className="block text-md font-medium text-white">
            {t("agent.settings.max-tool-calls.title")}
          </label>
          <p className="text-xs text-white/60">
            {t("agent.settings.max-tool-calls.description")}
          </p>
        </div>
        <input
          type="number"
          name="agentSkillMaxToolCalls"
          min={1}
          value={maxCallStack}
          disabled={loading}
          onChange={(e) => {
            if (e.target.value < 1) return;
            debouncedUpdateMaxCallStack(e.target.value);
            setMaxCallStack(parseInt(e.target.value));
          }}
          onWheel={(e) => e.target.blur()}
          className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
          placeholder="10"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
