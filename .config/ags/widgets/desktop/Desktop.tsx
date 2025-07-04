import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { Variable } from "astal";
import Sway from "../../lib/sway";
import GLib from "gi://GLib"
import { GtkMenu, GtkMenuItem, GtkSeparatorMenuItem } from "../../lib/astilfy";
import { dialog } from "../dialog/dialog";

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
            new GtkMenuItem({
                label: "File manager",
                // @ts-expect-error
                on_activate: () => {
                    sway.message_async("exec nemo")
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
                                dialog("Logoff").then((b) => {
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
                                dialog("Suspend system").then((b) => {
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
                                dialog("Shutdown system").then((b) => {
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
                                dialog("Restart system").then((b) => {
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



export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor;

    const desktopMenuUwU = desktopMenu(gdkmonitor);

    const date = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%e.%m.%Y")!);
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%k:%M:%S")!.replace(/\s/g, ""));

    return <window
        className="AstalDesktop"
        name="AstalDesktop"
        namespace={"AstalDesktop"}
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
            onButtonPressEvent={(_: Widget.EventBox, e: Gdk.Event) => {
                if (e.get_button()[1] === 3) {
                    desktopMenuUwU.popup_at_pointer(e);
                }
            }}>
                <box
                    vertical
                    valign={Gtk.Align.START}
                    halign={Gtk.Align.END}
                    spacing={20}
                    marginTop={500}
                    marginEnd={240}
                >
                    <label
                        className="Time"
                        onDestroy={() => time.drop()}
                        label={time()}
                    />
                    <label
                        className="Date"
                        onDestroy={() => date.drop()}
                        label={date()}
                    />
                </box>
            </Widget.EventBox>
    </window>
}