const battery = await Service.import('battery');


export default() => {
    const batIcon = Widget.Icon({
        icon: battery.bind('icon_name') 
    });

    const batLabel = Widget.Label({
        label: battery.bind('percent').as(p => p.toString() + "%")
    })

    const batTimeLeft = battery.bind("time_remaining").as((p) => {
        const date = new Date(null);
        date.setSeconds(p);

        let timeRemaings = date.toTimeString().split(" ")[0].split(":");
        return `${timeRemaings[0]} h ${timeRemaings[1]} min`;
    })

    return Widget.Box({
        children: [
            batIcon,
            batLabel,
        ],
        tooltip_text: batTimeLeft,
    })
}