#!/usr/bin/env bash

var=$(sensors -u)

# check if radeon
if [[ $var == *"amdgpu"* ]]
then
    >&2 echo amdgpu
    var=${var##*amdgpu}
    var=${var##*edge}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}

elif [[ $var == *"radeon"* ]]
then
    >&2 echo radeon
    var=${var##*radeon}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}

else
    >&2 echo "This script hasnt picked up your gpu\nThis script should work only for radeon and amdgpu's"
fi

printf "%.0f\n" ${var}
