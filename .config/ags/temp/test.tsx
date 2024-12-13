#!/usr/bin/ags run
import { App, Widget } from "astal/gtk3"
import Gtk from "gi://Gtk?version=3.0"

App.start({
    instanceName: "test",
    main() {
        return <window>
            <box>
                <button
                    onClicked={(e) => {}}
                >
                   uwu
                </button>
            
                <Gtk.Button
                    
                >
                    <Gtk.Label visible={true} label="UwU" />
                </Gtk.Button>
            </box>
        </window>
    }
})