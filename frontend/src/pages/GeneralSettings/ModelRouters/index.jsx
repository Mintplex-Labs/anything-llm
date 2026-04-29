import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { CircleNotch, PencilSimple, X } from "@phosphor-icons/react";
import ModelRouter from "@/models/modelRouter";
import { useModal } from "@/hooks/useModal";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import NewRouterModal from "./NewRouterModal";

export default function ModelRouters() {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [routers, setRouters] = useState([]);
  const [editingRouter, setEditingRouter] = useState(null);

  const openCreateModal = () => {
    setEditingRouter(null);
    openModal();
  };

  const openEditModal = (router) => {
    setEditingRouter(router);
    openModal();
  };

  const handleModalClose = () => {
    closeModal();
    setEditingRouter(null);
  };

  const fetchRouters = async () => {
    const results = await ModelRouter.getAll();
    setRouters(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchRouters();
  }, []);

  const removeRouter = (id) => {
    setRouters((prev) => prev.filter((r) => r.id !== id));
  };

  const isEmpty = !loading && routers.length === 0;

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
                {t("model-router.title")}
              </p>
              <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
                {t("model-router.description")}
              </p>
            </div>
            {!isEmpty && (
              <button
                onClick={openCreateModal}
                className="shrink-0 flex items-center justify-center h-9 px-5 py-2.5 rounded-lg bg-slate-50 text-zinc-950 text-sm font-medium leading-5 hover:opacity-90 transition-opacity duration-200"
              >
                {t("model-router.new-router-button")}
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-col">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_88px] gap-x-4 px-4 text-sm font-semibold uppercase tracking-[1.4px] text-zinc-500 light:text-slate-500 leading-5">
              <span>{t("model-router.table.name")}</span>
              <span>{t("model-router.table.fallback")}</span>
              <span>{t("model-router.table.rules")}</span>
              <span>{t("model-router.table.workspaces")}</span>
              <span aria-hidden="true" />
            </div>
            <div className="mt-[18px] border-t border-white/20 light:border-slate-300" />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <CircleNotch className="h-8 w-8 text-zinc-400 animate-spin" />
              </div>
            ) : isEmpty ? (
              <EmptyState onAction={openCreateModal} t={t} />
            ) : (
              <div className="flex flex-col">
                {routers.map((router, idx) => (
                  <RouterRow
                    key={router.id}
                    router={router}
                    removeRouter={removeRouter}
                    onEdit={() => openEditModal(router)}
                    showDivider={idx < routers.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <NewRouterModal
          isOpen={isOpen}
          closeModal={handleModalClose}
          onSuccess={fetchRouters}
          router={editingRouter}
        />
      </div>
    </div>
  );
}

function EmptyState({ onAction, t }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-28">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-base font-semibold leading-6 text-zinc-50 light:text-slate-900">
          {t("model-router.no-routers")}
        </p>
        <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 max-w-[370px]">
          {t("model-router.empty-description")}
        </p>
      </div>
      <button
        onClick={onAction}
        className="flex items-center justify-center h-9 px-5 py-2.5 rounded-lg bg-slate-50 text-zinc-950 text-sm font-medium leading-5 hover:opacity-90 transition-opacity duration-200"
      >
        {t("model-router.new-router-button")}
      </button>
    </div>
  );
}

function RouterRow({ router, removeRouter, onEdit, showDivider }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (
      !window.confirm(t("model-router.delete-confirm", { name: router.name }))
    )
      return;

    const { success, error } = await ModelRouter.delete(router.id);
    if (success) {
      showToast(t("model-router.toast-deleted"), "info");
      removeRouter(router.id);
    } else {
      showToast(t("model-router.toast-delete-failed", { error }), "error");
    }
  };

  const goToRules = () => navigate(paths.settings.modelRouterRules(router.id));

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <>
      <div
        onClick={goToRules}
        className="group grid grid-cols-[2fr_2fr_1fr_1fr_88px] gap-x-4 items-center h-9 px-4 rounded-lg cursor-pointer hover:bg-white/5 light:hover:bg-slate-100 transition-colors"
      >
        <span className="text-sm font-medium leading-5 text-white light:text-slate-900 truncate">
          {router.name}
        </span>
        <span className="text-sm font-normal leading-5 text-zinc-400 light:text-slate-500 truncate">
          {router.fallback_provider}/{router.fallback_model}
        </span>
        <span className="text-sm font-normal leading-5 text-zinc-400 light:text-slate-500">
          {router.ruleCount || 0}
        </span>
        <span
          className={`text-sm font-normal leading-5 ${
            router.workspaceCount > 0
              ? "text-green-400 light:text-green-600"
              : "text-zinc-400 light:text-slate-500"
          }`}
        >
          {router.workspaceCount || 0}
        </span>
        <div className="flex items-center justify-end gap-[14px]">
          <button
            onClick={handleDelete}
            aria-label={t("model-router.toast-deleted")}
            className="text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
          <button
            onClick={handleEditClick}
            aria-label={t("model-router.edit-router.title", {
              name: router.name,
            })}
            className="text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
          >
            <PencilSimple size={16} weight="bold" />
          </button>
        </div>
      </div>
      {showDivider && (
        <div className="border-t border-white/10 light:border-slate-200" />
      )}
    </>
  );
}
