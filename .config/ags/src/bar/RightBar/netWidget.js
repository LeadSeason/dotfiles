const network = await Service.import('network')

/*
 * Widget should show straight away without hovering or clingking. 
 * Is ip set,
 * can reach gw,
 * widget should show imiedtly, is ip, is gw, is wan reachable, is dns working.
 * Tooltip should contain more information. Example from Tims kde instance: https://tims.vxlan.fi/s/UKb5B0YkIHwpTfY
 */

export default() => {
    const WifiIndicator = () => Widget.Box({
        spacing: 5,
        tooltip_markup: "awd",
        children: [
            Widget.Icon({
                icon: network.wifi.bind('icon_name'),
            }),
            Widget.Label({
                label: network.wifi.bind('ssid')
                    .as(ssid => ssid || 'Unknown'),
            }),
        ],
    })

    const WiredIndicator = () => Widget.Icon({
        icon: network.wired.bind('icon_name'),
    })

    const wifiReveler = Widget.Revealer({
        reveal_child: (network.primary == "wifi"),
        transition: 'slide_left',
        child: WifiIndicator(),
    });

    const wiredReveler = Widget.Revealer({
        reveal_child: (network.primary == "wired"),
        transition: 'slide_right',
        child: WiredIndicator(),
    });
    
    const nullReveler = Widget.Revealer({
        reveal_child: (network.primary == null),
        transition: 'slide_right',
        child: Widget.Label("󰅤"),
    });

    network.connect("changed", ({ primary }) => {
        wifiReveler.reveal_child = ( primary == "wifi" );
        wiredReveler.reveal_child = ( primary == "wired" );
        nullReveler.reveal_child = ( primary == null );
    });

    return Widget.Box({
        class_names: ["fgpeach"],
        children: [wifiReveler, wiredReveler, nullReveler],
    })
}
