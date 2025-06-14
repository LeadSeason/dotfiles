import { bind, execAsync, Variable } from "astal"
import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { dialog } from "../desktop/Desktop"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

export default (action="XYZ") => {
    const selected = Variable<number>(1)

    const win = <window
        onKeyPressEvent={onKeyPress}
        className={"Powermenu"}
        name={"Powermenu"}
        namespace={"astal-powermenu"}
        exclusivity={IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        anchor={TOP | BOTTOM | LEFT | RIGHT}>
        <box
            halign={CENTER}
            valign={CENTER}
            className={"menu"}
            homogeneous
        >
            <button
                onClicked={lock}
                className={bind(selected).as((v) => (v === 1) ? "selected" : "")}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Lock"}/>
                </box>
            </button>
            <button
                onClicked={sleep}
                className={bind(selected).as((v) => (v === 2) ? "selected" : "")}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Sleep"} />
                </box>
            </button>
            <button
                onClicked={logout}
                className={bind(selected).as((v) => (v === 3) ? "selected" : "")}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Logout"} />
                </box>
            </button>
            <button
                onClicked={reboot}
                className={bind(selected).as((v) => (v === 4) ? "selected" : "")}
            >
                <box vertical>
                    <label label={""} className={"icon"} />
                    <label label={"Reboot"} />
                </box>
            </button>
            <button
                onClicked={shutdown}
                className={bind(selected).as((v) => (v === 5) ? "selected" : "")}
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
            execAsync("swaymsg exit")        
        })
        win.destroy()
    }

    function reboot() {
        dialog("Reboot").then((b) => {
            execAsync("systemctl reboot")
        })
        win.destroy()
    }
    
    function shutdown() {
        dialog("Shutdown").then((b) => {
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

        const currentSelectedValue = selected.get()

        if (keyval === 65361 || keyval === 65056) {
            // Shift left
            if (currentSelectedValue <= 1)
                selected.set(5)
            else
                selected.set(currentSelectedValue - 1)
        }
        if (keyval === 65363 || keyval == 65289) {
            // Shift right
            if (currentSelectedValue >= 5)
                selected.set(1)
            else
                selected.set(currentSelectedValue + 1)
        }
    }
}
