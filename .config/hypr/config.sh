#!/usr/bin/env bash

killall -q swayidle &
killall -q xsettingd &
killall -q swaync &
killall -q kdeconnectd &
killall -q waybar &
killall -q python &
killall -q getupdates-serv &
killall -q foot &
killall -q nm-applet &
killall -q kdeconnect-indicator &
killall -q xdg-desktop-portal-wlr &
killall -q xdg-desktop-portal &

wait

# password manager
eval $(gnome-keyring-daemon --start -c pkcs11,secrets)
export SSH_AUTH_SOCK

# foot server
foot -s &

# Adaptive wallpaper
python ~/.config/sway/scripts/wallpaper.py &

# kdeconnectd
/usr/lib/kdeconnectd &

# notifiaction deamon
swaync &

# start update notifer server
~/.config/waybar/scipts/getupdates-server.sh &

# waybar
~/var/build/Waybar/build/waybar --config ~/.config/waybar/config.Hypr &
kdeconnect-indicator &
nm-applet --indicator &

# Automatic locking
swayidle -w \
	timeout 300 'gtklock -d -s ~/.config/gtklock/style.css' \
	timeout 600 'swaymsg "output * dpms off"' \
		resume 'swaymsg "output * dpms on"' \
	before-sleep 'gtklock -d -s ~/.config/gtklock/style.css' &

/usr/lib/xdg-desktop-portal-wlr &
sleep 4
/usr/lib/xdg-desktop-portal &

systemctl --user import-environment XDG_CURRENT_DESKTOP XDG_SESSION_TYPE DISPLAY &

dbus-update-activation-environment --systemd XDG_CURRENT_DESKTOP XDG_SESSION_TYPE DISPLAY &
dbus-update-activation-environment XDG_CURRENT_DESKTOP XDG_SESSION_TYPE DISPLAY &
