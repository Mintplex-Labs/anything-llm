#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WHITELIST_FILE="$SCRIPT_DIR/legacy-colors-whitelist.txt"

PATTERN='(bg|text|border)-(gray|slate|zinc|stone|neutral|white|black)-|#[0-9a-fA-F]{3,6}'

IGNORE_ARGS=()

# Build ignore arguments from whitelist file if it exists
if [[ -f "$WHITELIST_FILE" ]]; then
  while IFS= read -r line; do
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    IGNORE_ARGS+=("--glob" "!$line")
  done < "$WHITELIST_FILE"
fi

# Search for legacy color usage
if rg "${IGNORE_ARGS[@]}" -n "$PATTERN" "$ROOT_DIR"/frontend/src; then
  echo "\nLegacy color usage detected. See lines above." >&2
  exit 1
fi

exit 0
