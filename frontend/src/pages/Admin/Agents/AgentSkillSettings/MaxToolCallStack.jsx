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
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-4">
        <div className="flex flex-col gap-y-1 flex-1">
          <label className="block text-md font-medium text-zinc-50 light:text-slate-900">
            {t("agent.settings.max-tool-calls.title")}
          </label>
          <p className="text-xs text-zinc-400 light:text-slate-600">
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
          className="bg-zinc-800 border border-zinc-800 text-zinc-100 placeholder:text-zinc-400 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400 text-sm rounded-lg outline-none focus:border-sky-500 light:focus:border-sky-500 block w-[80px] h-[34px] px-3 text-center"
          placeholder="10"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
