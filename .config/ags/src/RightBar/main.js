import archUpdates from "./archUpdates.js";
import notificationWidget from './notificationWidget.js';
import sysTray from './sysTray.js';
import sysStats from "./sysStats.js";
import volWidget from "./volWidget.js";

const rightGroup = () => Widget.Box({
    class_names: ["infoBox", "peach"],
    spacing: 20,
    children: [
        volWidget(),
        sysStats(),
        archUpdates(),
        sysTray(),
    ]
});

export default() => Widget.Box({
	class_names: ["rightBar", "bar"],
	hpack: "end",
	children: [
        rightGroup(),
        notificationWidget(),
	]
})
