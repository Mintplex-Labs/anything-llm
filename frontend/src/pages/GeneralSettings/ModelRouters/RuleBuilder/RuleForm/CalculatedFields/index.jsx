import { useTranslation } from "react-i18next";
import { Plus, X } from "@phosphor-icons/react";

const NUMERIC_PROPERTIES = [
  "conversationTokenCount",
  "conversationMessageCount",
  "currentHour",
];

const BOOLEAN_PROPERTIES = ["hasImageAttachment"];

function createProperties(t) {
  return [
    {
      value: "promptContent",
      label: t("model-router.rule-form.prop-prompt-content"),
    },
    {
      value: "conversationTokenCount",
      label: t("model-router.rule-form.prop-token-count"),
    },
    {
      value: "conversationMessageCount",
      label: t("model-router.rule-form.prop-message-count"),
    },
    {
      value: "currentHour",
      label: t("model-router.rule-form.prop-current-hour"),
    },
    {
      value: "hasImageAttachment",
      label: t("model-router.rule-form.prop-has-image"),
    },
  ];
}

function createStringComparators(t) {
  return [
    { value: "contains", label: t("model-router.rule-form.cmp-contains") },
    { value: "matches", label: t("model-router.rule-form.cmp-matches-regex") },
    { value: "eq", label: t("model-router.rule-form.cmp-equals") },
    { value: "neq", label: t("model-router.rule-form.cmp-not-equals") },
  ];
}

function createNumericComparators(t) {
  return [
    { value: "gt", label: t("model-router.rule-form.cmp-greater-than") },
    {
      value: "gte",
      label: t("model-router.rule-form.cmp-greater-than-or-equal"),
    },
    { value: "lt", label: t("model-router.rule-form.cmp-less-than") },
    { value: "lte", label: t("model-router.rule-form.cmp-less-than-or-equal") },
    { value: "eq", label: t("model-router.rule-form.cmp-equals") },
    { value: "neq", label: t("model-router.rule-form.cmp-not-equals") },
    { value: "between", label: t("model-router.rule-form.cmp-between") },
  ];
}

function comparatorsFor(t, property) {
  return NUMERIC_PROPERTIES.includes(property)
    ? createNumericComparators(t)
    : createStringComparators(t);
}

function valuePlaceholder(t, property, comparator) {
  if (comparator === "between") {
    return property === "currentHour"
      ? t("model-router.rule-form.placeholder-between-hour")
      : t("model-router.rule-form.placeholder-between-numeric");
  }
  if (property === "currentHour")
    return t("model-router.rule-form.placeholder-hour");
  if (property === "conversationMessageCount")
    return t("model-router.rule-form.placeholder-message-count");
  if (NUMERIC_PROPERTIES.includes(property))
    return t("model-router.rule-form.placeholder-numeric");
  if (comparator === "contains")
    return t("model-router.rule-form.placeholder-contains");
  if (comparator === "matches")
    return t("model-router.rule-form.placeholder-matches");
  return t("model-router.rule-form.placeholder-default");
}

