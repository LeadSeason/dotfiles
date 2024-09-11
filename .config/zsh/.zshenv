export ZDOTDIR=$HOME/.config/zsh/
export PATH="$HOME/.local/bin:$PATH"

# This is stupid but it works
export SSH_AUTH_SOCK="/run/user/1000/gcr/ssh"

# Editor
export SYSTEMD_EDITOR=nvim
export EDITOR=nvim

# Theaming
export GTK_THEME=catppuccin-mocha-pink-standard+default
export QT_QPA_PLATFORMTHEME=qt5ct
export QT_WAYLAND_DISABLE_WINDOWDECORATION=1

## Theaming for tui apps, like nmtui.
export NEWT_COLORS='root=black,black;window=black,black;border=white,black;listbox=white,black;label=blue,black;checkbox=red,black;title=green,black;button=white,red;actsellistbox=white,red;actlistbox=white,gray;compactbutton=white,gray;actcheckbox=white,blue;entry=lightgray,black;textbox=blue,black'

# XDG data dir
export XDG_CONFIG_HOME=$HOME/.config
export XDG_CACHE_HOME=$HOME/.cache
export XDG_DATA_HOME=$HOME/.local/share
export XDG_STATE_HOME=$HOME/.local/state

export XDG_DESKTOP_DIR="$HOME/"
export XDG_DOWNLOAD_DIR="$HOME/downloads"
export XDG_TEMPLATES_DIR="$HOME/"
export XDG_PUBLICSHARE_DIR="$HOME/media/share"
export XDG_DOCUMENTS_DIR="$HOME/media/documents"
export XDG_MUSIC_DIR="$HOME/media/music"
export XDG_PICTURES_DIR="$HOME/visual-media"
export XDG_VIDEOS_DIR="$HOME/visual-media"

# Per application datadirs
export GRADLE_USER_HOME="$XDG_DATA_HOME"/gradle
export GOCACHE=$XDG_CACHE_HOME/go
export GOPATH="$XDG_DATA_HOME"/go
export ANDROID_USER_HOME="$XDG_DATA_HOME"/android
export WINEPREFIX="$XDG_DATA_HOME"/wine
export TEXMFVAR="$XDG_CACHE_HOME"/texlive/texmf-var 
export NUGET_PACKAGES="$XDG_CACHE_HOME"/NuGetPackages
export NODE_REPL_HISTORY="$XDG_DATA_HOME"/node_repl_history
export MPLAYER_HOME="$XDG_CONFIG_HOME"/mplayer
export LESSHISTFILE="$XDG_STATE_HOME"/less/history
export KDEHOME="$XDG_CONFIG_HOME"/kde
export XCURSOR_PATH=/usr/share/icons:$XDG_DATA_HOME/icons 
export GTK2_RC_FILES="$XDG_CONFIG_HOME"/gtk-2.0/gtkrc
export DOTNET_CLI_HOME="$XDG_DATA_HOME"/dotnet
export DOCKER_CONFIG="$XDG_CONFIG_HOME"/docker 
export CARGO_HOME="$XDG_DATA_HOME"/cargo 

# other
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export MOZ_WEBRENDER=1
if [ -z "${WINEDLLPATH-}" ]; then       
    export WINEDLLPATH=/opt/discord-rpc/bin64:/opt/discord-rpc/bin32
else               
    export WINEDLLPATH=$WINEDLLPATH:/opt/discord-rpc/bin64:/opt/discord-rpc/bin32
fi   
