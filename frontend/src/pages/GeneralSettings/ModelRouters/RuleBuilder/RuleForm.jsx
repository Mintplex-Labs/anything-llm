import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import ModelRouterAPI from "@/models/modelRouter";
import showToast from "@/utils/toast";
import LLMProviderModelPicker from "../LLMProviderModelPicker";

const RULE_TYPES = [
  {
    value: "calculated",
    label: "Calculated",
    description:
      "Match based on message properties like content, token count, or time of day",
  },
  {
    value: "llm",
    label: "LLM Classified",
    description:
      "Use the fallback model to decide if the message matches a description you provide",
  },
];

const PROPERTIES = [
  { value: "promptContent", label: "Prompt Content" },
  { value: "conversationTokenCount", label: "Conversation Token Count" },
  { value: "conversationMessageCount", label: "Conversation Message Count" },
  { value: "currentHour", label: "Current Hour (0-23)" },
  { value: "hasImageAttachment", label: "Has Image Attachment" },
];

const STRING_COMPARATORS = [
  { value: "contains", label: "contains" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
];

const NUMERIC_COMPARATORS = [
  { value: "gt", label: "greater than" },
  { value: "gte", label: "greater than or equal" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "less than or equal" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "between", label: "between (inclusive)" },
];

const NUMERIC_PROPERTIES = [
  "conversationTokenCount",
  "conversationMessageCount",
  "currentHour",
];

const BOOLEAN_PROPERTIES = ["hasImageAttachment"];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export default function RuleForm({
  routerId,
  existingRule = null,
  nextPriority,
  onSaved,
  onCancel,
}) {
  const { t } = useTranslation();
  const isEditing = !!existingRule;
  const [loading, setLoading] = useState(false);
  const [ruleType, setRuleType] = useState(existingRule?.type || "calculated");
  const [property, setProperty] = useState(existingRule?.property || "");
  const [comparator, setComparator] = useState(existingRule?.comparator || "");

  const comparators = NUMERIC_PROPERTIES.includes(property)
    ? NUMERIC_COMPARATORS
    : STRING_COMPARATORS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const title = slugify(formData.get("title") || "");

    if (!title) {
      showToast(t("model-router.rule-form.title-required"), "error");
      setLoading(false);
      return;
    }

    const data = {
      title,
      type: ruleType,
      route_provider: formData.get("route_provider"),
      route_model: formData.get("route_model"),
      priority: isEditing ? existingRule.priority : Number(nextPriority),
    };

    if (ruleType === "calculated") {
      data.property = formData.get("property");
      data.comparator = formData.get("comparator");
      data.value = formData.get("value");
      data.description = null;
    } else if (ruleType === "llm") {
      data.description = formData.get("description");
      data.property = null;
      data.comparator = null;
      data.value = null;
    }

    let result;
    if (isEditing) {
      result = await ModelRouterAPI.updateRule(routerId, existingRule.id, data);
    } else {
      result = await ModelRouterAPI.createRule(routerId, data);
    }

    setLoading(false);
    if (result.rule) {
      showToast(
        isEditing
          ? t("model-router.rule-form.toast-updated")
          : t("model-router.rule-form.toast-created"),
        "success",
        {
          clear: true,
        }
      );
      onSaved();
    } else {
      showToast(
        result.error || t("model-router.rule-form.toast-save-failed"),
        "error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <p className="text-sm font-semibold text-white light:text-slate-900">
        {isEditing
          ? t("model-router.rule-form.edit-title")
          : t("model-router.rule-form.new-title")}
      </p>

      <div className="flex gap-x-4">
        <div className="flex-1 flex flex-col gap-y-1.5">
          <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
            {t("model-router.rule-form.title-label")}
          </label>
          <input
            type="text"
            name="title"
            defaultValue={existingRule?.title || ""}
            placeholder="e.g. route_code_to_claude"
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5 font-mono"
            required
          />
          <p className="text-[10px] text-zinc-400 light:text-slate-500">
            {t("model-router.rule-form.title-help")}
          </p>
        </div>
        <div className="w-[200px] flex flex-col gap-y-1.5">
          <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
            {t("model-router.rule-form.rule-type")}
          </label>
          <select
            value={ruleType}
            onChange={(e) => setRuleType(e.target.value)}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
          >
            {RULE_TYPES.map((rt) => (
              <option key={rt.value} value={rt.value}>
                {rt.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-zinc-400 light:text-slate-500">
            {RULE_TYPES.find((rt) => rt.value === ruleType)?.description}
          </p>
        </div>
      </div>

      {ruleType === "calculated" ? (
        <CalculatedFields
          property={property}
          setProperty={setProperty}
          comparator={comparator}
          setComparator={setComparator}
          comparators={comparators}
          existingRule={existingRule}
        />
      ) : (
        <LLMDescriptionField existingRule={existingRule} />
      )}

      <LLMProviderModelPicker
        providerFieldName="route_provider"
        modelFieldName="route_model"
        label={t("model-router.rule-form.route-to-label")}
        description={t("model-router.rule-form.route-to-description")}
        defaultProvider={existingRule?.route_provider || ""}
        defaultModel={existingRule?.route_model || ""}
      />

      <div className="flex justify-end gap-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 px-4 py-2 rounded-lg transition-colors"
        >
          {t("model-router.rule-form.cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <CircleNotch className="h-4 w-4 animate-spin" />
              {t("model-router.rule-form.saving")}
            </>
          ) : isEditing ? (
            t("model-router.rule-form.update-rule")
          ) : (
            t("model-router.rule-form.create-rule")
          )}
        </button>
      </div>
    </form>
  );
}

function CalculatedFields({
  property,
  setProperty,
  comparator,
  setComparator,
  comparators,
  existingRule,
}) {
  const { t } = useTranslation();
  const isBoolean = BOOLEAN_PROPERTIES.includes(property);

  return (
    <div className={`grid ${isBoolean ? "grid-cols-2" : "grid-cols-3"} gap-4`}>
      <div className="flex flex-col gap-y-1.5">
        <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
          {t("model-router.rule-form.property-label")}
        </label>
        <select
          name="property"
          defaultValue={existingRule?.property || ""}
          onChange={(e) => setProperty(e.target.value)}
          className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
          required
        >
          <option value="">
            {t("model-router.rule-form.property-select")}
          </option>
          {PROPERTIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {isBoolean ? (
        <>
          <input type="hidden" name="comparator" value="eq" />
          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
              {t("model-router.rule-form.value-label")}
            </label>
            <select
              name="value"
              defaultValue={existingRule?.value || "true"}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
              required
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
              {t("model-router.rule-form.comparator-label")}
            </label>
            <select
              name="comparator"
              defaultValue={existingRule?.comparator || ""}
              onChange={(e) => setComparator(e.target.value)}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
              required
            >
              <option value="">
                {t("model-router.rule-form.property-select")}
              </option>
              {comparators.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
              {t("model-router.rule-form.value-label")}
            </label>
            <input
              type="text"
              name="value"
              defaultValue={existingRule?.value || ""}
              placeholder={
                comparator === "between"
                  ? property === "currentHour"
                    ? "e.g. 9,17 (9am to 5pm)"
                    : "e.g. 10,50"
                  : property === "currentHour"
                    ? "e.g. 18 (0-23)"
                    : property === "conversationMessageCount"
                      ? "e.g. 10"
                      : NUMERIC_PROPERTIES.includes(property)
                        ? "e.g. 4000"
                        : "e.g. code"
              }
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
              required
            />
          </div>
        </>
      )}
    </div>
  );
}

function LLMDescriptionField({ existingRule }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {t("model-router.rule-form.match-description-label")}
      </label>
      <textarea
        name="description"
        defaultValue={existingRule?.description || ""}
        placeholder={t("model-router.rule-form.match-description-placeholder")}
        rows={2}
        className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5 resize-none"
        required
      />
      <p className="text-[10px] text-zinc-400 light:text-slate-500">
        {t("model-router.rule-form.match-description-help")}
      </p>
    </div>
  );
}
