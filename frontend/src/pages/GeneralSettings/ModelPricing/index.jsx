import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { CircleNotch, PencilSimple, X } from "@phosphor-icons/react";
import Sidebar from "@/components/SettingsSidebar";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import System from "@/models/system";
import { useModal } from "@/hooks/useModal";
import showToast from "@/utils/toast";
import { formatCost } from "@/utils/currency";
import PriceModal from "./PriceModal";

const GRID_COLUMNS = "grid-cols-[2fr_2fr_1fr_1fr_88px]";

export default function ModelPricing() {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [overrides, setOverrides] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    System.modelPricingOverrides().then((results) => {
      setOverrides(results);
      setLoading(false);
    });
  }, []);

  function openCreateModal() {
    setEditingIndex(null);
    openModal();
  }

  function openEditModal(index) {
    setEditingIndex(index);
    openModal();
  }

  async function saveOverrides(nextOverrides) {
    const {
      success,
      overrides: saved,
      error,
    } = await System.updateModelPricingOverrides(nextOverrides);
    if (success) setOverrides(saved);
    return { success, error };
  }

  /** @param {import("@/models/system").ModelPricingOverride} override */
  function handleSave(override) {
    if (editingIndex === null) return saveOverrides([...overrides, override]);
    return saveOverrides(
      overrides.map((existing, i) => (i === editingIndex ? override : existing))
    );
  }

  async function handleDelete(index) {
    const name = overrideName(overrides[index], t);
    if (!window.confirm(t("model-pricing.delete-confirm", { name }))) return;

    const { success, error } = await saveOverrides(
      overrides.filter((_, i) => i !== index)
    );
    if (!success)
      showToast(t("model-pricing.toast-delete-failed", { error }), "error");
  }

  return (
    <Layout
      showAction={!loading && overrides.length > 0}
      onAction={openCreateModal}
    >
      <PriceList
        loading={loading}
        overrides={overrides}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
      <PriceModal
        isOpen={isOpen}
        closeModal={closeModal}
        override={editingIndex === null ? null : overrides[editingIndex]}
        onSave={handleSave}
      />
    </Layout>
  );
}

/**
 * @param {import("@/models/system").ModelPricingOverride} override
 * @param {Function} t
 * @returns {string} eg: "OpenAI / gpt-4o" or "Ollama / All models"
 */
function overrideName(override, t) {
  return `${providerName(override.provider)} / ${override.model ?? t("model-pricing.all-models")}`;
}

function providerName(slug) {
  return (
    AVAILABLE_LLM_PROVIDERS.find((llm) => llm.value === slug)?.name ?? slug
  );
}

function Layout({ showAction, onAction, children }) {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-2xl bg-zinc-900 light:bg-white light:border light:border-slate-300 w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-0 py-16">
          <div className="flex items-end justify-between pr-8 py-6 border-b border-white/20 light:border-slate-300">
            <div className="flex flex-col gap-y-2">
              <p className="text-lg font-semibold leading-7 text-white light:text-slate-900">
                {t("model-pricing.title")}
              </p>
              <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
                {t("model-pricing.description")}
              </p>
            </div>
            <AddPriceButton visible={showAction} onClick={onAction} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function AddPriceButton({ visible = true, onClick }) {
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      className="border-none shrink-0 flex items-center justify-center h-9 px-5 py-2.5 rounded-lg bg-slate-50 light:bg-slate-900 text-zinc-950 light:text-white text-sm font-medium leading-5 hover:opacity-90 transition-opacity duration-200"
    >
      {t("model-pricing.add")}
    </button>
  );
}

function PriceList({ loading, overrides, onCreate, onEdit, onDelete }) {
  const { t } = useTranslation();
  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <CircleNotch className="h-8 w-8 text-zinc-400 animate-spin" />
      </div>
    );

  if (!overrides.length)
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-28">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-base font-semibold leading-6 text-zinc-50 light:text-slate-900">
            {t("model-pricing.no-prices")}
          </p>
          <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 max-w-[370px]">
            {t("model-pricing.empty-description")}
          </p>
        </div>
        <AddPriceButton onClick={onCreate} />
      </div>
    );

  return (
    <div className="mt-8 flex flex-col">
      <div
        className={`grid ${GRID_COLUMNS} gap-x-4 px-4 text-sm font-semibold uppercase tracking-[1.4px] text-zinc-500 light:text-slate-500 leading-5`}
      >
        <span>{t("model-pricing.table.provider")}</span>
        <span>{t("model-pricing.table.model")}</span>
        <span>{t("model-pricing.table.input")}</span>
        <span>{t("model-pricing.table.output")}</span>
        <span aria-hidden="true" />
      </div>
      <div className="mt-[18px] border-t border-white/20 light:border-slate-300" />
      {overrides.map((override, index) => (
        <PriceRow
          key={`${override.provider}:${override.model}`}
          override={override}
          onEdit={() => onEdit(index)}
          onDelete={() => onDelete(index)}
          showDivider={index < overrides.length - 1}
        />
      ))}
    </div>
  );
}

function PriceRow({ override, onEdit, onDelete, showDivider }) {
  const { t } = useTranslation();
  return (
    <>
      <div
        onClick={onEdit}
        className={`group grid ${GRID_COLUMNS} gap-x-4 items-center h-9 px-4 rounded-lg cursor-pointer hover:bg-white/5 light:hover:bg-slate-100 transition-colors`}
      >
        <span className="text-sm font-medium leading-5 text-white light:text-slate-900 truncate">
          {providerName(override.provider)}
        </span>
        <span className="text-sm font-normal leading-5 text-zinc-400 light:text-slate-500 truncate">
          {override.model ?? t("model-pricing.all-models")}
        </span>
        <span className="text-sm font-normal leading-5 text-zinc-400 light:text-slate-500">
          {formatCost(override.input)}
        </span>
        <span className="text-sm font-normal leading-5 text-zinc-400 light:text-slate-500">
          {formatCost(override.output)}
        </span>
        <div className="flex items-center justify-end gap-[14px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label={t("model-pricing.modal.edit-title")}
            className="border-none text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
          >
            <PencilSimple size={16} weight="bold" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={t("model-pricing.remove")}
            className="border-none text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      </div>
      {showDivider && (
        <div className="border-t border-white/10 light:border-slate-200" />
      )}
    </>
  );
}
