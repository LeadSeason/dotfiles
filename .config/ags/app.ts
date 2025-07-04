import { App, Gdk, Gtk } from "astal/gtk3";
import { exec, execAsync } from "astal/process";

import powerManagement from "./tools/powerManagement";
import { idleDim, idleDimReturn } from "./tools/powerManagement";

import Bar from "./widgets/bar/Bar";
// import Desktop from "./widgets/desktop/Desktop";
import Launcher from "./widgets/launcher/Launcher";
import OSD from "./widgets/osd/osd";
import Media from "./widgets/media/media"
import powermenu from "./widgets/powermenu/powermenu";
import scratchpad from "./widgets/scratchpad/scratchpad";

import { showMedia } from "./widgets/media/media";
import { GLib } from "astal";
import dropdown from "./widgets/dropdown/dropdown";
import { reduceEachTrailingCommentRange } from "typescript";

const cssPath = `${GLib.get_user_cache_dir()}/astal/astal.css`

function main() {
    powerManagement()

    const bars = new Map<Gdk.Monitor, Gtk.Widget>()
    const osd = new Map<Gdk.Monitor, Gtk.Widget>()
    const media = new Map<Gdk.Monitor, Gtk.Widget>()
    // const desktops = new Map<Gdk.Monitor, Gtk.Widget>()

    for (const gdkmonitor of App.get_monitors()) {
        bars.set(gdkmonitor, Bar(gdkmonitor))
        osd.set(gdkmonitor, OSD(gdkmonitor))
        media.set(gdkmonitor, Media(gdkmonitor))
        // desktops.set(gdkmonitor, Desktop(gdkmonitor))
    }

    App.connect("monitor-added", (_, gdkmonitor) => {
        bars.set(gdkmonitor, Bar(gdkmonitor))
        osd.set(gdkmonitor, OSD(gdkmonitor))
        media.set(gdkmonitor, Media(gdkmonitor))
        // desktops.set(gdkmonitor, Desktop(gdkmonitor))
    })

    App.connect("monitor-removed", (_, gdkmonitor) => {
        bars.get(gdkmonitor)?.destroy()
        bars.delete(gdkmonitor)
        osd.get(gdkmonitor)?.destroy()
        osd.delete(gdkmonitor)
        media.get(gdkmonitor)?.destroy()
        media.delete(gdkmonitor)
        // desktops.get(gdkmonitor)?.destroy()
        // desktops.delete(gdkmonitor)
    })
}

function requestHandler(request: string, res: (response: string) => void) {
    //  ags request "sass_reload" --instance astal
    switch (request.toLowerCase().replace("_", " ")) {
        case "sass reload":
        case "scss reload":
        case "css reload":
            log("Astal: Reloading style ...")
            execAsync(`sass ./style.scss ${cssPath}`)
                .then(() => {
                    console.log("Astal: Style reloaded")
                    App.apply_css(cssPath)
                    res("Astal: Style reloaded")
                })
                .catch((e) => {
                    console.log(e)
                    res("Astal Error: Failed to apply style")
                })
            break;

        case "launcher":
            const astalLauncher = App.get_window("AstalLauncher")
            if (astalLauncher) {
                astalLauncher.show()
                return res("AstalLauncher: Opened")
            }
            Launcher()
            return res("AstalLauncher: Launched")

        case "media":
            showMedia()
            return res("Media: showing")

        case "powermenu":
            powermenu()
            return res("Powermenu: Launched")

        case "scratchpad":
            scratchpad()
            return res("Scratchpad: Launched")
        
        case "dropdown":
            dropdown()
            return res("Dropdown: Launched")

        case "dim":
            idleDim()
            return res("dimmed")

        case "undo dim":
            idleDimReturn()
            return res("undid dim")

        default:
            return res(`Astal Error: unknown command "${request}"`)
    }
}

exec(`sass ./style.scss ${cssPath}`)

App.start({
    requestHandler,
    css: cssPath,
    main: main
})
