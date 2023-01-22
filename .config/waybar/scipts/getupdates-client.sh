#!/bin/sh

if ! updateslen=$(cat /tmp/updates 2> /dev/null | wc -l); then
    updateslen=0
fi

if ! updates=$(cat /tmp/updates 2> /dev/null | sed -rz 's/\n/\\n/g'); then
	updates=\"File /tmp/updates not found\"
fi

if [ $updateslen -gt 2 ]; then
	updates=${updates::-2}
fi

echo "{\"text\": \"$updateslen\", \"alt\": \"none\", \"tooltip\": \"$updates\", \"class\": \"none\"}" | jq --unbuffered --compact-output
