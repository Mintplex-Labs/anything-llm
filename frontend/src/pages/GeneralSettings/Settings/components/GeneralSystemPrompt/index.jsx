import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function GeneralSystemPrompt() {
  const { t } = useTranslation();
  const defaultSystemPrompt = t("customization.items.system-prompt.default");
  const [hasChanges, setHasChanges] = useState(false);
  const [generalSystemPrompt, setGeneralSystemPrompt] =
    useState(defaultSystemPrompt);

  // fetch general sys prompt for all workspaces
  useEffect(() => {
    const fetchGeneralSystemPrompt = async () => {
      const { generalSystemPrompt } =
        await System.fetchGeneralOrDefaultSystemPrompt();
      setGeneralSystemPrompt(generalSystemPrompt ?? defaultSystemPrompt);
    };
    fetchGeneralSystemPrompt();
  }, []);

  const updateGeneralSystemPrompt = async (e, newValue = null) => {
    e.preventDefault();
    let general_system_prompt = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      general_system_prompt = form.get("generalSystemPrompt");
    }
    const { success, error } = await Admin.updateSystemPreferences({
      general_system_prompt: general_system_prompt,
    });
    if (!success) {
      showToast(`Failed to update general system prompt: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated general system prompt.", "success");
      setGeneralSystemPrompt(general_system_prompt);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setGeneralSystemPrompt(e.target.value);
    setHasChanges(true);
  };

  return (
    <form
      className="flex flex-col gap-y-0.5 mt-4"
      onSubmit={updateGeneralSystemPrompt}
    >
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.system-prompt.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.system-prompt.description")}
      </p>

      <textarea
        name="generalSystemPrompt"
        className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full min-h-[150px] py-3 px-4 resize-none overflow-auto"
        placeholder={generalSystemPrompt || defaultSystemPrompt || ""}
        style={{
          textAlign: "left",
          lineHeight: "1.5",
        }}
        onChange={handleChange}
        value={generalSystemPrompt}
      />
      <div className="flex items-center gap-x-4">
        {generalSystemPrompt !== defaultSystemPrompt &&
          generalSystemPrompt !== "" && (
            <button
              type="button"
              onClick={(e) => updateGeneralSystemPrompt(e, "")}
              className="transition-all mt-2 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Clear
            </button>
          )}
        {hasChanges && (
          <button
            type="submit"
            className="transition-all mt-2 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            Save
          </button>
        )}
      </div>
    </form>
  );
}
