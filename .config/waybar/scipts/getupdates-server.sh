#!/bin/sh

while (true)
do
    if ! updates_arch=$(checkupdates 2> /dev/null | wc -l ); then
        updates_arch=0
    fi

    if ! updates_aur=$(checkupdates-aur 2> /dev/null | wc -l ); then
        updates_aur=0
    fi

    updates=$((updates_arch + updates_aur))

    echo $updates > /tmp/updates
	for i in {1..600}
	do
		sleep 1
		if ! pgrep -x waybar > /dev/null; then
			exit 0
		fi
	done
done
