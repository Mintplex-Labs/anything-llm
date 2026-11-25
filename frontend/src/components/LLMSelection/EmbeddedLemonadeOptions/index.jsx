import { useState, useEffect } from "react";
import {
  CaretDown,
  CheckCircle,
  CircleNotch,
  Info,
  Lightning,
  Plus,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import strDistance from "js-levenshtein";
import System from "@/models/system";
import ModelTable from "@/components/lib/ModelTable";
import MonoProviderIcon from "@/components/lib/MonoProviderIcon";
import ModelTableLayout from "@/components/lib/ModelTable/layout";
import ModelTableLoadingSkeleton from "@/components/lib/ModelTable/loading";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import { LLM_PREFERENCE_CHANGED_EVENT } from "@/pages/GeneralSettings/LLMPreference";
import EmbeddedLemonadeUtils from "./utils";

/**
 * The embedded Lemonade engine (`embedded_lemonade`) - a lemond server this instance runs itself. Only offered when
 * the server has it enabled (ENABLE_BUILT_IN_LLM), so it never shows up anywhere else.
 * @param {{onboarding?: boolean}} options - onboarding shows recommended models before the full model table.
 */
function embeddedLemonadeLLM({ onboarding = false } = {}) {
  return {
    name: "Built-in",
    value: "embedded_lemonade",
    logo: AnythingLLMIcon,
    options: (settings) => (
      <EmbeddedLemonadeOptions settings={settings} onboarding={onboarding} />
    ),
    description:
      "Run local LLMs on this server's CPU or GPU with no extra setup.",
    requiredConfig: ["EmbeddedLemonadeEnabled"],
  };
}

/**
 * Adds the embedded engine to a provider list when the server has it enabled - first, or right after the
 * `after` entry (eg: a "System default" entry that should stay on top).
 * @param {Array<object>} providers
 * @param {object|null} settings - System.keys()
 * @param {{onboarding?: boolean, after?: string}} options
 * @returns {Array<object>}
 */
export function withEmbeddedLemonade(
  providers = [],
  settings = null,
  { after = null, ...options } = {}
) {
  if (!settings?.EmbeddedLemonadeEnabled) return providers;
  const index = providers.findIndex((llm) => llm.value === after) + 1;
  return [
    ...providers.slice(0, index),
    embeddedLemonadeLLM(options),
    ...providers.slice(index),
  ];
}

const DOWNLOAD_CANCELLED = "Download cancelled.";

export default function EmbeddedLemonadeOptions({
  settings,
  onboarding = false,
}) {
  const [selectedModelId, setSelectedModelId] = useState(
    settings?.EmbeddedLemonadeModelPref
  );
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  // The one download in flight: { label, percentage }. The server runs one download at a time.
  const [download, setDownload] = useState(null);
  // Onboarding starts on the recommended models; the full table is one click away.
  const [showAllModels, setShowAllModels] = useState(!onboarding);

  async function fetchModels() {
    setLoading(true);
    const { models } = await System.customModels("embedded_lemonade-all");
    setModels(models || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchModels();
  }, []);

  function selectModel(modelId) {
    if (!modelId || modelId === selectedModelId) return;
    setSelectedModelId(modelId);
    window.dispatchEvent(new Event(LLM_PREFERENCE_CHANGED_EVENT));
  }

  /**
   * Downloads a model id or Hugging Face checkpoint, then selects it.
   * @param {string} modelName
   * @param {string} label - shown in the download status
   * @param {(percentage: number) => void} onProgress
   * @returns {Promise<boolean>} whether the model was downloaded
   */
  async function downloadModel(modelName, label, onProgress = () => {}) {
    if (download) {
      showToast(
        "Another model is downloading. Wait for it to finish or cancel it.",
        "info",
        { clear: true }
      );
      return false;
    }

    setDownload({ label, percentage: 0 });
    const { success, error, modelId } =
      await EmbeddedLemonadeUtils.downloadModel(modelName, (percentage) => {
        setDownload({ label, percentage });
        onProgress(percentage);
      });
    setDownload(null);

    if (!success) {
      const cancelled = error === DOWNLOAD_CANCELLED;
      showToast(
        cancelled
          ? `Download of ${label} cancelled.`
          : error || `Could not download ${label}`,
        cancelled ? "info" : "error",
        { clear: true }
      );
      return false;
    }
    await fetchModels();
    selectModel(modelId || modelName);
    return true;
  }

  async function uninstallModel(modelId) {
    if (
      !window.confirm(
        "Are you sure you want to uninstall this model? You will need to download it again to use it."
      )
    )
      return;
    const { success, error } = await EmbeddedLemonadeUtils.removeModel(modelId);
    if (!success) {
      showToast(
        error || "An error occurred while uninstalling the model",
        "error",
        {
          clear: true,
        }
      );
      return;
    }
    await fetchModels();
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      <input
        type="hidden"
        name="EmbeddedLemonadeModelPref"
        value={selectedModelId || ""}
      />
      <EngineStatus />
      <div className="flex flex-col gap-y-[20px]">
        <button
          type="button"
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm w-fit h-[40px] hover:bg-theme-bg-sidebar rounded-lg transition-all duration-300"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        >
          <div className="flex w-full gap-x-2 items-center">
            {showAdvancedSettings ? "Hide" : "Show"} Advanced Settings
          </div>
          <CaretDown
            weight="bold"
            size={14}
            className={`shrink-0 text-theme-text-secondary transition-transform ${showAdvancedSettings ? "rotate-180" : ""}`}
          />
        </button>
        {/* Hidden instead of unmounted so the field still submits with the form. */}
        <div hidden={!showAdvancedSettings}>
          <AdvancedSettings settings={settings} />
        </div>
      </div>

      {download ? (
        <DownloadStatus download={download} />
      ) : (
        <PullFromHuggingFace
          onPull={(checkpoint) => downloadModel(checkpoint, checkpoint)}
        />
      )}

      {showAllModels ? (
        <>
          {onboarding && (
            <button
              type="button"
              onClick={() => setShowAllModels(false)}
              className="border-none w-fit text-sm text-sky-400 hover:underline"
            >
              Show recommended models
            </button>
          )}
          <ModelSelection
            models={models}
            loading={loading}
            fetchModels={fetchModels}
            selectedModelId={selectedModelId}
            selectModel={selectModel}
            downloadModel={downloadModel}
            uninstallModel={uninstallModel}
          />
        </>
      ) : (
        <RecommendedModels
          selectedModelId={selectedModelId}
          selectModel={selectModel}
          downloadModel={downloadModel}
          downloading={!!download}
          downloadedIds={
            new Set(models.filter((m) => m.downloaded).map((m) => m.id))
          }
          showAllModels={() => setShowAllModels(true)}
        />
      )}
    </div>
  );
}

function AdvancedSettings({ settings }) {
  const [maxTokens, setMaxTokens] = useState(
    settings?.EmbeddedLemonadeTokenLimit ?? ""
  );

  return (
    <div className="flex gap-[36px] flex-wrap">
      <div className="flex flex-col w-60">
        <div className="flex items-center gap-1 mb-3">
          <label className="text-white text-sm font-semibold block">
            Model context window
          </label>
          <Tooltip
            id="embedded-lemonade-context-window"
            place="top"
            delayShow={300}
            className="tooltip !text-xs !opacity-100 z-99"
            style={{ maxWidth: "350px", whiteSpace: "normal" }}
          >
            Leave empty to use the model's context window, up to 16,384 tokens.
            A set value is capped to what the model supports. Larger windows use
            more memory.
          </Tooltip>
          <div
            className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
            data-tooltip-id="embedded-lemonade-context-window"
          >
            <Info size={18} className="text-theme-text-secondary" />
          </div>
        </div>
        <input
          type="number"
          name="EmbeddedLemonadeTokenLimit"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Auto"
          // No native min/step: this field can be collapsed out of view, where the browser would block the save
          // without being able to show why. The server validates it and the save shows the error.
          step="any"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          onScroll={(e) => e.target.blur()}
          required={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

/** Shows the engine download/startup while it is not ready yet. */
function EngineStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let timer = null;
    // A status request can still be in flight on unmount - it must not schedule another poll.
    let active = true;
    async function poll() {
      const next = await EmbeddedLemonadeUtils.status();
      if (!active) return;
      setStatus(next);
      if (next && !["ready", "error"].includes(next.state))
        timer = setTimeout(poll, 2000);
    }
    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  if (!status || status.state === "ready" || status.state === "idle")
    return null;
  if (status.state === "error")
    return (
      <p className="text-red-400 text-sm">
        The local LLM engine failed to start: {status.message}
      </p>
    );
  return (
    <div className="flex items-center gap-x-2 text-theme-text-secondary text-sm">
      <CircleNotch className="w-4 h-4 animate-spin" />
      <p>
        {status.message}
        {status.progress !== null ? ` ${status.progress}%` : ""}
      </p>
    </div>
  );
}

/** The download in flight, with a way to cancel it. */
function DownloadStatus({ download }) {
  return (
    <div className="flex h-[40px] items-center gap-x-2">
      <div className="border-none bg-theme-bg-secondary p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
        <CircleNotch
          weight="bold"
          size={14}
          className="shrink-0 animate-spin text-theme-text-secondary"
        />
      </div>
      <p className="text-left text-theme-text-secondary text-sm">
        Downloading {download.label} {download.percentage}%
      </p>
      <button
        type="button"
        onClick={async () => {
          if (!(await EmbeddedLemonadeUtils.cancelDownload()))
            showToast("Could not cancel the download.", "error", {
              clear: true,
            });
        }}
        className="border-none transition-all duration-300 px-2 py-1 rounded-lg text-white text-sm hover:bg-red-500"
      >
        Cancel
      </button>
    </div>
  );
}

/**
 * Onboarding only: three models picked for this server's hardware, as cards. Clicking a card downloads (if needed)
 * and selects the model.
 */
function RecommendedModels({
  selectedModelId,
  selectModel,
  downloadModel,
  downloading,
  downloadedIds,
  showAllModels,
}) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    EmbeddedLemonadeUtils.recommendations().then(setResult);
  }, []);

  if (!result)
    return (
      <div className="flex items-center gap-x-2 text-theme-text-secondary text-sm">
        <CircleNotch className="w-4 h-4 animate-spin" />
        <p>Finding models for your hardware...</p>
      </div>
    );

  const hardware = result.vramGb
    ? `${result.vramGb} GB GPU`
    : result.ramGb
      ? `${result.ramGb} GB of memory (no supported GPU)`
      : null;

  async function choose(model) {
    if (downloadedIds.has(model.id)) return selectModel(model.id);
    if (
      !window.confirm(
        `Download ${model.name}? It is ${model.size} and may take a while to download.`
      )
    )
      return;
    await downloadModel(model.id, model.name);
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <p className="text-white text-sm font-semibold">Recommended models</p>
        {hardware && (
          <p className="text-theme-text-secondary text-xs">
            Picked to run comfortably on this server's {hardware}.
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {result.recommendations.map(
          ({ category, label, description, model }) => {
            const selected = model.id === selectedModelId;
            const downloaded = downloadedIds.has(model.id);
            return (
              <button
                key={category}
                type="button"
                disabled={downloading && !downloaded}
                onClick={() => choose(model)}
                className={`text-left flex flex-col gap-y-2 p-4 rounded-lg border transition-all duration-200 bg-theme-bg-secondary hover:bg-theme-bg-primary disabled:opacity-50 disabled:cursor-not-allowed ${selected ? "border-primary-button" : "border-theme-modal-border"}`}
              >
                <div className="flex items-center justify-between gap-x-2">
                  <p className="text-xs uppercase font-semibold text-theme-text-secondary">
                    {label}
                  </p>
                  {selected && (
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="text-primary-button shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-x-2">
                  <MonoProviderIcon
                    provider={model.name}
                    match="pattern"
                    fallbackIconKey={model.organization?.toLowerCase()}
                    size={20}
                    className="text-theme-text-primary shrink-0"
                  />
                  <p className="text-white text-base font-semibold">
                    {model.name}
                  </p>
                </div>
                <p className="text-theme-text-secondary text-xs">
                  {description}
                </p>
                <p className="text-theme-text-secondary text-xs mt-auto">
                  {[
                    model.size,
                    model.capabilities?.vision ? "Vision" : null,
                    model.capabilities?.reasoning ? "Thinking" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="text-sm text-sky-400">
                  {selected
                    ? "Selected"
                    : downloaded
                      ? "Use this model"
                      : "Download"}
                </p>
              </button>
            );
          }
        )}
      </div>
      <button
        type="button"
        onClick={showAllModels}
        className="border-none w-fit text-sm text-sky-400 hover:underline"
      >
        Show all models
      </button>
    </div>
  );
}

function ModelSelection({
  models,
  loading,
  fetchModels,
  selectedModelId,
  selectModel,
  downloadModel,
  uninstallModel,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  async function downloadFromTable(modelId, fileSize, progressCallback) {
    if (
      !window.confirm(
        `Are you sure you want to download this model? It is ${fileSize} in size and may take a while to download.`
      )
    )
      return;
    const model = models.find((m) => m.id === modelId);
    if (await downloadModel(modelId, model?.name ?? modelId, progressCallback))
      progressCallback(100);
  }

  const query = searchQuery.toLowerCase().trim();
  const filteredModels = !query
    ? models
    : models.filter((model) =>
        [model.name, model.family, model.organization].some((value) => {
          const normalized = (value || "").toLowerCase();
          return (
            normalized.includes(query) || strDistance(normalized, query) <= 2
          );
        })
      );

  // Downloaded models first, then each family in registry order.
  const groups = new Map();
  const downloaded = filteredModels.filter((model) => model.downloaded);
  if (downloaded.length) groups.set("Downloaded Models", downloaded);
  for (const model of filteredModels) {
    const family = model.family || model.organization || "Other";
    groups.set(family, [...(groups.get(family) || []), model]);
  }

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
      <Tooltip
        id="embedded-lemonade-model-badge"
        place="top"
        className="tooltip !text-xs !opacity-100 z-99"
      />
      {loading ? (
        <ModelTableLoadingSkeleton />
      ) : filteredModels.length === 0 ? (
        <div className="flex flex-col w-full gap-y-2 mt-4">
          <p className="text-theme-text-secondary text-sm">
            No models found! The local LLM engine may still be starting.
          </p>
        </div>
      ) : (
        Array.from(groups.entries()).map(([alias, groupModels]) => (
          <ModelTable
            key={alias}
            alias={alias}
            models={groupModels}
            setActiveModel={selectModel}
            downloadModel={downloadFromTable}
            selectedModelId={selectedModelId}
            uninstallModel={uninstallModel}
            ui={{ rawTitle: true, badges: ModelBadges }}
          />
        ))
      )}
    </ModelTableLayout>
  );
}

/**
 * Pull any GGUF repository from Hugging Face (or ModelScope, per EMBEDDED_LEMONADE_REGISTRY) as
 * owner/repo[:QUANT] or its URL.
 */
function PullFromHuggingFace({ onPull }) {
  const [showInput, setShowInput] = useState(false);
  const [repo, setRepo] = useState("");

  function handlePull() {
    const checkpoint = normalizeCheckpoint(repo);
    if (!checkpoint)
      return showToast(
        "Enter a repository like owner/model-GGUF or owner/model-GGUF:Q4_K_M",
        "error",
        { clear: true }
      );
    setShowInput(false);
    setRepo("");
    onPull(checkpoint);
  }

  if (!showInput)
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="w-fit relative flex h-[40px] items-center border-none hover:bg-theme-bg-sidebar rounded-lg"
      >
        <div className="flex w-full gap-x-2 items-center">
          <div className="border-none bg-theme-bg-secondary p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
            <Plus
              weight="bold"
              size={14}
              className="shrink-0 text-theme-text-secondary"
            />
          </div>
          <p className="text-left text-theme-text-secondary text-sm">
            Pull model from Hugging Face
          </p>
        </div>
      </button>
    );

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex w-fit items-center gap-x-2">
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            handlePull();
          }}
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[360px] p-2.5"
          type="text"
          placeholder="unsloth/Qwen3-4B-GGUF:Q4_K_M"
          autoFocus
        />
        <button
          type="button"
          onClick={handlePull}
          className="transition-all duration-300 border border-slate-200 p-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
        >
          Pull
        </button>
        <button
          type="button"
          onClick={() => {
            setShowInput(false);
            setRepo("");
          }}
          className="border-none transition-all duration-300 p-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-red-500"
        >
          Cancel
        </button>
      </div>
      <p className="text-theme-text-secondary text-xs max-w-[600px]">
        Any GGUF model repository on{" "}
        <a
          href="https://huggingface.co/models?library=gguf&sort=trending"
          target="_blank"
          rel="noreferrer"
          className="text-sky-400 hover:underline"
        >
          Hugging Face
        </a>
        , as owner/repository with an optional :quantization, or its URL. When
        no quantization is given, Q4_K_M is used if the repository has it.
      </p>
    </div>
  );
}

/**
 * Turns user input into an owner/repo[:quant] checkpoint. Accepts a bare checkpoint, a Hugging Face or
 * ModelScope URL, `hf.co/owner/repo:quant`, or an `ollama run hf.co/...` command.
 * @param {string} input
 * @returns {string|null}
 */
function normalizeCheckpoint(input = "") {
  const value = input
    .trim()
    .replace(/^ollama run\s+/i, "")
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?(huggingface\.co|hf\.co|modelscope\.cn\/models)\//i, "");
  const [path, quant = null] = value.split(":");
  const [owner, name] = path.split("/").filter(Boolean);
  if (!owner || !name) return null;
  return `${owner}/${name}${quant ? `:${quant}` : ""}`;
}

/** Badges shown before a model's name - the runtime is always llama.cpp, so only what sets a model apart. */
function ModelBadges(model) {
  const mtp = model.tags?.includes("mtp") || /\bmtp\b/i.test(model.name);
  if (!mtp) return null;
  return (
    <div className="flex items-center gap-x-1">
      <Lightning
        size={16}
        weight="duotone"
        className="text-amber-400 light:text-amber-600"
        data-tooltip-id="embedded-lemonade-model-badge"
        data-tooltip-content="Multi-token prediction: usually faster on a GPU, uses a little more memory"
      />
    </div>
  );
}
