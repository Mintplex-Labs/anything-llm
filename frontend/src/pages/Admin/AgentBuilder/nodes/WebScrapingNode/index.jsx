import Toggle from "@/components/lib/Toggle";
import { useTranslation } from "react-i18next";
import VariableInput from "../../VariableInput";

export default function WebScrapingNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          {t("agentBuilder.webScraping.urlToScrape")}
        </label>
        <VariableInput
          value={config?.url || ""}
          onChange={(e) =>
            onConfigChange({
              ...config,
              url: e.target.value,
            })
          }
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          {t("agentBuilder.webScraping.captureAs")}
        </label>
        <select
          value={config.captureAs}
          onChange={(e) =>
            onConfigChange({ ...config, captureAs: e.target.value })
          }
          className="w-full border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
        >
          {[
            {
              label: t("agentBuilder.webScraping.textOnly"),
              value: "text",
            },
            {
              label: t("agentBuilder.webScraping.rawHtml"),
              value: "html",
            },
            {
              label: t("agentBuilder.webScraping.cssQuerySelector"),
              value: "querySelector",
            },
          ].map((captureAs) => (
            <option
              key={captureAs.value}
              value={captureAs.value}
              className="bg-theme-settings-input-bg"
            >
              {captureAs.label}
            </option>
          ))}
        </select>
      </div>

      {config.captureAs === "querySelector" && (
        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            {t("agentBuilder.webScraping.querySelector")}
          </label>
          <p className="text-xs text-theme-text-secondary mb-2">
            {t("agentBuilder.webScraping.querySelectorHint")}
          </p>
          <VariableInput
            value={config.querySelector}
            onChange={(e) =>
              onConfigChange({ ...config, querySelector: e.target.value })
            }
            placeholder=".article-content, #content, .main-content, etc."
          />
        </div>
      )}

      <Toggle
        size="md"
        variant="horizontal"
        label={t("agentBuilder.webScraping.contentSummarization")}
        hint="content-summarization-tooltip"
        enabled={config.enableSummarization ?? true}
        onChange={(checked) =>
          onConfigChange({ ...config, enableSummarization: checked })
        }
      />
      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          {t("agentBuilder.webScraping.resultVariable")}
        </label>
        {renderVariableSelect(
          config.resultVariable,
          (value) => onConfigChange({ ...config, resultVariable: value }),
          t("agentBuilder.selectOrCreateVariable"),
          true
        )}
      </div>
    </div>
  );
}
