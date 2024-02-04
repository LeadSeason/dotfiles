export ZDOTDIR=$HOME/.config/zsh/
export SYSTEMD_EDITOR=nvim
export EDITOR=nvim

# Wayland
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export SDL_VIDEODRIVER=wayland
export XDG_SESSION_TYPE=wayland
export XDG_SESSION_DEFAULT=sway
export XDG_CURRENT_DESKTOP=sway
export MOZ_ENABLE_WAYLAND=1
export QT_QPA_PLATFORM="wayland;xcb"

# Theaming
export GTK_THEME=Catppuccin-Mocha-Standard-Peach-Dark
export QT_QPA_PLATFORMTHEME=qt5ct
export QT_WAYLAND_DISABLE_WINDOWDECORATION=1

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

# other
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export MOZ_WEBRENDER=1
if [ -z "${WINEDLLPATH-}" ]; then       
    export WINEDLLPATH=/opt/discord-rpc/bin64:/opt/discord-rpc/bin32
else               
    export WINEDLLPATH=$WINEDLLPATH:/opt/discord-rpc/bin64:/opt/discord-rpc/bin32
fi   
