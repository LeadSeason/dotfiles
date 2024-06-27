import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import GLib from 'gi://GLib';

var ClockTimeout;

function Clock() {
	const dateText = Widget.Label({
		setup: self => self
			.poll(1000, self => Utils.execAsync(["date", "+%e.%m.%Y"])
				.then(date => self.label = `${date}`)),
	})

	const separatorText = Widget.Label({
		class_names: ["fgcrust"],
		label: " : ",
	})

	const revealerBox = Widget.Revealer({
		transition_duration: 1000,
		transition: "slide_left",
		child: Widget.Box({
			children: [
				separatorText,
				dateText
			],
		}),
	})

	const timeText = Widget.Label({
		setup: self => self
			.poll(1000, self => Utils.execAsync(["date", "+%k:%M:%S"])
				.then(date => self.label = date)),
	})

	const clockBadge = Widget.Button({
		class_names: ["barInfoBox", "Clock", "acentColor"],
		child: Widget.Box({
			children: [
				timeText,
				revealerBox
			],
		}),
	});

	clockBadge.connect('enter-notify-event', () => {
		revealerBox.reveal_child = true;
	});

	clockBadge.connect('leave-notify-event', () => {
		if (ClockTimeout) {
			// This Creates a Gjs-CRITICAL error when the timeout has finished.
			GLib.source_remove(ClockTimeout);
		}

		ClockTimeout = Utils.timeout(5000, () => {
			revealerBox.reveal_child = false;
		});
	});

	return clockBadge;
}

export default () => Widget.Box({
	class_names: ["barCenterBar", "bar"],
	hpack: "center",
	children: [
		Clock(),
	]
})