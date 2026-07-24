#!/bin/bash
#
# Provision a minimal Debian ARM64 VM with:
#   - XFCE desktop
#   - Chromium with CDP (remote debugging)
#   - Python 3 + Node.js 22
#   - pi.dev coding agent + custom extensions
#
# Run as root inside the VM.

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Try: su -c '/tmp/provision.sh'"
    exit 1
fi

export DEBIAN_FRONTEND=noninteractive
export PATH="/usr/sbin:/usr/local/sbin:/sbin:$PATH"

log() { echo "==> $*"; }

# ---------- bootstrap sudo + passwordless agent ----------
REAL_USER="${REAL_USER:-$(logname 2>/dev/null || echo "agent")}"

log "Installing sudo and making system passwordless"
apt-get update
apt-get install -y sudo
usermod -aG sudo "$REAL_USER"
echo "$REAL_USER ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$REAL_USER"
chmod 440 "/etc/sudoers.d/$REAL_USER"

passwd -d "$REAL_USER"
passwd -d root

mkdir -p /etc/pam.d
sed -i 's/^auth.*pam_unix.so.*/auth sufficient pam_permit.so/' /etc/pam.d/login 2>/dev/null || true
sed -i 's/^auth.*pam_unix.so.*/auth sufficient pam_permit.so/' /etc/pam.d/su 2>/dev/null || true

log "Configuring passwordless SSH"
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/^#*PermitEmptyPasswords.*/PermitEmptyPasswords yes/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/pam_unix.so/pam_unix.so nullok/' /etc/pam.d/common-auth 2>/dev/null || true
sed -i 's/pam_unix.so/pam_unix.so nullok/' /etc/pam.d/sshd 2>/dev/null || true
systemctl restart sshd 2>/dev/null || true

# ---------- system update ----------
log "Updating system packages"
apt-get update
apt-get upgrade -y

# ---------- XFCE desktop ----------
log "Installing XFCE desktop (minimal)"
apt-get install -y --no-install-recommends \
    xfce4 \
    xfce4-terminal \
    xfce4-whiskermenu-plugin \
    mousepad \
    lightdm \
    lightdm-gtk-greeter \
    dbus-x11 \
    xorg \
    fonts-dejavu-core

systemctl set-default graphical.target
systemctl enable lightdm

# ---------- Chromium ----------
log "Installing Chromium"
apt-get install -y --no-install-recommends chromium

# ---------- core dev tools ----------
log "Installing core dev tools"
apt-get install -y --no-install-recommends \
    build-essential \
    git \
    curl \
    wget \
    unzip \
    jq \
    htop \
    tmux \
    vim \
    openssh-server \
    ca-certificates \
    gnupg \
    lsb-release \
    sqlite3

# ---------- Python ----------
log "Installing Python"
apt-get install -y --no-install-recommends python3 python3-pip python3-venv
ln -sf /usr/bin/python3 /usr/local/bin/python

# ---------- Node.js 22 via NodeSource ----------
log "Installing Node.js 22"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y --no-install-recommends nodejs

# ---------- curl wrapper (HTML→Markdown interception) ----------
log "Installing curl wrapper"
cp /tmp/curl-wrapper.sh /usr/local/bin/curl
chmod 755 /usr/local/bin/curl

# ---------- PDF generation ----------
log "Installing PDF tools"
apt-get install -y --no-install-recommends pandoc weasyprint

# ---------- Python pip packages ----------
log "Installing Python packages"
pip3 install --break-system-packages --no-cache-dir requests beautifulsoup4 Pillow openpyxl

# ---------- X11 tools ----------
log "Installing X11 automation tools"
apt-get install -y --no-install-recommends \
    wmctrl \
    xdotool \
    x11-utils \
    xclip \
    xdg-utils

# ---------- AT-SPI accessibility (desktop app automation) ----------
log "Installing AT-SPI accessibility tools"
apt-get install -y --no-install-recommends \
    at-spi2-core \
    libatk-adaptor \
    python3-pyatspi \
    gir1.2-atspi-2.0

# ---------- Flatpak + Flathub ----------
log "Installing Flatpak with Flathub app store"
apt-get install -y --no-install-recommends flatpak gnome-software-plugin-flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# ---------- pi.dev coding agent ----------
log "Installing pi.dev coding agent"
npm install -g --ignore-scripts @earendil-works/pi-coding-agent

