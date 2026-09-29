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
const AUTH_METHODS = [
  { value: "none", label: "None (anonymous)" },
  { value: "api-key", label: "API key" },
  { value: "oidc-client-credentials", label: "OIDC client credentials" },
  { value: "oidc-password", label: "OIDC username & password" },
  { value: "bearer-token", label: "Bearer token" },
];
const DOCS = {
  customConnection:
    "https://docs.weaviate.io/weaviate/connections/connect-custom",
  authentication:
    "https://docs.weaviate.io/deploy/configuration/authentication",
  compression: "https://docs.weaviate.io/weaviate/concepts/vector-quantization",
  multiTenancy:
    "https://docs.weaviate.io/weaviate/manage-collections/multi-tenancy",
  hybridSearch: "https://docs.weaviate.io/weaviate/search/hybrid",
};
const INPUT_CLASS =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";
const SELECT_CLASS =
  "border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5";
const MASKED = "*".repeat(20);

/**
 * Settings saved before the deployment selector existed have no
 * WeaviateDeployment, so infer it the same way the server does.
 */
function initialDeployment(settings) {
  if (["cloud", "custom"].includes(settings?.WeaviateDeployment))
    return settings.WeaviateDeployment;
  if (settings?.WeaviateHttpHost) return "custom";
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

/**
 * Values for the custom connection fields: the explicit settings, or for
 * older configs, the parts of the WeaviateEndpoint / WeaviateGrpcEndpoint URLs.
 */
function initialCustomConnection(settings) {
  if (settings?.WeaviateHttpHost)
    return {
      httpHost: settings.WeaviateHttpHost,
      httpPort: settings.WeaviateHttpPort || "8080",
      httpSecure: settings.WeaviateHttpSecure === "true" ? "true" : "false",
      httpPath: settings.WeaviateHttpPath || "",
      grpcHost: settings.WeaviateGrpcHost || "",
      grpcPort: settings.WeaviateGrpcPort || "50051",
      grpcSecure: settings.WeaviateGrpcSecure || "",
    };

  const parse = (value) => {
    try {
      return value ? new URL(value) : null;
    } catch {
      return null;
    }
  };
  const http = parse(settings?.WeaviateEndpoint);
  const grpc = parse(settings?.WeaviateGrpcEndpoint);
  const httpSecure = http?.protocol === "https:";
  const path = http?.pathname.replace(/\/+$/, "") || "";
  return {
    httpHost: http?.hostname || "",
    httpPort: http ? http.port || (httpSecure ? "443" : "80") : "8080",
    httpSecure: httpSecure ? "true" : "false",
    httpPath: path,
    grpcHost: grpc?.hostname || "",
    grpcPort: grpc?.port || "50051",
    grpcSecure: grpc ? String(grpc.protocol === "https:") : "",
  };
}

function initialAuthMethod(settings) {
  if (AUTH_METHODS.some(({ value }) => value === settings?.WeaviateAuthMethod))
    return settings.WeaviateAuthMethod;
  return settings?.WeaviateApiKey ? "api-key" : "none";
}

function DocLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-white hover:opacity-80"
    >
      {children}
    </a>
  );
}

function Field({ label, children, hint = null }) {
  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        {label}
      </label>
      {children}
      {hint && <p className="text-theme-text-secondary text-xs mt-2">{hint}</p>}
    </div>
  );
}

function TextInput({
  name,
  defaultValue,
  placeholder,
  type = "text",
  ...rest
}) {
  return (
    <input
      type={type}
      name={name}
      className={INPUT_CLASS}
      placeholder={placeholder}
      defaultValue={defaultValue ?? ""}
      autoComplete="off"
      spellCheck={false}
      {...rest}
    />
  );
}

function SecretInput({ name, isSet, placeholder, required = false }) {
  return (
    <TextInput
      type="password"
      name={name}
      placeholder={placeholder}
      defaultValue={isSet ? MASKED : ""}
      required={required && !isSet}
    />
  );
}

