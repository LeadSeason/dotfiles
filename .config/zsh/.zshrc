
# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.config/zsh/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
source $ZDOTDIR/.zshenv

# start wm on tty1 login
if [ "$(tty)" = "/dev/tty1" ]; then
    exec sway-launch
fi

# didn't feel like it.
# fastfetch --config $HOME/.config/fastfetch/config-small.jsonc


# if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
#   source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
# fi


# auto loads and inits
autoload -Uz compinit promptinit colors select-word-style
compinit
promptinit
colors

# variable defenitions
HISTFILE=~/.local/share/zsh/histfile
HISTSIZE=100000000
SAVEHIST=100000000
setopt SHARE_HISTORY
setopt HIST_IGNORE_ALL_DUPS
ZPLUG_HOME=~/.local/share/zsh/zplug
fpath=($ZDOTDIR/completion $fpath)
REPORTTIME=1

export PATH ZPLUG_HOME SAVEHIST HISTSIZE HISTFILE

unset RPS1
unset PS1

# Plugin managment
source $ZPLUG_HOME/init.zsh

zplug 'zplug/zplug', \
	hook-build:'zplug --self-manage'
zplug romkatv/powerlevel10k, as:theme, depth:1
zplug "chrissicool/zsh-256color"
zplug "zsh-users/zsh-syntax-highlighting"
zplug "zsh-users/zsh-history-substring-search"
zplug "zsh-users/zsh-autosuggestions"
zplug "woefe/git-prompt.zsh"

if ! zplug check; then
	zplug install
fi
zplug load

# Set a title for the session so it easyer easyer easter, less difficult to pick out shell in the scractch pad.
precmd () {
    if [ "$TERM" = "xterm-kitty" ]; then
        kitty @ set-window-title $PWD
    fi
}
preexec () {
    if [ "$TERM" = "xterm-kitty" ]; then
        kitty @ set-window-title $1
    fi
}

function current() {
    # Get current scheme background color
    bgcolor=$(flavours info -r $(flavours current) | sed -n '3 p')
    # Get first character
    character=${bgcolor:1:1}
    # If its less than 5, normally is a dark scheme
    if [[ $character < 5 ]]; then
        echo "dark"
    else
        echo "light"
    fi
}

# alias defenitions
alias cls=clear
alias diff="diff --color"
alias :q="exit"
alias autoremove="sudo pacman -Rcns \$(pacman -Qdtq) --noconfirm"
alias cc="COLORTERM="" pygmentize -g"
alias clear="printf '\033[2J\033[3J\033[1;1H'"
alias clock="tty-clock -C 5"
alias copy="wl-copy"
alias ff="fastfetch"
alias ffs="fastfetch --config $HOME/.config/fastfetch/config-small.jsonc"
alias grep="grep --color"
alias icat="kitty +kitten icat"
alias ip="ip -color=auto"
alias la="lsd -Flha --color=auto"
alias ll="lsd -Flh --color=auto"
alias ls="lsd -F --color=auto"
alias lst="lsd -F --color=auto --tree"
alias lynx="lynx -accept_all_cookies"
alias make="make -j24"
alias mtr="mtr --aslookup --show-ips"
alias quit="exit"
alias radeontop="radeontop -cT"
alias s="s -p duckduckgo"
alias saberfetch="neofetch --ascii ~/.config/neofetch/saber.ascii --gap -567"
alias showcolors="curl https://gist.githubusercontent.com/HaleTom/89ffe32783f89f403bba96bd7bcd1263/raw/ | bash"
alias ssh="TERM=xterm ssh"
alias tree="tree -C"
alias tty-clock="tty-clock -C 5"
# alias vim="nvim"
alias xdg-ninja="COLORTERM=\"\" xdg-ninja"

# Moving to XDG data dir
alias adb='HOME="$XDG_DATA_HOME"/android adb'
alias wget=wget --hsts-file="$XDG_DATA_HOME/wget-hsts" 

# Bindings
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down
bindkey '^[[1;5D' vi-backward-blank-word
bindkey '^[[1;5C' vi-forward-blank-word

bindkey "^W" backward-delete-word-custom
bindkey "^H" backward-delete-word-custom

zstyle ':completion:*' matcher-list \
    'm:{[:lower:]}={[:upper:]}' \
    '+r:|[._-]=* r:|=*' \
    '+l:|=*'

function hb {
    url="https://bin.retardism.xyz"
    up_uri="$url/documents"

    response=$(cat $1 | curl -s -X POST -d @- "$up_uri")

    if [ ! $? -eq 0 ]; then
        echo "Failed to upload the document."
        return 1
    fi

    hasteKey=$(echo $response | jq -r '.key')
    url_final_v2_I_need_better_variable_names="$url/$hasteKey"
    echo "$url_final_v2_I_need_better_variable_names"

    if [ "$XDG_SESSION_TYPE" = "wayland" ]; then
        if type "wl-copy" > /dev/null; then
            wl-copy "$url_final_v2_I_need_better_variable_names"
        fi

    elif [ $XDG_SESSION_TYPE = "x11" ]; then
        if type "xclip" > /dev/null; then
            echo -n "$url_final_v2_I_need_better_variable_names" | xclip -sel c
        fi
    fi
}

backward-delete-word-custom() {
    local WORDCHARS=${WORDCHARS/\//}
    zle backward-delete-word
}

zle -N backward-delete-word-custom

TRAPUSR1() {
    # On USR1 signal.
}

# To customize prompt, run `p10k configure` or edit ~/.config/zsh/.p10k.zsh.
[[ ! -f ~/.config/zsh/.p10k.zsh ]] || source ~/.config/zsh/.p10k.zsh
