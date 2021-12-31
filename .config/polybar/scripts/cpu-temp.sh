#!/usr/bin/env bash

var=$(sensors -u 2>/dev/null)

var=${var##*SMBUSMASTER}
var=${var##*temp7_input}
var=${var:2}
var=${var%%00*}
printf "%.0f\n" ${var}

