import { bind } from "astal"
import { Gtk } from "astal/gtk3"
import Network from "gi://AstalNetwork?version=0.1"

export default() => {
    const network  = Network.get_default()
    /*
     * Reveler for extra info, like interface, ssid
     */
    return <box
        className="net InfoBox accentColor"
    >
        <revealer
            transitionType={Gtk.RevealerTransitionType.NONE}
            revealChild={bind(network, "primary").as((v) => {return v === 0})}
        >
            <label label="󰅤" />
        </revealer>
        <revealer
            transitionType={Gtk.RevealerTransitionType.NONE}
            revealChild={bind(network, "primary").as((v) => {return v === 1})}
        >
            <icon 
                icon={bind(network.wired, "iconName")}
            />
        </revealer>
        <revealer
            transitionType={Gtk.RevealerTransitionType.NONE}
            revealChild={bind(network, "primary").as((v) => {return v === 2})}
        >
            <icon
                icon={bind(network.wifi, "iconName")}
                tooltipText={bind(network.wifi, "ssid").as(String)}
            />
        </revealer>
    </box>
}

function Wifi() {
    return <icon
        tooltipText={bind(wifi, "ssid").as(String)}
        className="Wifi"
        icon={bind(wifi, "iconName")}
    />
}