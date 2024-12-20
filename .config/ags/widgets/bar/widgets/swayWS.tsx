import { bind } from "astal";
import Gdk from "gi://Gdk?version=3.0";
import i3ipc from "gi://i3ipc?version=1.0";
import Sway, { Displays } from "../../../lib/sway";

export default ({ monitor }: { monitor: Gdk.Monitor; }) => {
	const sway = Sway.get_default();
	
	// Translate Screen coordinates into display names.
	const displayData = sway.display;
	const monitorWorkarea = monitor.get_workarea();

	const displayName = displayData.find(
		(display) => display.rect.x === monitorWorkarea.x && display.rect.y === monitorWorkarea.y
	)?.name;


	return (
		<box
			className="Workspaces"
			spacing={15}
		>
			{bind(sway, "wss").as((wss) => wss
				.filter((ws) => ws.output === displayName)
				.map((ws) => <button
					className={bind(sway, "focused").as(id => ws.id === id ? "focused" : "")}
					onClick={() => 
						sway.message_async(
							`mouse_warping output; workspace number ${ws.num}; mouse_warping container`
						)
				}
				>
					{bind(sway, "rename").as(rwss => rwss.find(rws => ws.id === rws.id)?.name)}
				</button>
				)
			)}
		</box>
	);
};