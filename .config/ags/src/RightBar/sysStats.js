
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


const Cpu = () => Widget.Button({
    class_names: ["cpu", "fggreen"],
    label: cpuData.bind().transform((v) => { return " " + Math.floor(v * 100).toString() })
});

const Mem = () => Widget.Button({
    class_names: ["mem", "fgsky"],
    label: memData.bind().transform((v) => { return " " + Math.round(v * 100).toString() })
});

const Temp = () => Widget.Button({
    class_names: ["temp", "fgteal"],
    label: tempData.bind().transform((v) => { return v.toString() + "°C" })
});

export default() => Widget.Box({
    spacing: 15,
    children: [
        Cpu(),
        Mem(),
        Temp(),
    ]
})