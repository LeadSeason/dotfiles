import Sway, { Node } from "../../lib/sway";

import { For, createBinding, createState } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Graphene from "gi://Graphene"
import Fuse from "fuse.js";
import { timeout } from "ags/time";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default function Scratchpad() {
    let contentBox: Gtk.Box
    let searchEntry: Gtk.Entry
    let revealer: Gtk.Revealer
    let win: Astal.Window

    const sway = Sway.get_default()

    const [apps, setApps] = createState((sway.tree.find(i => i.name === "__i3")?.nodes.find(i => i.name === "__i3_scratch")?.floating_nodes) as Node[])
    const [list, setList] = createState((sway.tree.find(i => i.name === "__i3")?.nodes.find(i => i.name === "__i3_scratch")?.floating_nodes) as Node[])
    createBinding(sway, "tree").subscribe(() => {
        setApps(sway.tree.find(i => i.name === "__i3")?.nodes.find(i => i.name === "__i3_scratch")?.floating_nodes as Node[])
    })

    function search(text: string) {
        if (text.length < 1) {
            setList(apps.get())
            return
        }
        const fuse = new Fuse(apps.get(), {
            keys: [
                "name",
                "app_id",
                "window_properties.class",
                "window_properties.instance",
                "window_properties.title",
                "window_properties.window_role",
                "window_properties.window_type"
            ],
            threshold: 0.3,
            ignoreLocation: true,
            includeScore: true,
        })

        setList(fuse.search(text).map(result => result.item))
    }

    function openApp(app: Node) {
        sway.message_async(`[con_id=${app.id}] scratchpad show`)
        hide()
        return

    }

    function hide() {
        revealer.reveal_child = false
        timeout(50, () => {
            win.hide() 
        })
    }

    // close on ESC
    // handle alt + number key
    function onKey(
        _e: Gtk.EventControllerKey,
        keyval: number,
        _: number,
        mod: number,
    ) {
        if (keyval === Gdk.KEY_Escape) {
            hide()
            return
        }
    }

    // close on click away
    function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
        const [, rect] = contentBox.compute_bounds(win)
        const position = new Graphene.Point({ x, y })

        if (!rect.contains_point(position)) {
            hide()
            return
        }
    }

    function AppEntry({ app }: { app: Node }) {
        let iconLet = <></>
        let title = ""
        let description = ""

        if (app.shell === "xwayland") {
            // X11 app
            let elements = [
                app.window_properties?.class,
                app.window_properties?.instance,
                app.window_properties?.title,
                app.window_properties?.window_role,
                app.window_properties?.window_type
           ]
            elements.forEach(element => {
                if (new Gtk.IconTheme().lookup_icon((element != null) ? element : "", null, 48, 1, null, null).get_icon_name() !== "image-missing") {
                    iconLet = <image iconName={element} />
                }
            });
            title = (app.window_properties?.class != null) ? app.window_properties.class : ""
            description = (app.window_properties?.title != null) ? app.window_properties.title : ""
        }
        else {
            // Wayland app
            let elements = [
                app?.app_id,
                (app.name != null) ? app.name.split(" ")[0] : "",
                (app.name != null) ? app.name : ""
            ]
            elements.forEach(element => {
                if (new Gtk.IconTheme().lookup_icon((element != null) ? element : "", null, 48, 1, null, null).get_icon_name() !== "image-missing") {
                    iconLet = <image iconName={element} />
                }
            });
            title = (app?.app_id != null) ? app.app_id : ""
            description = (app?.name != null) ? app.name : ""
        }

        title = title.replace(title.charAt(0), title.charAt(0).toUpperCase())
        description = description.replace(description.charAt(0), description.charAt(0).toUpperCase())

        return <button onClicked={() => openApp(app)}>
            <box spacing={6}>
                {iconLet}
                <box orientation={Gtk.Orientation.VERTICAL}  >
                    <label label={title} class="title" maxWidthChars={60} wrap xalign={0} />
                    <label label={description} class="description" maxWidthChars={60} wrap xalign={0} />
                </box>
            </box>
        </button>
    }


    return <window
            $={(ref) => (win = ref)}
            name="AstalScratchpad"
            class="AstalScratchpad"
            namespace={"AstalScratchpad"}
            anchor={TOP | BOTTOM | LEFT | RIGHT}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            onNotifyVisible={({ visible }) => {
                if (visible) {
                    setList(apps.get())
                    searchEntry.grab_focus()
                    revealer.reveal_child = true
                }
                else {
                    searchEntry.set_text("")
                }
            }}
            onDestroy={() => {

            }}
        >
            <Gtk.EventControllerKey onKeyPressed={onKey} />
            <Gtk.GestureClick onPressed={onClick} />
            <revealer
                $={(ref) => (revealer = ref)}
            >
                <box
                    $={(ref) => (contentBox = ref)}
                    name="launcher-content"
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.CENTER}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <entry
                        $={(ref) => (searchEntry = ref)}
                        onNotifyText={({ text }) => search(text)}
                        onActivate={() => {
                            openApp(list.get()[0])
                        }}
                        placeholderText="Start typing to search"
                        primaryIconName={"system-search-symbolic"}
                    />
                    <Gtk.Separator visible={list((l) => l.length > 0)} />
                    <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
                        <For each={list}>
                        {(app, index) => (
                            <AppEntry app={app} />
                        )}
                        </For>
                    </box>
                    <box
                        class="not-found"
                        valign={Gtk.Align.CENTER}
                        halign={Gtk.Align.CENTER}
                        orientation={Gtk.Orientation.VERTICAL}
                        visible={list((l) => l.length === 0)} 
                    >
                        <image iconName="system-search-symbolic" />
                        <label label="No match found" />
                    </box>
                </box>
            </revealer>
        </window>
}
/*
app.start({
    main() {
        let s = Scratchpad() as Gtk.Window
        app.add_window(s)
        s.present()
    }
})
*/