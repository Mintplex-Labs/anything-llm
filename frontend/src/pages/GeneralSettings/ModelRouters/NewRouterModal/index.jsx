import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch, X } from "@phosphor-icons/react";
import ModelRouter from "@/models/modelRouter";
import showToast from "@/utils/toast";
import ModalWrapper from "@/components/ModalWrapper";
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
  const isEdit = !!router;

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
      showToast(
        t(
          isEdit
            ? "model-router.edit-router.toast-updated"
            : "model-router.new-router.toast-created"
        ),
        "success",
        { clear: true }
      );
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
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-full max-w-2xl bg-zinc-900 light:bg-white rounded-[8px] shadow border border-zinc-700 light:border-slate-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 p-6">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold leading-6 text-white light:text-slate-950">
                {isEdit
                  ? t("model-router.edit-router.title", { name: router.name })
                  : t("model-router.new-router.title")}
              </h3>
              <button
                onClick={closeModal}
                type="button"
                className="border-none text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            {isEdit && router?.description && (
              <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 truncate">
                {router.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm font-medium leading-5 text-white light:text-slate-950">
              {t("model-router.new-router.name")}
            </label>
            <input
              type="text"
              name="name"
              defaultValue={router?.name || ""}
              placeholder={t("model-router.new-router.name-placeholder")}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5"
              required
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm font-medium leading-5 text-white light:text-slate-950">
              {t("model-router.new-router.description")}
            </label>
            <input
              type="text"
              name="description"
              defaultValue={router?.description || ""}
              placeholder={t("model-router.new-router.description-placeholder")}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5"
            />
          </div>

          <LLMProviderModelPicker
            providerFieldName="fallback_provider"
            modelFieldName="fallback_model"
            label={t("model-router.new-router.fallback-label")}
            description={t("model-router.new-router.fallback-description")}
            defaultProvider={router?.fallback_provider}
            defaultModel={router?.fallback_model}
          />

          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm font-medium leading-5 text-white light:text-slate-950">
              {t("model-router.new-router.cooldown-label")}
            </label>
            <input
              type="number"
              name="cooldown_seconds"
              defaultValue={router?.cooldown_seconds ?? 30}
              min={0}
              max={3600}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm rounded-[8px] outline-none block w-full h-8 px-3.5"
            />
            <p className="text-xs leading-4 text-zinc-400 light:text-slate-600">
              {t("model-router.new-router.cooldown-help")}
            </p>
          </div>

          {error && (
            <p className="text-xs leading-4 text-red-400 light:text-red-600">
              Error: {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={closeModal}
              type="button"
              className="border border-zinc-600 light:border-slate-600 text-white light:text-slate-900 text-sm font-medium leading-5 rounded-[8px] h-[34px] px-3.5 hover:opacity-90 transition-opacity"
            >
              {t("model-router.new-router.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="border-none flex items-center gap-x-1.5 text-sm font-medium leading-5 bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-[8px] h-[34px] px-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  {t(
                    isEdit
                      ? "model-router.edit-router.saving"
                      : "model-router.new-router.creating"
                  )}
                </>
              ) : isEdit ? (
                t("model-router.edit-router.save")
              ) : (
                t("model-router.new-router.create")
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
