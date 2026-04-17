import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch, X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import ModelRouterAPI from "@/models/modelRouter";
import showToast from "@/utils/toast";
import LLMProviderModelPicker from "../../LLMProviderModelPicker";
import CalculatedFields from "./CalculatedFields";
import LLMDescriptionField from "./LLMDescriptionField";

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

function emptyCondition() {
  return { property: "", comparator: "", value: "" };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export default function RuleForm({
  isOpen,
  closeModal,
  routerId,
  existingRule = null,
  nextPriority,
  onSaved,
}) {
  const { t } = useTranslation();
  const isEditing = !!existingRule;
  const [loading, setLoading] = useState(false);
  const [ruleType, setRuleType] = useState(existingRule?.type || "calculated");
  const [conditionLogic, setConditionLogic] = useState(
    existingRule?.condition_logic || "AND"
  );
  const [conditions, setConditions] = useState(
    Array.isArray(existingRule?.conditions) && existingRule.conditions.length
      ? existingRule.conditions
      : [emptyCondition()]
  );

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
      const incomplete = conditions.findIndex(
        (c) => !c.property || !c.comparator || !String(c.value ?? "").trim()
      );
      if (incomplete !== -1) {
        showToast(
          t("model-router.rule-form.conditions-incomplete", {
            index: incomplete + 1,
          }),
          "error"
        );
        setLoading(false);
        return;
      }
      data.condition_logic = conditionLogic;
      data.conditions = conditions;
      data.description = null;
    } else if (ruleType === "llm") {
      data.description = formData.get("description");
      data.condition_logic = null;
      data.conditions = null;
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
        { clear: true }
      );
      onSaved();
      closeModal();
    } else {
      showToast(
        result.error || t("model-router.rule-form.toast-save-failed"),
        "error"
      );
    }
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-full max-w-3xl bg-zinc-900 light:bg-white rounded-xl shadow border border-zinc-700 light:border-slate-300">
        <div className="relative p-6 border-b border-zinc-700 light:border-slate-200">
          <h3 className="text-lg font-semibold text-white light:text-slate-900">
            {isEditing
              ? t("model-router.rule-form.edit-title")
              : t("model-router.rule-form.new-title")}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                    {
                      RULE_TYPES.find((rt) => rt.value === ruleType)
                        ?.description
                    }
                  </p>
                </div>
              </div>

              {ruleType === "calculated" ? (
                <CalculatedFields
                  conditionLogic={conditionLogic}
                  setConditionLogic={setConditionLogic}
                  conditions={conditions}
                  setConditions={setConditions}
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
            </div>

            <div className="flex justify-end items-center mt-6 pt-6 border-t border-zinc-700 light:border-slate-200">
              <button
                type="button"
                onClick={closeModal}
                className="text-sm font-medium text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 px-4 py-2 rounded-lg transition-colors mr-2"
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
        </div>
      </div>
    </ModalWrapper>
  );
}
