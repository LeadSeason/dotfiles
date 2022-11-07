#!/bin/sh

if ! updates=$(cat /tmp/updates 2> /dev/null | wc -l); then
    updates=0
fi

echo " $updates"
