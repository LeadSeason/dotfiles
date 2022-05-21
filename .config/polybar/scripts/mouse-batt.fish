#!/bin/fish
upower -d /org/freedesktop/UPower/devices/mouse_hidpp_battery_0 | grep -E "percentage" | string trim | string trim -c"percentage:" | string trim
