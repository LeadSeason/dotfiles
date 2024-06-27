
export default () => {
    const monBox = Widget.Box({
        class_name: "monBox",
        child: Widget.Label("Help"),
    })
    
    const win = Widget.Window({
        name: "ags-monitorRounding",
        anchor: ['top'],
        class_names: [],
        visible: false,
        child: monBox,
    })
    return win;
}
