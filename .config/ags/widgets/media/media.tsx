import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import Variable from "astal/variable"
import Mpris from "gi://AstalMpris"
import { bind } from "astal"
import { secondsToTime } from "../../tools/utils"

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}


const visible = Variable<boolean>(false)
const visibleBlock = Variable<boolean>(false)
let count = 0
export const showMedia = (timeoutTime: number = 5000) => {
    visible.set(true)
    count++
    timeout(timeoutTime, () => {
        count--
        if (count === 0 && !visibleBlock.get()) visible.set(false)
    })
}

const playerVisible = Variable<number>(0)


function MediaPlayer({ data: data }: { data: [Mpris.Player, number] }) {
    const player = data[0]
    const index = data[1]

    // Which play to show logic
    bind(player, "playbackStatus").subscribe((v) => {
        if (v === Mpris.PlaybackStatus.PLAYING) {
            playerVisible.set(index)
        }
    })

    const { START, END } = Gtk.Align

    const title = bind(player, "title").as(t =>
        t || "Unknown Track")

    const artist = bind(player, "artist").as(a =>
        a || "Unknown Artist")

    const coverArt = bind(player, "coverArt").as(c =>
        `background-image: url('${c}')`)

    const playerIcon = bind(player, "entry").as(e =>
        Astal.Icon.lookup_icon((e != null) ? e : "") ? e : "audio-x-generic-symbolic")

    const position = bind(player, "position").as(p => player.length > 0
        ? p / player.length : 0)

    const playIcon = bind(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic"
    )

    return <box
            className="MediaPlayer"
            visible={bind(playerVisible).as((v) => v === index)}
        >
        <box className="cover-art" css={coverArt} />
        <box vertical>
            <box className="title">
                <label truncate hexpand halign={START} label={title} />
                <icon icon={playerIcon} />
            </box>
            <label halign={START} valign={START} vexpand wrap label={artist} />
            <slider
                visible={bind(player, "length").as(l => l > 0)}
                onDragged={({ value }) => player.position = value * player.length}
                value={position}
            />
            <centerbox className="actions">
                <label
                    hexpand
                    className="position"
                    halign={START}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "position").as(lengthStr)}
                />
                <box>
                    <button
                        onClicked={() => player.previous()}
                        visible={bind(player, "canGoPrevious")}>
                        <icon icon="media-skip-backward-symbolic" />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        visible={bind(player, "canControl")}>
                        <icon icon={playIcon} />
                    </button>
                    <button
                        onClicked={() => player.next()}
                        visible={bind(player, "canGoNext")}>
                        <icon icon="media-skip-forward-symbolic" />
                    </button>
                    <button
                        className={bind(player, "shuffleStatus").as((a) =>
                            (a === 1) ? "enabled" : ""
                        )}
                        onClicked={() => player.shuffle()}>
                        <icon icon="media-playlist-shuffle-symbolic" />
                    </button>
                </box>
                <label
                    className="length"
                    hexpand
                    halign={END}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                />
            </centerbox>
        </box>
    </box>
}

function MediaReveler() {
    const mpris = Mpris.get_default()

    return (
        <revealer
            revealChild={visible()}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
        >
            {bind(mpris, "players").as((arr) => {
                arr.sort((a, b) => {return a.playbackStatus - b.playbackStatus})
                return <box>
                        {arr.map((player, index) => <MediaPlayer data={[player, index]} />)}
                    </box>
            })}
        </revealer>
    )
}

export default function Media(monitor: Gdk.Monitor) {
    const win = (
    <window
        gdkmonitor={monitor}
        className="Media"
        namespace="astal-osd"
        application={App}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        marginTop={20}
        marginRight={40}
    >
        <eventbox
            onClick={() => visible.set(false)}
            onHover={() => visibleBlock.set(true)}
            onHoverLost={() =>  {
                visibleBlock.set(false)
                showMedia()
            }}
        >
            <MediaReveler />
        </eventbox>
    </window>)
    win.hide()

    visible.subscribe((v) => {
        if (v) {
            win.show()
        }
        else {
            timeout(200, () => win.hide())
        }
    })
    return win;
}

