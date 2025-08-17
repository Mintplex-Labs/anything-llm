import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CustomAppName() {
  const { t } = useTranslation();
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
    <form
      className="onenew-card p-5 mb-4 flex flex-col gap-y-0.5"
      onSubmit={updateCustomAppName}
    >
      <p className="text-[var(--text)] font-medium">
        {t("customization.items.app-name.title")}
      </p>
      <p className="text-sm text-[var(--text-muted)]">
        {t("customization.items.app-name.description")}
      </p>
      <div className="flex items-center gap-x-4">
        <input
          name="customAppName"
          type="text"
          className="onenew-input mt-2 w-fit"
          placeholder="OneNew"
          required
          autoComplete="off"
          onChange={handleChange}
          value={customAppName}
        />
        {originalAppName !== "" && (
          <button
            type="button"
            onClick={(e) => updateCustomAppName(e, "")}
            className="onenew-btn onenew-btn--secondary"
          >
            Clear
          </button>
        )}
      </div>
      {hasChanges && (
        <button
          type="submit"
          className="onenew-btn onenew-btn--primary mt-2 w-fit"
        >
          Save
        </button>
      )}
    </form>
  );
}
