#!/usr/bin/sh

echo test
echo 2test > /dev/stderr

if (($(ps -aux | grep [p]icom | wc -l) > 0))
then
  echo test1 > /dev/stderr
  polybar-msg hook composer-toggle 1
  pkill -9 picom
else
  echo test2 > /dev/stderr
  polybar-msg hook composer-toggle 2
  picom --config ~/.config/picom.conf &
fi
