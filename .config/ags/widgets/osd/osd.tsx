import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import Variable from "astal/variable"
import Brightness from "./brightness"
import Wp from "gi://AstalWp"

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
    const brightness = Brightness.get_default()
    const speaker = Wp.get_default()!.get_default_speaker()

    const iconName = Variable("")
    const value = Variable(0)

    let count = 0
    function show(v: number, icon: string) {

        visible.set(true)
        value.set(v)
        iconName.set(icon)
        count++
        timeout(2000, () => {
            count--
            if (count === 0) visible.set(false)
        })
    }

    return (
        <revealer
            setup={(self) => {
                self.hook(brightness, "notify::screen", () =>
                    show(brightness.screen, "display-brightness-symbolic"),
                )

                if (speaker) {
                    self.hook(speaker, "notify::volume", () =>
                        show(speaker.volume, speaker.volumeIcon),
                    )
                }
            }}
            revealChild={visible()}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
        >
            <box className="OSD">
                <icon icon={iconName()} />
                <levelbar 
                    className={"astalLevelBar"}
                    valign={Gtk.Align.CENTER}
                    widthRequest={200}
                    value={value(v => {
                        if (v > 1.50) {
                            return 1.50
                        } 
                        return v
                    })}
                    minValue={0}
                    maxValue={1.50}
                />
                <label label={value(v => `${Math.round(v * 100)}%`)} />
            </box>
        </revealer>
    )
}

export default function OSD(monitor: Gdk.Monitor) {
    const visible = Variable<boolean>(false)
    const win = (
    <window
        gdkmonitor={monitor}
        className="OSD"
        namespace="astal-osd"
        application={App}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        marginTop={20}
        marginLeft={40}
    >
        <eventbox onClick={() => visible.set(false)}>
            <OnScreenProgress visible={visible} />
        </eventbox>
    </window>)

    visible.subscribe((v) => {
        if (v) {
            win.show()
        }
        else {
            timeout(200, () => win.hide())
        }
    })
    return win;
}