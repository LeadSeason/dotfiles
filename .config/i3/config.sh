#!/usr/bin/env bash

xrandr --output VGA-1-1 --off
xrandr --output DisplayPort-0 --rate 144 --mode 1920x1080
xrandr --output HDMI-A-0 --auto --left-of DisplayPort-0
xrandr --output DVI-I-1-1 --rate 144 --mode 1920x1080 --right-of DisplayPort-0

killall -q xsettingsd &
killall -q picom &
killall -q xidlehook &
killall -q dunst &
killall -q polybar &
killall -q keynav &

wait

# theaming
xsettingsd &

# X composing
picom --config ~/.config/picom.conf &

# wallpaper
feh --bg-fill ~/.config/i3/wallpaper.jpg &

# start auto lock
~/.config/i3/xidlehook.sh &

# polybar
~/.config/polybar/polybar.sh &

# notifiaction deamon
dunst &

# Keyboard mouse
keynav "loadconfig .config/keynavrc,daemonize"

# start libsecret (gnone key manager)
gnome-keyring-daemon &

# Cadmus
cadmus &
