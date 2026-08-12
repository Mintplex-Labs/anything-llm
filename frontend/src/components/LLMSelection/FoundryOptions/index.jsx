import { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import strDistance from "js-levenshtein";
import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { LLM_PREFERENCE_CHANGED_EVENT } from "@/pages/GeneralSettings/LLMPreference";
import ModelTable from "@/components/lib/ModelTable";
import ModelTableLayout from "@/components/lib/ModelTable/layout";
import ModelTableLoadingSkeleton from "@/components/lib/ModelTable/loading";
import FoundryUtils from "@/models/utils/foundryUtils";

export default function FoundryOptions({ settings }) {
  const [basePath, setBasePath] = useState(settings?.FoundryBasePath);
  const [tokenLimit, setTokenLimit] = useState(
    settings?.FoundryModelTokenLimit || ""
  );

  const handleTokenLimitChange = (e) => {
    setTokenLimit(e.target.value ? Number(e.target.value) : "");
  };
  const [selectedModelId, setSelectedModelId] = useState(
    settings?.FoundryModelPref || ""
  );

  useEffect(() => {
    setSelectedModelId(settings?.FoundryModelPref || "");
  }, [settings?.FoundryModelPref]);

  /**
   * The context window is deliberately left blank on selection. An empty field
   * means "let the server decide", which caps at a machine-friendly default
   * rather than handing a laptop the model's full window. A value typed here is
   * treated as an explicit override.
   */
  function handleModelSelected(modelId) {
    setSelectedModelId(modelId);
    window.dispatchEvent(new Event(LLM_PREFERENCE_CHANGED_EVENT));
  }

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              Base URL
            </label>
            <Tooltip
              id="foundry-base-url"
              place="top"
              delayShow={300}
              delayHide={800}
              clickable={true}
              className="tooltip !text-xs !opacity-100 z-99"
              style={{
                maxWidth: "300px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              The URL where the Foundry Local service is running. Run
              <b> foundry status</b> on the host to find it.
            </Tooltip>
            <div
              className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
              data-tooltip-id="foundry-base-url"
              data-tooltip-place="top"
              data-tooltip-delay-hide={800}
            >
              <Info size={18} className="text-theme-text-secondary" />
            </div>
          </div>
          <input
            type="url"
            name="FoundryBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="eg: http://127.0.0.1:5272"
            defaultValue={settings?.FoundryBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePath(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              Model context window
            </label>
            <Tooltip
              id="foundry-model-context-window"
              place="top"
              delayShow={300}
              delayHide={800}
              clickable={true}
              className="tooltip !text-xs !opacity-100 z-99"
              style={{
                maxWidth: "350px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              Override the context window limit. Leave empty to auto-detect from
              the model, or lower it if large context windows slow your machine
              down.
            </Tooltip>
            <div
              className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
              data-tooltip-id="foundry-model-context-window"
              data-tooltip-place="top"
              data-tooltip-delay-hide={800}
            >
              <Info size={18} className="text-theme-text-secondary" />
            </div>
          </div>
          <input
            type="number"
            name="FoundryModelTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Automatically managed"
            min={1}
            value={tokenLimit}
            onChange={handleTokenLimitChange}
            onScroll={(e) => e.target.blur()}
            required={false}
            autoComplete="off"
          />
        </div>
        <FoundryModelSelection
          selectedModelId={selectedModelId}
          onModelSelected={handleModelSelected}
          basePath={basePath}
        />
      </div>
    </div>
  );
}

function FoundryModelSelection({
  selectedModelId,
  onModelSelected,
  basePath = null,
}) {
  const [customModels, setCustomModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [canManage, setCanManage] = useState(false);

  async function fetchModels() {
    if (!basePath) {
      setCustomModels([]);
      setFilteredModels([]);
      setSearchQuery("");
      setCanManage(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [{ models }, capabilities] = await Promise.all([
      System.customModels("foundry", null, basePath),
      FoundryUtils.capabilities(basePath),
    ]);
    setCustomModels(models || []);
    setFilteredModels(models || []);
    setCanManage(capabilities.canManage);
    setSearchQuery("");
    setLoading(false);
  }

  useEffect(() => {
    fetchModels();
  }, [basePath]);

  useEffect(() => {
    if (!searchQuery || !customModels.length) {
      setFilteredModels(customModels || []);
      return;
    }

    const normalizedSearchQuery = searchQuery.toLowerCase().trim();
    const matches = new Map();

    customModels.forEach((model) => {
      const name = model.name.toLowerCase();
      if (name.includes(normalizedSearchQuery)) matches.set(model.id, model);
      if (strDistance(name, normalizedSearchQuery) <= 2)
        matches.set(model.id, model);
    });

    setFilteredModels(Array.from(matches.values()));
  }, [searchQuery, customModels]);

  async function uninstallModel(modelId) {
    try {
      if (
        !window.confirm(
          `Are you sure you want to uninstall this model? You will need to download it again to use it.`
        )
      )
        return;

      const { success, error } = await FoundryUtils.deleteModel(
        modelId,
        basePath
      );
      if (!success)
        throw new Error(
          error || "An error occurred while uninstalling the model"
        );

      const updatedModels = customModels.map((model) =>
        model.id === modelId ? { ...model, downloaded: false } : model
      );
      setCustomModels(updatedModels);
      setFilteredModels(updatedModels);
      setSearchQuery("");
    } catch (e) {
      console.error("Error uninstalling model:", e);
      showToast(
        e.message || "An error occurred while uninstalling the model",
        "error",
        { clear: true }
      );
    }
  }

  async function downloadModel(modelId, fileSize, progressCallback) {
    try {
      if (
        !window.confirm(
          `Are you sure you want to download this model? It is ${fileSize} in size and may take a while to download.`
        )
      )
        return;

      const { success, error } = await FoundryUtils.downloadModel(
        modelId,
        basePath,
        progressCallback
      );
      if (!success)
        throw new Error(
          error || "An error occurred while downloading the model"
        );
      progressCallback(100);

      const updatedModels = customModels.map((model) =>
        model.id === modelId ? { ...model, downloaded: true } : model
      );
      setCustomModels(updatedModels);
      setFilteredModels(updatedModels);
      setSearchQuery("");
      onModelSelected(modelId);
    } catch (e) {
      console.error("Error downloading model:", e);
      showToast(
        e.message || "An error occurred while downloading the model",
        "error",
        { clear: true }
      );
    }
  }

  /**
   * Pin everything already downloaded to the top, then group the rest by task.
   * The pinned group is skipped when every model is downloaded, since it would
   * just duplicate the whole list under a second heading.
   */
  function groupModels(models) {
    const downloaded = models.filter((model) => model.downloaded);
    const byType = models.reduce((acc, model) => {
      acc[model.organization] = acc[model.organization] || [];
      acc[model.organization].push(model);
      return acc;
    }, {});

    const grouped = {};
    if (downloaded.length && downloaded.length < models.length)
      grouped["Downloaded Models"] = downloaded;
    Object.keys(byType)
      .sort((a, b) => a.localeCompare(b))
      .forEach((type) => (grouped[type] = byType[type]));
    return grouped;
  }

  function handleSetActiveModel(modelId) {
    if (modelId === selectedModelId) return;
    onModelSelected(modelId);
  }

  const groupedModels = groupModels(filteredModels);
  return (
    <ModelTableLayout
      fetchModels={fetchModels}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      loading={loading}
    >
      <Tooltip
        id="install-model-tooltip"
        place="top"
        className="tooltip !text-xs !opacity-100 z-99"
      />
      <input
        type="hidden"
        name="FoundryModelPref"
        id="FoundryModelPref"
        value={selectedModelId}
      />
      {loading ? (
        <ModelTableLoadingSkeleton />
      ) : filteredModels.length === 0 ? (
        <div className="flex flex-col w-full gap-y-2 mt-4">
          <p className="text-theme-text-secondary text-sm">No models found!</p>
        </div>
      ) : (
        <>
          {!canManage && (
            <p className="text-theme-text-secondary text-xs italic mt-3">
              This Foundry service only reports the models it already has.
              Install more on the host with{" "}
              <span className="font-mono">foundry model download</span>, then
              refresh.
            </p>
          )}
          {Object.entries(groupedModels).map(([group, models]) => (
            <ModelTable
              key={group}
              alias={group}
              models={models}
              setActiveModel={handleSetActiveModel}
              downloadModel={canManage ? downloadModel : null}
              uninstallModel={canManage ? uninstallModel : null}
              selectedModelId={selectedModelId}
              ui={{ showRuntime: true }}
            />
          ))}
        </>
      )}
    </ModelTableLayout>
  );
}
