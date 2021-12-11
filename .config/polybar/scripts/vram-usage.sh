#!/usr/bin/env bash

var=$(radeontop --dump /dev/stdout -l1)
var=${var##*vram }
var=${var%% *}
printf "%.0f\n" ${var::-1}