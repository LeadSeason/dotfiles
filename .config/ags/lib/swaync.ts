import GObject, { getter, register } from "ags/gobject"
import { subprocess } from "ags/process";

@register({ GTypeName: "SwayNc" })
export default class SwayNc extends GObject.Object {
    static instance: SwayNc

    static get_default() {
        if (!this.instance) {
            this.instance = new SwayNc();
        }
        return this.instance;
    }

    #count: number = 0;
    #dnd: boolean = false;
    #visible: boolean = false;
    #inhibited: boolean = false;

    @getter(Number)
    get count (): number { return this.#count }

    @getter(Boolean)
    get dnd (): boolean { return this.#dnd }

    @getter(Boolean)
    get visible (): boolean { return this.#visible }

    @getter(Boolean)
    get inhibited (): boolean { return this.#inhibited }



    constructor() {
        super();

        const eventHandler = async (event: SwayNcEvent) => {
            if (event.count != this.#count) {
                this.#count = event.count;
                this.notify("count");
            }
            if (event.dnd != this.#dnd) {
                this.#dnd = event.dnd;
                this.notify("dnd");
            }
            if (event.visible != this.#visible) {
                this.#visible = event.visible;
                this.notify("visible");
            }
            if (event.inhibited != this.#inhibited) {
                this.#inhibited = event.inhibited;
                this.notify("inhibited");
            }
        }

        subprocess(
            "swaync-client -s",
            (v) => {
                eventHandler(JSON.parse(v))
            },
            (v) => {
                console.log("SwayNc:", v)
            }

        )
    }
}

export interface SwayNcEvent {
  count: number
  dnd: boolean
  visible: boolean
  inhibited: boolean
}