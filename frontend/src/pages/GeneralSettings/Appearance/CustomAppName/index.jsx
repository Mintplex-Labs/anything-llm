import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";

export default function CustomAppName() {
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [customAppName, setCustomAppName] = useState("");
  const [originalAppName, setOriginalAppName] = useState("");
  const [canCustomize, setCanCustomize] = useState(false);

  useEffect(() => {
    const fetchInitialParams = async () => {
      const settings = await System.keys();
      if (!settings?.MultiUserMode && !settings?.RequiresAuth) {
        setCanCustomize(false);
        return false;
      }

      const { appName } = await System.fetchCustomAppName();
      setCustomAppName(appName || "");
      setOriginalAppName(appName || "");
      setCanCustomize(true);
      setLoading(false);
    };
    fetchInitialParams();
  }, []);

  const updateCustomAppName = async (e, newValue = null) => {
    e.preventDefault();
    let custom_app_name = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      custom_app_name = form.get("customAppName");
    }
    const { success, error } = await Admin.updateSystemPreferences({
      custom_app_name,
    });
    if (!success) {
      showToast(`Failed to update custom app name: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated custom app name.", "success");
      window.localStorage.removeItem(System.cacheKeys.customAppName);
      setCustomAppName(custom_app_name);
      setOriginalAppName(custom_app_name);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setCustomAppName(e.target.value);
    setHasChanges(true);
  };

  if (!canCustomize || loading) return null;

  return (
    <form className="mb-6" onSubmit={updateCustomAppName}>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Custom App Name
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Set a custom app name that is displayed on the login page.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <input
          name="customAppName"
          type="text"
          className="border-none bg-theme-settings-input-bg mt-3 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 max-w-[275px] placeholder:text-theme-settings-input-placeholder"
          placeholder="AnythingLLM"
          required={true}
          autoComplete="off"
          onChange={handleChange}
          value={customAppName}
        />
        {originalAppName !== "" && (
          <button
            type="button"
            onClick={(e) => updateCustomAppName(e, "")}
            className="mt-4 text-white text-base font-medium hover:text-opacity-60"
          >
            Clear
          </button>
        )}
      </div>
      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-6 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save
        </button>
      )}
    </form>
  );
}
