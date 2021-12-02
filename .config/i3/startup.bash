#!/bin/bash

if [[ "$DESKTOP_SESSION" == "sway" ]]; then
   echo Starting Sway
   swaybg --image Pictures/wallpaper/lake2.jpg &
   xautolock -locker swaylock & 
else
   echo Starting i3
   picom --config /home/leadseason/.config/picom.conf &
   feh --bg-fill ~/Pictures/wallpaper/lake.jpg &
   xautolock &
fi
