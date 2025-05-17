import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import Variable from "astal/variable"
import Mpris from "gi://AstalMpris"
import { bind } from "astal"

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}


function MediaPlayer({ player }: { player: Mpris.Player }) {

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

    return <box className="MediaPlayer">
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

function OnScreenProgress({ data }: { data: Variable<boolean>[] }) {
    const visible = data[0]
    const mediaShow = data[1]
    const mpris = Mpris.get_default()

    let count = 0
    visible.subscribe((v) => {
        if (v) {
            show()
        }
    })
    const show = () => {
        visible.set(true)
        count++
        timeout(5000, () => {
            count--
            if (count === 0) visible.set(false)
        })
    }

    mediaShow.subscribe((v) => {
        if (v) {
            show()
        }
        mediaShow.set(false)
    })

    return (
        <revealer
            revealChild={visible()}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
        >
            {bind(mpris, "players").as((arr) => {
                arr.sort((a, b) => {return a.playbackStatus - b.playbackStatus})
                arr.forEach(p => {
                });
                arr[0].playbackStatus
                bind(arr[0], "playbackStatus").as(s => {
                    show()
                })
                return <MediaPlayer player={arr[0]} />
            })}
        </revealer>
    )
}

export default function Media(monitor: Gdk.Monitor, mediaShow: Variable<boolean>) {
    const visible = Variable<boolean>(false)
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
        <eventbox onClick={() => visible.set(false)}>
            <OnScreenProgress data={[visible, mediaShow]} />
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

