#!/usr/bin/env sh

# killing all polybar
killall -q polybar

# killing all update check scripts
killall -q getupdates-server.sh

# starting update check script
~/.config/polybar/scripts/getupdates-server.sh &

# starting polybar for every monitor
if type "xrandr"; then
  for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
    MONITOR=$m polybar --reload example &
  done
else
  polybar --reload example &
fi
