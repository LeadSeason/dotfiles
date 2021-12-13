#!/usr/bin/env bash

var=$(sensors -u >2 /dev/null)

# check if radeon
if [[ $var == *"amdgpu"* ]]
then
    var=${var##*amdgpu}
    var=${var##*edge}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}

elif [[ $var == *"radeon"* ]]
then
    var=${var##*radeon}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}

else
    >&2 echo "This script hasnt picked up your gpu\nor your gpu inst in sensors try detect-sensors to fix\nThis script should work only for radeon and amdgpu's"
fi

printf "%.0f\n" ${var}
