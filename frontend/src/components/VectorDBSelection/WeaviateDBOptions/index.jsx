import { useState } from "react";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function WeaviateDBOptions({ settings }) {
  const [deployment, setDeployment] = useState(
    settings?.WeaviateDeployment ||
      defaultDeployment(settings?.WeaviateEndpoint)
  );
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Deployment
          </label>
          <select
            name="WeaviateDeployment"
            value={deployment}
            onChange={(e) => setDeployment(e.target.value)}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option value="self-hosted">Self-hosted / Other</option>
            <option value="cloud">Weaviate Cloud</option>
          </select>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Weaviate URL (REST)
          </label>
          <input
            type="url"
            name="WeaviateEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={
              deployment === "cloud"
                ? "https://xxxx.weaviate.cloud"
                : "http://localhost:8080"
            }
            defaultValue={settings?.WeaviateEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="WeaviateApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-123Abcweaviate"
            defaultValue={settings?.WeaviateApiKey ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      {deployment === "self-hosted" && (
        <SelfHostedAdvancedSettings settings={settings} />
      )}
    </div>
  );
}

function SelfHostedAdvancedSettings({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  return (
    <>
      <div className="flex justify-start">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm"
        >
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-center gap-[36px]">
          <div className="flex flex-col w-60">
            <LabelWithTooltip id="weaviate-grpc-host-tooltip" label="gRPC Host">
              The host Weaviate serves gRPC on, without <code>https://</code> or
              a port.
              <br />
              <br />
              Leave blank to use the endpoint's host. Only set this if your
              provider gives you a separate gRPC host, such as DigitalOcean.
            </LabelWithTooltip>
            <input
              type="text"
              name="WeaviateGrpcHost"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Same as endpoint"
              defaultValue={settings?.WeaviateGrpcHost}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col w-60">
            <LabelWithTooltip id="weaviate-grpc-port-tooltip" label="gRPC Port">
              The port Weaviate serves gRPC on.
              <br />
              <br />
              Leave blank to use the default port <code>50051</code>. Only
              change this if your Weaviate instance exposes gRPC on a different
              port, such as behind a proxy.
            </LabelWithTooltip>
            <input
              type="number"
              name="WeaviateGrpcPort"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="50051"
              min={1}
              max={65535}
              step={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.WeaviateGrpcPort}
              required={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function LabelWithTooltip({ id, label, children }) {
  return (
    <div className="flex items-center gap-x-1 mb-3">
      <label className="text-white text-sm font-semibold block">{label}</label>
      <Info
        size={16}
        className="text-theme-text-secondary cursor-pointer"
        data-tooltip-id={id}
        data-tooltip-place="right"
      />
      <Tooltip
        delayHide={300}
        id={id}
        className="max-w-md z-99"
        clickable={true}
      >
        <p className="text-md whitespace-pre-line break-words">{children}</p>
      </Tooltip>
    </div>
  );
}

// Older installs don't have WEAVIATE_DEPLOYMENT set, so the server detects Weaviate Cloud
// from the endpoint. This mirrors that so saving the form doesn't switch Cloud users to self-hosted.
function defaultDeployment(endpoint) {
  try {
    const { hostname } = new URL(endpoint);
    return hostname.endsWith(".weaviate.cloud") ||
      hostname.endsWith(".weaviate.network")
      ? "cloud"
      : "self-hosted";
  } catch {
    return "self-hosted";
  }
}
