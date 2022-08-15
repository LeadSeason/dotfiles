
# start wm on tty1 login
if [ "$(tty)" = "/dev/tty1" ]; then
	systemctl --user stop gnome-keyring-daemon.service gnome-keyring-daemon.socket

	echo "[1] Start Sway"
	echo "[2] Start Hyprland"
	echo "[3] Stay in tty"
	echo -n " → "
	read ACTION

	case $ACTION in
		1)
			unset ACTION
			eval $(gnome-keyring-daemon --start -c pkcs11,secrets,ssh)
			export SSH_AUTH_SOCK
			export GNOME_KEYRING_CONTROL
			exec sway
			;;
		2)
			unset ACTION
			eval $(gnome-keyring-daemon --start -c pkcs11,secrets,ssh)
			export SSH_AUTH_SOCK
			export GNOME_KEYRING_CONTROL
			exec sway
			;;
		*)
			unset ACTION
			exec zsh
			;;
	esac
fi


# auto loads and inits
autoload -Uz compinit promptinit colors
compinit
promptinit
colors


# variable defenitions
PS1=" → %{$reset_color%}"
HISTFILE=~/.local/share/zsh/histfile
HISTSIZE=1000
SAVEHIST=100000
ZPLUG_HOME=~/.local/share/zsh/zplug


# Plugin managment
source $ZPLUG_HOME/init.zsh

zplug 'zplug/zplug', hook-build:'zplug --self-manage'
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
alias ls="lsd -F --color=auto"
alias ll="lsd -Flh --color=auto"
alias la="lsd -Flha --color=auto"
alias grep="grep --color"
alias lynx="lynx -accept_all_cookies"
alias s="s -p duckduckgo"
alias make="make -j24"
alias autoremove="sudo pacman -Rcns $(pacman -Qdtq)"
alias showcolors="curl https://gist.githubusercontent.com/HaleTom/89ffe32783f89f403bba96bd7bcd1263/raw/ | bash"


# Bindings
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down
bindkey "^W" "backward-delete-word-custom"

zstyle ':completion:*' matcher-list \
    'm:{[:lower:]}={[:upper:]}' \
    '+r:|[._-]=* r:|=*' \
    '+l:|=*'


# Functions
precmd() {
	local exit_code=(${?})
	bindkey '^W' backward-delete-word-custom
	if [[ "$exit_code" == "0" ]] then;
		print -P "%F{39}$USER%F{255}@%F{39}$HOST %F{34}%(5~|%-1~/…/%3~|%4~)%F{255} $(git rev-parse --abbrev-ref HEAD 2> /dev/null)"
	else

		print -P "%F{39}$USER%F{255}@%F{39}$HOST %{$reset_color%}[%F{196}$exit_code%{$reset_color%}] %F{34}%(5~|%-1~/…/%3~|%4~)%F{255} $(git rev-parse --abbrev-ref HEAD 2> /dev/null)"
	fi
}

backward-delete-word-custom() {
    local WORDCHARS=${WORDCHARS/\//}
    zle backward-delete-word
}

zle -N backward-delete-word-custom

