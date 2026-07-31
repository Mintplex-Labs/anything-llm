#!/bin/bash
xfce4-terminal --minimize &                                             # initialize docklike plugin if installed unobtrusively
CURRENT_THEME=$(xfconf-query -c xsettings -p /Net/ThemeName)
xfconf-query -c xsettings -p /Net/ThemeName -s "Adwaita-dark"           # trigger docklike update
sleep 3
xfconf-query -c xsettings -p /Net/ThemeName -s "$CURRENT_THEME"         # fix unreliable start menu category alignment
sleep 3
if pgrep -x xfce4-panel >/dev/null; then
	xfce4-panel -r
else
	xfce4-panel >/dev/null 2>&1 &
	sleep 2
fi
sleep 3
if grep -q "value=\"tasklist\"" ~/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml; then
	xfconf-query -c xsettings -p /Net/ThemeName -s "Adwaita-dark"   # make window buttons realize text length restrictions
	sleep 3
	xfconf-query -c xsettings -p /Net/ThemeName -s "$CURRENT_THEME" # set back to my beautiful theme
	sleep 3
fi
pkill xfce4-terminal                                                    # clean up