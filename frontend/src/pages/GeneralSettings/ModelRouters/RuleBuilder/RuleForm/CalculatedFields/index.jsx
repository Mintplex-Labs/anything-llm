import { useTranslation } from "react-i18next";

const PROPERTIES = [
  { value: "promptContent", label: "Prompt Content" },
  { value: "conversationTokenCount", label: "Conversation Token Count" },
  { value: "conversationMessageCount", label: "Conversation Message Count" },
  { value: "currentHour", label: "Current Hour (0-23)" },
  { value: "hasImageAttachment", label: "Has Image Attachment" },
];

export const NUMERIC_PROPERTIES = [
  "conversationTokenCount",
  "conversationMessageCount",
  "currentHour",
];

const BOOLEAN_PROPERTIES = ["hasImageAttachment"];

function valuePlaceholder(property, comparator) {
  if (comparator === "between")
    return property === "currentHour" ? "e.g. 9,17 (9am to 5pm)" : "e.g. 10,50";
  if (property === "currentHour") return "e.g. 18 (0-23)";
  if (property === "conversationMessageCount") return "e.g. 10";
  if (NUMERIC_PROPERTIES.includes(property)) return "e.g. 4000";
  return "e.g. code";
}

export default function CalculatedFields({
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
        <BooleanValueField existingRule={existingRule} />
      ) : (
        <ComparatorAndValueFields
          comparator={comparator}
          setComparator={setComparator}
          comparators={comparators}
          property={property}
          existingRule={existingRule}
        />
      )}
    </div>
  );
}

function BooleanValueField({ existingRule }) {
  const { t } = useTranslation();
  return (
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
  );
}

function ComparatorAndValueFields({
  comparator,
  setComparator,
  comparators,
  property,
  existingRule,
}) {
  const { t } = useTranslation();
  return (
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
          placeholder={valuePlaceholder(property, comparator)}
          className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
          required
        />
      </div>
    </>
  );
}
