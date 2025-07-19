import Battery from "gi://AstalBattery"
import Brightness from "../lib/brightness"
import Cache from "./cache"
import PowerProfiles from "gi://AstalPowerProfiles"
import { secondsToTime } from "./utils"
import { createBinding, createState } from "ags"
import { execAsync } from "ags/process"

const bat = Battery.get_default()
const brightness = Brightness.get_default()
const cache = Cache.get_default()
const power = PowerProfiles.get_default()

const [currentState, setCurrentState] = createState(bat.charging)


function populateDefaultData() {
    if (cache.data.onAcLastProfile == null)
        cache.data = { onAcLastProfile: "performance" }
    if (cache.data.onAcLastBrightness == null)
        cache.data = { onAcLastBrightness: 0.8 }
    if (cache.data.onAcLastKbdBrightness == null)
        cache.data = { onAcLastKbdBrightness: brightness.kbdMax }
    if (cache.data.onBatteryLastProfile == null)
        cache.data = { onBatteryLastProfile: "power-saver" }
    if (cache.data.onBatteryLastBrightness == null)
        cache.data = { onBatteryLastBrightness: 0.4 }
    if (cache.data.onBatteryLastKbdBrightness == null)
        cache.data = { onBatteryLastKbdBrightness: 0 }
}

function onAc() {
    // Save data and block saving, if it happens to disconnect / connect during dim state
    if (!cache.data.idleDimState) {
        cache.data = {
            onBatteryLastProfile: power.get_active_profile(),
            onBatteryLastBrightness: brightness.screen,
            onBatteryLastKbdBrightness: brightness.kbd
        }
    } else {
        return
    }

    power.set_active_profile(cache.data.onAcLastProfile)
    brightness.screen = cache.data.onAcLastBrightness
    brightness.kbd = cache.data.onAcLastKbdBrightness

}

function onBattery() {
    // Save data and block saving, if it happens to disconnect / connect during dim state
    if (!cache.data.idleDimState) {
        cache.data = {
            onAcLastProfile: power.get_active_profile(),
            onAcLastBrightness: brightness.screen,
            onAcLastKbdBrightness: brightness.kbd
        }
    } else {
        return
    }

    power.set_active_profile(cache.data.onBatteryLastProfile)
    brightness.screen = cache.data.onBatteryLastBrightness
    brightness.kbd = cache.data.onBatteryLastKbdBrightness
}

export function idleDim() {
    if (cache.data.idleDimState) {
        return
    }

    // Save data and block saving, if it happens to disconnect / connect during dim state
    if (currentState.get()) {
        cache.data = {
            onAcLastProfile: power.get_active_profile(),
            onAcLastBrightness: brightness.screen,
            onAcLastKbdBrightness: brightness.kbd
        }
    } else {
        cache.data = {
            onBatteryLastProfile: power.get_active_profile(),
            onBatteryLastBrightness: brightness.screen,
            onBatteryLastKbdBrightness: brightness.kbd
        }
    }

    cache.data = {
        idleDimState: true,
        idleDimLastState: currentState.get(),
        idleDimLastBrightness: brightness.screen,
        idleDimLastKbd: brightness.kbd,
    }

    brightness.screen = brightness.screen * .20
    brightness.kbd = 0
}

export function idleDimReturn() {
    if (!cache.data.idleDimState) {
        return
    }

    cache.data = {
        idleDimState: false,
    }

    if (currentState.get() !== cache.data.idleDimLastState) {
        if (currentState.get()) {
            onAc()
        } else {
            onBattery()
        }
        return
    }

    brightness.screen = cache.data.idleDimLastBrightness
    brightness.kbd = cache.data.idleDimLastBrightness
}

export default async function powerManagement() {
    populateDefaultData()

    createBinding(bat, "charging").subscribe(() => {
        let v = bat.charging
        if (v !== currentState.get()) {
            setCurrentState(v)
            if (v) {
                onAc()
            } else {
                onBattery()
            }
        }
    })
    createBinding(bat, "percentage").subscribe(() => {
        let v = bat.percentage
        if (!currentState.get()) {
            if (v === .20) {
                execAsync(`notify-send -u normal -i battery-level-20-symbolic "Battery at ${v * 100}%" "Battery will last for ${secondsToTime(bat.get_time_to_empty())}"`)
            } else if (v === .10) {
                execAsync(`notify-send -u urgent -i battery-level-10-symbolic "Battery at ${v * 100}%" "Battery will last for ${secondsToTime(bat.get_time_to_empty())}"`)
            }
        }
    })

}

// Handle brightness
// - Dim screen if idle timeout detected
//   - Return original value on resume
// - Dim screen when AC is disconnected
//   - Remember Old AC and battery values if charging states changed
// - Dim screen smoothly (Optional fancy)

// Notifications
// - Send notification if battery state is 30%, 15% (urgent)

// Turn kbd backlight off when AC is disconnected

// Turn on power-save mode from powerManagement

// Create a neat message for battery widget to display in tooltip
// - Power profile
// - On battery
//   - estimate Time till empty
// - On AC
//   - estimate Time till full

/*
App.start({
    instanceName: "powerManagement",
    requestHandler(request, res) {
        switch (request) {
            case "dim":
                idleDim()
                res("dimmed")
                break;
            case "undo dim":
                idleDimReturn()
                res("undid dim")

            default:
                res(`Astal Error: unknown command "${request}"`)
                break;
        }
    },
    main: powerManagement
})
*/