# ---------- pi-hermes-memory (persistent memory across sessions) ----------
log "Installing pi-hermes-memory extension"
su - "$REAL_USER" -c "pi install npm:pi-hermes-memory"

PI_AGENT_DIR="/home/$REAL_USER/.pi/agent"
mkdir -p "$PI_AGENT_DIR"
cat > "$PI_AGENT_DIR/hermes-memory-config.json" <<'EOF'
{
  "memoryMode": "policy-only",
  "memoryPolicyStyle": "full",
  "reviewEnabled": true,
  "nudgeInterval": 10,
  "nudgeToolCalls": 15,
  "correctionDetection": true,
  "autoConsolidate": true,
  "flushOnShutdown": true
}
EOF
chown -R "$REAL_USER:$REAL_USER" "$PI_AGENT_DIR"

# NOTE: pi-computer-use and pi-browser-cdp-extension are NOT installed.
# We use custom extensions in /opt/open-computer/extensions/ instead:
#   browser-cdp.ts  — our own CDP tool that evaluates JS directly in the page context
#   open-browser.ts — launches Chromium on the visible desktop
#   ask-user.ts     — prompts the user for input via the UI

# ---------- Chromium CDP (remote debugging) ----------
CDP_PORT=9222
log "Configuring Chromium to launch with CDP on port $CDP_PORT"

mkdir -p /etc/chromium.d
cat > /etc/chromium.d/cdp-flags <<EOF
export CHROMIUM_FLAGS="\$CHROMIUM_FLAGS --remote-debugging-port=$CDP_PORT --disable-session-crashed-bubble"
EOF

# ---------- timezone ----------
log "Setting timezone to America/Los_Angeles"
ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime
echo "America/Los_Angeles" > /etc/timezone

# ---------- a11y CLI tools (desktop app automation for pi agent) ----------
log "Installing a11y CLI tools"
install -m 755 /tmp/a11y-harvest.py /usr/local/bin/a11y-harvest
install -m 755 /tmp/a11y-action.py /usr/local/bin/a11y-action

# Enable AT-SPI accessibility bridge globally so all GTK apps expose their a11y tree
log "Enabling AT-SPI accessibility bridge"
for f in "/home/$REAL_USER/.bash_profile" "/home/$REAL_USER/.profile" "/home/$REAL_USER/.xsessionrc"; do
    touch "$f"
    grep -q "GTK_MODULES.*atk-bridge" "$f" 2>/dev/null || echo "export GTK_MODULES=gail:atk-bridge" >> "$f"
    grep -q "NO_AT_BRIDGE" "$f" 2>/dev/null || echo "export NO_AT_BRIDGE=0" >> "$f"
done
chown "$REAL_USER:$REAL_USER" "/home/$REAL_USER/.bash_profile" "/home/$REAL_USER/.profile" "/home/$REAL_USER/.xsessionrc"

# ---------- win10 theme ----------
log "Applying win10 theme"
REAL_USER="$REAL_USER" bash /tmp/win10/apply-noninteractive.sh

# Install wallpaper to a path outside /opt/open-computer so it survives the dev 9p mount.
# Must be world-readable so the agent user (running XFCE) can access it.
if [ -f /tmp/win10/background.png ]; then
    cp /tmp/win10/background.png /usr/share/pixmaps/open-computer-background.png
    chmod 644 /usr/share/pixmaps/open-computer-background.png
fi

# ---------- auto-login (optional, for kiosk-style use) ----------
log "Configuring LightDM auto-login for $REAL_USER"
mkdir -p /etc/lightdm/lightdm.conf.d
cat > /etc/lightdm/lightdm.conf.d/50-autologin.conf <<EOF
[Seat:*]
autologin-user=$REAL_USER
autologin-user-timeout=0
EOF

# ---------- VNC + noVNC streaming stack ----------
log "Installing x11vnc, noVNC, and websockify"
apt-get install -y x11vnc novnc websockify

log "Creating systemd service: x11vnc"
cat > /etc/systemd/system/x11vnc.service <<'EOF'
[Unit]
Description=x11vnc VNC server
After=lightdm.service
Requires=lightdm.service

[Service]
Type=simple
ExecStartPre=/bin/sh -c 'while [ ! -e /tmp/.X11-unix/X0 ]; do sleep 0.5; done; sleep 2'
ExecStart=/usr/bin/x11vnc -display :0 -forever -shared -nopw -rfbport 5900 -localhost -auth /var/run/lightdm/root/:0
Restart=always
RestartSec=3

