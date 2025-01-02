import { execAsync, bind } from "astal"
import { Gtk } from "astal/gtk3"
import SwayNc from "../../../lib/swaync"


export default() => {
    const swayNc = SwayNc.get_default()
    
    return <box
        className="widgetbox"
    >
            <button
            className="Notification"
            onClick={(p, e) => {
                switch (e.button) {
                    case 1:
                        execAsync("swaync-client -t -sw")
                        break;
                    case 2:
                        execAsync("swaync-client -C -sw")
                        break;
                    case 3:
                        execAsync("swaync-client -d -sw")
                        break;
                    default:
                }
            }}
        >
            <box>
                <revealer
                    transition_duration={250}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                    revealChild={bind(swayNc, "count").as((v) => {
                        return v > 0;
                    })}
                >
                    <label
                        className="Badge"
                        label={bind(swayNc, "count").as((v) => v.toString())} />                
                </revealer>
                <label label={bind(swayNc, "dnd").as((v) => {
                    return v ? "" : ""})}/>
            </box>
        </button>
    </box>
}