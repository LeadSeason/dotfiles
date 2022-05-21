function fish_greeting
    echo -n
end

export EDITOR=nvim

if status is-login
    if test -z "$DISPLAY" -a "$XDG_VTNR" = 1
        exec sway
		fish
    end
end

fish_add_path -g ~/.local/bin

export LANG=en_US.UTF-8
set -x (gnome-keyring-daemon --start | string split "=")

alias lynx="lynx -accept_all_cookies"
alias make="make -j24"
alias autoremove="sudo pacman -Rcns (pacman -Qdtq)"

function mpv
    /usr/bin/i3-msg layout tabbed; /usr/bin/mpv $argv --volume=40; /usr/bin/i3-msg layout toggle split; 
end

function feh
    /usr/bin/i3-msg layout tabbed; /usr/bin/feh $argv; /usr/bin/i3-msg layout toggle split; 
end

############################
#### fish command timer ####
############################
set fish_command_timer_enabled 1
set fish_command_timer_status_enabled 0
set fish_command_timer_color white
set fish_command_timer_success_color white
set fish_command_timer_time_format ""
set fish_command_timer_millis 0
set fish_command_timer_min_cmd_duration 1000

