import Gtk from "gi://Gtk?version=4.0";
import { execAsync } from "ags/process";
import app from "ags/gtk4/app";
import Config from "../config";

export function truncateText(text: string | null, maxLength: number = 60): string {
    if (text === null) {
        return ""
    }
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

export function secondsToTime(t: number): string {
        /* @ts-expect-error */
        const date = new Date(null);
        date.setSeconds(t); // specify value for SECONDS here
        return date.toISOString().slice(11, 19);
}

export function iconLookup(iconName: string): string | null {
    const icon = new Gtk.IconTheme().lookup_icon((iconName != null) ? iconName : "", null, 48, 1, null, null).get_icon_name()
    if (icon !== "image-missing") {
        return icon;
    }
    return null;
}

export async function reloadStyle() {
    try {
        await execAsync(`sass ./style.scss ${Config.cssPath}`)
        console.log(`${Config.instanceName}: Style reloaded`)
        app.apply_css(Config.cssPath)
        return "Style reloaded"
    } catch (e) {
        console.log(e)
        return "Failed to apply style"
    }
}