import GLib from "gi://GLib?version=2.0";

export default class Config {
    static instanceName = "wam";
    static instanceCacheDir= `${GLib.get_user_cache_dir()}/${this.instanceName}`

    static cacheFile = `${this.instanceCacheDir}/cache.json`

    static cssPath = `${this.instanceCacheDir}/style.css`
}