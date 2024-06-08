import LeftBar from './LeftBar/main.js';
import CenterBar from "./CenterBar.js";
import RightBar from "./RightBar/main.js";


/**
 * @param {number} monitor
 */
export default monitor => Widget.Window({
	monitor,
	class_name: "barMainBar",
	name: `bar${monitor}`,
	anchor: ['top', 'left', 'right'],
	exclusivity: 'exclusive',
	child: Widget.CenterBox({
		start_widget: LeftBar(monitor),
		center_widget: CenterBar(),
		end_widget: RightBar()
	})
});