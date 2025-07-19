import GObject, { register, getter, setter } from "ags/gobject"
import { monitorFile, readFileAsync } from "ags/file"
import { exec, execAsync } from "ags/process"

const get = (args: string) => Number(exec(`brightnessctl ${args}`))
const screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`)
let kbd = exec(`bash -c "ls -w1 /sys/class/leds | grep kbd | head -1"`)
if (!kbd)
    kbd = exec(`bash -c "ls -w1 /sys/class/leds | head -1"`)

@register({ GTypeName: "Brightness" })
export default class Brightness extends GObject.Object {
    static instance: Brightness
    static get_default() {
        if (!this.instance)
            this.instance = new Brightness()

        return this.instance
    }

    #kbdMax = get(`--device ${kbd} max`)
    #kbd = get(`--device ${kbd} get`)
    #screenMax = get("max")
    #screen = get("get") / (get("max") || 1)
    #isPresent = (screen == "") ? false : true;

    @getter(Number)
    get kbdMax() { return this.#kbdMax }

    @getter(Number)
    get kbd() { return this.#kbd }

    @setter(Number)
    set kbd(value) {
        if (value < 0 || value > this.#kbdMax)
            return

        execAsync(`brightnessctl -d ${kbd} s ${value} -q`).then(() => {
            this.#kbd = value
            this.notify("kbd")
        })
    }

    @getter(Number)
    get screen() { return this.#screen }

    @setter(Number)
    set screen(percent) {
        if (percent < 0)
            percent = 0

        if (percent > 1)
            percent = 1

        execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
            this.#screen = percent
            this.notify("screen")
        })
    }

    @getter(Boolean)
    get isPresent() { return this.#isPresent };

    constructor() {
        super()

        const screenPath = `/sys/class/backlight/${screen}/brightness`
        const kbdPath = `/sys/class/leds/${kbd}/brightness`

        monitorFile(screenPath, async f => {
            const v = await readFileAsync(f)
            this.#screen = Number(v) / this.#screenMax
            this.notify("screen")
        })

        monitorFile(kbdPath, async f => {
            const v = await readFileAsync(f)
            this.#kbd = Number(v)
            this.notify("kbd")
        })
    }
}