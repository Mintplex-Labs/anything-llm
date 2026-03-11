#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${LOCAL_DEV_REPO_URL:-git@github.com:AndreasRamsli/lovora.git}"
CLONE_DIR=""
FORCE_INSTALL="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --clone-dir)
      CLONE_DIR="${2:-}"
      shift 2
      ;;
    --repo-url)
      REPO_URL="${2:-}"
      shift 2
      ;;
    --force-install)
      FORCE_INSTALL="true"
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "Usage: $0 [--clone-dir /path/to/checkout] [--repo-url git@github.com:AndreasRamsli/lovora.git] [--force-install]" >&2
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRENT_REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_REPO_DIR="${CURRENT_REPO_DIR}"

if [[ -n "${CLONE_DIR}" ]]; then
  TARGET_REPO_DIR="$(cd "$(dirname "${CLONE_DIR}")" && pwd)/$(basename "${CLONE_DIR}")"
  if [[ ! -d "${TARGET_REPO_DIR}/.git" ]]; then
    mkdir -p "$(dirname "${TARGET_REPO_DIR}")"
    git clone "${REPO_URL}" "${TARGET_REPO_DIR}"
  fi
fi

cd "${TARGET_REPO_DIR}"

for cmd in git node yarn; do
  if [[ "${cmd}" == "yarn" ]]; then
    continue
  fi
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Missing required command: ${cmd}" >&2
    exit 1
  fi
done

run_yarn() {
  if command -v yarn >/dev/null 2>&1; then
    yarn "$@"
    return
  fi

  if command -v corepack >/dev/null 2>&1; then
    corepack yarn "$@"
    return
  fi

  echo "Missing required command: yarn (or corepack)" >&2
  exit 1
}

ensure_install() {
  local dir="$1"
  if [[ "${FORCE_INSTALL}" == "true" || ! -d "${dir}/node_modules" ]]; then
    echo "[local-dev-setup] Installing dependencies in ${dir}"
    (cd "${dir}" && run_yarn install --network-timeout 100000)
  else
    echo "[local-dev-setup] Dependencies already installed in ${dir}"
  fi
}

ensure_file() {
  local src="$1"
  local dest="$2"
  if [[ ! -f "${dest}" ]]; then
    cp "${src}" "${dest}"
  fi
}

upsert_env() {
  local file="$1"
  local key="$2"
  local value="$3"

  if grep -q "^${key}=" "${file}" 2>/dev/null; then
    perl -0pi -e "s|^${key}=.*$|${key}=${value}|m" "${file}"
  else
    printf "\n%s=%s\n" "${key}" "${value}" >> "${file}"
  fi
}

set_env_default() {
  local file="$1"
  local key="$2"
  local value="$3"

  if ! grep -q "^${key}=" "${file}" 2>/dev/null; then
    printf "\n%s=%s\n" "${key}" "${value}" >> "${file}"
  fi
}

generate_secret() {
  python - <<'PY'
import secrets
print(secrets.token_urlsafe(32))
PY
}

ensure_install "${TARGET_REPO_DIR}"
ensure_install "${TARGET_REPO_DIR}/server"
ensure_install "${TARGET_REPO_DIR}/frontend"
ensure_install "${TARGET_REPO_DIR}/collector"

ensure_file "${TARGET_REPO_DIR}/server/.env.example" "${TARGET_REPO_DIR}/server/.env.development"
ensure_file "${TARGET_REPO_DIR}/collector/.env.example" "${TARGET_REPO_DIR}/collector/.env.development"
ensure_file "${TARGET_REPO_DIR}/frontend/.env.example" "${TARGET_REPO_DIR}/frontend/.env"

mkdir -p "${TARGET_REPO_DIR}/.local-storage"
mkdir -p "${TARGET_REPO_DIR}/.local-dev/logs"

SERVER_ENV="${TARGET_REPO_DIR}/server/.env.development"
COLLECTOR_ENV="${TARGET_REPO_DIR}/collector/.env.development"
FRONTEND_ENV="${TARGET_REPO_DIR}/frontend/.env"
STORAGE_DIR="${TARGET_REPO_DIR}/.local-storage"

upsert_env "${SERVER_ENV}" "SERVER_PORT" "3001"
upsert_env "${SERVER_ENV}" "COLLECTOR_PORT" "8888"
upsert_env "${SERVER_ENV}" "STORAGE_DIR" "\"${STORAGE_DIR}\""
set_env_default "${SERVER_ENV}" "JWT_SECRET" "\"$(generate_secret)\""
set_env_default "${SERVER_ENV}" "SIG_KEY" "\"$(generate_secret)\""
set_env_default "${SERVER_ENV}" "SIG_SALT" "\"$(generate_secret)\""
upsert_env "${SERVER_ENV}" "DISABLE_TELEMETRY" "\"true\""
upsert_env "${SERVER_ENV}" "COLLECTOR_ALLOW_ANY_IP" "\"true\""
upsert_env "${SERVER_ENV}" "ENABLE_HTTP_LOGGER" "\"true\""

upsert_env "${COLLECTOR_ENV}" "STORAGE_DIR" "\"${STORAGE_DIR}\""
upsert_env "${COLLECTOR_ENV}" "ENABLE_HTTP_LOGGER" "\"true\""

upsert_env "${FRONTEND_ENV}" "VITE_API_BASE" "'http://localhost:3001/api'"

for passthrough in \
  LLM_PROVIDER OPEN_AI_KEY OPEN_MODEL_PREF OPENROUTER_API_KEY OPENROUTER_MODEL_PREF \
  AGENT_SERPER_DEV_KEY AGENT_TAVILY_API_KEY EMBEDDING_ENGINE EMBEDDING_MODEL_PREF \
  GEMINI_API_KEY ANTHROPIC_API_KEY; do
  if [[ -n "${!passthrough:-}" ]]; then
    upsert_env "${SERVER_ENV}" "${passthrough}" "\"${!passthrough}\""
  fi
done

echo "[local-dev-setup] Running Prisma generate + migrate deploy"
(cd "${TARGET_REPO_DIR}/server" && npx prisma generate --schema=./prisma/schema.prisma && npx prisma migrate deploy --schema=./prisma/schema.prisma)

cat <<EOF
[local-dev-setup] Complete.
Repo: ${TARGET_REPO_DIR}
Server env: ${SERVER_ENV}
Collector env: ${COLLECTOR_ENV}
Frontend env: ${FRONTEND_ENV}

If chat models are not configured yet, add your provider keys to:
  ${SERVER_ENV}

Start everything with:
  cd ${TARGET_REPO_DIR} && yarn local:start
EOF
