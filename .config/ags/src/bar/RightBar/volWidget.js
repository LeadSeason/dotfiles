const audio = await Service.import('audio');

export default () => Widget.Box({
	classNames: [""],
	spacing: 15,
	children: [
		sink(),
		source(),
	],
});

function sink() {
	const icons = {
		101: "overamplified",
		67: "high",
		34: "medium",
		1: "low",
		0: "muted",
	};

	function getIcon() {
		const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
			threshold => threshold <= audio.speaker.volume * 100)

		return `audio-volume-${icons[icon]}-symbolic`
	};

	const icon = Widget.Icon({
		class_name: "fgpink",
		icon: Utils.watch(getIcon(), audio.speaker, getIcon),
	});

	function dimMuted() {
		// Returns the call state. If muted dim 50%
		if (audio.speaker.is_muted) {
			return "barVol50"
		}

		if (0 >= audio.speaker.volume * 100) {
			return "barVol50"
		}
		return "fgpink"
	};

	const amplitude = Widget.Label({
		class_name: Utils.watch(dimMuted(), audio.speaker, dimMuted),
		label: audio.speaker.bind('volume').transform(
			(v) => { return Math.round(v * 100).toString() + "%" }
		)
	});

	const volWidget = Widget.Box({
		class_name: "volume",
		spacing: 5,
		children: [icon, amplitude],
	});

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
	});
};

function source() {
	const icons = {
		50: "high",
		1: "medium",
		0: "muted",
	};

	function getIcon() {
		const icon = audio.microphone.is_muted ? 0 : [50, 1, 0].find(
			threshold => threshold <= audio.microphone.volume * 100)

		return `audio-input-microphone-${icons[icon]}-symbolic`
	};

	const icon = Widget.Icon({
		class_name: "fgpink",
		icon: Utils.watch(getIcon(), audio.microphone, getIcon),
	});

	function dimMuted() {
		if (audio.microphone.is_muted) {
			return "barVol50"
		}

		if (0 >= audio.microphone.volume * 100) {
			return "barVol50"
		}
		return "fgpink"
	};

	const amplitude = Widget.Label({
		class_name: Utils.watch(dimMuted(), audio.microphone, dimMuted),
		label: audio.microphone.bind('volume').transform(
			(v) => { return Math.round(v * 100).toString() + "%" }
		)
	});

	const volWidget = Widget.Box({
		spacing: 5,
		children: [icon, amplitude],
	});

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
	});
};