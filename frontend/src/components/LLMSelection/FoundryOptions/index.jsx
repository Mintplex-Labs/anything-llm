import { useEffect, useState } from "react";
import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import System from "@/models/system";
import ModelTableLayout from "@/components/lib/ModelTable/layout";
import ModelTableLoadingSkeleton from "@/components/lib/ModelTable/loading";
import ModelTable from "@/components/lib/ModelTable";
import strDistance from "js-levenshtein";
import { LLM_PREFERENCE_CHANGED_EVENT } from "@/pages/GeneralSettings/LLMPreference";
import FoundryUtils from "@/models/utils/foundry";
import showToast from "@/utils/toast";

export default function FoundryOptions({ settings }) {
  const [basePath, setBasePath] = useState(settings?.FoundryBasePath);
  const [selectedModelId, setSelectedModelId] = useState(
    settings?.FoundryModelPref || ""
  );

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <div className="flex justify-between items-center gap-x-2">
              <label className="text-white text-sm font-semibold">
                Base URL
              </label>
            </div>
            <Tooltip
              id="foundry-base-url"
              place="top"
              delayShow={300}
              delayHide={800}
              clickable={true}
              className="tooltip !text-xs !opacity-100 z-99"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              Enter the URL where the Foundry API is running.
              <br />
              <br />
              You <b>must</b> start the Foundry API before using it.
              <br />
              <br />
              <code>foundry server start</code>
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
            placeholder="eg: http://127.0.0.1:8080"
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
              The maximum number of tokens that can be used for a model context
              window.
              <br />
              <br />
              If you enter a value here that is over the model's defined context
              window AnythingLLM will handle it for you automatically.
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
            placeholder="4096"
            defaultValue={settings?.FoundryModelTokenLimit}
            autoComplete="off"
            min={0}
          />
        </div>
        <FoundryModelSelection
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          basePath={basePath}
        />
      </div>
    </div>
  );
}

function FoundryModelSelection({
  selectedModelId,
  setSelectedModelId,
  basePath = null,
}) {
  const [customModels, setCustomModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchModels() {
    if (!basePath) {
      setCustomModels([]);
      setFilteredModels([]);
      setLoading(false);
      setSearchQuery("");
      return;
    }
    setLoading(true);
    const { models } = await System.customModels("foundry", null, basePath);
    setCustomModels(models || []);
    setFilteredModels(models || []);
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
    const filteredModels = new Map();

    customModels.forEach((model) => {
      const modelNameNormalized = model.name.toLowerCase();
      const modelOrganizationNormalized = model.organization.toLowerCase();

      if (modelNameNormalized.startsWith(normalizedSearchQuery))
        filteredModels.set(model.id, model);
      if (modelOrganizationNormalized.startsWith(normalizedSearchQuery))
        filteredModels.set(model.id, model);
      if (strDistance(modelNameNormalized, normalizedSearchQuery) <= 2)
        filteredModels.set(model.id, model);
      if (strDistance(modelOrganizationNormalized, normalizedSearchQuery) <= 2)
        filteredModels.set(model.id, model);
    });

    setFilteredModels(Array.from(filteredModels.values()));
  }, [searchQuery]);

  async function downloadModel(modelId, fileSize, progressCallback) {
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
      return showToast(
        error || "An error occurred while downloading the model",
        "error",
        { clear: true }
      );
    progressCallback(100);
    handleSetActiveModel(modelId);

    const existingModels = [...customModels];
    const newModel = existingModels.find((model) => model.id === modelId);
    if (newModel) {
      newModel.downloaded = true;
      setCustomModels(existingModels);
      setFilteredModels(existingModels);
      setSearchQuery("");
    }
  }

  function groupModelsByAlias(models) {
    const mapping = new Map();
    mapping.set("installed", new Map());
    mapping.set("not installed", new Map());

    const groupedModels = models.reduce((acc, model) => {
      acc[model.organization] = acc[model.organization] || [];
      acc[model.organization].push(model);
      return acc;
    }, {});

    Object.entries(groupedModels).forEach(([organization, models]) => {
      const hasInstalled = models.some((model) => model.downloaded);
      if (hasInstalled) {
        const installedModels = models.filter((model) => model.downloaded);
        mapping
          .get("installed")
          .set("Downloaded Models", [
            ...(mapping.get("installed").get("Downloaded Models") || []),
            ...installedModels,
          ]);
      }
      mapping.get("not installed").set(organization, models);
    });

    const orderedMap = new Map();
    mapping
      .get("installed")
      .entries()
      .forEach(([organization, models]) =>
        orderedMap.set(organization, models)
      );
    mapping
      .get("not installed")
      .entries()
      .forEach(([organization, models]) =>
        orderedMap.set(organization, models)
      );
    return Object.fromEntries(orderedMap);
  }

  function handleSetActiveModel(modelId) {
    if (modelId === selectedModelId) return;
    setSelectedModelId(modelId);
    window.dispatchEvent(new Event(LLM_PREFERENCE_CHANGED_EVENT));
  }

  const groupedModels = groupModelsByAlias(filteredModels);
  return (
    <ModelTableLayout
      fetchModels={fetchModels}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      loading={loading}
    >
      <Tooltip
        id="foundry-install-model-tooltip"
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
        Object.entries(groupedModels).map(([alias, models]) => (
          <ModelTable
            key={alias}
            alias={alias}
            models={models}
            setActiveModel={handleSetActiveModel}
            downloadModel={downloadModel}
            selectedModelId={selectedModelId}
            ui={{
              showRuntime: true,
            }}
          />
        ))
      )}
    </ModelTableLayout>
  );
}
