import { useState } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function ProviderPresetImport({ onApplied }) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    const trimmedCode = code.trim();
    setError(null);
    setApplied(false);
    if (!trimmedCode) {
      setError("invalid_preset_code");
      return;
    }

    setApplying(true);
    const result = await System.applyProviderPreset(trimmedCode);
    setApplying(false);

    if (!result?.success) {
      const reason = result?.error || "invalid_preset_code";
      setError(reason);
      showToast(reason, "error");
      return;
    }

    setApplied(true);
    showToast(t("provider_preset.success_toast"), "success");
    await onApplied?.();
  };

  return (
    <div className="w-full max-w-[640px] mt-8 pt-6 border-t border-white border-opacity-10 light:border-theme-sidebar-border">
      <div className="text-base font-bold text-white mb-4">
        {t("provider_preset.title")}
      </div>
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
              setApplied(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApply();
              }
            }}
            placeholder={t("provider_preset.placeholder")}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            autoComplete="off"
            spellCheck={false}
            disabled={applying}
          />
          <button
            type="button"
            disabled={applying}
            onClick={handleApply}
            className="border-none text-xs px-4 py-1 font-semibold light:text-[#ffffff] rounded-lg bg-primary-button hover:bg-secondary hover:text-white h-[42px] whitespace-nowrap min-w-[128px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {applying
              ? t("provider_preset.applying")
              : t("provider_preset.apply")}
          </button>
        </div>
        {applied && (
          <p className="text-xs text-green-400">
            {t("provider_preset.imported_status")}
          </p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
