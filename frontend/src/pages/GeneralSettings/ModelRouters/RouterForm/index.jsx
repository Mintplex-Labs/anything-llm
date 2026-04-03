import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { ArrowLeft, CircleNotch } from "@phosphor-icons/react";
import ModelRouter from "@/models/modelRouter";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import LLMProviderModelPicker from "../LLMProviderModelPicker";
import RuleBuilder from "../RuleBuilder";

export default function RouterFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [router, setRouter] = useState(null);

  const fetchRouter = async () => {
    const { router: found, error } = await ModelRouter.get(id);
    if (!found) {
      showToast(error || "Router not found", "error");
      navigate(paths.settings.modelRouters());
      return;
    }
    setRouter(found);
    setLoading(false);
  };

  useEffect(() => {
    fetchRouter();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      fallback_provider: formData.get("fallback_provider"),
      fallback_model: formData.get("fallback_model"),
    };

    const { router: updated, error } = await ModelRouter.update(id, data);
    setSaving(false);

    if (updated) {
      showToast("Router updated successfully", "success", { clear: true });
      setRouter({ ...router, ...updated });
    } else {
      showToast(error || "Failed to update router", "error");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-2xl bg-zinc-900 light:bg-white light:border light:border-slate-300 w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <button
            onClick={() => navigate(paths.settings.modelRouters())}
            className="flex items-center gap-x-2 text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Model Routers
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <CircleNotch className="h-8 w-8 text-zinc-400 light:text-slate-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="w-full flex flex-col gap-y-2 pb-6 border-b border-white/20 light:border-slate-300">
                <p className="text-lg font-semibold leading-7 text-white light:text-slate-900">
                  Edit Router: {router.name}
                </p>
                <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
                  Update the router settings and fallback provider/model.
                </p>
              </div>

              <form onSubmit={handleSave} className="mt-6">
                <div className="space-y-4 max-w-[700px]">
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={router.name}
                      className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      defaultValue={router.description || ""}
                      placeholder="Optional description"
                      className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
                    />
                  </div>
                  <LLMProviderModelPicker
                    providerFieldName="fallback_provider"
                    modelFieldName="fallback_model"
                    label="Fallback Provider & Model"
                    description="Used when no routing rule matches"
                    defaultProvider={router.fallback_provider}
                    defaultModel={router.fallback_model}
                  />
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <CircleNotch className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <RuleBuilder
                routerId={router.id}
                rules={router.rules || []}
                onRulesChanged={fetchRouter}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
