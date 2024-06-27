import archUpdates from "./archUpdates.js";
import notificationWidget from './notificationWidget.js';
import sysTray from './sysTray.js';
import sysStats from "./sysStats.js";
import volWidget from "./volWidget.js";
import netWidget from "./netWidget.js";
import batWidget from "./battery.js";

const rightGroup = () => Widget.Box({
    class_names: ["barInfoBox", "acentColor"],
    spacing: 20,
    children: [
        volWidget(),
        batWidget(),
        netWidget(),
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
