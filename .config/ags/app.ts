import { App, Gdk, Gtk } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widgets/bar/Bar"
import Desktop from "./widgets/desktop/Desktop"

function main() {
    const bars = new Map<Gdk.Monitor, Gtk.Widget>()
    const desktops = new Map<Gdk.Monitor, Gtk.Widget>()

    for (const gdkmonitor of App.get_monitors()) {
        bars.set(gdkmonitor, Bar(gdkmonitor))
        desktops.set(gdkmonitor, Desktop(gdkmonitor))
    }

    App.connect("monitor-added", (_, gdkmonitor) => {
        bars.set(gdkmonitor, Bar(gdkmonitor))
        desktops.set(gdkmonitor, Desktop(gdkmonitor))
    })

    App.connect("monitor-removed", (_, gdkmonitor) => {
        bars.get(gdkmonitor)?.destroy()
        bars.delete(gdkmonitor)
        desktops.get(gdkmonitor)?.destroy()
        desktops.delete(gdkmonitor)
    })
}

App.start({
    css: style,
    main: main
})
