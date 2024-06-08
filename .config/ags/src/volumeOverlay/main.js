const audio = await Service.import('audio')
import GLib from 'gi://GLib';

var ClockTimeout;
var oldVolume = audio.speaker.volume;

export default () => {
    const volSlider = Widget.Slider({
        onChange: ({ value }) => audio.speaker.volume = value,
        value: audio.speaker.bind("volume"),
        max: 1,
        min: 0,
    })

    const volWidget = Widget.Box({
        
        class_names: ["bgbase", "fgsapphire","volumeOverlayMain", "round10"],
        child: volSlider,
    });

    const win = Widget.Window({
        name: "ags-volumeOverlay",
        anchor: ['top'],
        class_names: [],
        visible: false,
        child: volWidget,
    })

    audio.connect("speaker-changed", () => {
        if (oldVolume === audio.speaker.volume) {
            return;
        }
        oldVolume = audio.speaker.volume;

        win.visible = true;

        if (ClockTimeout) {
			// This Creates a Gjs-CRITICAL error when the timeout has finished.
            GLib.source_remove(ClockTimeout);
        }

        ClockTimeout = Utils.timeout(2500, () =>  {
            win.visible = false
        })
    });

    return win;
}
