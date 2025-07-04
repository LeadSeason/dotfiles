import { Astal, Gtk, Gdk, Widget } from "astal/gtk3"
import { GtkMenu, GtkMenuItem } from "../../../lib/astilfy"
import { bind, Variable } from "astal"
import PowerProfiles from "gi://AstalPowerProfiles"
import Battery from "gi://AstalBattery"
import { secondsToTime } from "../../../tools/utils"

function BatteryMenu(powerProfiles: PowerProfiles.PowerProfiles) {
    return <GtkMenu widthRequest={200}>
        <GtkMenuItem
            /* @ts-ignore-error */
            submenu={<GtkMenu>
                {powerProfiles.get_profiles().map((v) => {
                        return <GtkMenuItem
                            /* @ts-ignore-error */
                            on_activate={() => powerProfiles.set_active_profile(v.profile)}
                        >
                            <box
                                spacing={10}
                            >
                                <icon icon={`power-profile-${v.profile}-symbolic`}/>
                                <label
                                    label={v.profile}
                                    css={bind(powerProfiles, "active_profile").as((a) => (v.profile == a) ? `font-weight: bold;` : ``)}
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
                <label label={bind(powerProfiles, "active_profile").as(
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

    const battState = Variable(secondsToTime(
        (bat.charging) ? bat.timeToEmpty : bat.timeToEmpty))

    bind(bat, "timeToEmpty").subscribe((v) => {
        if (!bat.get_charging()) {
            battState.set(secondsToTime(v))
        }
    })
    bind(bat, "timeToFull").subscribe((v) => {
        if (bat.get_charging()) {
            battState.set(secondsToTime(v))
        }
    })


    return <box spacing={5} className="Battery"
        visible={bind(bat, "isPresent")}
        tooltipMarkup={bind(battState)}
        >
        <button
            onButtonPressEvent={(_, e) => {
                if (e.get_button()[1] === 1) {
                    /* @ts-ignore-error */
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