#!/usr/bin/env bash

if pgrep -x "i3lock" >/dev/null
then
    printf "already locked aborting ..."
else
    i3lock --blur 5 --indicator --clock
fi
