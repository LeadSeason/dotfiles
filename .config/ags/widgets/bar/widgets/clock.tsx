import { Variable, bind } from "astal";
import { Gtk } from "astal/gtk3";
import GLib from "gi://GLib"


export default () => {
    const date = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%e.%m.%Y")!.replace(/\s/g, ""))
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%k:%M:%S")!.replace(/\s/g, ""))
    const showReveler = Variable<boolean>(false)
    const clockTimeout = Variable<GLib.Source>(setTimeout(() => {},0))

    return <button
        onHover={() => {
            showReveler.set(true)
            // Destroy old timeout.
            const ct = clockTimeout.get()
            if (!ct.is_destroyed()) {
                ct.destroy()
            }
        }}
        onHoverLost={() => {
            // Destroy old timeout, if called before timeout has reached.
            const ct = clockTimeout.get()
            if (!ct.is_destroyed()) {
                ct.destroy()
            }

            clockTimeout.set(setTimeout(() => {
                showReveler.set(false)
            }, 5000))
        }}
    >
        <box
            className="widgetbox Clock"
        >
            <label 
                className="Time"
                onDestroy={() => time.drop()}
                label={time()}
            />
            <revealer
                transition_duration={250}
                transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                revealChild={bind(showReveler)}
            >
                <box>
                    <label 
                        className="Separator"
                        label={" : "}
                        />                
                    <label 
                        className="Date"
                        onDestroy={() => date.drop()}
                        label={date()}
                    />
                </box>
            </revealer>
        </box>
    </button>
}