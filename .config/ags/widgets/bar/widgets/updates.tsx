import { bind, execAsync } from "astal";
import { Gtk } from "astal/gtk3";
import ArchUpdates from "../../../lib/updates";
import conf from "../../../conf";
import Sway from "../../../lib/sway";

const sway = Sway.get_default();

export default () => {
    const updates = ArchUpdates.get_default();

    const isVisible = (count: number): boolean => {
        if (count < conf.bar.minUpdates) {
            return false
        }
        return true;
    }

    return <box
        visible={bind(updates, "updatesnum").as(isVisible)}
    >
        <revealer
            transition_duration={250}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            revealChild={bind(updates, "updatesnum").as(isVisible)}
        >
            <button
                label={bind(updates, "updatesnum").as((u) => `󰁠 ${u}`)}
                tooltipText={bind(updates, "updates")}
                onClick={(self, event) => {
                    if (event.button === 1) {
                        sway.message_async("exec bash -c 'kitty --hold -e $HOME/.config/waybar/scipts/getupdates-update.sh'")
                    }
                }}
            />
        </revealer>
    </box>
} 