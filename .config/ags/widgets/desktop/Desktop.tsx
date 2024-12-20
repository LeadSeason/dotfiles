import { App, Astal, astalify, Gdk, Gtk, Widget } from "astal/gtk3"
import Sway from "../../lib/sway"
import { execAsync } from "astal"

const GtkScrolledWindow = astalify(Gtk.ScrolledWindow)
const GtkMenu = astalify(Gtk.Menu)
const GtkMenuItem = astalify(Gtk.MenuItem)
const GtkEventBox = astalify(Gtk.EventBox)
const GtkButton = astalify(Gtk.Button)
const GtkSeparatorMenuItem = astalify(Gtk.SeparatorMenuItem)
const GtkWindow = astalify(Gtk.Window)
 
const sway = Sway.get_default()

function desktopMenu(gdkmonitor: Gdk.Monitor) {
    const menu = new GtkMenu({
        // @ts-expect-error
        class: "desktop-menu",
        children: [
            new GtkMenuItem({
                label: "Web browser",
                // @ts-expect-error
                on_activate: () => {
                    sway.message_async("exec firefox-nightly")
                }
            }),
            new GtkMenuItem({
                label: "Calculator",
                // @ts-expect-error
                on_activate: () => {
                    sway.message_async("exec \"sway-floating kitty -e 'ptpython --vi'\"")
                }
            }),
            // @ts-expect-error
            new GtkSeparatorMenuItem(""),
            new GtkMenuItem({
                label: "Color picker",
                // @ts-expect-error
                on_activate: () => {
                    sway.message_async(`exec ~/.local/bin/colorpicker`)
                }
            }),
            // @ts-expect-error
            new GtkSeparatorMenuItem(""),
            new GtkMenuItem({
                label: "Exit",
                submenu: new GtkMenu({
                    // @ts-expect-error
                    children: [
                        new GtkMenuItem({
                            child: new Widget.Box({
                                spacing: 6,
                                children: [
                                    new Widget.Icon({
                                        icon: "lock-symbolic"
                                    }),
                                    new Widget.Label({label: "Lock"})
                                ]
                            }),
                            // @ts-expect-error
                            on_activate: () => {
                                sway.message_async("exec swaylock --grace 3")
                            }
                        }),
                        new GtkMenuItem({
                            child: new Widget.Box({
                                spacing: 6,
                                children: [
                                    new Widget.Icon({
                                        icon: "exit-symbolic"
                                    }),
                                    new Widget.Label({label: "Exit"})
                                ]
                            }),
                            // @ts-expect-error
                            on_activate: () => {
                                dialog(gdkmonitor, "Logoff").then((b) => {
                                    if (b) {
                                        sway.message_async("exit")
                                    }
                                })
                            }

                        }),
                        new GtkMenuItem({
                            child: new Widget.Box({
                                spacing: 6,
                                children: [
                                    new Widget.Icon({
                                        icon: "lock-symbolic"
                                    }),
                                    new Widget.Label({label: "Sleep"})
                                ]
                            }),
                            // @ts-expect-error
                            on_activate: () => {
                                dialog(gdkmonitor, "Suspend system").then((b) => {
                                    if (b) {
                                        sway.message_async("exec systemctl suspend")
                                    }
                                })
                            }

                        }),
                        new GtkMenuItem({
                            child: new Widget.Box({
                                spacing: 6,
                                children: [
                                    new Widget.Icon({
                                        icon: "system-shutdown-panel-symbolic"
                                    }),
                                    new Widget.Label({label: "Shutdown"})
                                ]
                            }),
                            // @ts-expect-error
                            on_activate: () => {
                                dialog(gdkmonitor, "Shutdown system").then((b) => {
                                    if (b) {
                                        sway.message_async("exec systemctl poweroff")
                                    }
                                })
                            }

                        }),
                        new GtkMenuItem({
                            child: new Widget.Box({
                                spacing: 6,
                                children: [
                                    new Widget.Icon({
                                        icon: "system-restart-panel-symbolic"
                                    }),
                                    new Widget.Label({label: "Restart"})
                                ]
                            }),
                            // @ts-expect-error
                            on_activate: () => {
                                dialog(gdkmonitor, "Restart system").then((b) => {
                                    if (b) {
                                        sway.message_async("exec systemctl reboot")
                                    }
                                })
                            }
                        }),
                    ]
                })
            })
        ]
    })

    return menu
}

async function dialog(gdkmonitor: Gdk.Monitor, action: string = "Detonate C4"): Promise<boolean> {
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
                w.close();
                resolve(false);
            }
        }

        const diagWindow = (
            <window
                gdkmonitor={gdkmonitor}
                className="AstalConfirm"
                name="AstalConfirm"
                namespace={"AstalConfirm"}
                onKeyPressEvent={onKeyPress}
                exclusivity={IGNORE}
                keymode={EXCLUSIVE}
                anchor={TOP | BOTTOM | LEFT | RIGHT}>
                <box className="confirmBox" halign={CENTER} valign={CENTER} vertical>
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
        );

        diagWindow.show(); // Display the window
    });
}


export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor
    
    const desktopMenuUwU = desktopMenu(gdkmonitor)

    return <window
        className="desktop"
        namespace={"AstralBg"}
        gdkmonitor={gdkmonitor}
        layer={Astal.Layer.BACKGROUND}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        /*
            marginTop={10}
            marginLeft={20}
            marginRight={20}
        */
        marginBottom={-10}
        anchor={ TOP | RIGHT | BOTTOM | LEFT }>
        <Widget.EventBox
            onButtonPressEvent={(_, e) => {
                if (e.get_button()[1] === 3) {
                    desktopMenuUwU.popup_at_pointer(e);
                }
            }}/>
    </window>
}