import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import GLib from "gi://GLib?version=2.0";

import { exec, execAsync } from "ags/process";
import { For, createBinding } from "ags";

import Bar from "./widgets/bar/Bar";
import Scratchpad from "./widgets/scratchpad/scratchpad";
import { idleDim, idleDimReturn } from "./tools/powerManagement";

const cssPath = `${GLib.get_user_cache_dir()}/astal/astal.css`

let scratchpad:  Gtk.Window

function main() {
    const monitors = createBinding(app, "monitors")
    scratchpad = Scratchpad() as Gtk.Window
    app.add_window(scratchpad)

    return (
        <For each={monitors} cleanup={(win) => (win as Gtk.Window).hide()}>
            {(monitor) => <Bar gdkmonitor={monitor} />}
        </For>
    )
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
                    app.apply_css(cssPath)
                    res("Astal: Style reloaded")
                })
                .catch((e) => {
                    console.log(e)
                    res("Astal Error: Failed to apply style")
                })
            break;

        /*
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

        */
        case "scratchpad":
            scratchpad.present()
            return res("Scratchpad: Launched")
        
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

app.start({
    requestHandler,
    css: cssPath,
    main: main,
})
