
export default() => Widget.Button({
    class_names: ["sapphire", "infoBox"],
    hpack: 'start',
    child: Widget.Label(''),

    on_primary_click: () => Utils.execAsync("bash -c \"if pgrep rofi; then pkill rofi; else /home/leadseason/.config/rofi/powermenu.sh; fi;\" & ")
});