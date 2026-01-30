#!/bin/sh
# This script installs AnythingLLMDesktop on Linux.
# On systems with AppArmor enabled, the AppImage needs to also create a userspace
# apparmor profile so that the AppImage can be run without SUID requirements due to root chromium ownership.
#
# Todo: Detect the current location of the AppImage so that we can update the application
# in-place without the user needed to manually move the application to the new location.
# This is also useful so that the apparmor location is always correct if the user edits it.
set -eu

status() { echo "$*" >&2; }
error() { echo "ERROR $*"; exit 1; }
warning() { echo "WARNING: $*"; }

# Create an AppArmor profile for AnythingLLMDesktop for systems with AppArmor enabled
# https://askubuntu.com/questions/1512287/obsidian-appimage-the-suid-sandbox-helper-binary-was-found-but-is-not-configu/1528215#1528215
create_apparmor_profile() {
    status "Checking for sudo privileges..."
    sudo -v
    if [ $? -ne 0 ]; then
        error "Failed to get sudo privileges! Aborting..."
        exit 1
    fi
    status "Creating AppArmor profile for AnythingLLM..."
    APP_ARMOR_CONTENT=$(cat <<EOF
# This profile is used specifically for AnythingLLMDesktop application
# If you move the application to a different location, you will need to edit this profile.
abi <abi/4.0>,
include <tunables/global>

# Use wildcard to allow the AppImage to be in any location on system across all users.
profile anythingllmdesktop /**/AnythingLLMDesktop.AppImage flags=(unconfined) {
  userns,
}
EOF
)
    echo "$APP_ARMOR_CONTENT" | sudo tee /etc/apparmor.d/anythingllmdesktop > /dev/null
    status "Reloading AppArmor service..."
    sudo systemctl reload apparmor.service
    status "AppArmor profile created - you can now run AnythingLLMDesktop without SUID requirements."
}

check_to_create_apparmor_profile() {
    # Check if the system has AppArmor enabled
    if [ -f /sys/kernel/security/apparmor/profiles ]; then
        if ! [ -f /etc/apparmor.d/anythingllmdesktop ]; then
            status "AppArmor is enabled on this system."
            status "\e[31m[Warning]\e[0m You will get an error about SUID permission issues when running the AppImage without creating an AppArmor profile."
            status "This requires sudo privileges. If you are unsure, you can create an AppArmor profile manually."
            read -p "Do you want to auto-create an AppArmor profile for AnythingLLM now? (y/n): " create_apparmor
            if [ "$create_apparmor" = "y" ]; then
                create_apparmor_profile
            else
                status "AppArmor is enabled on this system."
                status "AppArmor profile creation skipped. You may not be able to run AnythingLLMDesktop without it."
            fi
        else
            status "AppArmor profile already exists."
            read -p "Do you want to overwrite it with the latest version? (y/n): " overwrite_apparmor
            if [ "$overwrite_apparmor" = "y" ]; then
                create_apparmor_profile
            fi
        fi
    else
        status "AppArmor could not be automatically detected or does not exist. If you get an SUID error on startup, you may need to create an AppArmor profile for AnythingLLMDesktop.AppImage manually."
    fi  
}

check_or_create_desktop_profile() {
    if ! [ -f $HOME/.local/share/applications/anythingllmdesktop.desktop ]; then
        status "Desktop profile not found. Creating..."

        # Default Exec command
        EXEC_CMD="$INSTALL_DIR/AnythingLLMDesktop.AppImage"

        # Check for Wayland + KDE specifically
        # We check XDG_SESSION_TYPE for "wayland"
        # We check XDG_CURRENT_DESKTOP for "KDE" (handles "KDE", "KDE-Plasma", etc)
        # We use ':-' to safely handle unbound variables in 'set -u' mode
        if [ "${XDG_SESSION_TYPE:-}" = "wayland" ]; then
            case "${XDG_CURRENT_DESKTOP:-}" in
                *"KDE"*)
                    status "Detected KDE Plasma on Wayland. Adding specific flags for IME support."
                    EXEC_CMD="$INSTALL_DIR/AnythingLLMDesktop.AppImage --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime"
                    ;;
            esac
        fi

        DESKTOP_CONTENT=$(cat <<EOF
[Desktop Entry]
StartupWMClass=anythingllm-desktop
Type=Application
Name=AnythingLLM Desktop
Exec=$EXEC_CMD
Icon=$HOME/.config/anythingllm-desktop/storage/icon.png
Categories=Utility;
EOF
)
        mkdir -p $HOME/.local/share/applications
        echo "$DESKTOP_CONTENT" | tee $HOME/.local/share/applications/anythingllmdesktop.desktop > /dev/null
        status "Desktop profile created!"
    fi
}

arch=$(uname -m)
[ "$(uname -s)" = "Linux" ] || error 'This script is intended to run on Linux only.'
if [ "$(id -u)" -eq 0 ]; then
    status "This script should not be run as root. Please run it as a regular user."
    exit 1
fi

# Allow custom installation directory via ANYTHING_LLM_INSTALL_DIR environment variable
# Defaults to $HOME if not set
INSTALL_DIR="${ANYTHING_LLM_INSTALL_DIR:-$HOME}"

status "#########################################################"
status " Welcome to the AnythingLLM Desktop Installer"
status " by Mintplex Labs Inc (team@mintplexlabs.com)"
status " Architecture: $arch"
status " Install Directory: $INSTALL_DIR"
status "#########################################################"

if [ "$arch" = "arm64" ] || [ "$arch" = "aarch64" ]; then
    APPIMAGE_URL="https://cdn.anythingllm.com/latest/AnythingLLMDesktop-Arm64.AppImage"
else
    APPIMAGE_URL="https://cdn.anythingllm.com/latest/AnythingLLMDesktop.AppImage"
fi
APPIMAGE_FILE="AnythingLLMDesktop.AppImage"

status "Downloading latest AnythingLLM Desktop ($APPIMAGE_URL)"
mkdir -p "$INSTALL_DIR"
curl --fail --show-error --location --progress-bar -o "$INSTALL_DIR/$APPIMAGE_FILE" $APPIMAGE_URL
chmod +x "$INSTALL_DIR/$APPIMAGE_FILE";

status "AnythingLLM Desktop is ready to run!"
status "$INSTALL_DIR/$APPIMAGE_FILE to start AnythingLLMDesktop"
status "\e[36mHeads up!\e[0m You can rerun this installer anytime to get the latest version of AnythingLLM without effecting your existing data."
status "Documentation: https://docs.anythingllm.com"
status "Issues: https://github.com/Mintplex-Labs/anything-llm"
status "\e[36mThanks for using AnythingLLM!\e[0m\n\n"

status "Next, we will create a desktop profile and AppArmor profile for AnythingLLMDesktop."
status "This is required for the AppImage to be able to run without SUID requirements."
status "You can manually create these profiles if you prefer."

check_or_create_desktop_profile
check_to_create_apparmor_profile

read -p "Do you want to start AnythingLLMDesktop now? (y/n): " start
if [ "$start" = "y" ]; then
    "$INSTALL_DIR/$APPIMAGE_FILE"
fi