#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
RELAI_DIR="$ROOT_DIR/.relai"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "RELAI simulator dependency install requires $1, but it was not found on PATH." >&2
    exit 1
  fi
}

# BEGIN RELAI CLI SDK INSTALL - do not edit
read_relai_config_value() {
  local section="$1"
  local key="$2"
  local config_path="$ROOT_DIR/.relai/config.toml"
  if [ ! -f "$config_path" ]; then
    echo "missing RELAI config at $config_path" >&2
    exit 1
  fi
  awk -v section="$section" -v key="$key" -v path="$config_path" '
    BEGIN { in_section = 0; found = 0 }
    /^[[:space:]]*\[/ {
      in_section = ($0 ~ "^[[:space:]]*\\[" section "\\][[:space:]]*$")
      next
    }
    in_section && $0 ~ "^[[:space:]]*" key "[[:space:]]*=" {
      value = $0
      sub(/^[^=]*=[[:space:]]*/, "", value)
      sub(/[[:space:]]*(#.*)?$/, "", value)
      if (value ~ /^".*"$/) {
        sub(/^"/, "", value)
        sub(/"$/, "", value)
      }
      if (value != "") {
        print value
        found = 1
        exit
      }
    }
    END {
      if (!found) {
        printf "missing %s.%s in %s\n", section, key, path > "/dev/stderr"
        exit 1
      }
    }
  ' "$config_path"
}

read_optional_relai_config_value() {
  local section="$1"
  local key="$2"
  local config_path="$ROOT_DIR/.relai/config.toml"
  if [ ! -f "$config_path" ]; then
    return 0
  fi
  awk -v section="$section" -v key="$key" '
    BEGIN { in_section = 0 }
    /^[[:space:]]*\[/ {
      in_section = ($0 ~ "^[[:space:]]*\\[" section "\\][[:space:]]*$")
      next
    }
    in_section && $0 ~ "^[[:space:]]*" key "[[:space:]]*=" {
      value = $0
      sub(/^[^=]*=[[:space:]]*/, "", value)
      sub(/[[:space:]]*(#.*)?$/, "", value)
      if (value ~ /^".*"$/) {
        sub(/^"/, "", value)
        sub(/"$/, "", value)
      }
      print value
      exit
    }
  ' "$config_path"
}

resolve_relai_typescript_sdk_registry_url() {
  RELAI_API_URL="$(read_relai_config_value api url)"
  printf '%s/npm/\n' "${RELAI_API_URL%/}"
}

resolve_relai_typescript_sdk_version() {
  require_command curl
  require_command jq
  RELAI_API_URL="$(read_relai_config_value api url)"
  RELAI_API_KEY="$(read_relai_config_value api key)"
  RELAI_CLI_VERSION="0.1.40"
  local metadata
  local sdk_version
  metadata="$(curl -fsSL \
    -H "Authorization: Token ${RELAI_API_KEY}" \
    -H "X-RELAI-CLI-Version: ${RELAI_CLI_VERSION}" \
    "${RELAI_API_URL%/}/api/v1/agent-studio/sdk/compatibility/typescript/?cli_version=${RELAI_CLI_VERSION}")"
  sdk_version="$(printf '%s' "$metadata" | jq -r '.sdk_version // empty')"
  if [ -z "$sdk_version" ]; then
    echo "RELAI TypeScript SDK compatibility metadata must include sdk_version." >&2
    exit 1
  fi
  printf '%s\n' "$sdk_version"
}

relai_typescript_sdk_local_path_configured() {
  [ -n "${RELAI_SDK_LOCAL_PATH:-$(read_optional_relai_config_value local relai_sdk_path)}" ]
}

resolve_relai_typescript_sdk_local_path() {
  RELAI_SDK_LOCAL_PATH="${RELAI_SDK_LOCAL_PATH:-$(read_optional_relai_config_value local relai_sdk_path)}"
  if [ -z "$RELAI_SDK_LOCAL_PATH" ]; then
    return 1
  fi
  if [ ! -f "$RELAI_SDK_LOCAL_PATH/package.json" ]; then
    echo "local RELAI TypeScript SDK package.json not found at $RELAI_SDK_LOCAL_PATH/package.json" >&2
    exit 1
  fi
  node - "$RELAI_SDK_LOCAL_PATH/package.json" <<'JS'
const fs = require("node:fs");

const path = process.argv[2];
const packageJson = JSON.parse(fs.readFileSync(path, "utf8"));
if (packageJson.name !== "@relai-ai/relai") {
  throw new Error(`local RELAI TypeScript SDK package.json name must be @relai-ai/relai: ${path}`);
}
JS
  printf '%s\n' "$RELAI_SDK_LOCAL_PATH"
}

ensure_relai_typescript_sdk_local_build() {
  local sdk_dir="$1"
  require_command npm
  (
    cd "$sdk_dir"
    if [ ! -d "node_modules" ]; then
      if [ -f "package-lock.json" ]; then
        npm ci
      else
        npm install
      fi
    fi
    if [ ! -f "dist/index.js" ]; then
      npm run build
    fi
  )
  if [ ! -f "$sdk_dir/dist/index.js" ]; then
    echo "local RELAI TypeScript SDK build output not found at $sdk_dir/dist/index.js" >&2
    exit 1
  fi
}

resolve_existing_relai_typescript_sdk_file_dependency() {
  local project_dir="${1:-$ROOT_DIR}"
  if [ ! -f "$project_dir/package.json" ]; then
    return 1
  fi
  node - "$project_dir/package.json" "$project_dir" <<'JS'
const fs = require("node:fs");
const path = require("node:path");

const packageJsonPath = process.argv[2];
const projectDir = process.argv[3];
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const spec =
  packageJson.dependencies?.["@relai-ai/relai"] ??
  packageJson.devDependencies?.["@relai-ai/relai"];
if (!spec || !spec.startsWith("file:")) {
  process.exit(1);
}
const sdkDir = path.resolve(projectDir, spec.slice("file:".length));
if (!fs.existsSync(path.join(sdkDir, "package.json"))) {
  process.exit(1);
}
const sdkPackageJson = JSON.parse(
  fs.readFileSync(path.join(sdkDir, "package.json"), "utf8"),
);
if (sdkPackageJson.name !== "@relai-ai/relai") {
  process.exit(1);
}
console.log(sdkDir);
JS
}

relai_npm_auth_scope() {
  local registry_url="${1%/}/"
  case "$registry_url" in
    https://*) registry_url="${registry_url#https://}" ;;
    http://*) registry_url="${registry_url#http://}" ;;
  esac
  printf '//%s\n' "$registry_url"
}

configure_relai_typescript_sdk_registry_auth() {
  local project_dir="${1:-$ROOT_DIR}"
  local npmrc_path="$project_dir/.npmrc"
  local registry_url
  local auth_scope
  local tmp_path
  local start_marker="# BEGIN RELAI TYPESCRIPT SDK REGISTRY - managed by relai"
  local end_marker="# END RELAI TYPESCRIPT SDK REGISTRY - managed by relai"
  RELAI_API_KEY="$(read_relai_config_value api key)"
  registry_url="$(resolve_relai_typescript_sdk_registry_url)"
  auth_scope="$(relai_npm_auth_scope "$registry_url")"
  tmp_path="${npmrc_path}.relai-tmp"

  if [ -f "$npmrc_path" ]; then
    awk -v start="$start_marker" -v end="$end_marker" '
      $0 == start { skip = 1; next }
      $0 == end { skip = 0; next }
      skip != 1 { print }
    ' "$npmrc_path" > "$tmp_path"
  else
    : > "$tmp_path"
  fi

  {
    printf '%s\n' "$start_marker"
    printf '@relai-ai:registry=%s\n' "$registry_url"
    printf '%s:_authToken=%s\n' "$auth_scope" "$RELAI_API_KEY"
    printf '%s:always-auth=true\n' "$auth_scope"
    printf '%s\n' "$end_marker"
  } >> "$tmp_path"
  mv "$tmp_path" "$npmrc_path"
}

detect_relai_typescript_package_manager() {
  local project_dir="${1:-$ROOT_DIR}"
  if [ -f "$project_dir/bun.lockb" ] || [ -f "$project_dir/bun.lock" ]; then
    printf 'bun\n'
  elif [ -f "$project_dir/pnpm-lock.yaml" ]; then
    printf 'pnpm\n'
  elif [ -f "$project_dir/yarn.lock" ]; then
    printf 'yarn\n'
  else
    printf 'npm\n'
  fi
}

package_manager_add() {
  local project_dir="$1"
  local dev_flag="$2"
  local package_spec="$3"
  local manager="${RELAI_TYPESCRIPT_PACKAGE_MANAGER:-$(detect_relai_typescript_package_manager "$project_dir")}"
  (
    cd "$project_dir"
    case "$manager" in
      bun)
        require_command bun
        if [ "$dev_flag" = "dev" ]; then
          bun add --dev "$package_spec"
        else
          bun add "$package_spec"
        fi
        ;;
      pnpm)
        require_command pnpm
        if [ "$dev_flag" = "dev" ]; then
          pnpm add --save-dev "$package_spec"
        else
          pnpm add "$package_spec"
        fi
        ;;
      yarn)
        require_command yarn
        if [ "$dev_flag" = "dev" ]; then
          yarn add --dev "$package_spec"
        else
          yarn add "$package_spec"
        fi
        ;;
      npm)
        require_command npm
        if [ "$dev_flag" = "dev" ]; then
          npm install --save-dev "$package_spec"
        else
          npm install --save "$package_spec"
        fi
        ;;
      *)
        echo "Unsupported TypeScript package manager '$manager'. Expected npm, pnpm, yarn, or bun." >&2
        exit 1
        ;;
    esac
  )
}

install_relai_typescript_sdk() {
  local project_dir="${1:-$ROOT_DIR}"
  local sdk_spec="@relai-ai/relai"
  local existing_file_sdk_path
  if [ ! -f "$project_dir/package.json" ]; then
    echo "RELAI TypeScript SDK install requires package.json in $project_dir." >&2
    exit 1
  fi
  if relai_typescript_sdk_local_path_configured; then
    sdk_spec="$(resolve_relai_typescript_sdk_local_path)"
    ensure_relai_typescript_sdk_local_build "$sdk_spec"
  elif existing_file_sdk_path="$(resolve_existing_relai_typescript_sdk_file_dependency "$project_dir")"; then
    ensure_relai_typescript_sdk_local_build "$existing_file_sdk_path"
    sdk_spec="$existing_file_sdk_path"
  else
    configure_relai_typescript_sdk_registry_auth "$project_dir"
    sdk_spec="@relai-ai/relai@$(resolve_relai_typescript_sdk_version)"
  fi
  package_manager_add "$project_dir" prod "$sdk_spec"
}

ensure_relai_typescript_runner() {
  local project_dir="${1:-$ROOT_DIR}"
  if [ -x "$project_dir/node_modules/.bin/tsx" ]; then
    return
  fi
  package_manager_add "$project_dir" dev tsx
}

# END RELAI CLI SDK INSTALL

require_command node

if [ ! -f "$RELAI_DIR/package.json" ]; then
  echo "RELAI TypeScript simulator install requires package.json in $RELAI_DIR." >&2
  exit 1
fi

# BEGIN RELAI CLI SDK INSTALL - do not edit
install_relai_typescript_sdk "$RELAI_DIR"
ensure_relai_typescript_runner "$RELAI_DIR"
# END RELAI CLI SDK INSTALL

# BEGIN RELAI CLI ROOT PROJECT INSTALL - do not edit
install_root_typescript_dependencies() {
  if [ ! -f "$ROOT_DIR/package.json" ]; then
    return
  fi

  local manager
  manager="$(detect_relai_typescript_package_manager "$ROOT_DIR")"
  echo "Installing root TypeScript project dependencies with $manager..." >&2
  (
    cd "$ROOT_DIR"
    case "$manager" in
      bun)
        require_command bun
        if [ -f "bun.lock" ] || [ -f "bun.lockb" ]; then
          bun install --frozen-lockfile
        else
          bun install
        fi
        ;;
      pnpm)
        require_command pnpm
        if [ -f "pnpm-lock.yaml" ]; then
          pnpm install --frozen-lockfile
        else
          pnpm install
        fi
        ;;
      yarn)
        require_command yarn
        if [ -f ".yarnrc.yml" ]; then
          yarn install --immutable
        elif [ -f "yarn.lock" ]; then
          yarn install --frozen-lockfile
        else
          yarn install
        fi
        ;;
      npm)
        require_command npm
        if [ -f "package-lock.json" ] || [ -f "npm-shrinkwrap.json" ]; then
          npm ci
        else
          npm install
        fi
        ;;
      *)
        echo "Unsupported TypeScript package manager '$manager'. Expected npm, pnpm, yarn, or bun." >&2
        exit 1
        ;;
    esac
  )
}

