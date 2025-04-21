import { App, Gdk, Gtk } from "astal/gtk3";
import { exec, execAsync } from "astal/process";
import { monitorFile } from "astal/file";
import conf from "./conf";
import Bar from "./widgets/bar/Bar";
// import Desktop from "./widgets/desktop/Desktop";
import Launcher from "./widgets/launcher/Launcher";

function main() {
    const bars = new Map<Gdk.Monitor, Gtk.Widget>()
    // const desktops = new Map<Gdk.Monitor, Gtk.Widget>()

    for (const gdkmonitor of App.get_monitors()) {
        bars.set(gdkmonitor, Bar(gdkmonitor))
        // desktops.set(gdkmonitor, Desktop(gdkmonitor))
    }

    App.connect("monitor-added", (_, gdkmonitor) => {
        bars.set(gdkmonitor, Bar(gdkmonitor))
        // desktops.set(gdkmonitor, Desktop(gdkmonitor))
    })

    App.connect("monitor-removed", (_, gdkmonitor) => {
        bars.get(gdkmonitor)?.destroy()
        bars.delete(gdkmonitor)
        // desktops.get(gdkmonitor)?.destroy()
        // desktops.delete(gdkmonitor)
    })
}

function requestHandler(request: string, res: (response: string) => void) {
    //  ags request "sass_reload" --instance astal
    switch (request) {
        case "sass_reload":
            log("Astal: Reloading style ...")
            execAsync("sass ./style.scss /tmp/style.css")
                .then(() => {
                    console.log("Astal: Style reloaded")
                    App.apply_css("/tmp/style.css")
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
            
        default:
            res("Astal Error: unknown command")
            break;
    }
}

monitorFile("./style.scss", async f => {
    if (conf.sassHotReload) {
        log("Astal: Reloading style ...")
        execAsync("sass ./style.scss /tmp/style.css")
            .then(() => {
                console.log("Astal: Style reloaded")
                App.apply_css("/tmp/style.css")
            })
            .catch((e) => {
                console.log(e)
            })
    }
})

exec("sass ./style.scss /tmp/style.css")

App.start({
    requestHandler,
    css: "/tmp/style.css",
    main: main
})
