import { execAsync } from "astal"
import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { dialog } from "../dialog/dialog"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

export default (action="XYZ") => {
    // Close window if called multiple times.
    const window: Gtk.Window | null  = App.get_window("AstalPowermenu")
    if (window != null) {
        window.destroy()
        return null
    }

    const win = <window
        onKeyPressEvent={onKeyPress}
        className="AstalPowermenu"
        name="AstalPowermenu"
        namespace="AstalPowermenu"
        exclusivity={IGNORE}
        keymode={EXCLUSIVE}
        anchor={TOP | BOTTOM | LEFT | RIGHT}>
        <box
            halign={CENTER}
            valign={CENTER}
            className={"menu"}
            homogeneous
        >
            <button
                onClicked={lock}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Lock"}/>
                </box>
            </button>
            <button
                onClicked={sleep}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Sleep"} />
                </box>
            </button>
            <button
                onClicked={logout}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Logout"} />
                </box>
            </button>
            <button
                onClicked={reboot}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Reboot"} />
                </box>
            </button>
            <button
                onClicked={shutdown}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Shutdown"} />
                </box>
            </button>
        </box>
    </window>

    function lock() {
        dialog("Lock").then((b) => {
            if (b)
                execAsync("swaylock --grace 3")
        })
        win.destroy()
    }

    function sleep() {
        dialog("Sleep").then((b) => {
            if (b)
                execAsync("systemctl hybrid-sleep")
        })
        win.destroy()
    }

    function logout() {
        dialog("Logout").then((b) => {
            if (b)
                execAsync("swaymsg exit")
        })
        win.destroy()
    }

    function reboot() {
        dialog("Reboot").then((b) => {
            if (b)
                execAsync("systemctl reboot")
        })
        win.destroy()
    }

    function shutdown() {
        dialog("Shutdown").then((b) => {
            if (b)
                execAsync("systemctl poweroff")
        })
        win.destroy()
    }

    function close() {
        win.destroy()
    }

    function onKeyPress(_: Astal.Window, event: Gdk.Event) {
        const keyval = event.get_keyval()[1];

        if (keyval === Gdk.KEY_Escape) {
            close()
        }
    }
}
