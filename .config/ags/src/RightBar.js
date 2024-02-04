import archUpdates from "./RightBar/archUpdates.js";
import notificationWidget from './RightBar/notificationWidget.js';
import sysTray from './RightBar/sysTray.js';
import sysStats from "./RightBar/sysStats.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";

const rightGroup = () => Widget.Box({
    class_names: ["infoBox", "peach"],
    spacing: 20,
    children: [
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
