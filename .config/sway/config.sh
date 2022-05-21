#!/usr/bin/env bash

killall -q swayidle &
killall -q xsettingd &
killall -q swaync &
killall -q gnome-keyring-deamon &
killall -q kdeconnectd &
killall -q waybar &

wait

# Adaptive wallpaper
/bin/python /home/leadseason/.config/sway/scripts/wallpaper.py &

# Import User envronment
/etc/X11/xinit/xinitrc.d/50-systemd-user.sh &

# Theaming
# xsettingsd &

# kdeconnectd
/usr/lib/kdeconnectd &

# waybar
waybar &

# Automatich locking
swayidle -w \
	timeout 300 'swaylock -f -c 000000' \
	timeout 600 'swaymsg "output * dpms off"' \
		resume 'swaymsg "output * dpms on"' \
	before-sleep 'swaylock -f -c 000000' &

# notifiaction deamon
swaync &

# start libsecret (gnone key manager)
gnome-keyring-daemon &

# start update notifer server
~/.config/waybar/scipts/getupdates-server.sh &
