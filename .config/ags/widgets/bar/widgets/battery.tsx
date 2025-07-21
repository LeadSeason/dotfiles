import { createBinding, createState } from "ags";
import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { secondsToTime} from "../../../tools/utils";
import Gtk from "gi://Gtk?version=4.0";

export default function BatteryLevel() {
  const bat = AstalBattery.get_default()
  const powerProfiles = AstalPowerProfiles.get_default()

  const batTimeConvert = (timeRemaining: number) => {{
      let timeString = secondsToTime(timeRemaining)
      if (timeString === "00:00:00") {
        timeString = "Unknown time remaining"
      }
      if (bat.charging) {
        timeString = "Charging...\n Time to full: " + timeString
      } else {
        timeString = "Discharging \n Time to empty: " + timeString
      }
      return timeString
    }
  }

  const [batTime, setBatTime] = createState(batTimeConvert(
        (bat.charging) ? bat.timeToEmpty : bat.timeToEmpty))

  createBinding(bat, "timeToEmpty").subscribe(() => {
    if (!bat.get_charging()) {
      setBatTime(batTimeConvert(bat.timeToFull))
    }})

  createBinding(bat, "timeToFull").subscribe(() => {
    if (bat.get_charging()) {
      setBatTime(batTimeConvert(bat.timeToFull))
    }})

  return <menubutton
    tooltipText={batTime}
  >
    <box>
      <box visible={createBinding(bat, "isPresent")}>
        <label label={createBinding(bat, "percentage").as((v) => `${Math.floor(v * 100)}%`)} />
        <image iconName={createBinding(bat, "iconName")} />
      </box>
      <box visible={createBinding(bat, "isPresent").as((v) => !v)}>
        <image iconName={createBinding(powerProfiles, "activeProfile").as(v => `power-profile-${v}-symbolic`)} />
      </box>
    </box>
    <popover>
      <box spacing={5} orientation={Gtk.Orientation.VERTICAL} class="battery-popover">
        <label visible={createBinding(bat, "isPresent")} label={batTime} />
        <box spacing={5}>
          {powerProfiles.get_profiles().map((profile) => (
            <button
              onClicked={() => {
                powerProfiles.set_active_profile(profile.profile)
              }}
              class={createBinding(powerProfiles, "activeProfile").as((active: String) =>
                (active === profile.profile) ? "active" : "")}
              >
                <image iconName={`power-profile-${profile.profile}-symbolic`} />
                <label label={profile.profile} css={createBinding(powerProfiles, "activeProfile").as((active: String) => (active == profile.profile) ? "font-weight: bold;" : "")}/>
              </button>
            ))}
        </box>
      </box>
    </popover>
  </menubutton>
}