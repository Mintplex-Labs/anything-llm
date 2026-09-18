#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
RELAI_DIR="$ROOT_DIR/.relai"
TSX_BIN="$RELAI_DIR/node_modules/.bin/tsx"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "RELAI simulator dependency check requires $1, but it was not found on PATH." >&2
    exit 1
  fi
}

require_command node

if [ ! -f "$RELAI_DIR/package.json" ]; then
  echo "RELAI TypeScript simulator requires package.json in $RELAI_DIR." >&2
  exit 1
fi

if [ ! -x "$TSX_BIN" ]; then
  echo "Simulator TypeScript runner is missing. Run .relai/simulator/install.sh" >&2
  exit 1
fi

if node - "$ROOT_DIR/package.json" <<'JS'
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
  if [ ! -f "$ROOT_DIR/dist/index.js" ]; then
    echo "Root TypeScript build output is missing. Run .relai/simulator/install.sh" >&2
    exit 1
  fi
  if [ -d "$ROOT_DIR/src" ] && find "$ROOT_DIR/src" -type f -name '*.ts' -newer "$ROOT_DIR/dist/index.js" | grep -q .; then
    echo "Root TypeScript source is newer than build output. Run .relai/simulator/install.sh" >&2
    exit 1
  fi
fi

(
  cd "$RELAI_DIR"
  node --input-type=module -e "await import('@relai-ai/relai')"
  node --input-type=module -e "const { buildOpenAIAgent } = await import('@relai-ai/relai'); await buildOpenAIAgent({ name: 'RELAI dependency check', instructions: 'Validate SDK runtime dependencies.' });"
)

(
  cd "$ROOT_DIR"
  "$TSX_BIN" -e "import('./.relai/simulator/src/relai_simulator/runner.ts').catch((error) => { console.error(error); process.exit(1); })"
)
