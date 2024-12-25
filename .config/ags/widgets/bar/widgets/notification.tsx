import { execAsync, bind, Variable } from "astal"
import { Gtk } from "astal/gtk3"

export default() => {
    const NotificationLister = Variable<swayncEvent>(
        {"count": 0, "dnd": false, "visible": false, "inhibited": false})
        .watch("swaync-client -s", out => JSON.parse(out))
    
    return <box
        className="widgetbox "
    >
            <button
            className="Notification"
            onClick={(p, e) => {
                switch (e.button) {
                    case 1:
                        execAsync("swaync-client -t -sw")
                        break;
                    case 2:
                        execAsync("swaync-client -d -sw")
                        break;

                    case 3:
                        execAsync("swaync-client -C -sw")
                        break;
                
                    default:
                }
            }}
        >
            <box
                onDestroy={() => NotificationLister.drop()}
            >
                <revealer
                    transition_duration={250}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                    revealChild={bind(NotificationLister).as((v) => {
                        return v.count > 0;
                    })}
                >
                    <label
                        className="Badge"
                        label={bind(NotificationLister).as((v) => v.count.toString())} />                
                </revealer>
                <label label={bind(NotificationLister).as((v) => {
                    return v.dnd ? "" : ""})}/>
            </box>
        </button>
    </box>
}

export interface swayncEvent {
  count: number
  dnd: boolean
  visible: boolean
  inhibited: boolean
}