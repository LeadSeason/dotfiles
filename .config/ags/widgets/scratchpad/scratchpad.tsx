import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import { GtkSeparatorMenuItem } from "../../lib/astilfy";
import Sway from "../../lib/sway";
import { Node } from "../../lib/sway" ;

const sway = Sway.get_default()

function hide() {
    App.get_window("AstalScratchpad")!.destroy()
}

function AppEntry({ app }: { app: Node }) {
    let iconLet = <></>
    let title = ""
    let description = ""
    if (app.shell === "xwayland") {
        let elements = [
            app.window_properties?.class,
            app.window_properties?.instance,
            app.window_properties?.title,
            app.window_properties?.window_role,
            app.window_properties?.window_type
       ]
        elements.forEach(element => {
            if (Astal.Icon.lookup_icon((element != null) ? element : "") !== null) {
                iconLet = <icon icon={element} />
            }
        });
        title = (app.window_properties?.class != null) ? app.window_properties.class : ""
        description = (app.window_properties?.title != null) ? app.window_properties.title : ""
    }
    else {
        let elements = [
            app?.app_id,
            app?.name.split(" ")[0],
            app?.name
        ]
        elements.forEach(element => {
            if (Astal.Icon.lookup_icon((element != null) ? element : "") !== null) {
                iconLet = <icon icon={element} />
            }
        });
        title = (app?.app_id != null) ? app.app_id : ""
        description = (app?.name != null) ? app.name : ""
    }

    title = title.replace(title.charAt(0), title.charAt(0).toUpperCase())
    description = description.replace(description.charAt(0), description.charAt(0).toUpperCase())


    return <button
        onClicked={() => {
            hide();
            sway.message_async(`[con_id=${app.id}] scratchpad show`)
        }}
    >
        <box
            spacing={6}
        >
            {iconLet}
            <box vertical>
                <label
                    className="name"
                    truncate
                    label={title}
                    xalign={0}
                />
                <label
                    className="description"
                    wrap
                    xalign={0}
                    label={description}
                />
            </box>
        </box>
    </button>
}

export default async function AstalScratchpad() {

    // Close window if called multiple times.
    const window: Gtk.Window | null  = App.get_window("AstalScratchpad")
    if (window != null) {
        window.destroy()
        return null
    }

    const { CENTER } = Gtk.Align

    const text = Variable("")

    const sway = Sway.get_default()

    /**
     * This looks complicated
     * We need the list of con's in the scratch pad
     * tree root:
     *     __i3:
     *         __i3_scratch:
     *             Here lies all the scratchpad con's
     *             Plus they are floating.
     */
    const apps = sway.tree.nodes.find(i => i.name === "__i3")?.nodes.find(i => i.name === "__i3_scratch")?.floating_nodes

    const list = text(text => apps?.filter((app, i, apps) => {
        if (app.name.toLowerCase().match(text.toLowerCase()) !== null) {
            return true
        }

        if (app.app_id?.toLowerCase().match(text.toLowerCase()) !== null && app.app_id !== null) {
            return true
        }

        return false
    }).splice(0, 6))
    const onEnter = () => {
        sway.message_async(`[con_id=${list.get()?.[0].id}] scratchpad show`)
        hide()
    }

    return <window
        className="AstalScratchpad"
        name="AstalScratchpad"
        namespace="AstalScratchpad"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        onShow={() => text.set("")}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.destroy()
        }}>
        <box>
            <eventbox widthRequest={4000} expand onClick={hide} />
            <box hexpand={false} vertical>
                <eventbox heightRequest={100} onClick={hide} />
                <box widthRequest={500} className="AppLauncher" vertical>
                    <entry
                        placeholderText="Search"
                        text={text()}
                        onChanged={self => text.set(self.text)}
                        onActivate={onEnter}
                        setup={self => {
                            App.connect("window-toggled", (_, win) => {
                                if (win && win.name == "AstalLauncher" && win.visible == true) {
                                    self.grab_focus()
                                }
                            })
                        }}
                    />
                    <GtkSeparatorMenuItem/>
                    <box spacing={6} vertical>
                        {list.as(list => list?.map(app =>
                            <AppEntry app={app} />
                        ))}
                    </box>
                    <box
                        halign={CENTER}
                        className="not-found"
                        vertical
                        visible={list.as(l => l?.length === 0)}>
                        <icon icon="system-search-symbolic" />
                        <label label="No match found" />
                    </box>
                </box>
                <eventbox expand onClick={hide} />
            </box>
            <eventbox widthRequest={4000} expand onClick={hide} />
        </box>
    </window>
}