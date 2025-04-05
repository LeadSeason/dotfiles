import { App, Gdk, Gtk, astalify } from "astal/gtk3"
import { bind } from "astal"
import Astal from "gi://Astal?version=3.0"
import Wp from "gi://AstalWp"
import { GtkSeparatorMenuItem } from "../../../lib/astilfy"

export default () => {
    return <box
        className="Noises"
        spacing={9}
    >
        <Source/>
        <Sink/>
    </box>
} 

function MixerDropdown() {
    const astalMixer = App.get_window("AstalMixer")

    // Reopen of already exists
    if (astalMixer) {
        if (astalMixer.is_visible()) {
            astalMixer.hide();
        } else {
            astalMixer.show();
        }
        return astalMixer;
    }


    const audio = Wp.get_default()?.audio!;

    return <window
        name="AstalMixer"
        namespace="AstalMixer"
        className="AstalMixer"
        application={App}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        marginRight={42}
        marginTop={50}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box
            className={"AstalMixerBase"}
            spacing={5}
            vertical
        >
            {bind(audio, "speakers").as(v => v.sort(function(a, b) { return (a === b)? 0 : a? 1 : -1} ).map(speaker => {
            return <eventbox
                onScroll={(b, e: Astal.ScrollEvent) => {
                    speaker.volume -= e.delta_y / 150
                }}
                onClick={(b, e) => {
                    if (e.button == 3) {
                        speaker.set_mute(!speaker.get_mute())
                    }
                }}
                ><box>
                    <icon 
                        icon={bind(speaker, "volumeIcon")}
                    />
                    <box vertical>
                        <label
                            className={bind(speaker, "mute").as((v) => v ? "NameLabel NameMuted" : "NameLabel")}
                            halign={Gtk.Align.START}
                            css={bind(speaker, "isDefault").as(v => v ? "font-weight: bold;" : "")} 
                            label={bind(speaker, "description")}
                        />
                        <box>
                            <slider
                                className={"AstalMixerSlider"}
                                hexpand
                                min={0}
                                max={1.50}
                                onDragged={({ value }) => speaker.volume = value}
                                value={bind(speaker, "volume")}
                            />
                            <label label={bind(speaker, "volume").as((vol) => `${Math.round(vol * 100)}%`)}/>
                        </box>
                    </box>
                </box></eventbox>                
            }))}
        <GtkSeparatorMenuItem/>
            {bind(audio, "streams").as(v => v.map(endpoint => {
                return <eventbox
                    onScroll={(b, e: Astal.ScrollEvent) => {
                        endpoint.volume -= e.delta_y / 150
                    }}
                    onClick={(b, e) => {
                        if (e.button == 3) {
                            endpoint.set_mute(!endpoint.get_mute())
                        }
                    }}
                ><box>
                    <icon 
                        icon={bind(endpoint, "icon")}
                    />
                    <box vertical>
                        <label
                            className={bind(endpoint, "mute").as((v) => v ? "NameLabel NameMuted" : "NameLabel")}
                            halign={Gtk.Align.START}
                            label={bind(endpoint, "notify").as((_) => 
                                `${endpoint.description}: ${endpoint.name}`)}
                            />
                        <box>
                            <slider
                                className={"AstalMixerSlider"}
                                hexpand
                                min={0}
                                max={1.50}
                                onDragged={({ value }) => endpoint.volume = value}
                                value={bind(endpoint, "volume")}
                            />
                            <label label={bind(endpoint, "volume").as((vol) => `${Math.round(vol * 100)}%`)}/>
                        </box>
                    </box>
                </box></eventbox>
            }))}
        </box>
    </window>
}

function Sink() {
    const device = Wp.get_default()?.audio.defaultSpeaker!
    
    return <button
        className="Sink"
        onScroll={(b, e: Astal.ScrollEvent) => {
            device.volume -= e.delta_y / 150
        }}
        onButtonPressEvent={(self, event) => {
            if (event.get_button()[1] == 3) {
                device.set_mute(!device.get_mute())
            } else if (event.get_button()[1] == 1) {
                MixerDropdown();
            }
        }}
    >
        <box
            spacing={5}
            tooltipText={bind(device, "description").as((v) => `Active Device: ${v}`)}
        >
            <label 
                className={bind(device, "mute").as((v) => {
                    return (v !== true) ? "vol" : "vol50"
                })}
                label={bind(device, "volume").as((v) => {
                    return Math.round(v * 100).toString() + "%"
                })}
                />
            <icon
                className="volicon"
                icon={bind(device, "volumeIcon")}
            />
        </box>
    </button>
}

function Source() {
    const device = Wp.get_default()?.audio.defaultMicrophone!
    
    return <button
        className="Source"
        onScroll={(b, e: Astal.ScrollEvent) => {
            device.volume -= e.delta_y / 150
        }}
        onClick={() => device.set_mute(!device.get_mute())}
    >
        <box
            spacing={5}
            tooltipText={bind(device, "description").as((v) => `Active Device: ${v}`)}
        >
            <label 
                className={bind(device, "mute").as((v) => {
                    return (v !== true) ? "vol" : "vol50"
                })}
                label={bind(device, "volume").as((v) => {
                    return Math.round(v * 100).toString() + "%"
                })}
                />
            <icon
                className="volicon"
                icon={bind(device, "volumeIcon")}
            />
        </box>
    </button>
}