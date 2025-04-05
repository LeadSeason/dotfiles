import GObject, { register, property } from "astal/gobject";
import conf from "../conf";

// From Bonjourr, https://github.com/victrme/Bonjourr
function minutator(date: Date) {
	return date.getHours() * 60 + date.getMinutes()
}

function periodOfDay(time?: number) {
	// noon & evening are + /- 60 min around sunrise/set

	const mins = minutator(time ? new Date(time) : new Date())
	const { sunrise, sunset } = suntime()

	if (mins >= 0 && mins <= sunrise - 60) return 'night'
	if (mins <= sunrise + 60) return 'noon'
	if (mins <= sunset - 60) return 'day'
	if (mins <= sunset + 60) return 'evening'
	if (mins >= sunset + 60) return 'night'

	return 'day'
}

let sunrise = 420
let sunset = 1320
let dusk = 60

function suntime(rise?: number, set?: number): Suntime {
	if (rise && set) {
		sunrise = minutator(new Date(rise))
		sunset = minutator(new Date(set))
	}

	// This calculates an approximate time between sunset and dusk
	// 16h sunset -> 40min dusk time
	// 21h sunset -> 1h10min dusk time
	const minutesInADay = 60 * 24
	const maxTimeToDusk = 100
	dusk = maxTimeToDusk - (minutesInADay - sunset) / 8

	return {
		sunrise,
		sunset,
		dusk,
	}
}

// https://unsplash.com/@bonjourr/collections
const bonjourrCollections = {
	noon: 'GD4aOSg4yQE',
	day: 'o8uX55RbBPs',
	evening: '3M2rKTckZaQ',
	night: 'bHDh4Ae7O8o',
}

@register({ GTypeName: "unsplashWallpaper" })
export default class unsplashWallpaper extends GObject.Object {
    static instance: unsplashWallpaper;
    
    static get_default() {
        if (!this.instance) {
            this.instance = new unsplashWallpaper();
        }

        return this.instance;
    }
    
    
    constructor() {
        super();
        
    }
}

interface Suntime {
	sunrise: number
	sunset: number
	dusk: number
}
type Frequency = 'tabs' | 'hour' | 'day' | 'period' | 'pause'

declare namespace Unsplash {
	type Local = {
		[key in Unsplash.Sync['lastCollec']]: Unsplash.Image[]
	}

	type CollectionTypes = 'night' | 'noon' | 'day' | 'evening' | 'user'

	interface Sync {
		time?: number
		every: Frequency
		collection: string
		pausedImage?: Unsplash.Image
		lastCollec: Unsplash.CollectionTypes
	}

	interface Image {
		url: string
		link: string
		download_link: string
		username: string
		name: string
		city: string | null
		country: string | null
		color: string
		exif?: {
			make: string
			model: string
			exposure_time: string
			aperture: string
			focal_length: string
			iso: number
		}
	}

	interface API {
		color: string
		blur_hash: string
		description: string
		exif: {
			make: string
			model: string
			exposure_time: string
			aperture: string
			focal_length: string
			iso: number
		}
		location: {
			name: string
			city: string
			country: string
		}
		urls: {
			raw: string
		}
		links: {
			html: string
			download: string
		}
		user: {
			username: string
			name: string
			links: {
				html: string
			}
		}
	}
}