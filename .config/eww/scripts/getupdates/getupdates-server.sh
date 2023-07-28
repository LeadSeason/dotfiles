#!/bin/sh

while (true)
do
	checkupdates 2> /dev/null > /tmp/updates
	yay -Qau 2> /dev/null >> /tmp/updates

	echo "Avalable packages to update $(cat /tmp/updates 2> /dev/null | wc -l)"
	sleep 300
done
