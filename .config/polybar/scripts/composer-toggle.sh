#!/usr/bin/sh

echo test
echo 2test > /dev/stderr

if pgrep picom;
then
  echo test1 > /dev/stderr
  polybar-msg hook composer-toggle 1
  pkill -9 picom
  sed -i '0,/for_window/{s/for_window.*/for_window [class="^.*"] border pixel 2/}' ~/.config/i3/config
  i3-msg restart
else
  echo test2 > /dev/stderr
  polybar-msg hook composer-toggle 2
  picom --config ~/.config/picom.conf &
  sed -i '0,/for_window/{s/for_window.*/for_window [class="^.*"] border pixel 0/}' ~/.config/i3/config
  i3-msg restart
fi
