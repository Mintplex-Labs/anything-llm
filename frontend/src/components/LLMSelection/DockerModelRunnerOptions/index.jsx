import { useState, useEffect } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { DOCKER_MODEL_RUNNER_COMMON_URLS } from "@/utils/constants";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import { upperCaseFirst } from "text-case";

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
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-semibold">Base URL</label>
            {loading ? (
              <PreLoader size="6" />
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
        <DockerModelRunnerModelSelection
          settings={settings}
          basePath={basePathValue.value}
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Token context window
          </label>
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
      </div>
    </div>
  );
}

function DockerModelRunnerModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { models } = await System.customModels(
        "docker-model-runner",
        null,
        basePath
      );
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <PreLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Chat Model Selection
      </label>
      <select
        name="DockerModelRunnerModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
      >
        <option disabled={true} selected={true}>
          -- select a model --
        </option>
        {customModels.length > 0 &&
          customModels.map((model) => {
            return (
              <option
                key={model.id}
                value={model.id}
                selected={settings?.DockerModelRunnerModelPref === model.id}
              >
                {upperCaseFirst(model.name)}
              </option>
            );
          })}
        {customModels.length === 0 && (
          <option disabled={true} selected={true}>
            -- no models found --
          </option>
        )}
      </select>
    </div>
  );
}
