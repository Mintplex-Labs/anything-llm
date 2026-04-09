import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import {
  CircleNotch,
  PlusCircle,
  Trash,
  PencilSimple,
} from "@phosphor-icons/react";
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

  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-2xl bg-zinc-900 light:bg-white light:border light:border-slate-300 w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-2 pb-6 border-b border-white/20 light:border-slate-300">
            <p className="text-lg font-semibold leading-7 text-white light:text-slate-900">
              {t("model-router.title")}
            </p>
            <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
              {t("model-router.description")}
            </p>
          </div>
          <div className="w-full justify-end flex mt-4">
            <button
              onClick={openModal}
              className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200"
            >
              <PlusCircle className="h-4 w-4" weight="bold" />
              {t("model-router.create-router")}
            </button>
          </div>
          <div className="overflow-x-auto mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <CircleNotch className="h-8 w-8 text-zinc-400 light:text-slate-400 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
                <thead className="text-zinc-400 light:text-slate-500 text-xs leading-[18px] font-bold uppercase border-b border-zinc-700 light:border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">
                      {t("model-router.table.name")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("model-router.table.fallback")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("model-router.table.rules")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("model-router.table.workspaces")}
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">
                      {" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-zinc-400 light:text-slate-500"
                      >
                        {t("model-router.no-routers")}
                      </td>
                    </tr>
                  ) : (
                    routers.map((router) => (
                      <RouterRow
                        key={router.id}
                        router={router}
                        removeRouter={removeRouter}
                      />
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <NewRouterModal
          isOpen={isOpen}
          closeModal={closeModal}
          onSuccess={fetchRouters}
        />
      </div>
    </div>
  );
}

function RouterRow({ router, removeRouter }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDelete = async () => {
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

  return (
    <tr className="text-sm border-b border-zinc-700 light:border-slate-200 h-10">
      <td className="px-6 py-3 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-semibold text-white light:text-slate-900">
            {router.name}
          </span>
          {router.description && (
            <span className="text-zinc-400 light:text-slate-500 text-[10px]">
              {router.description}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-3 text-zinc-300 light:text-slate-700">
        {router.fallback_provider} / {router.fallback_model}
      </td>
      <td className="px-6 py-3 text-zinc-300 light:text-slate-700">
        {router.ruleCount || 0}
      </td>
      <td className="px-6 py-3">
        <span
          className={
            router.workspaceCount > 0
              ? "text-green-400 light:text-green-600"
              : "text-zinc-400 light:text-slate-500"
          }
        >
          {router.workspaceCount || 0}
        </span>
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => navigate(paths.settings.modelRouterEdit(router.id))}
            className="text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
          >
            <PencilSimple className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
