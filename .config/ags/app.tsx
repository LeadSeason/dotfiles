import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib?version=2.0";

import { exec } from "ags/process";
import { For, createBinding } from "ags";

import Config from "./config";
import Bar from "./widgets/bar/Bar";
import Scratchpad from "./widgets/scratchpad/scratchpad";
import OSD from "./widgets/osd/osd";
import Media from "./widgets/media/media"
import SwayGaps from "./tools/swaygaps";
import powerManagement from "./tools/powerManagement";
import { requestHandler } from "./tools/requestHandler";

let scratchpad:  Gtk.Window
let osd: Gtk.Window
let media: Gtk.Window

if (!GLib.file_test(Config.instanceCacheDir, GLib.FileTest.IS_DIR)) {
    GLib.mkdir_with_parents(Config.instanceCacheDir, 0o755);
    print("Created dir:", Config.instanceCacheDir)
} 

function main() {
    powerManagement()
    SwayGaps.get_default()

    scratchpad = Scratchpad() as Gtk.Window
    app.add_window(scratchpad)
    
    osd = OSD() as Gtk.Window
    app.add_window(osd)

    media = Media() as Gtk.Window
    app.add_window(media)

    const monitors = createBinding(app, "monitors")

    return (
        <For each={monitors} cleanup={(win) => (win as Gtk.Window).hide()}>
            {(monitor) => <Bar gdkmonitor={monitor} />}
        </For>
    )
}

exec(`sass ./style.scss ${Config.cssPath}`)

app.start({
    instanceName: Config.instanceName,
    requestHandler,
    css: Config.cssPath,
    main: main,
})
