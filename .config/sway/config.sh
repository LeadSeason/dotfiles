#!/usr/bin/env bash

systemctl --user stop gnome-keyring-daemon.service gnome-keyring-daemon.socket &

killall -q swayidle &
killall -q wl-paste &
killall -q swaync &
killall -q kdeconnectd &
killall -q waybar &
killall -q python &
pkill getupdates-serv &
killall -q foot &
killall -q nm-applet &
killall -q kdeconnect-indicator &
killall -q xdg-desktop-portal-wlr &
killall -q xdg-desktop-portal &
killall -q polkit-gnome-au &

wait

# foot server
foot -s &

wl-paste -t text --watch clipman store --no-persist &

/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &

# Adaptive wallpaper
python ~/.config/sway/scripts/wallpaper.py &

# kdeconnectd
/usr/lib/kdeconnectd &

# notifiaction deamon
swaync &

# start update notifer server
~/.config/waybar/scipts/getupdates-server.sh &

# waybar
waybar &
kdeconnect-indicator &
nm-applet --indicator &

# Automatic locking using swaylock-effects
# swayidle -w \
# 	timeout 300 'swaylock --ignore-empty-password --fade-in 2 --grace 3 --grace-no-mouse --grace-no-touch --screenshots --indicator-caps-lock --indicator --clock --timestr "%T" --bs-hl-color 66000099 --caps-lock-bs-hl-color 66000099 --caps-lock-key-hl-color 00660099 --font Iosevka Term,Iosevka Term Thin Extended:style=Thin Extended,Regular --indicator-idle-visible --indicator-radius 120 --indicator-thickness 10 --inside-color 00000099 --inside-clear-color 00660099 --inside-caps-lock-color 66000099 --inside-ver-color 66666699 --inside-wrong-color 66000099 --key-hl-color ffffffee --layout-bg-color 00000066 --layout-border-color 33333366 --layout-text-color ffffffff --line-color ffffff66 --line-clear-color ffffff66 --line-caps-lock-color ffffff66 --line-ver-color 33333366 --line-wrong-color 33000066 --ring-color ffffff66 --ring-clear-color 33ff3366 --ring-caps-lock-color ff333366 --ring-ver-color bb00cc66 --ring-wrong-color ff000066 --separator-color 00000000 --text-color ffffff --text-clear-color ffffffff --text-caps-lock-color ffffffff --text-ver-color ffffffff --text-wrong-color ffffffff --effect-blur 7x5 --effect-vignette 0.5:0.5' \
# 	timeout 600 'swaymsg "output * dpms off"' \
# 		resume 'swaymsg "output * dpms on"' \
# 	before-sleep 'swaylock --ignore-empty-password --fade-in 2 --grace 3 --grace-no-mouse --grace-no-touch --screenshots --indicator-caps-lock --indicator --clock --timestr "%T" --bs-hl-color 66000099 --caps-lock-bs-hl-color 66000099 --caps-lock-key-hl-color 00660099 --font Iosevka Term,Iosevka Term Thin Extended:style=Thin Extended,Regular --indicator-idle-visible --indicator-radius 120 --indicator-thickness 10 --inside-color 00000099 --inside-clear-color 00660099 --inside-caps-lock-color 66000099 --inside-ver-color 66666699 --inside-wrong-color 66000099 --key-hl-color ffffffee --layout-bg-color 00000066 --layout-border-color 33333366 --layout-text-color ffffffff --line-color ffffff66 --line-clear-color ffffff66 --line-caps-lock-color ffffff66 --line-ver-color 33333366 --line-wrong-color 33000066 --ring-color ffffff66 --ring-clear-color 33ff3366 --ring-caps-lock-color ff333366 --ring-ver-color bb00cc66 --ring-wrong-color ff000066 --separator-color 00000000 --text-color ffffff --text-clear-color ffffffff --text-caps-lock-color ffffffff --text-ver-color ffffffff --text-wrong-color ffffffff --effect-blur 7x5 --effect-vignette 0.5:0.5' &

# Automatic locking using gtklock
swayidle -w \
	timeout 300 'gtklock' \
	timeout 600 'swaymsg "output * dpms off"' \
		resume 'swaymsg "output * dpms on"' \
	before-sleep '' &


/usr/lib/xdg-desktop-portal-wlr &
sleep 4
/usr/lib/xdg-desktop-portal &

systemctl --user import-environment XDG_CURRENT_DESKTOP XDG_SESSION_TYPE DISPLAY WAYLAND_DISPLAY &

dbus-update-activation-environment --systemd XDG_CURRENT_DESKTOP XDG_SESSION_TYPE DISPLAY WAYLAND_DISPLAY &

