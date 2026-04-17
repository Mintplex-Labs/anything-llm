import { useTranslation } from "react-i18next";
import { Plus, X } from "@phosphor-icons/react";

const PROPERTIES = [
  { value: "promptContent", label: "Prompt Content" },
  { value: "conversationTokenCount", label: "Conversation Token Count" },
  { value: "conversationMessageCount", label: "Conversation Message Count" },
  { value: "currentHour", label: "Current Hour (0-23)" },
  { value: "hasImageAttachment", label: "Has Image Attachment" },
];

const NUMERIC_PROPERTIES = [
  "conversationTokenCount",
  "conversationMessageCount",
  "currentHour",
];

const BOOLEAN_PROPERTIES = ["hasImageAttachment"];

const STRING_COMPARATORS = [
  { value: "contains", label: "contains" },
  { value: "matches", label: "matches (regex)" },
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

function comparatorsFor(property) {
  return NUMERIC_PROPERTIES.includes(property)
    ? NUMERIC_COMPARATORS
    : STRING_COMPARATORS;
}

function valuePlaceholder(property, comparator) {
  if (comparator === "between")
    return property === "currentHour" ? "e.g. 9,17 (9am to 5pm)" : "e.g. 10,50";
  if (property === "currentHour") return "e.g. 18 (0-23)";
  if (property === "conversationMessageCount") return "e.g. 10";
  if (NUMERIC_PROPERTIES.includes(property)) return "e.g. 4000";
  if (comparator === "contains") return "e.g. code, python, rust";
  if (comparator === "matches") return "e.g. /\\bpython\\b/i";
  return "e.g. code";
}

function valueHelp(property, comparator) {
  if (NUMERIC_PROPERTIES.includes(property)) return null;
  if (comparator === "contains")
    return "Comma-separated list — matches if the prompt contains any of the values (case-insensitive).";
  if (comparator === "matches")
    return "Regex pattern. Use /pattern/flags for case sensitivity (defaults to case-insensitive).";
  return null;
}

export default function CalculatedFields({
  conditionLogic,
  setConditionLogic,
  conditions,
  setConditions,
}) {
  const { t } = useTranslation();

  const updateCondition = (index, changes) => {
    setConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...changes } : c))
    );
  };

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { property: "", comparator: "", value: "" },
    ]);
  };

  const removeCondition = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-y-3">
      {conditions.length > 1 && (
        <LogicToggle value={conditionLogic} onChange={setConditionLogic} />
      )}

      <div className="flex flex-col gap-y-2">
        {conditions.map((condition, index) => (
          <ConditionRow
            key={index}
            condition={condition}
            onChange={(changes) => updateCondition(index, changes)}
            onRemove={
              conditions.length > 1 ? () => removeCondition(index) : null
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addCondition}
        className="self-start flex items-center gap-x-1.5 text-xs font-medium text-zinc-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 border border-zinc-700 light:border-slate-300 hover:border-zinc-500 light:hover:border-slate-400 rounded-lg px-3 py-1.5 transition-colors"
      >
        <Plus size={14} weight="bold" />
        {t("model-router.rule-form.add-condition")}
      </button>
    </div>
  );
}

function LogicToggle({ value, onChange }) {
  const { t } = useTranslation();
  const options = [
    { value: "AND", label: t("model-router.rule-form.logic-and") },
    { value: "OR", label: t("model-router.rule-form.logic-or") },
  ];
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {t("model-router.rule-form.logic-label")}
      </label>
      <div
        role="radiogroup"
        className="inline-flex self-start rounded-lg border border-zinc-700 light:border-slate-300 bg-zinc-800 light:bg-white p-0.5"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selected
                  ? "bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white"
                  : "text-zinc-300 light:text-slate-700 hover:text-white light:hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConditionRow({ condition, onChange, onRemove }) {
  const { t } = useTranslation();
  const isBoolean = BOOLEAN_PROPERTIES.includes(condition.property);

  // Boolean properties (hasImageAttachment) have a fixed comparator (eq) and a
  // True/False value picker, so we short-circuit the normal comparator/value
  // fields when one is selected.
  const handlePropertyChange = (nextProperty) => {
    if (BOOLEAN_PROPERTIES.includes(nextProperty)) {
      onChange({ property: nextProperty, comparator: "eq", value: "true" });
      return;
    }
    const prevComparators = comparatorsFor(condition.property);
    const nextComparators = comparatorsFor(nextProperty);
    const comparatorStillValid =
      !!condition.comparator &&
      nextComparators.some((c) => c.value === condition.comparator) &&
      prevComparators.some((c) => c.value === condition.comparator);
    onChange({
      property: nextProperty,
      comparator: comparatorStillValid ? condition.comparator : "",
      // Clear the value when switching from a boolean property since True/False
      // isn't meaningful for other properties.
      value: BOOLEAN_PROPERTIES.includes(condition.property)
        ? ""
        : condition.value,
    });
  };

  return (
    <div className="flex items-start gap-x-2">
      <div
        className={`grid flex-1 ${isBoolean ? "grid-cols-2" : "grid-cols-3"} gap-3`}
      >
        <div className="flex flex-col gap-y-1">
          <select
            value={condition.property}
            onChange={(e) => handlePropertyChange(e.target.value)}
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
          <BooleanValueField
            value={condition.value}
            onChange={(value) => onChange({ value })}
          />
        ) : (
          <ComparatorAndValueFields condition={condition} onChange={onChange} />
        )}
      </div>

      <button
        type="button"
        onClick={onRemove || undefined}
        disabled={!onRemove}
        aria-label={t("model-router.rule-form.remove-condition")}
        className="mt-1.5 text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
}

function BooleanValueField({ value, onChange }) {
  return (
    <select
      value={value || "true"}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
      required
    >
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  );
}

function ComparatorAndValueFields({ condition, onChange }) {
  const { t } = useTranslation();
  const comparators = comparatorsFor(condition.property);
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <select
          value={condition.comparator}
          onChange={(e) => onChange({ comparator: e.target.value })}
          className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
          required
        >
          <option value="">
            {t("model-router.rule-form.comparator-select")}
          </option>
          {comparators.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-y-1">
        <input
          type="text"
          value={condition.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder={valuePlaceholder(
            condition.property,
            condition.comparator
          )}
          className={`bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5 ${
            condition.comparator === "matches" ? "font-mono" : ""
          }`}
          required
        />
        {valueHelp(condition.property, condition.comparator) && (
          <p className="text-[10px] text-zinc-400 light:text-slate-500">
            {valueHelp(condition.property, condition.comparator)}
          </p>
        )}
      </div>
    </>
  );
}
