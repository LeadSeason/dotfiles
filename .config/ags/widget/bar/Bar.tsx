import { App, astalify } from "astal/gtk3"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import { Variable, GLib, bind, exec, execAsync } from "astal"
import Mpris from "gi://AstalMpris"
import Hyprland from "gi://AstalHyprland"
import Battery from "gi://AstalBattery"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Tray from "gi://AstalTray"
import Sway from "./widgets/sway"
import Clock from "./widgets/clock"
import Noises from "./widgets/noises"
import Notification from "./widgets/notification"
import Net from "./widgets/net"

function SysTray() {
    const tray = Tray.get_default()

    return <box
    spacing={5}
    >
        {bind(tray, "items").as(items => items.map(item => {
            if (item.iconThemePath)
                App.add_icons(item.iconThemePath)

            const menu = item.create_menu()

            return <button
                className="Trayicon"
                tooltipMarkup={bind(item, "tooltipMarkup")}
                onDestroy={() => menu?.destroy()}
                onClickRelease={self => {
                    menu?.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null)
                }}>
                <icon gIcon={bind(item, "gicon")} />
            </button>
        }))}
    </box>
}


function BatteryLevel() {
    const bat = Battery.get_default()

    return <box className="Battery"
        visible={bind(bat, "isPresent")}>
        <icon icon={bind(bat, "batteryIconName")} />
        <label label={bind(bat, "percentage").as(p =>
            `${Math.floor(p * 100)} %`
        )} />
    </box>
}

function Media() {
    const mpris = Mpris.get_default()

    return <box className="Media">
        {bind(mpris, "players").as(ps => ps[0] ? (
            <box>
                <box
                    className="Cover"
                    valign={Gtk.Align.CENTER}
                    css={bind(ps[0], "coverArt").as(cover =>
                        `background-image: url('${cover}');`
                    )}
                />
                <label
                    label={bind(ps[0], "title").as(() =>
                        `${ps[0].title} - ${ps[0].artist}`
                    )}
                />
            </box>
        ) : (
            "Nothing Playing"
        ))}
    </box>
}

function OSIcon() {
    return <box
        className={"OSIcon"} 
    >
        <button
        onClick={() => execAsync(
            "bash -c \"if pgrep rofi; then pkill rofi; else /home/leadseason/.config/rofi/powermenu.sh; fi;\" & "
        )}>
                
    </button>
    </box>
}

export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        className="Bar"
        namespace={"AstralBar"}
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        /*
            marginTop={10}
            marginLeft={20}
            marginRight={20}
        */
        marginBottom={-10}
        anchor={TOP | LEFT | RIGHT}>
        <centerbox
            className="Barbox"
        >
            <box hexpand halign={Gtk.Align.START}>
                <OSIcon/>
                <Sway monitor={monitor} />
            </box>
            <box>
                <Clock />
            </box>
            <box hexpand halign={Gtk.Align.END} >
                <box
                    className="widgetbox rightbar"
                    spacing={14}
                    >
                    <BatteryLevel />
                    <Net />
                    <Noises />
                    <SysTray />
                </box>
                <Notification />
            </box>
        </centerbox>
    </window>
}