import { App } from "astal/gtk3"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import { bind, execAsync } from "astal"
import Mpris from "gi://AstalMpris"
import Battery from "gi://AstalBattery"
import Tray from "gi://AstalTray"

import SwayWS from "./widgets/swayWS"
import Clock from "./widgets/clock"
import Noises from "./widgets/noises"
import Notification from "./widgets/notification"
import Net from "./widgets/net"
import Updates from "./widgets/updates"
import Bluetooth from "./widgets/bluetooth"

function SysTray() {
    const tray = Tray.get_default()

    return <box 
        className="SysTray"
        spacing={5}
    >
        {bind(tray, "items").as(items => items.map(item => (
            <menubutton
                className="Trayicon"
                tooltipMarkup={bind(item, "tooltipMarkup")}
                usePopover={false}
                actionGroup={bind(item, "action-group").as(ag => ["dbusmenu", ag])}
                menuModel={bind(item, "menu-model")}>
                <icon gicon={bind(item, "gicon")} />
            </menubutton>
        )))}
    </box>
}


function BatteryLevel() {
    const bat = Battery.get_default()

    return <box spacing={5} className="Battery"
        visible={bind(bat, "isPresent")}>
        <icon icon={bind(bat, "batteryIconName")} />
        <label label={bind(bat, "percentage").as(p =>
            `${Math.floor(p * 100)}%`
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

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        className="Bar"
        namespace={"AstalBar"}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        /*
            marginTop={10}
            marginLeft={20}
            marginRight={20}
        */
        marginBottom={0}
        anchor={TOP | LEFT | RIGHT}>
        <centerbox
            className="Barbox"
        >
            <box hexpand halign={Gtk.Align.START}>
                <OSIcon/>
                <SwayWS monitor={gdkmonitor} />
            </box>
            <box>
                <Clock />
            </box>
            <box hexpand halign={Gtk.Align.END} >
                <box
                    className="widgetbox rightbar"
                    spacing={14}
                    >
                    {/* <Bluetooth /> */}
                    <Net />
                    <Noises />
                    <BatteryLevel />
                    <Updates />
                    <SysTray />
                </box>
                <Notification />
            </box>
        </centerbox>
    </window>
}