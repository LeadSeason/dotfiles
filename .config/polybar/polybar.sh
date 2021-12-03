#!/usr/bin/env sh

# killing all polybar
killall -q polybar

# starting polybar for every monitor
if type "xrandr"; then
  for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
    MONITOR=$m polybar --reload example &
  done
else
  polybar --reload example &
fi