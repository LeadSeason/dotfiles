import App from 'resource:///com/github/Aylur/ags/app.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const ArchUpdatesData = Variable('{"text": "0", "alt": "none", "tooltip": "", "class": "none"}', {
	poll: [1000, App.configDir + "/scripts/getupdates-client", out => JSON.parse(out)],
});

export default() => Widget.Button({
	class_name: "fgsapphire",
	label: ArchUpdatesData.bind().transform(value => "󰁠" + value["text"]),
	tooltip_text: ArchUpdatesData.bind().transform(value => value["tooltip"]),
	on_clicked: () => { execAsync(`kitty --hold -e ${App.configDir}/scripts/getupdates-update.sh`); },
});