<h1 align="center">LeadSeason's Dotfiles</h1>
<p align="center">Collection of dotfiles. Used to sync between two computers.</p>

## About
**Warning**: Don’t blindly use my settings unless you know what that entails.
Use at your own risk!  
These dotfiles should be used as a example.

## ScreenShots
<p align="center">
  <img src="https://github.com/LeadSeason/dotfiles/raw/main/assets/1.png">
  <img src="https://github.com/LeadSeason/dotfiles/raw/main/assets/2.png">
  <img src="https://github.com/LeadSeason/dotfiles/raw/main/assets/3.png">
  <img src="https://github.com/LeadSeason/dotfiles/raw/main/assets/4.png">
</p>

## Install
### **⚠️ Do not install Unless you know what you are doing ⚠️**
```
cd
git clone https://github.com/LeadSeason/dotfiles
rm -r dotfiles/*
cp -r dotfiles/.* .
rm dotfiles -rf
```
Packages to install
```
# pacman -Sy --noconfirm archlinux-keyring
# pacman -Syu --needed --noconfirm adobe-source-han-sans-otc-fonts btop code discord firefox git gnome-keyring gnome-tweaks grim htop jq kdeconnect kitty lsd nemo neofetch neovim noto-fonts-emoji pacman-contrib polkit-gnome python python-aiofiles python-aiohttp python-filetype python-keyring python-pynvim ranger seahorse slurp swappy sway swayimg swaybg swayidle ttf-jetbrains-mono-nerd ttf-nerd-fonts-symbols-2048-em unarchiver waybar wf-recorder wget wl-clipboard wofi xorg-xwayland zip zsh zsh-syntax-highlighting
# pacman -S base-devel
$ git clone https://aur.archlinux.org/yay.git
$ cd yay
$ makepkg -si
$ yay -S cava checkupdates-aur clipman s wev rofi-lbonn-wayland-git
```
Most likely few packages are missing will add later if missing
