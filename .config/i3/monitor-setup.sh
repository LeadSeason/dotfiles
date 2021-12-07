#!/usr/bin/env bash

xrandr --output HDMI-A-0 --off
xrandr --output DVI-I-1-1 --off
xrandr --output VGA-1-1 --off
xrandr --output HDMI-A-0 --rate 144 --mode 1920x1080
xrandr --output VGA-1-1 --auto --left-of HDMI-A-0
xrandr --output DVI-I-1-1 --rate 144 --mode 1920x1080 --right-of HDMI-A-0
