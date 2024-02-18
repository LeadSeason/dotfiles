
# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.config/zsh/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
source ~/.zshenv

# start wm on tty1 login
if [ "$(tty)" = "/dev/tty1" ]; then
    sway-launch
fi

fastfetch --load-config $HOME/.config/fastfetch/config-small.conf

if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi


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
NVIM_PATH="${PATH:-}"
REPORTTIME=1

export NVIM_PATH PATH ZPLUG_HOME SAVEHIST HISTSIZE HISTFILE

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


# Plugin Configuration
source /home/leadseason/.config/zsh/catppuccin_mocha-zsh-syntax-highlighting.zsh


# alias defenitions
alias :q="exit"
alias autoremove="sudo pacman -Rcns \$(pacman -Qdtq) --noconfirm"
alias cc="COLORTERM="" pygmentize -g"
alias clear="printf '\033[2J\033[3J\033[1;1H'"
alias copy="wl-copy"
alias ff="fastfetch"
alias ffs="fastfetch --load-config $HOME/.config/fastfetch/config-small.conf"
alias grep="grep --color"
alias icat="kitty +kitten icat"
alias ip="ip -color=auto"
alias la="lsd -Flha --color=auto"
alias ll="lsd -Flh --color=auto"
alias ls="lsd -F --color=auto"
alias lynx="lynx -accept_all_cookies"
alias make="make -j24"
alias nvim="PATH=\"$NVIM_PATH\" nvim"
alias quit="exit"
alias radeontop="radeontop -c"
alias s="s -p duckduckgo"
alias saberfetch="neofetch --ascii ~/.config/neofetch/saber.ascii --gap -567"
alias showcolors="curl https://gist.githubusercontent.com/HaleTom/89ffe32783f89f403bba96bd7bcd1263/raw/ | bash"
alias ssh="TERM=xterm ssh"
alias tree="tree -C"


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

# precmd() {
# 	# 
# 	# →
# 	local exit_code=(${?})
#     local git_branch=" $(gitprompt)"
# 
# 	if [[ $VIRTUAL_ENV_PROMPT ]] then;
# 		local py_venv=" $VIRTUAL_ENV_PROMPT"
# 	fi
# 
# 	if [[ "$exit_code" == "0" ]] then;
# 		PS1="$fg[blue]$USER$fg[white]@$fg[blue]$HOST $fg[green]%(5~|%-1~/…/%3~|%4~)$reset_color$git_branch$py_venv
#  -> %{$reset_color%}"
# 
# 	else
# 		PS1="$fg[blue]$USER$fg[white]@$fg[blue]$HOST$reset_color [$fg[red]$exit_code$reset_color] $fg[green]%(5~|%-1~/…/%3~|%4~)$reset_color$git_branch$py_venv
#  -> %{$reset_color%}"
# 	fi
# 
# 	unset ZSH_TIMER_SHOW
# }

backward-delete-word-custom() {
    local WORDCHARS=${WORDCHARS/\//}
    zle backward-delete-word
}

zle -N backward-delete-word-custom

eval "$(zoxide init zsh --cmd cd)"

# To customize prompt, run `p10k configure` or edit ~/.config/zsh/.p10k.zsh.
[[ ! -f ~/.config/zsh/.p10k.zsh ]] || source ~/.config/zsh/.p10k.zsh
