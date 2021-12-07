#!/usr/bin/env bash

if pgrep -x "i3lock" >/dev/null
then
    printf "already locked aborting ..."
else
    # Take a screenshot
    scrot /tmp/screen_locked.png

    # Pixellate it 10x
    mogrify -scale 10% -scale 1000% /tmp/screen_locked.png

    # Lock screen displaying this image.
    i3lock -i /tmp/screen_locked.png

    rm -f /tmp/screen_locked.png
fi
