#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_IMAGE_DIR="$PROJECT_DIR/master/base_image"

BASE_IMAGE_DATE="06_08_2026"
BASE_URL="${OPEN_COMPUTER_BASE_IMAGE_URL:-https://cdn.anythingllm.com/support/open-computer/base-images/${BASE_IMAGE_DATE}}"

# ── Detect platform / arch ────────────────────────────────────────────────────

OS="$(uname -s)"
ARCH_RAW="$(uname -m)"

case "$ARCH_RAW" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="x64" ;;
  *) echo "Error: unsupported architecture '$ARCH_RAW'" >&2; exit 1 ;;
esac

TAR_NAME="${ARCH}-base-image.tar"
TAR_URL="${BASE_URL}/${TAR_NAME}"
SHA_NAME="${TAR_NAME}.sha256"
SHA_URL="${BASE_URL}/${SHA_NAME}"

mkdir -p "$BASE_IMAGE_DIR"

# ── Check for existing files ──────────────────────────────────────────────────

EXISTING_FILES=()
for f in "$BASE_IMAGE_DIR/base.qcow2" "$BASE_IMAGE_DIR/efi-vars.fd"; do
  [ -f "$f" ] && EXISTING_FILES+=("$(basename "$f")")
done

if [ ${#EXISTING_FILES[@]} -gt 0 ]; then
  echo "Existing base image files found: ${EXISTING_FILES[*]}"
  echo ""
  read -r -p "Delete existing files and re-download the base image for ${ARCH}? [y/N] " REPLY
  echo ""
  case "$REPLY" in
    [yY][eE][sS]|[yY])
      echo "Removing existing base image files..."
      rm -f "$BASE_IMAGE_DIR/base.qcow2" "$BASE_IMAGE_DIR/efi-vars.fd"
      ;;
    *)
      echo "Skipping download. Existing base image kept."
      exit 0
      ;;
  esac
else
  echo "No base image found for ${ARCH}."
  echo ""
  read -r -p "Download ${TAR_NAME} (~2.3 GB)? [Y/n] " REPLY
  echo ""
  case "$REPLY" in
    [nN][oO]|[nN])
      echo "Skipping download."
      exit 0
      ;;
  esac
fi

# ── Download ──────────────────────────────────────────────────────────────────

TAR_PATH="$BASE_IMAGE_DIR/$TAR_NAME"
SHA_PATH="$BASE_IMAGE_DIR/$SHA_NAME"

echo "Fetching checksum from ${SHA_URL} ..."
curl -fL --progress-bar -o "$SHA_PATH" "$SHA_URL"

echo "Downloading ${TAR_URL} ..."
curl -fL --progress-bar -o "$TAR_PATH" "$TAR_URL"

# ── Verify ────────────────────────────────────────────────────────────────────

echo "Verifying checksum..."
(cd "$BASE_IMAGE_DIR" && shasum -a 256 -c "$SHA_NAME")
echo "Checksum verified."

# ── Extract ───────────────────────────────────────────────────────────────────

echo "Extracting..."
tar -xf "$TAR_PATH" -C "$BASE_IMAGE_DIR"

rm -f "$TAR_PATH" "$SHA_PATH"

echo ""
echo "Base image ready:"
echo "  $BASE_IMAGE_DIR/base.qcow2"
echo "  $BASE_IMAGE_DIR/efi-vars.fd"
