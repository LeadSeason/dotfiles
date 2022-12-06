
# start wm on tty1 login
if [ "$(tty)" = "/dev/tty1" ]; then
	echo "[1] Start Sway"
	echo "[2] Start Hyprland"
	echo "[3] Stay in tty"
	echo -n " → "
	read ACTION
	wait

	case $ACTION in
		"1")
			unset ACTION
			# starting gnome-keyring-daemon for ssh, secrets, and gpg key unloking
			eval $(gnome-keyring-daemon --start -c pkcs11,secrets,ssh)

			# exporting keyring variables
			export SSH_AUTH_SOCK
			export GNOME_KEYRING_CONTROL

			# starting sway
			exec sway
			;;
		"2")
			unset ACTION
			eval $(gnome-keyring-daemon --start -c pkcs11,secrets,ssh)
			export SSH_AUTH_SOCK
			export GNOME_KEYRING_CONTROL
			exec Hyprland
			;;
		*)
			unset ACTION
			;;
	esac
fi


# auto loads and inits
autoload -Uz compinit promptinit colors select-word-style
compinit
promptinit
colors


# variable defenitions
HISTFILE=~/.local/share/zsh/histfile
HISTSIZE=1000
SAVEHIST=1000000
ZPLUG_HOME=~/.local/share/zsh/zplug
PATH="$HOME/.local/bin:$PATH"
NVIM_PATH="${PATH:-}"

export NVIM_PATH PATH ZPLUG_HOME SAVEHIST HISTSIZE HISTFILE

unset RPS1
unset PS1

# Plugin managment
source $ZPLUG_HOME/init.zsh

zplug 'zplug/zplug', hook-build:'zplug --self-manage'
zplug "chrissicool/zsh-256color"
zplug "zsh-users/zsh-syntax-highlighting"
zplug "zsh-users/zsh-history-substring-search"
zplug "zsh-users/zsh-autosuggestions"
zplug "popstas/zsh-command-time"

if ! zplug check; then
	zplug install
fi
zplug load


# Plugin Configuration



# alias defenitions
alias :q="exit"
alias ls="lsd -F --color=auto"
alias ll="lsd -Flh --color=auto"
alias la="lsd -Flha --color=auto"
alias grep="grep --color"
alias lynx="lynx -accept_all_cookies"
alias s="s -p duckduckgo"
alias make="make -j24"
alias cc="pygmentize -g"
alias nvim="PATH=\"$NVIM_PATH\" nvim"
alias autoremove="sudo pacman -Rcns $(pacman -Qdtq) --noconfirm"
alias showcolors="curl https://gist.githubusercontent.com/HaleTom/89ffe32783f89f403bba96bd7bcd1263/raw/ | bash"


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


# Functions

zsh_command_time() {
    if [ -n "$ZSH_COMMAND_TIME" ]; then
        local hours=$(($ZSH_COMMAND_TIME/3600))
        local min=$(($ZSH_COMMAND_TIME/60))
        local sec=$(($ZSH_COMMAND_TIME%60))
        if [ "$ZSH_COMMAND_TIME" -le 60 ]; then
            local timer_show="$fg[green]${ZSH_COMMAND_TIME}s"
        elif [ "$ZSH_COMMAND_TIME" -gt 60 ] && [ "$ZSH_COMMAND_TIME" -le 180 ]; then
            local timer_show="$fg[yellow]${min}min ${sec}s"
        else
            if [ "$hours" -gt 0 ]; then
                local min=$(($min%60))
                local timer_show="$fg[red]${hours}h ${min}min ${sec}s"
            else
				local timer_show="$fg[red]${min}min ${sec}s"
            fi
        fi
		printf "${ZSH_COMMAND_TIME_MSG}\n" "$timer_show"
    fi
}

precmd() {
	local exit_code=(${?})
	local git_branch=" $(git rev-parse --abbrev-ref HEAD 2> /dev/null)"

	if [[ $VIRTUAL_ENV_PROMPT ]] then;
		local py_venv=" $VIRTUAL_ENV_PROMPT"
	fi

	if [[ "$exit_code" == "0" ]] then;
		PS1="%F{39}$USER%F{255}@%F{39}$HOST %F{34}%(5~|%-1~/…/%3~|%4~)%F{255}$git_branch$py_venv
 → %{$reset_color%}"

	else
		PS1="%F{39}$USER%F{255}@%F{39}$HOST %{$reset_color%}[%F{196}$exit_code%{$reset_color%}] %F{34}%(5~|%-1~/…/%3~|%4~)%F{255}$git_branch$py_venv
 → %{$reset_color%}"
	fi

	unset ZSH_TIMER_SHOW
}

backward-delete-word-custom() {
    local WORDCHARS=${WORDCHARS/\//}
    zle backward-delete-word
}

zle -N backward-delete-word-custom

pfetch

