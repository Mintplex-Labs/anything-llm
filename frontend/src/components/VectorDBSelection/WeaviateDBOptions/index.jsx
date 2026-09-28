import { useState } from "react";

const WEAVIATE_CLOUD_DOMAINS = [".weaviate.cloud", ".weaviate.network"];
const QUANTIZATION_OPTIONS = [
  { value: "", label: "Server default" },
  { value: "rq-8", label: "RQ 8-bit (recommended, Weaviate 1.32+)" },
  { value: "rq-1", label: "RQ 1-bit (Weaviate 1.33+)" },
  { value: "bq", label: "Binary (BQ)" },
  { value: "sq", label: "Scalar (SQ)" },
  { value: "pq", label: "Product (PQ)" },
];
const INPUT_CLASS =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";

/**
 * Settings saved before the deployment selector existed have no
 * WeaviateDeployment, so infer it the same way the server does.
 */
function initialDeployment(settings) {
  if (["cloud", "custom"].includes(settings?.WeaviateDeployment))
    return settings.WeaviateDeployment;
  try {
    const { hostname } = new URL(settings?.WeaviateEndpoint);
    const isCloudHost = WEAVIATE_CLOUD_DOMAINS.some((domain) =>
      hostname.endsWith(domain)
    );
    return isCloudHost && !settings?.WeaviateGrpcEndpoint ? "cloud" : "custom";
  } catch {
    return "custom";
  }
}

export default function WeaviateDBOptions({ settings }) {
  const [deployment, setDeployment] = useState(initialDeployment(settings));
  const isCloud = deployment === "cloud";
  const [multiTenancy, setMultiTenancy] = useState(
    settings?.WeaviateMultiTenancy === "true" ? "true" : "false"
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
            <option value="cloud">Weaviate Cloud</option>
            <option value="custom">Custom (self-hosted)</option>
          </select>
        </div>
      </div>

      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {isCloud ? "Cluster URL" : "REST Endpoint"}
          </label>
          <input
            type="url"
            name="WeaviateEndpoint"
            className={INPUT_CLASS}
            placeholder={
              isCloud
                ? "https://xyz.c0.europe-west3.gcp.weaviate.cloud"
                : "http://localhost:8080"
            }
            defaultValue={settings?.WeaviateEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {!isCloud && (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              gRPC Endpoint (optional)
            </label>
            <input
              type="url"
              name="WeaviateGrpcEndpoint"
              className={INPUT_CLASS}
              placeholder="http://localhost:50051"
              defaultValue={settings?.WeaviateGrpcEndpoint}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {isCloud ? "API Key" : "API Key (optional)"}
          </label>
          <input
            type="password"
            name="WeaviateApiKey"
            className={INPUT_CLASS}
            placeholder="Weaviate API key"
            defaultValue={settings?.WeaviateApiKey ? "*".repeat(20) : ""}
            required={isCloud && !settings?.WeaviateApiKey}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <p className="text-theme-text-secondary text-xs -mt-4">
        {isCloud
          ? "Use the REST endpoint and an API key from your Weaviate Cloud cluster. The gRPC endpoint is derived automatically."
          : "Weaviate 1.29 or later. The gRPC endpoint defaults to the REST host on port 50051."}
      </p>

      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Vector compression
          </label>
          <select
            name="WeaviateQuantization"
            defaultValue={settings?.WeaviateQuantization || ""}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {QUANTIZATION_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-theme-text-secondary text-xs -mt-4">
        Compresses vectors to cut memory use, with a small loss of search
        accuracy. Applies to workspaces created after the change.
      </p>

      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Workspace storage
          </label>
          <select
            name="WeaviateMultiTenancy"
            value={multiTenancy}
            onChange={(e) => setMultiTenancy(e.target.value)}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option value="false">One collection per workspace</option>
            <option value="true">Multi-tenant (one shared collection)</option>
          </select>
        </div>
        {multiTenancy === "true" && (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Shared collection name
            </label>
            <input
              type="text"
              name="WeaviateCollection"
              className={INPUT_CLASS}
              placeholder="AnythingLLM"
              defaultValue={settings?.WeaviateCollection}
              pattern="[A-Za-z][A-Za-z0-9_]*"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>
      <p className="text-theme-text-secondary text-xs -mt-4">
        Multi-tenant stores each workspace as a tenant of one collection, which
        scales better with many workspaces. Existing workspaces are moved
        automatically when you switch, without re-embedding.
      </p>
    </div>
  );
}
