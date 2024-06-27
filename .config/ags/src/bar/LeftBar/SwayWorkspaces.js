import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const swayWorkspaceState = Variable("[]", {
    listen: [`${App.configDir}/scripts/workspace.py`]
});

/**
 * @param {number} monitor
 */
export default (monitor) => {

    /**
     * @param {String} workspaceState 
     * @returns {Array}
     */
    const transformWorkspaceState = (workspaceState) => {
        /**
         * Takes the data from python script and creates all workspace buttons
         */
        if (workspaceState === "[]") {
            return [];
        }

        const workspaces = [];
        const parsedWorkspaceState = JSON.parse(workspaceState.toString());
        const selectedDisplayWorkspaces = 
            parsedWorkspaceState[Object.keys(parsedWorkspaceState)[monitor]];

        selectedDisplayWorkspaces.forEach(element => {
            const workspaceButton = Widget.Button({
                on_primary_click: () => execAsync(`swaymsg workspace number ${element["workspaceID"]}`),
                class_names: ["barWorkspace", element["workspaceType"]],
                child: Widget.Label(element["workspaceName"])
            });

            workspaces.push(workspaceButton);
        });

        return workspaces;
    };

    return Widget.Box({
        class_names: ["barSwayWorkspaces", "bgacentColor"],
        hpack: 'start',
        // @ts-ignore
        children: swayWorkspaceState.bind().transform(transformWorkspaceState),
    });
};