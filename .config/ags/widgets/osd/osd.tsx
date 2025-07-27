import { Accessor, createBinding, createState } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import { timeout } from "ags/time";

import Mpris from "gi://AstalMpris"
import Brightness from "../../lib/brightness"
import Wp from "gi://AstalWp"


const [visible, setVisible] = createState<boolean>(false)
const [visibleBlock, setVisibleBlock] = createState<boolean>(false)
let count = 0

const [iconName, setIconName] = createState("")
const [value, setValue] = createState(0)
const [levelMax, setLevelMax] = createState(1)


export const showOSD = (v: number | null = null, icon: string | null = null, valueMax: number | null = null, timeoutTime: number = 5000) => {
    if (valueMax)
        setLevelMax(valueMax)
    if (v)
        setValue(v)
    if (icon)
        setIconName(icon)

    setVisible(true)

    count++
    timeout(timeoutTime, () => {
        count--
        if (count === 0 && !visibleBlock.get()) setVisible(false)
    })
}

const brightness = Brightness.get_default()
const speaker = Wp.get_default()!.get_default_speaker()

function OnScreenDisplay() {
    // @ts-ignore
    createBinding(brightness, "monitor").subscribe(() => {
        showOSD(brightness.screen, "display-brightness-symbolic", 1)
    })
    
    createBinding(speaker, "volume").subscribe(() => {
        showOSD(speaker.volume, speaker.volumeIcon, 1.5)
    })

    return <revealer
        revealChild={visible}
        transitionType={Gtk.RevealerTransitionType.CROSSFADE}
    >
        <box class="OSD">
            <image iconName={iconName} />
            <levelbar
                class="astalLevelBar"
                valign={Gtk.Align.CENTER}
                widthRequest={200}
                value={value(v => {
                    if (v > levelMax.get()) {
                        return levelMax.get()
                    }
                    return v
                })}
                minValue={0}
                maxValue={levelMax}
            />
            <label label={value(v => `${Math.round(v * 100)}%`)} />
        </box>
    </revealer>
}

export default function onScreenDisplay() {
    let win: Gtk.Window

    return <window
        $={(self) => {
            win = self
            visible.subscribe(() => {
                if (visible.get()) {
                    self.show()
                } else {
                    timeout(200, () => self.hide())
                }
            })
        }}
        name="AstalOSD"
        class="AstalOSD"
        namespace="AstalOSD"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        keymode={Astal.Keymode.ON_DEMAND}
        marginTop={20}
        marginLeft={40}
        visible={true}
    >
        <Gtk.GestureClick
            onPressed={(source, arg0, x, y) => {
                setVisible(false)
                win.hide()
            }}
        />
        <Gtk.EventControllerMotion 
            onEnter={() => {
                setVisibleBlock(true)
            }}
            onLeave={() => {
                setVisibleBlock(false)
                showOSD()
            }}
        />
        <OnScreenDisplay />
    </window>
}