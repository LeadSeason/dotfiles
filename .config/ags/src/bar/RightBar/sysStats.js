/** @type {function([string, string] | string[]): number} */
const divide = ([total, free]) => Number.parseInt(free) / Number.parseInt(total);

const cpuData = Variable(0, {
    poll: [1000, 'top -b -n 1', out => divide(['100', out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        ?.split(/\s+/)[1]
        .replace(',', '.') || '0'])],
});

const memData = Variable(0, {
    poll: [2000, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        ?.split(/\s+/)
        .splice(1, 2) || ['1', '1'])],
});

const tempData = Variable(0, {
    poll: [1000, "bash -c \"cat /sys/devices/platform/nct6775.2592/hwmon/*/temp7_input\"", n => {
        return Math.ceil(Number.parseInt(n) / 100_0);
    }],
});


const Cpu = () => {
    const cpuIcon = Widget.Label({
        label: ""
    })

    const dataLabel = Widget.Label({
        label: cpuData.bind().transform((v) => { return Math.floor(v * 100).toString() + "%" }),
    })

    const cpuWidget = Widget.Box({
        spacing: 5,
        children:[cpuIcon, dataLabel]
    })

    return Widget.Button({
        class_names: ["cpu", "fggreen"],
        child: cpuWidget,
    });
};

const Mem = () => {	
    const memIcon = Widget.Icon({
        icon: "memory-symbolic",
    })

    const dataLabel = Widget.Label({
        label: memData.bind().transform((v) => { return Math.round(v * 100).toString() + "%" }),
    });

    const memWidget = Widget.Box({
        spacing: 5,
        children:[memIcon, dataLabel]
    });

    return Widget.Button({
        class_names: ["mem", "fgsky"],
        child: memWidget,
    });
};

const Temp = () => {
    // temperature-cold-symbolic
    // temperature-normal-symbolic
    // temperature-warm-symbolic
    const icons = {
		70: "warm",
		60: "normal",
		0: "cold",
	};

	function getIcon() {
		const icon = [70, 60, 0].find(
            threshold => threshold <= tempData.value);

		return `temperature-${icons[icon]}-symbolic`;
	};

    const tempIcon = Widget.Icon({
        icon: Utils.watch(getIcon(), tempData, getIcon),
    });

    const dataLabel = Widget.Label({
        label: tempData.bind().transform((v) => { return v.toString() + "°C" }),
    })

    const tempWidget = Widget.Box({
        children:[tempIcon, dataLabel]
    })

    return Widget.Button({
        class_names: ["mem", "fgsky"],
        child: tempWidget,
    });
};

export default() => Widget.Box({
    spacing: 15,
    children: [
        Cpu(),
        Mem(),
        Temp(),
    ]
})