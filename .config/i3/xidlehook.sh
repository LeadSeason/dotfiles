#!/usr/bin/env sh

xidlehook \
    `# Dont lock when playing yt or something like that` \
    --not-when-audio \
    `# Lock after 10 minutes` \
    --timer 60 \
        "/home/leadseason/.config/i3/lock.sh" \
        "" \
    `# suspend after hour` \
    --timer 3600 \
        "systemctl suspend" \
        ""
