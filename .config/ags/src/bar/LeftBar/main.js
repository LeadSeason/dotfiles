import OsIcon from "./OsIcon.js";
import SwayWorkspaces from "./SwayWorkspaces.js";

/**
 * Leftbar
 * @param {number} monitor
 */
export default (monitor) => Widget.Box({
	class_names: [],
	hpack: "start",
	children: [
		OsIcon(),
		// Monitor needs to be passed to the workspace module to indicate
		// what workspaces should be displayed on the monitor
		SwayWorkspaces(monitor),
	]
})