import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib?version=2.0";

import { exec, execAsync } from "ags/process";
import { For, createBinding } from "ags";

import Bar from "./widgets/bar/Bar";
import Scratchpad from "./widgets/scratchpad/scratchpad";

import OSD from "./widgets/osd/osd";
import { showOSD } from "./widgets/osd/osd";
import Media from "./widgets/media/media"
import { showMedia } from "./widgets/media/media";

import SwayGaps from "./tools/swaygaps";
import powerManagement from "./tools/powerManagement";
import { idleDim, idleDimReturn } from "./tools/powerManagement";

const cssPath = `${GLib.get_user_cache_dir()}/astal/astal.css`

let scratchpad:  Gtk.Window
let osd: Gtk.Window
let media: Gtk.Window
let swayGaps = new SwayGaps()

function main() {
    powerManagement()

    const monitors = createBinding(app, "monitors")

    scratchpad = Scratchpad() as Gtk.Window
    app.add_window(scratchpad)
    
    osd = OSD() as Gtk.Window
    app.add_window(osd)

    media = Media() as Gtk.Window
    app.add_window(media)

    return (
        <For each={monitors} cleanup={(win) => (win as Gtk.Window).hide()}>
            {(monitor) => <Bar gdkmonitor={monitor} />}
        </For>
    )
}

function requestHandler(request: string, res: (response: string) => void) {
    switch (request.toLowerCase().replace("_", " ")) {
        case "sass reload":
        case "scss reload":
        case "css reload":
            log("Astal: Reloading style ...")
            execAsync(`sass ./style.scss ${cssPath}`)
                .then(() => {
                    console.log("Astal: Style reloaded")
                    app.apply_css(cssPath)
                    res("Astal: Style reloaded")
                })
                .catch((e) => {
                    console.log(e)
                    res("Astal Error: Failed to apply style")
                })
            break;

        case "media":
            showMedia()
            return res("Media: showing")

        case "scratchpad":
            scratchpad.present()
            return res("Scratchpad: Launched")

        case "dim":
            idleDim()
            return res("dimmed")

        case "undo dim":
            idleDimReturn()
            return res("undid dim")
            
        case "sway toggle gaps":
        case "toggle gaps":
            swayGaps.toggleGaps()
            return res("Astal: Toggled gaps")

        case "show everything":
        case "show all":
        case "show off":
            showMedia()
            showOSD()
            scratchpad.present()
            return res("Astal: Showing off ... ")
             

        default:
            return res(`Astal Error: unknown command "${request}"`)
    }
}

exec(`sass ./style.scss ${cssPath}`)

app.start({
    requestHandler,
    css: cssPath,
    main: main,
})
