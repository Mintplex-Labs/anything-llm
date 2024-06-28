#!/bin/sh
# This script installs AnythingLLMDesktop on Linux.
# Due to READ_ONLY issues on regular mounting of an AppImage
# we need to download the file then unpack it so it can be run.

[ "$(uname -s)" = "Linux" ] || error 'This script is intended to run on Linux only.'
if [ "$(id -u)" -eq 0 ]; then
    echo "This script should not be run as root. Please run it as a regular user."
    exit 1
fi

set -eu
status() { echo ">>> $*" >&2; }

APPIMAGE_URL="https://s3.us-west-1.amazonaws.com/public.useanything.com/latest/AnythingLLMDesktop.AppImage"
APPIMAGE_FILE="AnythingLLMDesktop.AppImage"
EXTRACTED_DIR="anythingllm-desktop"
COMMAND_NAME="anything-llm"
OUTDIR="$HOME/AnythingLLMDesktop"

rm -rf $OUTDIR
mkdir -p $OUTDIR

status "Downloading latest AnythingLLM Desktop..."
curl --fail --show-error --location --progress-bar -o $OUTDIR/$APPIMAGE_FILE $APPIMAGE_URL

cd $OUTDIR
chmod +x $APPIMAGE_FILE;
status "Extracting..."
./$APPIMAGE_FILE --appimage-extract >/dev/null;
rm -rf $APPIMAGE_FILE
mv squashfs-root $EXTRACTED_DIR
ln -sf $EXTRACTED_DIR/AppRun start

status "AnythingLLMDesktop is ready to run with .$OUTDIR/start."
status "\e[36mHeads up!\e[0mYou can rerun this installer anytime to get the latest version of AnythingLLM without effecting your existing data."
status "Documentation: https://docs.useanything.com"
status "Issues: https://github.com/Mintplex-Labs/anything-llm"
status "\e[36mThanks for using AnythingLLM!\e[0m "