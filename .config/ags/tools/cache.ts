import GLib from "gi://GLib";
import { readFile, readFileAsync, writeFile, writeFileAsync } from "ags/file";
import GObject, { register, property, getter } from "ags/gobject"

const cacheFile = `${GLib.get_user_cache_dir()}/astal/astalcache.json`

/**
 * cache.ts - Caching module.
 *
 * For typescript, for adding new types to the data in the module add the type
 * to cacheType.
 *
 * example usage of module
 * ```ts
 * const cache = Cache.get_default()
 * cache.data = { testData: "Hello world" }
 * console.log(cache.data.testData)
 * ```
 */



// For typescript, for adding new types to the data in the module add the type
// to cacheType.

function getCacheData(): cacheType {
    /* @ts-expect-error */
    let data: cacheType = {
        lastSave: 0
    }

    let rawData = ""
    try {
        rawData = readFile(cacheFile)
    } catch (error) {
        console.log(error)
        return data
    }

    try {
        data = JSON.parse(rawData)
    } catch (e) {
        console.log(`Error in Cachefile (${cacheFile}): ${e}`)
    }

    if (data.lastSave === undefined) {
        data.lastSave = 0;
    }

    return data
}

async function saveCacheData(data: cacheType) {
    data.lastSave = Date.now();
    writeFile(cacheFile, JSON.stringify(data))
}

@register({ GTypeName: "Cache" })
export default class Cache extends GObject.Object {
    static instance: Cache
    static get_default() {
        if (!this.instance)
            this.instance = new Cache()

        return this.instance
    }

    #cache: cacheType = getCacheData();

    get data(): cacheType {
        return this.#cache;
    }

    set data(data: cacheMergeType) {
        let cache = this.#cache;
        // Merge cache and new data
        Object.assign(cache, data)
        if (cache === this.#cache) {
            this.#cache = cache;
            saveCacheData(this.#cache)
            .then(() => {this.notify("data")})
        }
    }

    constructor() {
        super()
    }
}

interface cacheType {
    // self - cache.ts
    lastSave: number // Don't change


    // powermagment.ts
    onAcLastProfile: string
    onAcLastBrightness: number
    onAcLastKbdBrightness: number
    onBatteryLastProfile: string
    onBatteryLastBrightness: number
    onBatteryLastKbdBrightness: number

    idleDimState: boolean
    idleDimLastState: boolean // True: AC, False: Battery
    idleDimLastPowerProfile: string
    idleDimLastBrightness: number
    idleDimLastKbd: number
}

interface cacheMergeType {
    // self - cache.ts
    lastSave?: number // Don't change

    // powermagment.ts
    onAcLastProfile?: string
    onAcLastBrightness?: number
    onAcLastKbdBrightness?: number
    onBatteryLastProfile?: string
    onBatteryLastBrightness?: number
    onBatteryLastKbdBrightness?: number

    idleDimState?: boolean
    idleDimLastState?: boolean // True: AC, False: Battery
    idleDimLastPowerProfile?: string
    idleDimLastBrightness?: number
    idleDimLastKbd?: number
}