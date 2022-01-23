
function fish_greeting
    echo -n
end

export EDITOR=nvim

fish_add_path -g ~/.local/bin

alias lynx="lynx -accept_all_cookies"
alias cat="/home/leadseason/.config/fish/functions/cat.py"

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

