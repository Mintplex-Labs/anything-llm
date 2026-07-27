#!/bin/bash
# Non-interactive Fake10 Light theme installer for open-computer VMs (Debian XFCE)
# Designed to run at provision time (no X server / D-Bus required).
# Writes XFCE config XML files directly instead of using xfconf-query.
#
# Run as: su - agent -c '/path/to/apply-noninteractive.sh'
# Or pass REAL_USER env var if running as root.

set -euo pipefail

cd "$(dirname "$0")"

THEME_USER="${REAL_USER:-$(logname 2>/dev/null || echo agent)}"
HOME_DIR="/home/$THEME_USER"
COLOR="0078D7"
BUILD_VERSION="v$(date +%Y.%m.%d.%H%M%S)"

echo "=== Fake10 Light non-interactive install (provision mode) ==="
echo "    User: $THEME_USER  Home: $HOME_DIR"

# ---------- directories ----------
echo "Creating directories..."
mkdir -p "$HOME_DIR/.local/share/fonts"
mkdir -p "$HOME_DIR/.local/bin"
mkdir -p "$HOME_DIR/.local/share/xfce4/terminal/colorschemes"
mkdir -p "$HOME_DIR/.icons"
mkdir -p "$HOME_DIR/.themes"
mkdir -p "$HOME_DIR/.config/autostart"
mkdir -p "$HOME_DIR/.config/gtk-3.0"
mkdir -p "$HOME_DIR/.local/share/mime/packages"
mkdir -p "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml"
mkdir -p "$HOME_DIR/.config/xfce4/panel"
mkdir -p "$HOME_DIR/.local/share/applications"
mkdir -p "$HOME_DIR/Desktop"
mkdir -p "$HOME_DIR/deliverables"
mkdir -p "$HOME_DIR/uploads"

