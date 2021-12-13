#!/usr/bin/env bash

# multimonitor setup
xrandr --output HDMI-A-0 --off
xrandr --output DVI-I-1-1 --off
xrandr --output VGA-1-1 --off
xrandr --output HDMI-A-0 --rate 144 --mode 1920x1080
xrandr --output VGA-1-1 --auto --left-of HDMI-A-0
xrandr --output DVI-I-1-1 --rate 144 --mode 1920x1080 --right-of HDMI-A-0

# X composing
picom --config /home/leadseason/.config/picom.conf &

# wallpaper
feh --bg-fill /home/leadseason/Pictures/wallpaper/wallpaper.jpg &

# start auto lock
/home/leadseason/.config/i3/xidlehook.sh &

# polybar
/home/leadseason/.config/polybar/polybar.sh &

# notifiaction deamon
dunst &

# Clipboard deamon
klipper &

# network manager tray icon
nm-applet &

# blueman-applet start
blueman-applet &

# discord on start
# discord-canary &
