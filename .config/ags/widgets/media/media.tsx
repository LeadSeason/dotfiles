import { Accessor, For, createBinding, createState } from "ags";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { timeout } from "ags/time";
import app from "ags/gtk4/app";
import Mpris from "gi://AstalMpris"
import { iconLookup, truncateText } from "../../tools/utils";
import { exec, execAsync } from "ags/process";

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

const [visible, setVisible] = createState<boolean>(false)
const [visibleBlock, setVisibleBlock] = createState<boolean>(false)
let count = 0

export const showMedia = (timeoutTime: number = 5000) => {
    setVisible(true)
    count++
    timeout(timeoutTime, () => {
        count--
        if (count === 0 && !visibleBlock.get()) setVisible(false)
    })
}

const [playerVisible, setPlayerVisible] = createState<number>(0)

function MediaPlayer({ data: data }: { data: [Mpris.Player, Accessor<number>] }) {
    const player = data[0]
    const index = data[1]

    createBinding(player, "playbackStatus").subscribe(() => {
        console.log("playbackStatus", player.playbackStatus)
        if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) {
            setPlayerVisible(index.get())
        }
    })

    const title = createBinding(player, "title").as(t =>
        truncateText(t, 60) || "Unknown Track")

    const artist = createBinding(player, "artist").as(a =>
        a || "Unknown Artist")

    const playerIcon = createBinding(player, "entry").as(e =>
        iconLookup((e != null) ? e : "") ? e : "audio-x-generic-symbolic")

    const position = createBinding(player, "position").as(p => player.length > 0
        ? p / player.length : 0)

    const playIcon = createBinding(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic")

    return <box
        class="MediaPlayer"
        visible={playerVisible.as((v) => v === index.get())}
    >
        <image
            heightRequest={120}
            widthRequest={120}
            file={createBinding(player, "coverArt")}
        />
        <box orientation={Gtk.Orientation.VERTICAL}>
            <box class="title">
                <label label={title} hexpand maxWidthChars={30} wrap halign={Gtk.Align.START} />
                <image iconName={playerIcon} valign={Gtk.Align.START} />
            </box>
            <box class="artist">
                <label label={artist} />
            </box>
            <slider
                visible={createBinding(player, "length").as(l => l > 0)}
                onChangeValue={({ value }) => {player.position = value * player.length}}
                value={position}
                vexpand
                valign={Gtk.Align.END}
            />
            <box class="actions">
                <label 
                    label={createBinding(player, "position").as(lengthStr)}
                    visible={createBinding(player, "length").as(l => l > 0)}
                    hexpand
                    halign={Gtk.Align.START}
                />
                <box class="controls">
                    <button
                        onClicked={() => player.previous()}
                        visible={createBinding(player, "canGoPrevious")}
                    >
                        <image 
                            marginStart={4} /* Kind of a hack but to center the image*/
                            iconName="media-skip-backward-symbolic" />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        visible={createBinding(player, "canControl")}
                    >
                        <image
                            marginStart={4} /* Kind of a hack but to center the image*/
                            iconName={playIcon} />
                    </button>
                    <button 
                        onClicked={() => player.next()}
                        visible={createBinding(player, "canGoNext")}
                    >
                        <image
                            marginStart={4} /* Kind of a hack but to center the image*/
                            iconName="media-skip-forward-symbolic" />
                    </button>
                    <button
                        class={createBinding(player, "shuffleStatus").as((a) => 
                        (a === 1) ? "enabled" : "")}
                        onClicked={() => player.shuffle()}
                    >
                        <image
                            marginStart={4} /* Kind of a hack but to center the image*/
                            iconName="media-playlist-shuffle-symbolic" />
                    </button>
                </box>
                <label
                    hexpand
                    halign={Gtk.Align.END}
                    label={createBinding(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                    visible={createBinding(player, "length").as(l => l > 0 )}
                />
            </box>
        </box>
    </box>

}

function MediaReveler() {
    const mpris = Mpris.get_default()
    
    const players = createBinding(mpris, "players")

    return <revealer
        revealChild={visible}
        transitionType={Gtk.RevealerTransitionType.CROSSFADE}
    >
        <box spacing={5} orientation={Gtk.Orientation.VERTICAL} >
            <For each={players}>
                {(item, index) => <MediaPlayer data={[item, index]} />}
            </For>
        </box>
    </revealer>
}

export default function Media() {
    let win: Gtk.Window
    return <window
        $={(self) => {
            win = self
            visible.subscribe(() => {
                if (visible.get()) {
                    self.show()
                } else {
                    timeout(200, () => self.hide())
                }
            })
        }}
        name="AstalMedia"
        class="AstalMedia"
        namespace="AstalMedia"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        keymode={Astal.Keymode.ON_DEMAND}
        marginTop={10}
        marginRight={10}
        visible={true}
    >
        <Gtk.GestureClick
            onPressed={(source, arg0, x, y) => {
                win.hide()
            }}
        />
        <Gtk.EventControllerMotion 
            onEnter={() => {
                setVisibleBlock(true)
            }}
            onLeave={() => {
                setVisibleBlock(false)
                showMedia()
            }}
        />
        <MediaReveler />
    </window>
}