import Gtk from "gi://Gtk?version=4.0";
import SwayNc from "../../../lib/swaync"
import { execAsync } from "ags/process"
import Gdk from "gi://Gdk?version=4.0";
import { createBinding } from "ags";

export default function Notify() {
    const swayNc = SwayNc.get_default();

    const handleClick = (e: Gtk.Button) => {
        execAsync("swaync-client -t -sw")
    }

    return <button
        onClicked={handleClick}
    >
        <box spacing={4}>
            <revealer
                transitionDuration={250}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={createBinding(swayNc, "count").as((v) => v > 0)}
            >
                <label
                    class="Badge"
                    label={createBinding(swayNc, "count").as((v) => v.toString())}/>
            </revealer>
                    
            <label label={createBinding(swayNc, "dnd").as((v) => v ? "" : "")}/>
        </box>
    </button>
}