# ---------- theme assets ----------
echo "Copying fonts..."
cp -r ./Fonts/* "$HOME_DIR/.local/share/fonts"

echo "Copying mimes..."
cp -r ./Mimes/* "$HOME_DIR/.local/share/mime/packages/"
update-mime-database "$HOME_DIR/.local/share/mime/" > /dev/null 2>&1 || true

echo "Copying icons..."
cp -r ./Icons/* "$HOME_DIR/.icons"
gtk-update-icon-cache -f -t -q "$HOME_DIR/.icons/Fake10 Light/" 2>/dev/null || true

echo "Copying scripts..."
cp -r ./Scripts/* "$HOME_DIR/.local/bin/"
chmod +x "$HOME_DIR/.local/bin/show-desktop.sh" 2>/dev/null || true
chmod +x "$HOME_DIR/.local/bin/reload-theme.sh" 2>/dev/null || true

echo "Copying themes..."
cp -r ./Terminal/* "$HOME_DIR/.local/share/xfce4/terminal/colorschemes"
cp -r ./Themes/* "$HOME_DIR/.themes"

echo "Setting accent color..."
sed -i "s/0078D7/$COLOR/g" "$HOME_DIR/.themes/Fake10 Light/gtk-3.0/gtk.css"
sed -i "s/0078D7/$COLOR/g" "$HOME_DIR/.themes/Fake10 Light Accent Color/xfwm4/themerc"

# ---------- start menu icon ----------
echo "Installing start menu icon..."
cp ./Icons/start-menu-dark-icon.png /usr/share/pixmaps/start-menu-icon.png 2>/dev/null || true

# ---------- persistent scrollbars ----------
echo "Enabling persistent scroll bars..."
for f in "$HOME_DIR/.bash_profile" "$HOME_DIR/.profile" "$HOME_DIR/.xsessionrc"; do
    touch "$f"
    grep -q "export GTK_OVERLAY_SCROLLING=0" "$f" 2>/dev/null || echo "export GTK_OVERLAY_SCROLLING=0" >> "$f"
done

# ---------- font cache ----------
echo "Rebuilding font cache..."
rm -rf "$HOME_DIR/.cache/fontconfig" "$HOME_DIR/.fontconfig"
fc-cache -r 2>/dev/null || true

# ---------- pixbuf loaders cache ----------
echo "Updating pixbuf loaders cache..."
gdk-pixbuf-query-loaders --update-cache 2>/dev/null || true

# ---------- XFCE config: xsettings ----------
echo "Writing xsettings config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xsettings.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xsettings" version="1.0">
  <property name="Net" type="empty">
    <property name="ThemeName" type="string" value="Fake10 Light"/>
    <property name="IconThemeName" type="string" value="Fake10 Light"/>
  </property>
  <property name="Gtk" type="empty">
    <property name="CursorThemeName" type="string" value="Fake10 Light"/>
    <property name="FontName" type="string" value="Segoe UI 9"/>
    <property name="MonospaceFontName" type="string" value="Consolas 12"/>
    <property name="ButtonImages" type="bool" value="false"/>
    <property name="DialogsUseHeader" type="bool" value="false"/>
  </property>
  <property name="Xft" type="empty">
    <property name="DPI" type="int" value="-1"/>
    <property name="HintStyle" type="string" value="hintfull"/>
    <property name="RGBA" type="string" value="rgb"/>
  </property>
</channel>
EOF

# ---------- XFCE config: xfwm4 ----------
echo "Writing xfwm4 config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfwm4" version="1.0">
  <property name="general" type="empty">
    <property name="theme" type="string" value="Fake10 Light"/>
    <property name="title_font" type="string" value="Segoe UI 9"/>
    <property name="title_alignment" type="string" value="left"/>
    <property name="button_layout" type="string" value="O|HMC"/>
    <property name="show_dock_shadow" type="bool" value="false"/>
    <property name="use_compositing" type="bool" value="false"/>
    <property name="workspace_count" type="int" value="1"/>
  </property>
</channel>
EOF

# ---------- XFCE config: panel ----------
echo "Writing panel config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-panel" version="1.0">
  <property name="configver" type="int" value="2"/>
  <property name="panels" type="array">
    <value type="int" value="1"/>
    <property name="dark-mode" type="bool" value="false"/>
    <property name="panel-1" type="empty">
      <property name="position" type="string" value="p=8;x=0;y=0"/>
      <property name="position-locked" type="bool" value="true"/>
      <property name="size" type="uint" value="40"/>
      <property name="length" type="uint" value="100"/>
      <property name="length-adjust" type="bool" value="false"/>
      <property name="icon-size" type="uint" value="24"/>
      <property name="background-style" type="uint" value="1"/>
      <property name="background-rgba" type="array">
        <value type="double" value="0.933333333333333"/>
        <value type="double" value="0.933333333333333"/>
        <value type="double" value="0.933333333333333"/>
        <value type="double" value="1"/>
      </property>
      <property name="plugin-ids" type="array">
        <value type="int" value="1"/>
        <value type="int" value="8"/>
        <value type="int" value="9"/>
        <value type="int" value="10"/>
        <value type="int" value="2"/>
        <value type="int" value="3"/>
        <value type="int" value="7"/>
        <value type="int" value="6"/>
      </property>
    </property>
  </property>
  <property name="plugins" type="empty">
    <property name="plugin-1" type="string" value="whiskermenu">
      <property name="category-show-name" type="bool" value="false"/>
      <property name="launcher-show-description" type="bool" value="false"/>
      <property name="category-icon-size" type="int" value="0"/>
      <property name="position-categories-alternate" type="bool" value="true"/>
      <property name="position-search-alternate" type="bool" value="true"/>
      <property name="position-commands-alternate" type="bool" value="true"/>
      <property name="profile-shape" type="int" value="2"/>
      <property name="confirm-session-command" type="bool" value="false"/>
      <property name="show-command-settings" type="bool" value="false"/>
      <property name="show-command-lockscreen" type="bool" value="false"/>
      <property name="show-command-shutdown" type="bool" value="true"/>
      <property name="show-command-logout" type="bool" value="false"/>
      <property name="menu-height" type="int" value="640"/>
      <property name="menu-width" type="int" value="392"/>
      <property name="button-icon" type="string" value="/usr/share/pixmaps/start-menu-icon.png"/>
      <property name="favorites" type="array">
        <value type="string" value="chromium.desktop"/>
        <value type="string" value="notepad.desktop"/>
        <value type="string" value="thunar.desktop"/>
        <value type="string" value="xfce4-terminal.desktop"/>
        <value type="string" value="app-store.desktop"/>
        <value type="string" value="memories.desktop"/>
      </property>
    </property>
    <property name="plugin-8" type="string" value="launcher">
      <property name="items" type="array">
        <value type="string" value="chromium.desktop"/>
      </property>
    </property>
    <property name="plugin-9" type="string" value="launcher">
      <property name="items" type="array">
        <value type="string" value="thunar.desktop"/>
      </property>
    </property>
    <property name="plugin-10" type="string" value="launcher">
      <property name="items" type="array">
        <value type="string" value="xfce4-terminal.desktop"/>
      </property>
    </property>
    <property name="plugin-2" type="string" value="tasklist">
      <property name="show-handle" type="bool" value="false"/>
      <property name="sort-order" type="uint" value="4"/>
      <property name="grouping" type="uint" value="1"/>
      <property name="flat-buttons" type="bool" value="true"/>
      <property name="show-labels" type="bool" value="true"/>
    </property>
    <property name="plugin-3" type="string" value="separator">
      <property name="expand" type="bool" value="true"/>
      <property name="style" type="uint" value="0"/>
    </property>
    <property name="plugin-7" type="string" value="clock">
      <property name="digital-time-font" type="string" value="Segoe UI 9"/>
      <property name="digital-date-font" type="string" value="Segoe UI 9"/>
      <property name="digital-layout" type="uint" value="3"/>
      <property name="digital-time-format" type="string" value="&lt;span foreground=&apos;#777777&apos;&gt;__BUILD_VERSION__&lt;/span&gt;"/>
      <property name="digital-date-format" type="string" value=""/>
      <property name="tooltip-format" type="string" value="__BUILD_VERSION__"/>
    </property>
    <property name="plugin-6" type="string" value="clock">
      <property name="digital-time-font" type="string" value="Segoe UI 9"/>
      <property name="digital-date-font" type="string" value="Segoe UI 9"/>
      <property name="digital-layout" type="uint" value="3"/>
      <property name="digital-time-format" type="string" value="%I:%M %p"/>
      <property name="digital-date-format" type="string" value=""/>
    </property>
  </property>
</channel>
EOF

echo "Stamping build version: $BUILD_VERSION"
sed -i "s/__BUILD_VERSION__/$BUILD_VERSION/g" "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml"

# ---------- panel launcher .desktop files ----------
mkdir -p "$HOME_DIR/.config/xfce4/panel/launcher-9"
cat > "$HOME_DIR/.config/xfce4/panel/launcher-9/thunar.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Files
Exec=thunar
Icon=system-file-manager
DESK

mkdir -p "$HOME_DIR/.config/xfce4/panel/launcher-10"
cat > "$HOME_DIR/.config/xfce4/panel/launcher-10/xfce4-terminal.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Terminal
Exec=xfce4-terminal
Icon=utilities-terminal
DESK

mkdir -p "$HOME_DIR/.config/xfce4/panel/launcher-8"
cat > "$HOME_DIR/.config/xfce4/panel/launcher-8/chromium.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Chromium
Exec=chromium --disable-session-crashed-bubble %U
Icon=web-browser
DESK

# ---------- XFCE config: keyboard shortcuts ----------
echo "Writing keyboard shortcuts..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-keyboard-shortcuts" version="1.0">
  <property name="commands" type="empty">
    <property name="custom" type="empty">
      <property name="Super_L" type="string" value="xfce4-popup-whiskermenu"/>
      <property name="Super_R" type="string" value="xfce4-popup-whiskermenu"/>
    </property>
  </property>
</channel>
EOF

# ---------- XFCE config: notifications ----------
echo "Writing notification config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-notifyd.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-notifyd" version="1.0">
  <property name="do-fadeout" type="bool" value="false"/>
  <property name="do-slideout" type="bool" value="true"/>
  <property name="theme" type="string" value="Fake10 Light"/>
  <property name="notify-location" type="uint" value="3"/>
  <property name="initial-opacity" type="double" value="1.0"/>
</channel>
EOF

# ---------- XFCE config: desktop ----------
echo "Writing desktop config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-desktop.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-desktop" version="1.0">
  <property name="desktop-icons" type="empty">
    <property name="file-icons" type="empty">
      <property name="show-home" type="bool" value="false"/>
      <property name="show-filesystem" type="bool" value="false"/>
      <property name="show-removable" type="bool" value="false"/>
    </property>
    <property name="icon-size" type="int" value="48"/>
  </property>
  <property name="backdrop" type="empty">
    <property name="screen0" type="empty">
      <property name="monitorVirtual-1" type="empty">
        <property name="workspace0" type="empty">
          <property name="last-image" type="string" value="/usr/share/pixmaps/open-computer-background.png"/>
          <property name="image-style" type="int" value="5"/>
          <property name="color-style" type="int" value="0"/>
        </property>
      </property>
    </property>
  </property>
</channel>
EOF

# ---------- XFCE config: terminal ----------
echo "Writing terminal config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-terminal.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-terminal" version="1.0">
  <property name="title-initial" type="string" value="Command Prompt"/>
  <property name="title-mode" type="string" value="TERMINAL_TITLE_HIDE"/>
  <property name="misc-cursor-shape" type="string" value="TERMINAL_CURSOR_SHAPE_UNDERLINE"/>
  <property name="misc-cursor-blinks" type="bool" value="true"/>
  <property name="font-name" type="string" value="Consolas 11"/>
  <property name="font-allow-bold" type="bool" value="false"/>
  <property name="misc-menubar-default" type="bool" value="false"/>
  <property name="color-foreground" type="string" value="#CCCCCC"/>
  <property name="color-background" type="string" value="#0C0C0C"/>
  <property name="color-palette" type="string" value="#0C0C0C;#C50F1F;#13A10E;#C19C00;#0037DA;#881798;#3A96DD;#CCCCCC;#767676;#E74856;#16C60C;#F9F1A5;#3B78FF;#B4009E;#61D6D6;#F2F2F2"/>
</channel>
EOF

# ---------- XFCE config: thunar ----------
echo "Writing Thunar config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/thunar.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="thunar" version="1.0">
  <property name="shortcuts-icon-size" type="string" value="THUNAR_ICON_SIZE_16"/>
  <property name="last-toolbar-items" type="string" value="back:1,forward:1,open-parent:1,location-bar:1,search:1"/>
  <property name="last-location-bar" type="string" value="ThunarLocationButtons"/>
</channel>
EOF

# ---------- XFCE config: screensaver ----------
echo "Writing screensaver config..."
cat > "$HOME_DIR/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-screensaver.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-screensaver" version="1.0">
  <property name="lock" type="empty">
    <property name="user-switching" type="empty">
      <property name="enabled" type="bool" value="false"/>
    </property>
  </property>
</channel>
EOF

# ---------- autostart ----------
echo "Setting up autostart..."
rm -f "$HOME_DIR/.config/autostart/set-wallpaper.desktop"

cat > "$HOME_DIR/.config/autostart/reload-theme.desktop" << EOF
[Desktop Entry]
Type=Application
Exec=$HOME_DIR/.local/bin/reload-theme.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=Fake10 Reload Theme on Logon
Comment=Fixes taskbar issues
EOF

cat > "$HOME_DIR/.config/autostart/xfce4-panel-restart.desktop" << 'EOF'
[Desktop Entry]
Type=Application
Name=Panel Restart
Exec=sh -c "sleep 5; pgrep -x xfce4-panel >/dev/null || xfce4-panel >/dev/null 2>&1"
X-GNOME-Autostart-enabled=true
EOF

# ---------- desktop shortcuts ----------
echo "Creating desktop shortcuts..."
cat > "$HOME_DIR/Desktop/my-computer.desktop" << DESK
[Desktop Entry]
Type=Application
Name=My Computer
Exec=thunar $HOME_DIR
Icon=computer
DESK
chmod +x "$HOME_DIR/Desktop/my-computer.desktop"

cat > "$HOME_DIR/Desktop/deliverables.desktop" << DESK
[Desktop Entry]
Type=Application
Name=Deliverables
Exec=thunar $HOME_DIR/deliverables
Icon=folder-documents
DESK
chmod +x "$HOME_DIR/Desktop/deliverables.desktop"

cat > "$HOME_DIR/Desktop/uploads.desktop" << DESK
[Desktop Entry]
Type=Application
Name=Uploads
Exec=thunar $HOME_DIR/uploads
Icon=folder-download
DESK
chmod +x "$HOME_DIR/Desktop/uploads.desktop"

cat > "$HOME_DIR/Desktop/memories.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Memories
GenericName=Agent Memory Manager
Exec=chromium --app=http://localhost:8090 --window-size=520,640 --user-data-dir=/home/agent/.config/memory-manager-chromium --no-first-run --disable-sync --disable-extensions --disable-background-networking --disable-default-apps --disable-session-crashed-bubble --disable-infobars
Icon=preferences-system
Categories=Settings;
StartupWMClass=chromium-browser
DESK
chmod +x "$HOME_DIR/Desktop/memories.desktop"

cat > "$HOME_DIR/Desktop/app-store.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=App Store
GenericName=Software Store
Comment=Browse and install applications from Flathub
Exec=gnome-software
Icon=app-store
Categories=System;PackageManager;
DESK
chmod +x "$HOME_DIR/Desktop/app-store.desktop"

cat > "$HOME_DIR/Desktop/fix-panel.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Fix Panel
Exec=sh -c "pkill -x xfce4-panel; sleep 1; xfce4-panel >/dev/null 2>&1 &"
Icon=text-x-script
DESK
chmod +x "$HOME_DIR/Desktop/fix-panel.desktop"

# ---------- desktop icon positions ----------
echo "Setting desktop icon positions..."
mkdir -p "$HOME_DIR/.config/xfce4/desktop"
cat > "$HOME_DIR/.config/xfce4/desktop/icons.screen0.yaml" << 'EOF'
configs:
- level: 0
  monitors:
  - id: "abfb9c8813957ba56a06ac1f0133da569ae08c54"
    display_name: "Red Hat, Inc. QEMU Monitor (Virtual-1)"
    geometry:
      x: 0
      y: 0
      width: 1280
      height: 800
  icons:
    "/home/agent/Desktop/my-computer.desktop":
      row: 0
      col: 0
    "/home/agent/Desktop/deliverables.desktop":
      row: 1
      col: 0
    "/home/agent/Desktop/uploads.desktop":
      row: 1
      col: 1
    "/home/agent/Desktop/memories.desktop":
      row: 0
      col: 1
    "/home/agent/Desktop/app-store.desktop":
      row: 0
      col: 2
    "/home/agent/Desktop/fix-panel.desktop":
      row: 6
      col: 11
EOF

# ---------- hide/rename default XFCE .desktop entries ----------
echo "Customizing default application entries..."

cat > "$HOME_DIR/.local/share/applications/xfce4-terminal.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Terminal
GenericName=Terminal Emulator
Exec=xfce4-terminal
Icon=utilities-terminal
Categories=System;TerminalEmulator;
DESK

cat > "$HOME_DIR/.local/share/applications/exo-mail-reader.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Mail Reader
NoDisplay=true
DESK

cat > "$HOME_DIR/.local/share/applications/xfce4-web-browser.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Web Browser
NoDisplay=true
DESK

# ---------- Notepad (mousepad) .desktop ----------
echo "Configuring Notepad (mousepad) desktop entry..."
cat > "$HOME_DIR/.local/share/applications/notepad.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Notepad
GenericName=Text Editor
Exec=mousepad %F
Icon=accessories-text-editor
MimeType=text/plain;text/css;text/html;text/x-python;application/javascript;application/json;application/xml;
Categories=Utility;TextEditor;
DESK

# ---------- Memories app .desktop ----------
cat > "$HOME_DIR/.local/share/applications/memories.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Memories
GenericName=Agent Memory Manager
Exec=chromium --app=http://localhost:8090 --window-size=520,640 --user-data-dir=/home/agent/.config/memory-manager-chromium --no-first-run --disable-sync --disable-extensions --disable-background-networking --disable-default-apps --disable-session-crashed-bubble --disable-infobars
Icon=preferences-system
Categories=Settings;
StartupWMClass=chromium-browser
DESK

# ---------- App Store .desktop ----------
cat > "$HOME_DIR/.local/share/applications/app-store.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=App Store
GenericName=Software Store
Comment=Browse and install applications from Flathub
Exec=gnome-software
Icon=app-store
Categories=System;PackageManager;
DESK

# ---------- Chromium default bookmarks & favicons ----------
echo "Setting Chromium default bookmarks..."
mkdir -p "$HOME_DIR/.config/chromium/Default"
cat > "$HOME_DIR/.config/chromium/Default/Bookmarks" << 'BOOKMARKS'
{
   "checksum": "",
   "roots": {
      "bookmark_bar": {
         "children": [
            {
               "name": "AnythingLLM",
               "type": "url",
               "url": "https://anythingllm.com"
            },
            {
               "name": "Star on Github",
               "type": "url",
               "url": "https://github.com/Mintplex-Labs/anything-llm"
            },
            {
               "name": "Agent Computer Docs",
               "type": "url",
               "url": "https://docs.anythingllm.com/features/agent-computers"
            }
         ],
         "name": "Bookmarks bar",
         "type": "folder"
      },
      "other": {
         "children": [],
         "name": "Other bookmarks",
         "type": "folder"
      },
      "synced": {
         "children": [],
         "name": "Mobile bookmarks",
         "type": "folder"
      }
   },
   "version": 1
}
BOOKMARKS

echo "Creating Chromium favicon database..."
FAVICON_DB="$HOME_DIR/.config/chromium/Default/Favicons"
rm -f "$FAVICON_DB"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FAV_DIR="$SCRIPT_DIR/../favicons"

sqlite3 "$FAVICON_DB" <<'SQL'
CREATE TABLE IF NOT EXISTS meta(key LONGVARCHAR NOT NULL UNIQUE PRIMARY KEY, value LONGVARCHAR);
INSERT OR REPLACE INTO meta VALUES('version','8');
INSERT OR REPLACE INTO meta VALUES('last_compatible_version','5');
CREATE TABLE IF NOT EXISTS favicons(id INTEGER PRIMARY KEY, url LONGVARCHAR NOT NULL, icon_type INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS favicon_bitmaps(id INTEGER PRIMARY KEY, icon_id INTEGER NOT NULL, last_updated INTEGER DEFAULT 0, image_data BLOB, width INTEGER DEFAULT 0, height INTEGER DEFAULT 0, last_requested INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS icon_mapping(id INTEGER PRIMARY KEY, page_url LONGVARCHAR NOT NULL, icon_id INTEGER);
CREATE INDEX IF NOT EXISTS favicons_url ON favicons(url);
CREATE INDEX IF NOT EXISTS icon_mapping_page_url_idx ON icon_mapping(page_url);
SQL

sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO favicons(id,url,icon_type) VALUES(1,'https://anythingllm.com/',1);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO favicons(id,url,icon_type) VALUES(2,'https://github.com/',1);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO favicons(id,url,icon_type) VALUES(3,'https://docs.anythingllm.com/',1);"

sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO favicon_bitmaps(id,icon_id,last_updated,image_data,width,height) VALUES(1,1,$(date +%s),readfile('$FAV_DIR/anythingllm.png'),16,16);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO favicon_bitmaps(id,icon_id,last_updated,image_data,width,height) VALUES(2,2,$(date +%s),readfile('$FAV_DIR/github.png'),16,16);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO favicon_bitmaps(id,icon_id,last_updated,image_data,width,height) VALUES(3,3,$(date +%s),readfile('$FAV_DIR/anythingllm.png'),16,16);"

sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO icon_mapping(id,page_url,icon_id) VALUES(1,'https://anythingllm.com/',1);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO icon_mapping(id,page_url,icon_id) VALUES(2,'https://anythingllm.com',1);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO icon_mapping(id,page_url,icon_id) VALUES(3,'https://github.com/Mintplex-Labs/anything-llm',2);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO icon_mapping(id,page_url,icon_id) VALUES(4,'https://github.com/Mintplex-Labs/anything-llm/',2);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO icon_mapping(id,page_url,icon_id) VALUES(5,'https://docs.anythingllm.com/features/agent-computers',3);"
sqlite3 "$FAVICON_DB" "INSERT OR REPLACE INTO icon_mapping(id,page_url,icon_id) VALUES(6,'https://docs.anythingllm.com/features/agent-computers/',3);"

# ---------- Chromium .desktop with CDP and Chrome icon ----------
echo "Configuring Chromium desktop entry..."
cat > "$HOME_DIR/.local/share/applications/chromium.desktop" << 'DESK'
[Desktop Entry]
Type=Application
Name=Chromium
GenericName=Web Browser
Exec=chromium --remote-debugging-port=9222 --disable-session-crashed-bubble %U
Icon=google-chrome
MimeType=text/html;text/xml;application/xhtml+xml;
Categories=Network;WebBrowser;
DESK

# ---------- fix ownership ----------
echo "Fixing ownership..."
chown -R "$THEME_USER:$THEME_USER" "$HOME_DIR/.local" "$HOME_DIR/.config" "$HOME_DIR/.icons" "$HOME_DIR/.themes" "$HOME_DIR/.bash_profile" "$HOME_DIR/.profile" "$HOME_DIR/.xsessionrc" "$HOME_DIR/Desktop" "$HOME_DIR/deliverables" "$HOME_DIR/uploads"

echo ""
echo "=== Fake10 Light theme applied (provision mode)! ==="
echo "Theme will be active on first login."
exit 0
