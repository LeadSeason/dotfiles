#!/usr/bin/env sh

xidlehook \
    `# Dont lock when playing yt or something like that` \
    --not-when-audio \
    `# Lock after 10 minutes` \
    --timer 300 \
        "~/.config/i3/lock.sh" \
        "" \
    `# suspend after hour` \
    --timer 1800 \
        "systemctl suspend" \
        ""
