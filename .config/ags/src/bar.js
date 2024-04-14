import LeftBar from './LeftBar/main.js';
import * as Center from "./CenterBar.js";
import RightBar from "./RightBar/main.js";


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