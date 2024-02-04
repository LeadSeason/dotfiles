import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import { Widget } from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js'

export const OsIcon = () => Widget.Button({
    class_names: ["sapphire", "infoBox"],
    hpack: 'start',
    child: Widget.Label(''),

    on_primary_click: () => Utils.execAsync("bash -c \"if pgrep rofi; then pkill rofi; else /home/leadseason/.config/rofi/powermenu.sh; fi;\" & ")
});

const swayWorkspaceState = new Variable("[]", {
    listen: App.configDir + '/scripts/workspace.py',
})

/**
 * @param {number} monitor
 */
export const SwayWorkspaces = (monitor) => {

    /**
     * @param {String} workspaceState 
     * @returns {Array}
     */
    const transformWorkspaceState = (workspaceState) => {
        if (workspaceState === "[]") {
            return [];
        }

        const workspaces = [];
        const parsedWorkspaceState = JSON.parse(workspaceState.toString());
        const selectedDisplayWorkspaces = 
            parsedWorkspaceState[Object.keys(parsedWorkspaceState)[monitor]];

        selectedDisplayWorkspaces.forEach(element => {
            const workspaceButton = Widget.Button({
                on_primary_click: () => Utils.execAsync(`swaymsg workspace number ${element["workspaceID"]}`),
                class_names: ["workspace", element["workspaceType"]],
                child: Widget.Label(element["workspaceName"])
            });

            workspaces.push(workspaceButton);
        });

        return workspaces;
    };

    return Widget.Box({
        class_names: ["SwayWorkspaces",],
        hpack: 'start',
        // @ts-ignore
        children: swayWorkspaceState.bind().transform(transformWorkspaceState),
    });
};