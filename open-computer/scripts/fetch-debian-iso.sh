#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VM_DIR="$PROJECT_DIR/master/iso"

DEBIAN_VERSION="13.5.0"
BASE_URL="https://debian.osuosl.org/debian-cdimage/${DEBIAN_VERSION}"

# Determine architecture
ARCH="${1:-}"
if [ -z "$ARCH" ]; then
  HOST_ARCH="$(uname -m)"
  case "$HOST_ARCH" in
    x86_64|amd64)   ARCH="amd64" ;;
    arm64|aarch64)   ARCH="arm64" ;;
    *) echo "Error: cannot auto-detect arch from '$HOST_ARCH'; pass arm64 or amd64 as argument" >&2; exit 1 ;;
  esac
  echo "Auto-detected architecture: $ARCH"
fi

case "$ARCH" in
  arm64|amd64) ;;
  *) echo "Error: unsupported architecture '$ARCH' (use arm64 or amd64)" >&2; exit 1 ;;
esac

ISO_NAME="debian-${DEBIAN_VERSION}-${ARCH}-netinst.iso"
ISO_URL="${BASE_URL}/${ARCH}/iso-cd/${ISO_NAME}"
ISO_PATH="$VM_DIR/$ISO_NAME"
SHA_PATH="$VM_DIR/$ISO_NAME.sha256"

mkdir -p "$VM_DIR"

if [ -f "$SHA_PATH" ]; then
  echo "SHA256 file exists: $SHA_PATH"

  if [ -f "$ISO_PATH" ]; then
    echo "ISO already exists, verifying checksum..."
    if (cd "$VM_DIR" && shasum -a 256 -c "$ISO_NAME.sha256"); then
      echo "ISO is valid, nothing to do."
      exit 0
    else
      echo "Checksum mismatch — re-downloading."
      rm -f "$ISO_PATH"
    fi
  fi

  echo "Downloading $ISO_URL ..."
  curl -L --progress-bar -o "$ISO_PATH" "$ISO_URL"

  echo "Verifying downloaded ISO against existing checksum..."
  (cd "$VM_DIR" && shasum -a 256 -c "$ISO_NAME.sha256")
  echo "Download verified."
else
  if [ -f "$ISO_PATH" ]; then
    echo "ISO exists but no SHA256 file — generating checksum..."
  else
    echo "Downloading $ISO_URL ..."
    curl -L --progress-bar -o "$ISO_PATH" "$ISO_URL"
  fi

  echo "Generating SHA256 checksum..."
  (cd "$VM_DIR" && shasum -a 256 "$ISO_NAME" > "$ISO_NAME.sha256")
  echo "Wrote $SHA_PATH"
  echo "Commit this file to version control: $SHA_PATH"
fi
