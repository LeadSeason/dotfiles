import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout, Variable } from "astal"
import { GtkSeparatorMenuItem } from "../../lib/astilfy";
import conf from "../../conf";
import Sway from "../../lib/sway";
 
const sway = Sway.get_default()

function hide() {
    App.get_window("AstalLauncher")!.hide()
}

function launchApp(application: Apps.Application) {
    application.set_frequency(application.get_frequency() + 1)
    // https://specifications.freedesktop.org/desktop-entry-spec/latest/exec-variables.html
    // Yeah, I could do the proper thing and fill in %i %c %k but I don't have any desktop entries where that would be a concern
    // %f %F %u %I Do not need to be filled in since we are'nt handling files.
    sway.message_async(`exec ${application.executable.replace(/\%f|\%F|\%u|\%U|\%d|\%D|\%n|\%N|\%i|\%c|\%k|\%v|\%m/, "")}`)    
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        className="AppButton"
        onClicked={() => { hide(); launchApp(app)}}>
        <box>
            <icon icon={app.iconName} />
            <box valign={Gtk.Align.CENTER} vertical>
                <label
                    className="name"
                    truncate
                    xalign={0}
                    label={app.name}
                />
                {app.description && <label
                    className="description"
                    wrap
                    xalign={0}
                    label={app.description}
                />}
            </box>
        </box>
    </button>
}

export default async function AppLauncher() {
    const { CENTER } = Gtk.Align
    const apps = new Apps.Apps()

    const text = Variable("")
    const list = text(text => apps.fuzzy_query(text).slice(0, conf.launcher.maxItems))
    const onEnter = () => {
        launchApp(apps.fuzzy_query(text.get())?.[0])
        hide()
    }
    
    return <window
        className="AstalLauncher"
        name="AstalLauncher"
        namespace="AstalLauncher"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        onShow={() => text.set("")}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
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
                        {list.as(list => list.map(app => (
                            <AppButton app={app} />
                        )))}
                    </box>
                    <box
                        halign={CENTER}
                        className="not-found"
                        vertical
                        visible={list.as(l => l.length === 0)}>
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