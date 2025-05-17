import { App, Astal, Gtk, Gdk } from "astal/gtk3"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
const { IGNORE } = Astal.Exclusivity
const { EXCLUSIVE } = Astal.Keymode
const { CENTER } = Gtk.Align

export default (action="XYZ") => {
    const win = <window
        onKeyPressEvent={onKeyPress}
        className={"Powermenu"}
        name={"Powermenu"}
        namespace={"astal-powermenu"}
        exclusivity={IGNORE}
        keymode={EXCLUSIVE}
        anchor={TOP | BOTTOM | LEFT | RIGHT}>
        <box halign={CENTER} valign={CENTER} vertical className={"menu"}>
            <label className="title" label="Are you sure you want to do" />
            <label className="action" label={`${action}?`} />
            <box homogeneous>
                <button onClicked={yes}>
                    Yes
                </button>
                <button onClicked={no}>
                    No
                </button>
            </box>
        </box>
    </window>

    function yes() {
        win.destroy()
        print("yes")
    }

    function no() {
        win.destroy()
        print("no")
    }

    function onKeyPress(_: Astal.Window, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) {
            no()
        }
    }
}
