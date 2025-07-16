import AstalWp from "gi://AstalWp"
import { createBinding } from "ags"

export default function PowerMenu() {
    /**
     * Show Wifi or Ethernet, depending on the connection.
     *  - Show generic icon if no connection.
     * Show Bluetooth, if on. and plain icon if not connected to any device
     * show Battery, don't show if no battery is present.
     * Show volume
     * Show microphone
     * show brightness, if available.
     * show vpn
     */
    const { defaultSpeaker: speaker } = AstalWp.get_default()!
    return <menubutton>
        <box>
            <image iconName={createBinding(speaker, "volumeIcon")} />
        </box>
        <popover>
            <box>
            <button onClicked={() => console.log("logout")}>
                <label label="Logout" />
            </button>
            <menubutton>
                <image iconName="system-shutdown-symbolic" />
                <popover>
                    <box>
                        <button onClicked={() => console.log("Power Off")}>
                            <label label="Power Off" />
                        </button>
                        <button onClicked={() => console.log("Reboot")}>
                            <label label="Reboot" />
                        </button>
                        <button onClicked={() => console.log("Suspend")}>
                            <label label="Suspend" />
                        </button>
                    </box>
                </popover>
            </menubutton>
            </box>
        </popover>
    </menubutton>
}