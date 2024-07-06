import archUpdates from "./archUpdates.js";
import notificationWidget from './notificationWidget.js';
import sysTray from './sysTray.js';
import sysStats from "./sysStats.js";
import volWidget from "./volWidget.js";
import netWidget from "./netWidget.js";
import batWidget from "./battery.js";

// Some widgets may return null, on conditions. 
// @ts-ignore
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
    ].filter((w) => {
        // Filter out all null types.
        if (w === null)  {
            return false;
        }
        return true;
    })
});

export default() => Widget.Box({
	class_names: ["rightBar", "bar"],
	hpack: "end",
	children: [
        rightGroup(),
        notificationWidget(),
	]
})
