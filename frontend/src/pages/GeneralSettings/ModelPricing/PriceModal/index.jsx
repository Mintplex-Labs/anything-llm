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
import useCurrency from "@/hooks/useCurrency";
import { currencySymbol } from "@/utils/currency";

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
  const { currency: displayCurrency, rates } = useCurrency();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [systemSettings, setSystemSettings] = useState(null);
  const [selection, setSelection] = useState({ provider: "", model: "" });
  const [price, setPrice] = useState(EMPTY_PRICE);
  const isEdit = !!override;
  // A saved price stays in the currency it was entered in. A new price is
  // entered in the display currency.
  const currency = override?.currency ?? displayCurrency;
  // Units of `currency` per USD, only used to fill in the models.dev price.
  const rate = currency === "USD" ? 1 : rates?.[currency];

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setPrice(isEdit ? savedPrice(override) : EMPTY_PRICE);
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
      setPrice((current) => (current.listed ? savedPrice(override) : current));
      return;
    }

    let cancelled = false;
    const lookup =
      provider && model && rate
        ? System.modelPricingListed(provider, model)
        : Promise.resolve(null);
    lookup.then((listed) => {
      if (cancelled) return;
      if (listed) return setPrice(listedPrice(listed, rate));
      setPrice((current) => (current.listed ? EMPTY_PRICE : current));
    });
    return () => {
      cancelled = true;
    };
  }, [selection, rate]);

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
      currency,
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
            hint={t("model-pricing.modal.input-hint", { currency })}
            type="number"
            name="input"
            leading={currencySymbol(currency)}
            min={0}
            step="any"
            placeholder="0.00"
            value={price.input}
            onChange={handlePriceChange}
            required
          />
          <ModalInput
            label={t("model-pricing.modal.output-label")}
            hint={t("model-pricing.modal.output-hint", { currency })}
            type="number"
            name="output"
            leading={currencySymbol(currency)}
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

/**
 * The inputs for a saved price, exactly as it was entered.
 * @param {import("@/models/system").ModelPricingOverride} override
 * @returns {{input: number, output: number, listed: false}}
 */
function savedPrice(override) {
  return { input: override.input, output: override.output, listed: false };
}

/**
 * The inputs for a models.dev price, converted from USD into the currency the
 * price is entered in and kept to 4 significant figures so small per-token
 * prices are not rounded away.
 * @param {{input: number, output: number}} listed - USD per 1M tokens
 * @param {number} rate - units of the entry currency per USD
 * @returns {{input: number, output: number, listed: true}}
 */
function listedPrice(listed, rate) {
  return {
    input: Number((listed.input * rate).toPrecision(4)),
    output: Number((listed.output * rate).toPrecision(4)),
    listed: true,
  };
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
