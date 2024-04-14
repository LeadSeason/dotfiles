import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const NotificationLister = Variable('{"text": "0", "alt": "none", "tooltip": "", "class": "none"}', {
    listen: ["swaync-client -swb", out => JSON.parse(out)],
})

export default() => {
    const transformIcon = (value) => {
        switch (value["alt"]) {
            case "dnd-none":
            case "dnd-notification":
                return ""
        
            default:
                return ""
        }
    };

    const icon = Widget.Label({
        // @ts-ignore
        label: NotificationLister.bind().transform(transformIcon)
    });

    const transformBadge = (value) => {

        if (value["text"] === undefined) {
            // Resolves error on start
            return "";
        }

        return value["text"];
    };

    const badge = Widget.Label({
        class_name: "notificationBadge",
        label: NotificationLister.bind().transform(transformBadge),
    });

    const revealer = Widget.Revealer({
        reveal_child: false,
        transition: 'slide_left',
        child: badge
    });
    
    NotificationLister.connect('changed', ({ value }) => {
        revealer.reveal_child =  (value["text"] != "0");
    });

    const iconBadgeSet = Widget.Box({
        children: [
            revealer,
            icon
        ]
    });

    return Widget.Button({
        // TODO: Add Actions
        class_names: ["infoBox", "peach"],
        child: iconBadgeSet,
        onPrimaryClick: () => execAsync("swaync-client -t -sw"),
        onSecondaryClick: () => execAsync("swaync-client -d -sw"),
        onMiddleClick: () => execAsync("swaync-client -C -sw"),
    });
}