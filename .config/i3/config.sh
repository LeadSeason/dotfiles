#!/usr/bin/env bash

xrandr --output DisplayPort-0 --auto
xrandr --output DisplayPort-1 --auto --left-of DisplayPort-0
xrandr --output DisplayPort-2 --auto --right-of DisplayPort-0

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
