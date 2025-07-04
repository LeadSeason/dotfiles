import { bind, execAsync } from "astal"
import { Gdk, Gtk } from "astal/gtk3"
import Network from "gi://AstalNetwork?version=0.1"

export default() => {
    const network  = Network.get_default()
    /*
     * Reveler for extra info, like interface, ssid
     */
    return <button
        className="net InfoBox accentColor"
        onClick={(self, event) => {
            execAsync("bash -c 'pgrep rofi || networkmanager_dmenu'")
                .catch((r) => console.log(r))
        }}
    >
        <box>
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(network, "primary").as((v) => {return v === 0})}
            >
                <label className={"BarIcon"} label="󰅤" />
            </revealer>
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(network, "primary").as((v) => {return v === 1})}
            >
                <icon
                    className={"BarIcon"}
                    icon={bind(network.wired, "iconName")}
                />
            </revealer>
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(network, "primary").as((v) => {return v === 2})}
            >
                <icon
                    className={"BarIcon"}
                    icon={bind(network.wifi, "iconName")}
                    tooltipText={bind(network.wifi, "ssid").as(String)}
                />
            </revealer>
        </box>
    </button>
}