#!/bin/sh

while (true)
do
	checkupdates 2> /dev/null > /tmp/updates
	yay -Qau 2> /dev/null >> /tmp/updates

	echo "Avalable packages to update $(cat /tmp/updates 2> /dev/null | wc -l)"

	for i in {1..600}
	do
		sleep 1
		if ! pgrep -x waybar > /dev/null; then
			exit 0
		fi
	done
done
