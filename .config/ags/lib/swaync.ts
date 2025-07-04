import GObject, { register, property } from "astal/gobject"
import { subprocess, Variable } from "astal"

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

    @property(Number)
    get count (): number { return this.#count }

    @property(Boolean)
    get dnd (): boolean { return this.#dnd }

    @property(Boolean)
    get visible (): boolean { return this.#visible }

    @property(Boolean)
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