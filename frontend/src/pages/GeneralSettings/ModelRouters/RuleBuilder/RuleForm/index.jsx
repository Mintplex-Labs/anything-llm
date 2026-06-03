import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
  ModalLabel,
  ModalHint,
} from "@/components/lib/Modal";
import ModelRouterAPI from "@/models/modelRouter";
import showToast from "@/utils/toast";
import LLMProviderModelPicker from "../../LLMProviderModelPicker";
import CalculatedFields from "./CalculatedFields";
import LLMDescriptionField from "./LLMDescriptionField";

function createRuleTypes(t) {
  return [
    {
      value: "calculated",
      label: t("model-router.rule-form.type-calculated-label"),
      description: t("model-router.rule-form.type-calculated-description"),
    },
    {
      value: "llm",
      label: t("model-router.rule-form.type-llm-label"),
      description: t("model-router.rule-form.type-llm-description"),
    },
  ];
}

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
  const ruleTypes = createRuleTypes(t);
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
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <ModalHeader
          title={t("model-router.rules.title")}
          subtitle={t("model-router.rules.description")}
          onClose={closeModal}
        />
        <ModalBody className="max-h-[60vh] overflow-y-auto">
          <div className="flex gap-x-5 items-start">
            <div className="w-[500px]">
              <ModalInput
                label={t("model-router.rule-form.title-label")}
                type="text"
                name="title"
                defaultValue={existingRule?.title || ""}
                placeholder="e.g. route_code_to_claude"
                className="font-mono"
                required
              />
            </div>
            <div className="flex flex-col gap-y-1.5 w-[300px]">
              <ModalLabel>{t("model-router.rule-form.rule-type")}</ModalLabel>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
                className="bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 text-zinc-100 light:text-slate-900 text-sm rounded-lg outline-none block w-full h-[34px] px-3.5 focus:border-sky-500"
              >
                {ruleTypes.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
              <ModalHint>
                {ruleTypes.find((rt) => rt.value === ruleType)?.description}
              </ModalHint>
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
        </ModalBody>
        <ModalFooter>
          <ModalSecondaryButton type="button" onClick={closeModal}>
            {t("model-router.rule-form.cancel")}
          </ModalSecondaryButton>
          <ModalPrimaryButton type="submit" disabled={loading}>
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
          </ModalPrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}
