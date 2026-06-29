import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import ModelRouter from "@/models/modelRouter";
import System from "@/models/system";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
} from "@/components/lib/Modal";
import LLMProviderModelPicker from "../LLMProviderModelPicker";

export default function NewRouterModal({
  isOpen,
  closeModal,
  onSuccess,
  router = null,
}) {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemSettings, setSystemSettings] = useState(null);
  const isEdit = !!router;

  useEffect(() => {
    if (isOpen && !isEdit) {
      System.keys().then((settings) => setSystemSettings(settings));
    }
  }, [isOpen, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      fallback_provider: formData.get("fallback_provider"),
      fallback_model: formData.get("fallback_model"),
      cooldown_seconds: Number(formData.get("cooldown_seconds") ?? 30),
    };

    if (!data.name) {
      setError(t("model-router.new-router.name-required"));
      setLoading(false);
      return;
    }

    if (!data.fallback_provider || !data.fallback_model) {
      setError(t("model-router.new-router.fallback-required"));
      setLoading(false);
      return;
    }

    const { router: saved, error: apiError } = isEdit
      ? await ModelRouter.update(router.id, data)
      : await ModelRouter.create(data);
    setLoading(false);

    if (saved) {
      onSuccess();
      closeModal();
    } else {
      setError(
        apiError ||
          (isEdit ? t("model-router.edit-router.toast-update-failed") : null)
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <ModalHeader
          title={
            isEdit
              ? t("model-router.edit-router.title", { name: router.name })
              : t("model-router.new-router.title")
          }
          subtitle={isEdit && router?.description ? router.description : null}
          onClose={closeModal}
        />
        <ModalBody>
          <ModalInput
            label={t("model-router.new-router.name")}
            type="text"
            name="name"
            defaultValue={router?.name || ""}
            placeholder={t("model-router.new-router.name-placeholder")}
            required
          />

          <ModalInput
            label={t("model-router.new-router.description")}
            type="text"
            name="description"
            defaultValue={router?.description || ""}
            placeholder={t("model-router.new-router.description-placeholder")}
          />

          <LLMProviderModelPicker
            providerFieldName="fallback_provider"
            modelFieldName="fallback_model"
            label={t("model-router.new-router.fallback-label")}
            description={t("model-router.new-router.fallback-description")}
            defaultProvider={
              router?.fallback_provider ?? systemSettings?.LLMProvider
            }
            defaultModel={router?.fallback_model ?? systemSettings?.LLMModel}
          />

          <ModalInput
            label={t("model-router.new-router.cooldown-label")}
            hint={t("model-router.new-router.cooldown-help")}
            type="number"
            name="cooldown_seconds"
            defaultValue={router?.cooldown_seconds ?? 300}
            min={0}
          />

          {error && (
            <p className="text-xs leading-4 text-red-400 light:text-red-600">
              Error: {error}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <ModalSecondaryButton onClick={closeModal} type="button">
            {t("model-router.new-router.cancel")}
          </ModalSecondaryButton>
          <ModalPrimaryButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <CircleNotch className="h-4 w-4 animate-spin" />
                {t("common.saving")}
              </>
            ) : isEdit ? (
              t("model-router.edit-router.save")
            ) : (
              t("model-router.new-router.create")
            )}
          </ModalPrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}