run_root_typescript_build() {
  if ! node - "$ROOT_DIR/package.json" <<'JS'
const fs = require("node:fs");
const path = process.argv[2];
if (!fs.existsSync(path)) {
  process.exit(1);
}
const packageJson = JSON.parse(fs.readFileSync(path, "utf8"));
const build = packageJson.scripts?.build;
process.exit(typeof build === "string" && build.trim() ? 0 : 1);
JS
  then
    return
  fi

  local manager
  manager="$(detect_relai_typescript_package_manager "$ROOT_DIR")"
  echo "Building root TypeScript project with $manager..." >&2
  (
    cd "$ROOT_DIR"
    case "$manager" in
      bun)
        require_command bun
        bun run build
        ;;
      pnpm)
        require_command pnpm
        pnpm run build
        ;;
      yarn)
        require_command yarn
        yarn run build
        ;;
      npm)
        require_command npm
        npm run build
        ;;
      *)
        echo "Unsupported TypeScript package manager '$manager'. Expected npm, pnpm, yarn, or bun." >&2
        exit 1
        ;;
    esac
  )
}

install_root_typescript_dependencies
# END RELAI CLI ROOT PROJECT INSTALL

# BEGIN PROJECT DEPENDENCY INSTALL
# No extra setup: the CLI installs the root Yarn dependencies, including server.
# END PROJECT DEPENDENCY INSTALL

# BEGIN RELAI CLI ROOT PROJECT BUILD - do not edit
run_root_typescript_build
# END RELAI CLI ROOT PROJECT BUILD
