const network = await Service.import('network')

/*
 * Widget should show straight away without hovering or clingking. 
 * Is ip set,
 * can reach gw,
 * widget pitäisi näytää suoraan onko esim onko ip, onko gw, onko pääsekö wan, onko nameserver
 * Sitten tooltipiksi laitaa lisä tietoa. Esimerkki Tim: https://tims.vxlan.fi/s/UKb5B0YkIHwpTfY
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

    network.connect("changed", ({ primary }) => {
        wifiReveler.reveal_child = ( primary == "wifi" );
        wiredReveler.reveal_child = ( primary == "wired" );
    });

    return Widget.Box({
        children: [wifiReveler, wiredReveler],
    })
}
