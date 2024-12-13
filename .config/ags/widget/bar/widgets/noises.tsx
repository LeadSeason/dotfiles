import { bind } from "astal"
import Astal from "gi://Astal?version=3.0"
import Wp from "gi://AstalWp"

export default () => {
    return <box
        className="Noises"
        spacing={9}
    >
        <Source/>
        <Sink/>
    </box>
} 

function Sink() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!
    
    return <button
        className="Sink"
        onScroll={(b, e: Astal.ScrollEvent) => {
            speaker.volume -= e.delta_y / 150
        }}
        onClick={() => speaker.set_mute(!speaker.get_mute())}
    >
        <box
            spacing={5}
        >
            <label 
                className={bind(speaker, "mute").as((v) => {
                    return (v !== true) ? "vol" : "vol50"
                })}
                label={bind(speaker, "volume").as((v) => {
                    return Math.round(v * 100).toString() + "%"
                })}
                />
            <icon
                className="volicon"
                icon={bind(speaker, "volumeIcon")}
            />
        </box>
    </button>
}

function Source() {
    const microphone = Wp.get_default()?.audio.defaultMicrophone!
    
    return <button
        className="Source"
        onScroll={(b, e: Astal.ScrollEvent) => {
            microphone.volume -= e.delta_y / 150
        }}
        onClick={() => microphone.set_mute(!microphone.get_mute())}
    >
        <box
            spacing={5}
        >
            <label 
                className={bind(microphone, "mute").as((v) => {
                    return (v !== true) ? "vol" : "vol50"
                })}
                label={bind(microphone, "volume").as((v) => {
                    return Math.round(v * 100).toString() + "%"
                })}
                />
            <icon
                className="volicon"
                icon={bind(microphone, "volumeIcon")}
            />
        </box>
    </button>
}