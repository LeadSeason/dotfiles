# if status is-interactive
#     set fish_p_name_color "e4e4e4"
#     set fish_p_name_color_bg "d70000"
#     set fish_p_hostname_color "080808"
#     set fish_p_hostname_color_bg "e4e4e4"
#     set fish_p_dir_color "bcbcbc"
#     set fish_p_dir_color_bg "303030"
#     set fish_p_text_color "b2b2b2"
#     set fish_P_text_color_bg "000000"
# 
#     set fish_function_path $fish_function_path "/usr/share/powerline/bindings/fish"
#     powerline-setup
# 
# 
#     function fish_prompt --description 'Write out the prompt'
#         echo -n -s (set_color -b $fish_p_name_color_bg)(set_color $fish_p_name_color)" $LOGNAME "(set_color -b $fish_p_hostname_color_bg)(set_color $fish_p_name_color_bg)''(set_color -o $fish_p_hostname_color) " $hostname  " (set_color $fish_p_hostname_color_bg)(set_color -b $fish_p_dir_color_bg)' '(set_color $fish_p_dir_color) (prompt_pwd) " " (set_color -b normal) (set_color $fish_p_dir_color_bg)  " "(set_color normal)
#     end
# end

# function fish_greeting
#     echo -n (set_color FFFFFF) (fish --version) " 
#     ▄▀▄▀▀▀▀▄▀▄
#     █        ▀▄      ▄
#     █  ▀  ▀     ▀▄▄  █ █
#     █ ▄ █▀ ▄       ▀▀  █
#     █  ▀▀▀▀            █
#     █                  █
#     █                  █
#     █  ▄▄  ▄▄▄▄  ▄▄  █
#     █ ▄▀█ ▄▀  █ ▄▀█ ▄▀
#     ▀▀  ▀▀    ▀▀  ▀▀
#     "
# end

function fish_greeting
    echo -n
end

set EDITOR vim

fish_add_path -g ~/.local/bin

thefuck --alias | source

export LANG=en_US.UTF-8

alias msnake="/home/leadseason/Games/msnake/build/msnake"
alias bashblitz="/home/leadseason/Games/bashblitz/bashblitz.sh"
alias lynx="lynx -accept_all_cookies"
alias ledon="ratbagctl 0 led 0 set mode cycle duration 5000; ratbagctl 0 led 1 set mode cycle duration 5000"
alias ledoff="ratbagctl 0 led 0 set mode off; ratbagctl 0 led 1 set mode off"
alias yt-dl="youtube-dl -f mp4 --id "
alias make="make -j24"
alias autoremove="sudo pacman -Rcns (pacman -Qdtq)"
alias mixer=ncpamixer
# alias cat="pygmentize -g"


############################
#### fish command timer ####
###########################
set fish_command_timer_enabled 1
set fish_command_timer_status_enabled 0
set fish_command_timer_color white
set fish_command_timer_success_color white
set fish_command_timer_time_format ""
set fish_command_timer_millis 0
set fish_command_timer_min_cmd_duration 10

