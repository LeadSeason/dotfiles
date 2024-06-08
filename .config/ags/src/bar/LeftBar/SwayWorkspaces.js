import { Variable } from 'resource:///com/github/Aylur/ags/variable.js'


const swayWorkspaceState = new Variable("[]", {
    listen: App.configDir + '/scripts/workspace.py',
})

/**
 * @param {number} monitor
 */
export default (monitor) => {

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
                class_names: ["barWorkspace", element["workspaceType"]],
                child: Widget.Label(element["workspaceName"])
            });

            workspaces.push(workspaceButton);
        });

        return workspaces;
    };

    return Widget.Box({
        class_names: ["barSwayWorkspaces"],
        hpack: 'start',
        // @ts-ignore
        children: swayWorkspaceState.bind().as(transformWorkspaceState),
    });
};

