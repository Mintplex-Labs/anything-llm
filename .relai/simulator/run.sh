#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SIM_DIR="$ROOT_DIR/.relai/simulator"
RELAI_DIR="$ROOT_DIR/.relai"
TSX_BIN="$RELAI_DIR/node_modules/.bin/tsx"
LEARNING_ENV=""
RESULT_JSON=""

while [ "$#" -gt 0 ]; do
  case "$1" in
    --learning-env)
      LEARNING_ENV="${2:-}"
      shift 2
      ;;
    --result-json)
      RESULT_JSON="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

if [ -z "$LEARNING_ENV" ]; then
  echo "Usage: .relai/simulator/run.sh --learning-env <learning-env-path>" >&2
  exit 2
fi

if [ ! -x "$TSX_BIN" ]; then
  echo "Simulator TypeScript runner is missing. Run .relai/simulator/install.sh" >&2
  exit 1
fi

if [ -n "$RESULT_JSON" ]; then
  mkdir -p "$(dirname "$RESULT_JSON")"
fi

cmd=(
  "$TSX_BIN"
  "$SIM_DIR/src/relai_simulator/runner.ts"
  --project-root
  "$ROOT_DIR"
  --learning-env
  "$LEARNING_ENV"
)

if [ -n "$RESULT_JSON" ]; then
  cmd+=(--result-json "$RESULT_JSON")
fi

(
  cd "$ROOT_DIR"
  "${cmd[@]}"
)
