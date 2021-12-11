#!/usr/bin/env bash

var=$(sensors -u)
var=${var##*edge}
var=${var##*temp1_input}
var=${var:2}
var=${var%% *}
printf "%.0f\n" ${var}