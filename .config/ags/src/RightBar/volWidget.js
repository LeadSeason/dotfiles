const audio = await Service.import('audio')

export default () => Widget.Box({
	classNames: ["fgred"],
	spacing: 15,
	children: [
		sink(),
		source(),
	],
})

function source() {
	const icons = {
		101: "overamplified",
		67: "high",
		34: "medium",
		1: "low",
		0: "muted",
	}

	function getIcon() {
		const icon = audio.microphone.is_muted ? 0 : [101, 67, 34, 1, 0].find(
			threshold => threshold <= audio.microphone.volume * 100)

		return `audio-volume-${icons[icon]}-symbolic`
	}

	const icon = Widget.Icon({
		icon: Utils.watch(getIcon(), audio.microphone, getIcon),
	})

	const amplitude = Widget.Label({
		label: audio.microphone.bind('volume').transform(
			(v) => { return Math.round(v * 100).toString() + "%" }
		)
	})

	const volWidget = Widget.Box({
		class_name: "volume",
		spacing: 5,
		children: [icon, amplitude],
	})

	return Widget.Button({
		child: volWidget,
		onClicked: (event) => (
			audio.microphone.is_muted = !audio.microphone.is_muted
		),
		onScrollUp: (event) => (
			audio.microphone.volume = audio.microphone.volume + .01
		),
		onScrollDown: (event) => (
			audio.microphone.volume = audio.microphone.volume - .01
		),
	})
}

function sink() {
	const icons = {
		101: "overamplified",
		67: "high",
		34: "medium",
		1: "low",
		0: "muted",
	}

	function getIcon() {
		const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
			threshold => threshold <= audio.speaker.volume * 100)

		return `audio-volume-${icons[icon]}-symbolic`
	}

	const icon = Widget.Icon({
		icon: Utils.watch(getIcon(), audio.speaker, getIcon),
	})

	const amplitude = Widget.Label({
		label: audio.speaker.bind('volume').transform(
			(v) => { return Math.round(v * 100).toString() + "%" }
		)
	})

	const volWidget = Widget.Box({
		class_name: "volume",
		spacing: 5,
		children: [icon, amplitude],
	})

	return Widget.Button({
		child: volWidget,
		onClicked: (event) => (
			audio.speaker.is_muted = !audio.speaker.is_muted
		),
		onScrollUp: (event) => (
			audio.speaker.volume = audio.speaker.volume + .01
		),
		onScrollDown: (event) => (
			audio.speaker.volume = audio.speaker.volume - .01
		),
	})
}