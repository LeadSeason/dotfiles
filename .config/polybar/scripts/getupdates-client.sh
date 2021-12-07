#!/bin/sh

if ! updates=$(cat /tmp/updates 2> /dev/null); then
    updates=0
fi


if [ "$updates" -gt 9 ]; then
    echo "$updates"
else
    echo ""
fi
