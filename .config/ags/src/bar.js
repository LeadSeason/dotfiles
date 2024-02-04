import { Widget } from 'resource:///com/github/Aylur/ags/widget.js';
import * as Left from './LeftBar.js';
import * as Center from "./CenterBar.js";
import RightBar from "./RightBar.js";

// LeftBar
const LeftBar = (monitor) => Widget.Box({
	class_names: ["leftBar", "bar"],
	hpack: "start",
	children: [
		Left.OsIcon(),
		// Monitor needs to be passed to the workspace module to indicate
		// what workspaces should be displayed on the monitor
		Left.SwayWorkspaces(monitor),
	]
})

const CenterBar = () => Widget.Box({
	class_names: ["centerBar", "bar"],
	hpack: "center",
	children: [
		Center.Clock(),
	]
})


/**
 * @param {number} monitor
 */
export default monitor => Widget.Window({
	monitor,
	class_name: "MainBar",
	name: `bar${monitor}`,
	anchor: ['top', 'left', 'right'],
	exclusivity: 'exclusive',
	child: Widget.CenterBox({
		start_widget: LeftBar(monitor),
		center_widget: CenterBar(),
		end_widget: RightBar()
	})
});