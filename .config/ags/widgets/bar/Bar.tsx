import { Astal, Gtk, Gdk, Widget } from "astal/gtk3"
import { bind, execAsync, Variable } from "astal"
import Battery from "gi://AstalBattery"
import Tray from "gi://AstalTray"

import SwayWS from "./widgets/swayWS"
import Clock from "./widgets/clock"
import Noises from "./widgets/noises"
import Notification from "./widgets/notification"
import Net from "./widgets/net"
import Updates from "./widgets/updates"
import Bluetooth from "./widgets/bluetooth"
import Brightness from "../../lib/brightness"
import powermenu from "../powermenu/powermenu"
import { GtkMenu, GtkMenuItem } from "../../lib/astilfy"

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
function BatteryMenu(gtkmonitor: Gdk.Monitor) {
    return new GtkMenu({
        // @ts-expect-error
        class: "battery-menu",
        children: [
            new GtkMenuItem({
                label: "Web browser",
                // @ts-expect-error
                on_activate: () => {
                    console.log("Hi!")
                }
            }),
        ]
    })
}

function BatteryLevel({gdkmonitor}: { gdkmonitor: Gdk.Monitor; }) {
    const bat = Battery.get_default()
        
    const batteryMenu = BatteryMenu(gdkmonitor)

    return <box spacing={5} className="Battery"
        visible={bind(bat, "isPresent")}
        tooltipMarkup={bind(bat, "time_to_empty").as(t =>  {
            console.log(t)
            const date = new Date(null);
            date.setSeconds(t); // specify value for SECONDS here
            return date.toISOString().slice(11, 19);
        })}
        >
        <Widget.EventBox
            >
            <box>
                <icon icon={bind(bat, "batteryIconName")} />
                <label label={bind(bat, "percentage").as(p =>
                    `${Math.floor(p * 100)}%`
                )} />
            </box>
        </Widget.EventBox>
    </box>
}

function DisplayBrightness() {
    const brightness = Brightness.get_default()
    const icons = "󰃠 󰃝 󰃟 󰃞 󰃜 󰃛 󰃚".split(" ").reverse()
    return <box>
        <label label={bind(brightness, "screen").as(v => 
            `${Math.floor(v * 100)}% ${icons[Math.floor(v * 6)]}`
        )}/>
    </box>
}

function OSIcon() {
    return <box
        className={"OSIcon"} 
    >
        <button
            // onClick={() => execAsync(
                // "bash -c \"if pgrep rofi; then pkill rofi; else /home/leadseason/.config/rofi/powermenu.sh; fi;\" & "
            // </box>)}
            onClick={() => powermenu()}
            >
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
                    <DisplayBrightness />
                    <BatteryLevel />
                    <Updates />
                    <SysTray />
                </box>
                <Notification />
            </box>
        </centerbox>
    </window>
}