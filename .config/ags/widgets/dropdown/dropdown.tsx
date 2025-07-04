import { App, Gdk } from "astal/gtk3"
import { bind } from "astal"
import Astal from "gi://Astal?version=3.0"

import Brightness from "../../lib/brightness"

export default () => {
    const brightness = Brightness.get_default()

    return <window
        name="AstalDropdown"
        namespace="AstalDropdown"
        className="AstalDropdown"
        application={App}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        marginRight={10}
        marginTop={50}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.destroy()
        }}>
        <box vertical>
            <box className={"buttons"}>
                <button>
                    <icon icon={"system-lock-screen-symbolic"} />
                </button>
                <button>
                    <icon icon={"system-lock-screen-symbolic"} />
                </button>
                <button>
                    <icon icon={"system-lock-screen-symbolic"} />
                </button>
                <button>
                    <icon icon={"system-lock-screen-symbolic"} />
                </button>
            </box>
            <slider
                className={"AstalMixerSlider"}
                hexpand
                min={0}
                max={1.50}
                onDragged={({ value }) => brightness.screen = value}
                value={bind(brightness, "screen")}
            />
        </box>
    </window>
}