function YesNoSelect({ name, defaultValue, emptyLabel = null }) {
  return (
    <select name={name} defaultValue={defaultValue} className={SELECT_CLASS}>
      {emptyLabel !== null && <option value="">{emptyLabel}</option>}
      <option value="false">No</option>
      <option value="true">Yes</option>
    </select>
  );
}

function Row({ children }) {
  return (
    <div className="w-full flex flex-wrap items-start gap-[36px]">
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="text-white text-base font-bold -mb-3">{children}</div>;
}

export default function WeaviateDBOptions({ settings }) {
  const [deployment, setDeployment] = useState(initialDeployment(settings));
  const [authMethod, setAuthMethod] = useState(initialAuthMethod(settings));
  const [multiTenancy, setMultiTenancy] = useState(
    settings?.WeaviateMultiTenancy === "true" ? "true" : "false"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isCloud = deployment === "cloud";
  const custom = initialCustomConnection(settings);

  return (
    <div className="w-full flex flex-col gap-y-7">
      <Row>
        <Field label="Deployment">
          <select
            name="WeaviateDeployment"
            value={deployment}
            onChange={(e) => setDeployment(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="cloud">Weaviate Cloud</option>
            <option value="custom">Custom (self-hosted)</option>
          </select>
        </Field>
      </Row>

      {isCloud ? (
        <Row>
          <Field
            label="Cluster URL"
            hint="The REST endpoint of your cluster. The gRPC endpoint is derived automatically."
          >
            <TextInput
              type="url"
              name="WeaviateEndpoint"
              placeholder="https://xyz.c0.europe-west3.gcp.weaviate.cloud"
              defaultValue={settings?.WeaviateEndpoint}
              required={true}
            />
          </Field>
          <Field label="API Key">
            <input type="hidden" name="WeaviateAuthMethod" value="api-key" />
            <SecretInput
              name="WeaviateApiKey"
              isSet={settings?.WeaviateApiKey}
              placeholder="Weaviate Cloud API key"
              required={true}
            />
          </Field>
        </Row>
      ) : (
        <>
          {/* The explicit fields below replace the older URL settings. */}
          <input type="hidden" name="WeaviateEndpoint" value="" />
          <input type="hidden" name="WeaviateGrpcEndpoint" value="" />
          <p className="text-theme-text-secondary text-xs -mt-4">
            Every option of a{" "}
            <DocLink href={DOCS.customConnection}>custom connection</DocLink>.
            AnythingLLM needs Weaviate 1.29 or later with both the HTTP and gRPC
            ports reachable.
          </p>
          <SectionTitle>HTTP (REST)</SectionTitle>
          <Row>
            <Field label="Host">
              <TextInput
                name="WeaviateHttpHost"
                placeholder="localhost"
                defaultValue={custom.httpHost}
                required={true}
              />
            </Field>
            <Field label="Port">
              <TextInput
                type="number"
                min={1}
                max={65535}
                name="WeaviateHttpPort"
                placeholder="8080"
                defaultValue={custom.httpPort}
              />
            </Field>
            <Field label="Secure (HTTPS)">
              <YesNoSelect
                name="WeaviateHttpSecure"
                defaultValue={custom.httpSecure}
              />
            </Field>
            <Field label="Path (optional)" hint="e.g. /weaviate behind a proxy">
              <TextInput
                name="WeaviateHttpPath"
                placeholder="/"
                defaultValue={custom.httpPath}
              />
            </Field>
          </Row>

          <SectionTitle>gRPC</SectionTitle>
          <Row>
            <Field label="Host (optional)" hint="Defaults to the HTTP host.">
              <TextInput
                name="WeaviateGrpcHost"
                placeholder={custom.httpHost || "localhost"}
                defaultValue={custom.grpcHost}
              />
            </Field>
            <Field label="Port">
              <TextInput
                type="number"
                min={1}
                max={65535}
                name="WeaviateGrpcPort"
                placeholder="50051"
                defaultValue={custom.grpcPort}
              />
            </Field>
            <Field label="Secure (TLS)">
              <YesNoSelect
                name="WeaviateGrpcSecure"
                defaultValue={custom.grpcSecure}
                emptyLabel="Same as HTTP"
              />
            </Field>
            <Field label="Proxy (optional)">
              <TextInput
                type="url"
                name="WeaviateGrpcProxy"
                placeholder="http://proxy:3128"
                defaultValue={settings?.WeaviateGrpcProxy}
              />
            </Field>
          </Row>

          <SectionTitle>Authentication</SectionTitle>
          <p className="text-theme-text-secondary text-xs -mt-4">
            Use the method your Weaviate server is configured for. See{" "}
            <DocLink href={DOCS.authentication}>authentication</DocLink>.
          </p>
          <Row>
            <Field label="Method">
              <select
                name="WeaviateAuthMethod"
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value)}
                className={SELECT_CLASS}
              >
                {AUTH_METHODS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            {authMethod === "api-key" && (
              <Field label="API Key">
                <SecretInput
                  name="WeaviateApiKey"
                  isSet={settings?.WeaviateApiKey}
                  placeholder="Weaviate API key"
                  required={true}
                />
              </Field>
            )}
            {authMethod === "oidc-client-credentials" && (
              <Field label="Client secret">
                <SecretInput
                  name="WeaviateOidcClientSecret"
                  isSet={settings?.WeaviateOidcClientSecret}
                  placeholder="OIDC client secret"
                  required={true}
                />
              </Field>
            )}
            {authMethod === "oidc-password" && (
              <>
                <Field label="Username">
                  <TextInput
                    name="WeaviateOidcUsername"
                    placeholder="user@example.com"
                    defaultValue={settings?.WeaviateOidcUsername}
                    required={true}
                  />
                </Field>
                <Field label="Password">
                  <SecretInput
                    name="WeaviateOidcPassword"
                    isSet={settings?.WeaviateOidcPassword}
                    placeholder="Password"
                    required={true}
                  />
                </Field>
              </>
            )}
            {["oidc-client-credentials", "oidc-password"].includes(
              authMethod
            ) && (
              <Field label="Scopes (optional)" hint="Space or comma separated.">
                <TextInput
                  name="WeaviateOidcScopes"
                  placeholder="openid offline_access"
                  defaultValue={settings?.WeaviateOidcScopes}
                />
              </Field>
            )}
            {authMethod === "bearer-token" && (
              <>
                <Field label="Access token">
                  <SecretInput
                    name="WeaviateAccessToken"
                    isSet={settings?.WeaviateAccessToken}
                    placeholder="Access token"
                    required={true}
                  />
                </Field>
                <Field label="Expires in (seconds)">
                  <TextInput
                    type="number"
                    min={1}
                    name="WeaviateAccessTokenExpiresIn"
                    placeholder="3600"
                    defaultValue={settings?.WeaviateAccessTokenExpiresIn}
                  />
                </Field>
                <Field label="Refresh token (optional)">
                  <SecretInput
                    name="WeaviateRefreshToken"
                    isSet={settings?.WeaviateRefreshToken}
                    placeholder="Refresh token"
                  />
                </Field>
              </>
            )}
          </Row>
        </>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-white text-sm font-semibold underline"
        >
          {showAdvanced ? "Hide" : "Show"} advanced connection settings
        </button>
      </div>
      {/* Kept in the form while hidden so the values are always saved. */}
      <div className={showAdvanced ? "flex flex-col gap-y-7" : "hidden"}>
        <Row>
          <Field label="Query timeout (s)" hint="Default 30">
            <TextInput
              type="number"
              min={0}
              step="any"
              name="WeaviateTimeoutQuery"
              placeholder="30"
              defaultValue={settings?.WeaviateTimeoutQuery}
            />
          </Field>
          <Field label="Insert timeout (s)" hint="Default 90">
            <TextInput
              type="number"
              min={0}
              step="any"
              name="WeaviateTimeoutInsert"
              placeholder="90"
              defaultValue={settings?.WeaviateTimeoutInsert}
            />
          </Field>
          <Field label="Init timeout (s)" hint="Default 2">
            <TextInput
              type="number"
              min={0}
              step="any"
              name="WeaviateTimeoutInit"
              placeholder="2"
              defaultValue={settings?.WeaviateTimeoutInit}
            />
          </Field>
          <Field
            label="Skip init checks"
            hint="Skips the startup health and version checks."
          >
            <YesNoSelect
              name="WeaviateSkipInitChecks"
              defaultValue={
                settings?.WeaviateSkipInitChecks === "true" ? "true" : "false"
              }
            />
          </Field>
        </Row>
        <div className="flex flex-col w-full max-w-[600px]">
          <label className="text-white text-sm font-semibold block mb-3">
            Additional headers (JSON, optional)
          </label>
          <textarea
            name="WeaviateHeaders"
            rows={3}
            className={INPUT_CLASS}
            placeholder='{"X-Custom-Header": "value"}'
            defaultValue={settings?.WeaviateHeaders ? MASKED : ""}
            spellCheck={false}
          />
          <p className="text-theme-text-secondary text-xs mt-2">
            Sent with every request. Stored values are hidden; enter the full
            JSON again to change them.
          </p>
        </div>
      </div>

      <SectionTitle>Search</SectionTitle>
      <Row>
        <Field label="Default search mode">
          <select
            name="WeaviateSearchMode"
            defaultValue={
              settings?.WeaviateSearchMode === "hybrid" ? "hybrid" : "vector"
            }
            className={SELECT_CLASS}
          >
            <option value="vector">Vector</option>
            <option value="hybrid">Hybrid (keyword + vector)</option>
          </select>
        </Field>
        <Field
          label="Hybrid alpha (optional)"
          hint="0 = keyword only, 1 = vector only. Empty uses the Weaviate default (0.75)."
        >
          <TextInput
            type="number"
            min={0}
            max={1}
            step="0.05"
            name="WeaviateHybridAlpha"
            placeholder="0.75"
            defaultValue={settings?.WeaviateHybridAlpha}
          />
        </Field>
        <Field label="Hybrid fusion">
          <select
            name="WeaviateHybridFusion"
            defaultValue={settings?.WeaviateHybridFusion || ""}
            className={SELECT_CLASS}
          >
            <option value="">Weaviate default</option>
            <option value="relativeScore">Relative score</option>
            <option value="ranked">Ranked</option>
          </select>
        </Field>
      </Row>
      <p className="text-theme-text-secondary text-xs -mt-4">
        Hybrid search combines keyword (BM25) matching on the chunk text with
        vector search, which helps with names, codes and exact terms. Each
        workspace can override the mode and alpha in its Vector Database
        settings.{" "}
        <DocLink href={DOCS.hybridSearch}>Learn about hybrid search</DocLink>.
      </p>

      <Row>
        <Field label="Vector compression">
          <select
            name="WeaviateQuantization"
            defaultValue={settings?.WeaviateQuantization || ""}
            className={SELECT_CLASS}
          >
            {QUANTIZATION_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </Row>
      <p className="text-theme-text-secondary text-xs -mt-4">
        Compresses vectors to cut memory use, with a small loss of search
        accuracy. Applies to workspaces created after the change.{" "}
        <DocLink href={DOCS.compression}>
          Learn about vector compression
        </DocLink>
        .
      </p>

      <Row>
        <Field label="Workspace storage">
          <select
            name="WeaviateMultiTenancy"
            value={multiTenancy}
            onChange={(e) => setMultiTenancy(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="false">One collection per workspace</option>
            <option value="true">Multi-tenant (one shared collection)</option>
          </select>
        </Field>
        {multiTenancy === "true" && (
          <Field label="Shared collection name">
            <TextInput
              name="WeaviateCollection"
              placeholder="AnythingLLM"
              defaultValue={settings?.WeaviateCollection}
              pattern="[A-Za-z][A-Za-z0-9_]*"
            />
          </Field>
        )}
      </Row>
      <p className="text-theme-text-secondary text-xs -mt-4">
        Multi-tenant stores each workspace as a tenant of one collection, which
        scales better with many workspaces. Existing workspaces are moved
        automatically when you switch, without re-embedding.{" "}
        <DocLink href={DOCS.multiTenancy}>Learn about multi-tenancy</DocLink>.
      </p>
    </div>
  );
}
