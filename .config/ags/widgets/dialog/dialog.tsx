import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import Sway from "../../lib/sway";

const sway = Sway.get_default()

export async function dialog(
    action: string = "Detonate C4, at Mitch's place."
): Promise<boolean> {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
    const { IGNORE } = Astal.Exclusivity;
    const { EXCLUSIVE } = Astal.Keymode;
    const { CENTER } = Gtk.Align;

    return new Promise((resolve) => {
        function yes() {
            resolve(true);
            // @ts-expect-error
            diagWindow.close();
        }

        function no() {
            resolve(false);
            // @ts-expect-error
            diagWindow.close();
        }

        function onKeyPress(w: Astal.Window, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape) {
                resolve(false);
                // @ts-expect-error
                diagWindow.close()
            }
        }

        const diagWindow = (
            <window
                className="AstalDialog"
                name="AstalDialog"
                namespace={"AstalDialog"}
                onKeyPressEvent={onKeyPress}
                exclusivity={IGNORE}
                keymode={EXCLUSIVE}
                anchor={TOP | BOTTOM | LEFT | RIGHT}>
                <box
                    className="confirmBox"
                    halign={CENTER}
                    valign={CENTER}
                    vertical
                >
                    <label
                        className="title"
                        label="Are you sure you want to do"
                    />
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
        );

        diagWindow.show(); // Display the window
    });
}