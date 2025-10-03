# anythingllm

![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.85.0](https://img.shields.io/badge/AppVersion-1.85.0-informational?style=flat-square)

![AnythingLLM](https://raw.githubusercontent.com/Mintplex-Labs/anything-llm/master/images/wordmark.png)

[AnythingLLM](https://github.com/Mintplex-Labs/anything-llm)

The all-in-one Desktop & Docker AI application with built-in RAG, AI agents, No-code agent builder, MCP compatibility, and more.

**Configuration & Usage**

- **Config vs Secrets:** This chart exposes application configuration via two mechanisms:
  - `config` (in `values.yaml`) — rendered into a `ConfigMap` and injected using `envFrom` in the pod. Do NOT place sensitive values (API keys, secrets) in `config` because `ConfigMap`s are not encrypted.
  - `env` / `envFrom` — the preferred way to inject secrets. Use Kubernetes `Secret` objects and reference them from `env` (with `valueFrom.secretKeyRef`) or `envFrom.secretRef`.

- **Storage & STORAGE_DIR mapping:** The chart creates (or mounts) a `PersistentVolumeClaim` using the `persistentVolume.*` settings. The container mount path is set from `persistentVolume.mountPath`. Ensure the container `STORAGE_DIR` config key matches that path (defaults are set in `values.yaml`).

**Providing API keys & secrets (recommended)**

Use Kubernetes Secrets. Below are example workflows and `values.yaml` snippets.

1) Create a Kubernetes Secret with API keys:

```
kubectl create secret generic openai-secret --from-literal=OPENAI_KEY="sk-..."
# or from a file
# kubectl create secret generic openai-secret --from-file=OPENAI_KEY=/path/to/keyfile
```

2) Reference the Secret from `values.yaml` using `envFrom` (recommended when your secret contains multiple env keys):

```yaml
envFrom:
  - secretRef:
      name: openai-secret
```

This will inject all key/value pairs from the `openai-secret` Secret as environment variables in the container.

3) Or reference a single secret key via `env` (explicit mapping):

```yaml
env:
  - name: OPENAI_KEY
    valueFrom:
      secretKeyRef:
        name: openai-secret
        key: OPENAI_KEY
```

Notes:
- Avoid placing secret values into `config:` (the chart's `ConfigMap`) — `ConfigMap`s are visible to anyone who can read the namespace. Use `Secret` objects for any credentials/tokens.
- If you use a GitOps workflow, consider integrating an external secret operator (ExternalSecrets, SealedSecrets, etc.) so you don't store raw secrets in Git.

**Example `values-secret.yaml` to pass during `helm install`**

```yaml
image:
  repository: mintplexlabs/anythingllm
  tag: "1.8.5"

service:
  type: ClusterIP
  port: 3001

# Reference secret containing API keys
envFrom:
  - secretRef:
      name: openai-secret

# Optionally override other values
persistentVolume:
  size: 16Gi
  mountPath: /storage
```

Install with:

```
helm install my-anythingllm ./anythingllm -f values-secret.yaml
```

**Best practices & tips**

- Use `envFrom` for convenience when many environment variables are stored in a single `Secret` and use `env`/`valueFrom` for explicit single-key mappings.
- Use `kubectl create secret generic` or your secrets management solution. If you need to reference multiple different provider keys (OpenAI, Anthropic, etc.), create a single `Secret` with multiple keys or multiple Secrets and add multiple `envFrom` entries.
- Keep probe paths and `service.port` aligned. If your probes fail after deployment, check that the probe `port` matches the container port (or named port `http`) and that the `path` is valid.
- For storage, if you have a pre-existing PVC set `persistentVolume.existingClaim` to the PVC name; the chart will mount that claim (and will not attempt to create a new PVC).
- For production, provide resource `requests` and `limits` in `values.yaml` to prevent scheduler starvation and to control cost.

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` |  |
| config.DISABLE_TELEMETRY | string | `"true"` |  |
| config.GID | string | `"1000"` |  |
| config.NODE_ENV | string | `"production"` |  |
| config.STORAGE_DIR | string | `"/storage"` |  |
| config.UID | string | `"1000"` |  |
| env | object | `{}` |  |
| envFrom | object | `{}` |  |
| fullnameOverride | string | `""` |  |
| image.pullPolicy | string | `"IfNotPresent"` |  |
| image.repository | string | `"mintplexlabs/anythingllm"` |  |
| image.tag | string | `"1.8.5"` |  |
| imagePullSecrets | list | `[]` |  |
| ingress.annotations | object | `{}` |  |
| ingress.className | string | `""` |  |
| ingress.enabled | bool | `false` |  |
| ingress.hosts[0].host | string | `"chart-example.local"` |  |
| ingress.hosts[0].paths[0].path | string | `"/"` |  |
| ingress.hosts[0].paths[0].pathType | string | `"ImplementationSpecific"` |  |
| ingress.tls | list | `[]` |  |
| initContainers | list | `[]` |  |
| livenessProbe.failureThreshold | int | `3` |  |
| livenessProbe.httpGet.path | string | `"/v1/api/health"` |  |
| livenessProbe.httpGet.port | int | `8888` |  |
| livenessProbe.initialDelaySeconds | int | `15` |  |
| livenessProbe.periodSeconds | int | `5` |  |
| nameOverride | string | `""` |  |
| nodeSelector | object | `{}` |  |
| persistentVolume.accessModes[0] | string | `"ReadWriteOnce"` |  |
| persistentVolume.annotations | object | `{}` |  |
| persistentVolume.existingClaim | string | `""` |  |
| persistentVolume.labels | object | `{}` |  |
| persistentVolume.mountPath | string | `"/storage"` |  |
| persistentVolume.size | string | `"8Gi"` |  |
| podAnnotations | object | `{}` |  |
| podLabels | object | `{}` |  |
| podSecurityContext.fsGroup | int | `1000` |  |
| readinessProbe.httpGet.path | string | `"/v1/api/health"` |  |
| readinessProbe.httpGet.port | int | `8888` |  |
| readinessProbe.initialDelaySeconds | int | `15` |  |
| readinessProbe.periodSeconds | int | `5` |  |
| readinessProbe.successThreshold | int | `2` |  |
| replicaCount | int | `1` |  |
| resources | object | `{}` |  |
| securityContext | object | `{}` |  |
| service.port | int | `3001` |  |
| service.type | string | `"ClusterIP"` |  |
| serviceAccount.annotations | object | `{}` |  |
| serviceAccount.automount | bool | `true` |  |
| serviceAccount.create | bool | `true` |  |
| serviceAccount.name | string | `""` |  |
| tolerations | list | `[]` |  |
| volumeMounts | list | `[]` |  |
| volumes | list | `[]` |  |