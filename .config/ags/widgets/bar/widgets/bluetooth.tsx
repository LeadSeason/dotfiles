import { bind, execAsync } from "astal";
import { Gtk, Gdk, App, Astal } from "astal/gtk3";
import conf from "../../../conf";
import Bluetooth from "gi://AstalBluetooth"


function BTDropdown() {
    const astalBTDropdown = App.get_window("AstalBTDropdown");

    // Reopen of already exists
    if (astalBTDropdown) {
        if (astalBTDropdown.is_visible()) {
            astalBTDropdown.hide();
        } else {
            astalBTDropdown.show();
        }
        return astalBTDropdown;
    }

    const bluetooth = Bluetooth.get_default();

    const BtDevices = () => <box vertical spacing={7}>
        {bind(bluetooth, "devices").as((devices) => (devices.map((device) => {
            return <box
                spacing={50}
            >
                <label
                    css={bind(device, "connected").as(v => v ? "font-weight: bold;" : "")}
                    label={device.name}
                />
                <switch
                    state={bind(device, "connected")}
                    onState-set={(event) => {
                        if (device.get_connected()) {
                            device.connect_device()
                        }
                        else {
                            device.disconnect_device()
                        }
                    }}
                />
            </box>
        })))}
    </box>;


    return <window
        name="AstalBTDropdown"
        namespace="AstalBTDropdown"
        className="AstalBTDropdown"
        application={App}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        marginRight={42}
        marginTop={50}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box
            className={"Base"}
            spacing={5}
            vertical
        >
            <BtDevices />
        </box>
    </window>
}

export default () => {
    const bluetooth = Bluetooth.get_default()

    for (const device of bluetooth.get_devices()) {
    }


    return <button
        label="BT"
        onButtonPressEvent={(self, event) => {
            if (event.get_button()[1] == 1) {
                BTDropdown();
            }
        }}
    >
    </button>
}