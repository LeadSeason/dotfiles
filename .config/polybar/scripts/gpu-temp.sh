#!/usr/bin/env bash

var=$(sensors -u)
if [[ $var == *"amdgpu"* ]];
then
    >&2 echo amdgpu
    var=${var##*amdgpu}
    var=${var##*edge}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}
fi

if [[ $var == *"radeon"* ]];
then
    >&2 echo radeon
    var=${var##*radeon}
    var=${var##*temp1_input}
    var=${var:2}
    var=${var%% *}
fi
printf "%.0f\n" ${var}
