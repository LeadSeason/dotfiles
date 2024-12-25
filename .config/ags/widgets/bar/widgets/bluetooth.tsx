import { bind, execAsync } from "astal";
import { Gtk } from "astal/gtk3";
import conf from "../../../conf";
import Bluetooth from "gi://AstalBluetooth"

export default () => {
    const bluetooth = Bluetooth.get_default()

    for (const device of bluetooth.get_devices()) {
    }

    const btDevices = <box>
        {bind(bluetooth, "devices").as((devices) => (devices.forEach((device) => {
            <label label={device.name}/>
        })))}
    </box>

    return <box>
        <button
            label="BT"
            onButtonPressEvent={(self, event) => {
                }
        >

        </button>
    </box>

} 