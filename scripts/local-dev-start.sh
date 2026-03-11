#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_DIR}"

if command -v yarn >/dev/null 2>&1; then
  YARN_CMD="yarn"
elif command -v corepack >/dev/null 2>&1; then
  YARN_CMD="corepack yarn"
else
  echo "Missing required command: yarn (or corepack)" >&2
  exit 1
fi

for path in \
  "server/.env.development" \
  "collector/.env.development" \
  "frontend/.env"; do
  if [[ ! -f "${path}" ]]; then
    echo "Missing ${path}. Run: yarn local:setup" >&2
    exit 1
  fi
done

if [[ ! -d node_modules ]]; then
  echo "Missing root node_modules. Run: yarn local:setup" >&2
  exit 1
fi

mkdir -p .local-dev/logs

exec npx concurrently \
  --names server,frontend,collector \
  --prefix-colors blue,magenta,green \
  --kill-others-on-fail \
  "cd server && ${YARN_CMD} dev" \
  "cd frontend && ${YARN_CMD} dev" \
  "cd collector && ${YARN_CMD} dev"