function valueHelp(t, property, comparator) {
  if (NUMERIC_PROPERTIES.includes(property)) return null;
  if (comparator === "contains")
    return t("model-router.rule-form.help-contains");
  if (comparator === "matches") return t("model-router.rule-form.help-matches");
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

  const toggleLogic = () => {
    setConditionLogic((prev) => (prev === "AND" ? "OR" : "AND"));
  };

  return (
    <div className="flex flex-col gap-y-1.5 items-start">
      <div className="flex flex-col gap-y-5 w-full">
        {conditions.map((condition, index) => (
          <ConditionRow
            key={index}
            condition={condition}
            showLabels={index === 0}
            logicBadge={
              index === 0 ? null : (
                <LogicBadge value={conditionLogic} onClick={toggleLogic} />
              )
            }
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
        aria-label={t("model-router.rule-form.add-condition")}
        className="border-none mt-3 bg-zinc-800 light:bg-slate-900 text-white light:text-white rounded-md p-1 hover:opacity-90 transition-opacity"
      >
        <Plus size={16} weight="bold" />
      </button>
    </div>
  );
}

function LogicBadge({ value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-none shrink-0 self-start bg-zinc-700 light:bg-slate-200 text-white light:text-slate-950 text-xs font-medium leading-4 tracking-[1.2px] uppercase px-2.5 py-1.5 rounded-md hover:opacity-80 transition-opacity"
    >
      {value}
    </button>
  );
}

function ConditionRow({
  condition,
  showLabels,
  logicBadge,
  onChange,
  onRemove,
}) {
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
    const prevComparators = comparatorsFor(t, condition.property);
    const nextComparators = comparatorsFor(t, nextProperty);
    const comparatorStillValid =
      !!condition.comparator &&
      nextComparators.some((c) => c.value === condition.comparator) &&
      prevComparators.some((c) => c.value === condition.comparator);
    onChange({
      property: nextProperty,
      comparator: comparatorStillValid ? condition.comparator : "",
      value: BOOLEAN_PROPERTIES.includes(condition.property)
        ? ""
        : condition.value,
    });
  };
  const properties = createProperties(t);

  return (
    <div className="flex items-end gap-x-5">
      {logicBadge}
      <div
        className={`grid flex-1 ${isBoolean ? "grid-cols-2" : "grid-cols-3"} gap-x-5`}
      >
        <FieldColumn
          label={showLabels ? t("model-router.rule-form.property-label") : null}
        >
          <select
            value={condition.property}
            onChange={(e) => handlePropertyChange(e.target.value)}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5"
            required
          >
            <option value="">
              {t("model-router.rule-form.property-select")}
            </option>
            {properties.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </FieldColumn>

        {isBoolean ? (
          <FieldColumn
            label={showLabels ? t("model-router.rule-form.value-label") : null}
          >
            <BooleanValueField
              value={condition.value}
              onChange={(value) => onChange({ value })}
            />
          </FieldColumn>
        ) : (
          <ComparatorAndValueFields
            condition={condition}
            onChange={onChange}
            showLabels={showLabels}
          />
        )}
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("model-router.rule-form.remove-condition")}
          className={`border-none shrink-0 self-start ${showLabels ? "mt-[34px]" : "mt-2"} text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors`}
        >
          <X size={16} weight="bold" />
        </button>
      )}
    </div>
  );
}

function FieldColumn({ label, children }) {
  return (
    <div className="flex flex-col gap-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-5 text-white light:text-slate-950">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function BooleanValueField({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <select
      value={value || "true"}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5"
      required
    >
      <option value="true">{t("model-router.rule-form.bool-true")}</option>
      <option value="false">{t("model-router.rule-form.bool-false")}</option>
    </select>
  );
}

function ComparatorAndValueFields({ condition, onChange, showLabels }) {
  const { t } = useTranslation();
  const comparators = comparatorsFor(t, condition.property);
  return (
    <>
      <FieldColumn
        label={showLabels ? t("model-router.rule-form.comparator-label") : null}
      >
        <select
          value={condition.comparator}
          onChange={(e) => onChange({ comparator: e.target.value })}
          className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5"
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
      </FieldColumn>

      <FieldColumn
        label={showLabels ? t("model-router.rule-form.value-label") : null}
      >
        <input
          type="text"
          value={condition.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder={valuePlaceholder(
            t,
            condition.property,
            condition.comparator
          )}
          className={`bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5 ${
            condition.comparator === "matches" ? "font-mono" : ""
          }`}
          required
        />
        {valueHelp(t, condition.property, condition.comparator) && (
          <p className="text-xs leading-4 text-zinc-400 light:text-slate-600">
            {valueHelp(t, condition.property, condition.comparator)}
          </p>
        )}
      </FieldColumn>
    </>
  );
}