[Install]
WantedBy=graphical.target
EOF

log "Creating systemd service: novnc (websockify)"
cat > /etc/systemd/system/novnc.service <<'EOF'
[Unit]
Description=noVNC WebSocket proxy
After=x11vnc.service
Requires=x11vnc.service

[Service]
Type=simple
ExecStart=/usr/bin/websockify --web /usr/share/novnc 6080 localhost:5900
Restart=always
RestartSec=3

[Install]
WantedBy=graphical.target
EOF

log "Creating systemd service: open-computer-mount (9p dev mount, silently skipped in prod)"
cat > /etc/systemd/system/open-computer-mount.service <<'EOF'
[Unit]
Description=Mount 9p open-computer service directory (dev mode)
DefaultDependencies=no
After=local-fs.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/sh -c 'mount -t 9p -o trans=virtio,version=9p2000.L,msize=104857600 open-computer_service /opt/open-computer 2>/dev/null; true'

[Install]
WantedBy=multi-user.target
EOF

log "Creating systemd service: open-computer"
cat > /etc/systemd/system/open-computer.service <<'EOF'
[Unit]
Description=open-computer orchestration service
After=novnc.service open-computer-mount.service
Wants=novnc.service open-computer-mount.service

[Service]
Type=simple
User=agent
WorkingDirectory=/opt/open-computer
ExecStart=/opt/open-computer/start-service.sh
Restart=always
RestartSec=3
Environment=HOME=/home/agent
Environment=PORT=8080

[Install]
WantedBy=graphical.target
EOF

log "Creating systemd service: memory-manager"
cat > /etc/systemd/system/memory-manager.service <<'EOF'
[Unit]
Description=Memory Manager Web UI
After=network.target

[Service]
Type=simple
User=agent
WorkingDirectory=/opt/open-computer/memory-manager
ExecStart=/opt/open-computer/memory-manager/start.sh
Restart=always
RestartSec=3
Environment=HOME=/home/agent
Environment=PORT=8090

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable open-computer-mount open-computer memory-manager

# ---------- mount point for service directory ----------
log "Creating /opt/open-computer mount point"
mkdir -p /opt/open-computer

# ---------- nodemon for dev auto-reload (skip in production builds) ----------
log "Installing nodemon globally"
npm install -g nodemon

# ---------- agent home directories ----------
log "Creating agent directories"
su - "$REAL_USER" -c 'mkdir -p ~/deliverables ~/logs'

# ---------- log hygiene (cron + journald cap) ----------
log "Configuring log rotation"

# Cap systemd journal at 50 MB
mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/size-limit.conf <<'JEOF'
[Journal]
SystemMaxUse=50M
RuntimeMaxUse=50M
JEOF

# Cron: delete per-session trace logs older than 3 hours, vacuum journal daily
cat > /etc/cron.d/open-computer-log-hygiene <<'CEOF'
# Delete session trace logs older than 3 hours (runs every 15 minutes)
*/15 * * * * root find /home/agent/logs -name "*.jsonl" -mmin +180 -delete 2>/dev/null
# Vacuum journal daily
30 3 * * * root journalctl --vacuum-size=50M >/dev/null 2>&1
# Weekly fstrim so qcow2 can be compacted
0 4 * * 0 root fstrim -a >/dev/null 2>&1
CEOF
chmod 644 /etc/cron.d/open-computer-log-hygiene

# ---------- cleanup ----------
log "Cleaning up"
apt-get autoremove -y
apt-get clean
rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*
rm -rf /usr/share/doc/* /usr/share/man/* /usr/share/info/*
rm -rf /usr/share/locale/* /usr/share/i18n/locales/*
rm -rf /usr/share/icons/Adwaita 2>/dev/null || true
rm -rf /usr/share/backgrounds/* 2>/dev/null || true
rm -rf /usr/lib/python3*/test /usr/lib/python3*/__pycache__
rm -rf /tmp/* /var/tmp/*
rm -rf /var/log/*.log /var/log/apt/*
pip3 cache purge 2>/dev/null || true
npm cache clean --force 2>/dev/null || true
find /usr/share/chromium -name "*.pak" ! -name "en-US.pak" ! -name "resources.pak" ! -name "chrome_100_percent.pak" ! -name "chrome_200_percent.pak" -delete 2>/dev/null || true

log "Provision complete! Reboot to start the XFCE desktop."
log "  Run 'sudo reboot' then reconnect via open-computer up/ssh/vnc."
