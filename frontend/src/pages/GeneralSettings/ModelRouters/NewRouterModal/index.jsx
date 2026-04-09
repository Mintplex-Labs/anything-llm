import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch, X } from "@phosphor-icons/react";
import ModelRouter from "@/models/modelRouter";
import showToast from "@/utils/toast";
import ModalWrapper from "@/components/ModalWrapper";
import LLMProviderModelPicker from "../LLMProviderModelPicker";

export default function NewRouterModal({ isOpen, closeModal, onSuccess }) {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
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

    const { router, error: apiError } = await ModelRouter.create(data);
    setLoading(false);

    if (router) {
      showToast(t("model-router.new-router.toast-created"), "success", {
        clear: true,
      });
      onSuccess();
      closeModal();
    } else {
      setError(apiError);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-full max-w-2xl bg-zinc-900 light:bg-white rounded-xl shadow border border-zinc-700 light:border-slate-300">
        <div className="relative p-6 border-b border-zinc-700 light:border-slate-200">
          <h3 className="text-lg font-semibold text-white light:text-slate-900">
            {t("model-router.new-router.title")}
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
          <form onSubmit={handleCreate}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
                  {t("model-router.new-router.name")}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t("model-router.new-router.name-placeholder")}
                  className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
                  {t("model-router.new-router.description")}
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder={t(
                    "model-router.new-router.description-placeholder"
                  )}
                  className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
                />
              </div>
              <LLMProviderModelPicker
                providerFieldName="fallback_provider"
                modelFieldName="fallback_model"
                label={t("model-router.new-router.fallback-label")}
                description={t("model-router.new-router.fallback-description")}
              />
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
                  {t("model-router.new-router.cooldown-label")}
                </label>
                <input
                  type="number"
                  name="cooldown_seconds"
                  defaultValue={30}
                  min={0}
                  max={3600}
                  className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
                />
                <p className="text-[10px] text-zinc-400 light:text-slate-500">
                  {t("model-router.new-router.cooldown-help")}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center mt-6 pt-6 border-t border-zinc-700 light:border-slate-200">
              <button
                onClick={closeModal}
                type="button"
                className="text-sm font-medium text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 px-4 py-2 rounded-lg transition-colors mr-2"
              >
                {t("model-router.new-router.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <CircleNotch className="h-4 w-4 animate-spin" />
                    {t("model-router.new-router.creating")}
                  </>
                ) : (
                  t("model-router.new-router.create")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
