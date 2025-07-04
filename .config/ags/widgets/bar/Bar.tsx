import Battery from "gi://AstalBattery"
import Tray from "gi://AstalTray"
import { Astal, Gtk, Gdk, Widget } from "astal/gtk3"
import { bind, execAsync, Variable } from "astal"

import { GtkMenu, GtkMenuItem } from "../../lib/astilfy"
import Brightness from "../../lib/brightness"
import powermenu from "../powermenu/powermenu"

import SwayWS from "./widgets/swayWS"
import Clock from "./widgets/clock"
import Noises from "./widgets/noises"
import Notification from "./widgets/notification"
import Net from "./widgets/net"
import Updates from "./widgets/updates"
import Bluetooth from "./widgets/bluetooth"
import BatteryLevel from "./widgets/battery"

function SysTray() {
    const tray = Tray.get_default()

    return <box
        className="SysTray"
        spacing={5}
    >
        {bind(tray, "items").as(items => items.map(item => (
            <menubutton
                className="TrayIcon"
                tooltipMarkup={bind(item, "tooltipMarkup")}
                usePopover={false}
                actionGroup={bind(item, "action_group").as(ag => ["dbusmenu", ag])}
                menuModel={bind(item, "menu_model")}>
                <icon gicon={bind(item, "gicon")} />
            </menubutton>
        )))}
    </box>
}

function DisplayBrightness() {
    const brightness = Brightness.get_default()
    const icons = "󰃠 󰃝 󰃟 󰃞 󰃜 󰃛 󰃚".split(" ").reverse()
    return <button
        onScroll={(b, e: Astal.ScrollEvent) => {
            brightness.screen -= e.delta_y / 150
        }}
    >
        <box
            visible={bind(brightness, "isPresent")}
        >
            <label label={bind(brightness, "screen").as(v =>
                `${Math.floor(v * 100)}% ${icons[Math.floor(v * 6)]}`
            )}/>
        </box>
    </button>
}

function OSIcon() {
    return <box
        className={"OSIcon"}
    >
        <button
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
            className="BarBox"
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
                    className="widgetBox"
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