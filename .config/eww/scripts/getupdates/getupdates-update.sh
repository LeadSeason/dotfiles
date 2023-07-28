#!/usr/bin/env sh

set -e

sudo pacman -Syu --noconfirm
yay -Syu --noconfirm --sudoloop
sudo pacman -Rcns $(pacman -Qdtq) --noconfirm
echo -n > /tmp/updates

printf "\e[1;32m ____   ___  _   _ _____
|  _ \ / _ \| \ | | ____|
| | | | | | |  \| |  _|
| |_| | |_| | |\  | |___
|____/ \___/|_| \_|_____|
"
