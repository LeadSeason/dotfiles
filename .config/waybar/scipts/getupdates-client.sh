#!/bin/sh

if ! updateslen=$(cat /tmp/updates 2> /dev/null | wc -l); then
    updateslen=0
fi

if ! updates=$(cat /tmp/updates 2> /dev/null | sed -rz 's/\n/\\n/g'); then
	updates=\"File /tmp/updates not found\"
fi

echo "{\"text\": \"$updateslen\", \"alt\": \"none\", \"tooltip\": \"${updates::-2}\", \"class\": \"none\"}" | jq --unbuffered --compact-output
