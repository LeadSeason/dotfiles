#!/usr/bin/env sh

yay -Syu --noconfirm --sudoloop
sudo pacman -Rcns $(pacman -Qdtq) --noconfirm
echo 0 > /tmp/updates

