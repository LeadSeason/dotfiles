#!/bin/sh

if ! updates=$(cat /tmp/updates 2> /dev/null); then
    updates=0
fi

echo " $updates"