function fish_greeting
    echo -n
end

if status is-login
    if test -z "$DISPLAY" -a "$XDG_VTNR" = 1
		# set -x (gnome-keyring-daemon --start | string split "=")
        exec sway 2>> ~/.cache/swaylog
    end
end

# set -x (gnome-keyring-daemon --start | string split "=")

fish_add_path -g ~/.local/bin

export LANG=en_US.UTF-8
export EDITOR=nvim

alias lynx="lynx -accept_all_cookies"
alias make="make -j24"
alias autoremove="sudo pacman -Rcns (pacman -Qdtq)"

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

