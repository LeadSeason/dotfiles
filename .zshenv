export ZDOTDIR=$HOME/.config/zsh/
export SYSTEMD_EDITOR=nvim
export EDITOR=nvim
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export GOCACHE=$HOME/.cache/go
if [ -z "${WINEDLLPATH-}" ]; then       
    export WINEDLLPATH=/opt/discord-rpc/bin64:/opt/discord-rpc/bin32
else               
    export WINEDLLPATH=$WINEDLLPATH:/opt/discord-rpc/bin64:/opt/discord-rpc/bin32
fi   
export GDK_BACKEND=wayland
export CLUTTER_BACKEND=wayland
export SDL_VIDEODRIVER=wayland
export XDG_SESSION_TYPE=wayland
export XDG_SESSION_DEFAULT=sway
export XDG_CURRENT_DESKTOP=sway
export MOZ_ENABLE_WAYLAND=1
export MOZ_WEBRENDER=1
export QT_QPA_PLATFORM="wayland;xcb"
export QT_WAYLAND_DISABLE_WINDOWDECORATION=1
export QT_QPA_PLATFORMTHEME=qt5ct
export GTK_THEME=Catppuccin-Mocha-Standard-Sapphire-Dark
