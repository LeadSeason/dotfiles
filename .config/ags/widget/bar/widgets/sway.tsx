import { bind } from "astal";
import Gdk from "gi://Gdk?version=3.0";
import i3ipc from "gi://i3ipc?version=1.0";
import SwayWSS, { Displays } from "./swayWSS";

export default ({ monitor }: { monitor: Gdk.Monitor; }) => {
	const conn = i3ipc.Connection.new(null);

	// Translate Screen coordinates into display names.
	const displayData: Displays = JSON.parse(conn.message(i3ipc.MessageType.GET_OUTPUTS, ""));
	const monitorWorkarea = monitor.get_workarea();

	const displayName = displayData.find(
		(display) => display.rect.x === monitorWorkarea.x && display.rect.y === monitorWorkarea.y
	)?.name;

	const sway = SwayWSS.get_default();
	return (
		<box
			className="Workspaces"
			spacing={15}
		>
			{bind(sway, "wss").as((wss) => wss
				.filter((ws) => ws.output === displayName)
				.map((ws) => <button
					className={bind(sway, "focused").as(id => ws.id === id ? "focused" : "")}
					onClick={() => conn.message(
						i3ipc.MessageType.COMMAND,
						// Disable mouse_warping so mouse doesn't disappear when clicking.
						`mouse_warping output; workspace number ${ws.num}; mouse_warping container`
					)}
				>
					{bind(sway, "rename").as(rwss => rwss.find(rws => ws.id === rws.id)?.name)}
				</button>
				)
			)}
		</box>
	);
};