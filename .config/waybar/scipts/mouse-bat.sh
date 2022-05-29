if ! charge=$(cat /sys/class/power_supply/hidpp_battery_*/capacity 2> /dev/null)
then
    charge=0
fi
printf '{"percentage": %s}' "${charge}" | jq --unbuffered --compact-output
