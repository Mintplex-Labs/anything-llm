#/bin/bash
if xprop -root _NET_SHOWING_DESKTOP | grep -E "= 1"; then 
	wmctrl -k off
else 
	wmctrl -k on
fi