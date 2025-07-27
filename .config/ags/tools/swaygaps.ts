#!/usr/bin/env -S ags run --gtk 4
import Sway from "../lib/sway"
import Cache from "./cache";
import i3ipc from "gi://i3ipc?version=1.0";

const sway = Sway.get_default();
const cache = Cache.get_default();
const conn = i3ipc.Connection.new(null)
const cacheSize = 10;

export default class SwayGaps {
    state: boolean
    toggleGaps() {
        this.state = !this.state;
        this.gaps = this.state;
    }

    set gaps(state: boolean) {
        this.state = state;
        console.log(`gaps inner ${state ? cacheSize : 0}; gaps outer ${state ? cacheSize : 0}`)
        sway.message_async(`gaps inner all set ${state ? cacheSize : 0}; gaps outer all set ${state ? cacheSize : 0}`);
        cache.data = { gaps: state };
    }
    
    get gaps(): boolean {
        return this.state;
    }

    constructor() {
        this.state = cache.data.gaps
        
        conn.on("workspace", async (conn: i3ipc.Connection, event: i3ipc.WorkspaceEvent) => {
            if (event.change === "init") {
                console.log("New sway workpaces, Better change the sizes")
                sway.message_async(`gaps inner all set ${this.state ? cacheSize : 0}; gaps outer all set ${this.state ? cacheSize : 0}`);
            }
        })

        console.log("SwayGaps init OK")
    }
}