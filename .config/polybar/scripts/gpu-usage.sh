#!/usr/bin/env bash

var=$(radeontop --dump /dev/stdout -l1)
var=${var##*gpu}
var=${var%%, ee*}
var=${var%%, ee*}
printf "%.0f\n" ${var::-1}