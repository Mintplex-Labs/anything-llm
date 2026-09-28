import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import System from "@/models/system";
import Admin from "@/models/admin";

/**
 * Setting for how many markdown skills are injected into the system prompt
 * per chat when there are more skills than the limit. When at or under the
 * limit, all skills are always injected.
 */
export default function MarkdownSkillInjectionLimit() {
  const { t } = useTranslation();
  const [maxInjected, setMaxInjected] = useState(5);
  const [loading, setLoading] = useState(true);

  const debouncedUpdateMaxInjected = useMemo(
    () =>
      debounce(async (value) => {
        await Admin.updateSystemPreferences({
          markdown_skills_max_injected: String(value),
        });
      }, 800),
    []
  );

  useEffect(() => {
    System.keys()
      .then((res) => {
        setMaxInjected(parseInt(res.MarkdownSkillsMaxInjected) || 5);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      debouncedUpdateMaxInjected.cancel();
    };
  }, [debouncedUpdateMaxInjected]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-1">
        <label className="block text-md font-medium text-zinc-50 light:text-slate-900">
          {t("agent.settings.markdown-skill-injection.title")}
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-zinc-400 light:text-slate-600 flex-1">
          {t("agent.settings.markdown-skill-injection.description")}
        </p>
        {loading ? (
          <CircleNotch
            size={16}
            className="shrink-0 animate-spin text-zinc-400 light:text-slate-600"
          />
        ) : (
          <input
            type="number"
            name="markdownSkillInjectionLimit"
            min={1}
            max={50}
            value={maxInjected}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (Number.isNaN(value) || value < 1) return;
              const clamped = Math.min(value, 50);
              setMaxInjected(clamped);
              debouncedUpdateMaxInjected(clamped);
            }}
            onWheel={(e) => e.target.blur()}
            className="bg-zinc-800 border border-zinc-800 text-zinc-100 placeholder:text-zinc-400 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400 text-sm rounded-lg outline-none focus:border-sky-500 light:focus:border-sky-500 block w-[80px] h-[34px] px-3 text-center"
            placeholder="5"
            autoComplete="off"
          />
        )}
      </div>
    </div>
  );
}
