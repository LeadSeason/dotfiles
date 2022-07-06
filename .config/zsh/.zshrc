# auto loads and inits
autoload -Uz compinit promptinit colors
compinit
promptinit
colors
# variable definitions
HISTFILE=~/.local/share/zsh/histfile
HISTSIZE=1000
SAVEHIST=100000

my-backward-delete-word() {
    local WORDCHARS=${WORDCHARS/\//}
    zle backward-delete-word
}

zle -N my-backward-delete-word
bindkey '^W' my-backward-delete-word

bindkey -v

source ~/.config/zsh/znap/zsh-snap/znap.zsh
znap source jeffreytse/zsh-vi-mode
znap source zsh-users/zsh-autosuggestions
znap source zsh-users/zsh-syntax-highlighting
znap source olivierverdier/zsh-git-prompt
# znap source marlonrichert/zsh-autocomplete

alias ls="ls -F --color=auto"
alias ll="ls -Flsh --color=auto"
alias la="ls -Flsha --color=auto"
alias grep="grep --color"

# zstyle ':autocomplete:*' list-lines 32
# zstyle ':autocomplete:history-search:*' list-lines 32
# zstyle ':autocomplete:*' min-delay 3
zstyle ':completion:*' matcher-list \
    'm:{[:lower:]}={[:upper:]}' \
    '+r:|[._-]=* r:|=*' \
    '+l:|=*'

# The plugin will auto execute this zvm_after_select_vi_mode function
function zvm_after_select_vi_mode() {
  case $ZVM_MODE in
    $ZVM_MODE_NORMAL)
      ZVM_MODE_TEXT="%F{8}[%F{2}N%F{8}]"
    ;;
    $ZVM_MODE_INSERT)
      ZVM_MODE_TEXT="%F{8}[%F{14}I%F{8}]"
    ;;
    $ZVM_MODE_VISUAL)
      ZVM_MODE_TEXT="%F{8}[%F{3}V%F{8}]"
    ;;
    $ZVM_MODE_VISUAL_LINE)
      ZVM_MODE_TEXT="%F{8}[%F{3}V%F{8}]"
    ;;
    $ZVM_MODE_REPLACE)
      ZVM_MODE_TEXT="%F{8}[%F{1}R%F{8}]"
    ;;
  esac
  PS1=" $ZVM_MODE_TEXT%F{15}$_CUR"
}

precmd() {
	bindkey '^W' my-backward-delete-word
	local exit_code=(${?})
	print -P "%F{124}$USER%F{255}@%F{39}$HOST %F{34}%(5~|%-1~/…/%3~|%4~)%F{255} $(git_super_status)"
	if [[ "$exit_code" == 0 ]] then;
		_CUR=" → %{$reset_color%}"
	else
		_CUR="%F{196} $exit_code → %{$reset_color%}"
	fi
}

RPS1="%*"


