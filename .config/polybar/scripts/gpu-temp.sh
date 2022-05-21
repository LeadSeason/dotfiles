#!/usr/bin/env bash

var=$(sensors -u 2>/dev/null)

# check if amdgpu
if [[ $var == *"amdgpu"* ]]
then
    var=${var##*amdgpu}
    var=${var##*edge}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}
    printf ${var}

# check if radeon
elif [[ $var == *"radeon"* ]]
then
    var=${var##*radeon}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}
    printf "%.0f\n" ${var}

else
    >&2 echo "This script hasnt picked up your gpu
or your gpu inst in sensors try detect-sensors to fix
This script should work only for radeon and amdgpu's"
fi

