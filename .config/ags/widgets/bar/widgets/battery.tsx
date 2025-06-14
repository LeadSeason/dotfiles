import { Astal, Gtk, Gdk, Widget } from "astal/gtk3"
import { GtkMenu, GtkMenuItem } from "../../../lib/astilfy"
import { bind } from "astal"
import PowerProfiles from "gi://AstalPowerProfiles"
import Battery from "gi://AstalBattery"

function BatteryMenu(powerProfiles: PowerProfiles.PowerProfiles) {
    powerProfiles.set_active_profile("performance")

    return <GtkMenu widthRequest={200}>
        <GtkMenuItem
            submenu={<GtkMenu>
                {powerProfiles.get_profiles().map((v) => {
                        return <GtkMenuItem
                            on_activate={() => powerProfiles.set_active_profile(v.profile)}
                        >
                            <box
                                spacing={10}
                            >
                                <icon icon={`power-profile-${v.profile}-symbolic`}/>
                                <label 
                                    label={v.profile}
                                    css={bind(powerProfiles, "active-profile").as((a) => (v.profile == a) ? `font-weight: bold;` : ``)}
                                />
                            </box>
                        </GtkMenuItem>
                })}
            </GtkMenu>}
        >
            <box
                spacing={10}
            >
                <icon icon={bind(powerProfiles, "icon_name")} />
                <label label={bind(powerProfiles, "active-profile").as(
                    (v) => v.toString()
                )} />
            </box>
        </GtkMenuItem>
    </GtkMenu>
}

export default () => {
    const bat = Battery.get_default()
    const powerProfiles = PowerProfiles.get_default()

    const batteryMenu = BatteryMenu(powerProfiles)

    return <box spacing={5} className="Battery"
        visible={bind(bat, "isPresent")}
        tooltipMarkup={bind(bat, "time_to_empty").as(t =>  {
            /* @ts-expect-error */
            const date = new Date(null);
            date.setSeconds(t); // specify value for SECONDS here
            return date.toISOString().slice(11, 19);
        })}
        >
        <button
            onButtonPressEvent={(_, e) => {
                if (e.get_button()[1] === 1) {
                    batteryMenu.popup_at_pointer(e)
                }
            }}
        >
            <box>
                <icon icon={bind(bat, "batteryIconName")} />
                <label label={bind(bat, "percentage").as(p =>
                    `${Math.floor(p * 100)}%`
                )} />
            </box>
        </button>
    </box>
}