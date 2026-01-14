import { useState, useEffect } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { DOCKER_MODEL_RUNNER_COMMON_URLS } from "@/utils/constants";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ModelTable from "./ModelTable";
import {
  ArrowClockwise,
  CircleNotch,
  MagnifyingGlass,
  Info,
} from "@phosphor-icons/react";
import strDistance from "js-levenshtein";
import { LLM_PREFERENCE_CHANGED_EVENT } from "@/pages/GeneralSettings/LLMPreference";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";

export default function DockerModelRunnerOptions({ settings }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "docker-model-runner",
    initialBasePath: settings?.DockerModelRunnerBasePath,
    ENDPOINTS: DOCKER_MODEL_RUNNER_COMMON_URLS,
  });

  const [maxTokens, setMaxTokens] = useState(
    settings?.DockerModelRunnerModelTokenLimit || 4096
  );

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <div className="flex justify-between items-center gap-x-2">
              <label className="text-white text-sm font-semibold">
                Base URL
              </label>
              {loading ? (
                <CircleNotch className="w-4 h-4 text-theme-text-secondary animate-spin" />
              ) : (
                <>
                  {!basePathValue.value && (
                    <button
                      onClick={handleAutoDetectClick}
                      className="bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
                    >
                      Auto-Detect
                    </button>
                  )}
                </>
              )}
            </div>
            <Tooltip
              id="docker-model-runner-base-url"
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
              Enter the URL where the Docker Model Runner is running.
              <br />
              <br />
              You <b>must</b> have enabled the Docker Model Runner TCP support
              for this to work.
              <br />
              <br />
              <Link
                to="https://docs.docker.com/ai/model-runner/get-started/#docker-desktop"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Learn more &rarr;
              </Link>
            </Tooltip>
            <div
              className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
              data-tooltip-id="docker-model-runner-base-url"
              data-tooltip-place="top"
              data-tooltip-delay-hide={800}
            >
              <Info size={18} className="text-theme-text-secondary" />
            </div>
          </div>

          <input
            type="url"
            name="DockerModelRunnerBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:12434/engines/llama.cpp/v1"
            value={basePathValue.value}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={basePath.onChange}
            onBlur={basePath.onBlur}
          />
        </div>
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              Model context window
            </label>
            <Tooltip
              id="docker-model-runner-model-context-window"
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
              To set the context window limit for a model, you can use the{" "}
              <code>docker run</code> command with the{" "}
              <code>--context-window</code> parameter.
              <br />
              <br />
              <code>
                docker model configure --context-size 8192 ai/qwen3:latest
              </code>
              <br />
              <br />
              <Link
                to="https://docs.docker.com/ai/model-runner/#context-size"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Learn more &rarr;
              </Link>
            </Tooltip>
            <div
              className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
              data-tooltip-id="docker-model-runner-model-context-window"
              data-tooltip-place="top"
              data-tooltip-delay-hide={800}
            >
              <Info size={18} className="text-theme-text-secondary" />
            </div>
          </div>
          <input
            type="number"
            name="DockerModelRunnerModelTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="4096"
            min={1}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            onScroll={(e) => e.target.blur()}
            required={true}
            autoComplete="off"
          />
        </div>
        <DockerModelRunnerModelSelection
          settings={settings}
          basePath={basePathValue.value}
        />
      </div>
    </div>
  );
}

function DockerModelRunnerModelSelection({ settings, basePath = null }) {
  const [selectedModelId, setSelectedModelId] = useState(
    settings?.DockerModelRunnerModelPref
  );
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
    const { models } = await System.customModels(
      "docker-model-runner",
      null,
      basePath
    );
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

  function downloadModel(modelId, _fileSize, progressCallback) {
    const [name, tag] = modelId.split(":");

    // Open the model in the Docker Hub (via browser since they may not be installed locally)
    window.open(`https://hub.docker.com/layers/${name}/${tag}`, "_blank");
    progressCallback(100);
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
      const tags = models.map((model) => ({
        ...model,
        name: model.name.split(":")[1],
      }));
      mapping.get("not installed").set(organization, tags);
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
    <Layout
      fetchModels={fetchModels}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      loading={loading}
    >
      <input
        type="hidden"
        name="DockerModelRunnerModelPref"
        id="DockerModelRunnerModelPref"
        value={selectedModelId}
      />
      {loading ? (
        <LoadingSkeleton />
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
              showRuntime: false,
            }}
          />
        ))
      )}
    </Layout>
  );
}

function Layout({
  children,
  fetchModels = null,
  searchQuery = "",
  setSearchQuery = () => {},
  loading = false,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  async function refreshModels() {
    setIsRefreshing(true);
    try {
      await fetchModels?.();
    } catch {
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-x-2 items-center pb-[8px]">
        <label className="text-theme-text-primary text-base font-semibold">
          Available Models
        </label>
      </div>
      <div className="flex w-full items-center gap-x-[16px]">
        <div className="relative flex-1 max-w-[640px]">
          <MagnifyingGlass
            size={14}
            weight="bold"
            color="var(--theme-text-primary)"
            className="absolute left-[9px] top-[10px] text-theme-settings-input-placeholder peer-focus:invisible"
          />
          <input
            type="search"
            placeholder="Search models"
            value={searchQuery}
            disabled={loading}
            className="min-h-[32px] border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 pl-[30px] py-2 search-input disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        {!!fetchModels && (
          <button
            type="button"
            onClick={refreshModels}
            disabled={isRefreshing || loading}
            className="border-none text-theme-text-secondary text-sm font-medium hover:underline flex items-center gap-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <CircleNotch className="w-4 h-4 text-theme-text-secondary animate-spin" />
            ) : (
              <ArrowClockwise
                weight="bold"
                className="w-4 h-4 text-theme-text-secondary"
              />
            )}
            <span
              className={`text-sm font-medium ${isRefreshing ? "hidden" : "text-theme-text-secondary"}`}
            >
              Refresh Models
            </span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <Skeleton.default
        height={100}
        width="100%"
        count={7}
        highlightColor="var(--theme-settings-input-active)"
        baseColor="var(--theme-settings-input-bg)"
        enableAnimation={true}
        containerClassName="w-fill flex gap-[8px] flex-col p-0"
      />
    </div>
  );
}
