#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_IMAGE_DIR="$PROJECT_DIR/master/base_image"

# ── Detect platform / arch ────────────────────────────────────────────────────

ARCH_RAW="${1:-$(uname -m)}"

case "$ARCH_RAW" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="x64" ;;
  *) echo "Error: unsupported architecture '$ARCH_RAW' (pass arm64 or x64 as argument)" >&2; exit 1 ;;
esac

TAR_NAME="${ARCH}-base-image.tar"
SHA_NAME="${TAR_NAME}.sha256"
TAR_PATH="$BASE_IMAGE_DIR/$TAR_NAME"
SHA_PATH="$BASE_IMAGE_DIR/$SHA_NAME"

# ── Validate source files ─────────────────────────────────────────────────────

MISSING=()
for f in base.qcow2 efi-vars.fd; do
  [ -f "$BASE_IMAGE_DIR/$f" ] || MISSING+=("$f")
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "Error: missing required files in master/base_image/: ${MISSING[*]}" >&2
  exit 1
fi

# ── Bundle ────────────────────────────────────────────────────────────────────

echo "Bundling ${TAR_NAME} ..."
echo "  + base.qcow2  ($(du -sh "$BASE_IMAGE_DIR/base.qcow2"   | cut -f1))"
echo "  + efi-vars.fd ($(du -sh "$BASE_IMAGE_DIR/efi-vars.fd"  | cut -f1))"
echo ""

tar -cf "$TAR_PATH" -C "$BASE_IMAGE_DIR" base.qcow2 efi-vars.fd

echo "Computing SHA256 ..."
shasum -a 256 "$TAR_PATH" | awk '{print $1 "  '"$TAR_NAME"'"}' > "$SHA_PATH"

TAR_SIZE="$(du -sh "$TAR_PATH" | cut -f1)"
SHA_HASH="$(cut -d' ' -f1 "$SHA_PATH")"

echo ""
echo "Done!"
echo ""
echo "  Archive : $TAR_PATH  ($TAR_SIZE)"
echo "  SHA256  : $SHA_PATH"
echo "  Hash    : $SHA_HASH"
echo ""
echo "Upload both files to:"
echo "  https://cdn.anythingllm.com/support/open-computer/base-images/<DATE>/$TAR_NAME"
echo "  https://cdn.anythingllm.com/support/open-computer/base-images/<DATE>/$SHA_NAME"
