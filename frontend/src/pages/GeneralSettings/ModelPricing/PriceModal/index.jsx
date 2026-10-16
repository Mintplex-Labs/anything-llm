import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import System from "@/models/system";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
} from "@/components/lib/Modal";
import LLMProviderModelPicker from "@/pages/GeneralSettings/ModelRouters/LLMProviderModelPicker";

const EMPTY_PRICE = { input: "", output: "", listed: false };

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.closeModal
 * @param {import("@/models/system").ModelPricingOverride|null} [props.override] - price being edited, null when adding
 * @param {(override: import("@/models/system").ModelPricingOverride) => Promise<{success: boolean, error?: string}>} props.onSave
 */
export default function PriceModal({
  isOpen,
  closeModal,
  override = null,
  onSave,
}) {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [systemSettings, setSystemSettings] = useState(null);
  const [selection, setSelection] = useState({ provider: "", model: "" });
  const [price, setPrice] = useState(EMPTY_PRICE);
  const isEdit = !!override;

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setPrice(
      isEdit
        ? { input: override.input, output: override.output, listed: false }
        : EMPTY_PRICE
    );
    if (!isEdit) System.keys().then((settings) => setSystemSettings(settings));
  }, [isOpen, isEdit]);

  // Fill in the models.dev price for the selected model, and clear a
  // previously filled price when the new selection has none.
  useEffect(() => {
    if (!isOpen) return;
    const { provider, model } = selection;
    if (
      isEdit &&
      provider === override.provider &&
      model === (override.model ?? "")
    ) {
      const saved = {
        input: override.input,
        output: override.output,
        listed: false,
      };
      setPrice((current) => (current.listed ? saved : current));
      return;
    }

    let cancelled = false;
    const lookup =
      provider && model
        ? System.modelPricingListed(provider, model)
        : Promise.resolve(null);
    lookup.then((listed) => {
      if (cancelled) return;
      if (listed) return setPrice({ ...listed, listed: true });
      setPrice((current) => (current.listed ? EMPTY_PRICE : current));
    });
    return () => {
      cancelled = true;
    };
  }, [selection]);

  function handlePriceChange(e) {
    const { name, value } = e.target;
    setPrice((current) => ({ ...current, [name]: value, listed: false }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const provider = form.get("provider");
    if (!provider) return setError(t("model-pricing.modal.provider-required"));

    setSaving(true);
    const { success, error: apiError } = await onSave({
      provider,
      model: String(form.get("model") ?? "").trim() || null,
      input: Number(form.get("input")),
      output: Number(form.get("output")),
    });
    setSaving(false);
    if (!success) return setError(apiError || t("model-pricing.modal.error"));
    closeModal();
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <ModalHeader
          title={
            isEdit
              ? t("model-pricing.modal.edit-title")
              : t("model-pricing.modal.new-title")
          }
          onClose={closeModal}
        />
        <ModalBody>
          <LLMProviderModelPicker
            providerFieldName="provider"
            modelFieldName="model"
            label={t("model-pricing.modal.model-label")}
            description={t("model-pricing.modal.model-description")}
            anyModelLabel={t("model-pricing.all-models")}
            onSelectionChange={setSelection}
            defaultProvider={override?.provider ?? systemSettings?.LLMProvider}
            defaultModel={
              isEdit ? (override.model ?? "") : systemSettings?.LLMModel
            }
          />
          <ModalInput
            label={t("model-pricing.modal.input-label")}
            hint={t("model-pricing.modal.input-hint")}
            type="number"
            name="input"
            leading="$"
            min={0}
            step="any"
            placeholder="0.00"
            value={price.input}
            onChange={handlePriceChange}
            required
          />
          <ModalInput
            label={t("model-pricing.modal.output-label")}
            hint={t("model-pricing.modal.output-hint")}
            type="number"
            name="output"
            leading="$"
            min={0}
            step="any"
            placeholder="0.00"
            value={price.output}
            onChange={handlePriceChange}
            required
          />
          {price.listed && (
            <p className="text-xs leading-4 text-zinc-400 light:text-slate-500">
              {t("model-pricing.modal.listed-note")}
            </p>
          )}
          {error && (
            <p className="text-xs leading-4 text-red-400 light:text-red-600">
              {error}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <ModalSecondaryButton onClick={closeModal} type="button">
            {t("model-pricing.modal.cancel")}
          </ModalSecondaryButton>
          <ModalPrimaryButton type="submit" disabled={saving}>
            <SubmitLabel saving={saving} isEdit={isEdit} />
          </ModalPrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}

function SubmitLabel({ saving, isEdit }) {
  const { t } = useTranslation();
  if (saving)
    return (
      <>
        <CircleNotch className="h-4 w-4 animate-spin" />
        {t("common.saving")}
      </>
    );
  if (isEdit) return t("model-pricing.modal.save");
  return t("model-pricing.modal.create");
}
