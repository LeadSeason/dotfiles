import GObject, { register, property } from "astal/gobject"
import i3ipc from "gi://i3ipc"

const conn = i3ipc.Connection.new(null)

@register({ GTypeName: "Sway" })
export default class Sway extends GObject.Object {
    static instance: Sway

    static get_default() {
        if (!this.instance)
            this.instance = new Sway()

        return this.instance
    }

    #wss: Workspaces = JSON.parse(conn.message(i3ipc.MessageType.GET_WORKSPACES, ""));
    #outputs: Displays = JSON.parse(conn.message(i3ipc.MessageType.GET_OUTPUTS, ""));
    #tree: Node = JSON.parse(conn.message(i3ipc.MessageType.GET_TREE, ""));

    @property()
    get wss () { return this.#wss };

    @property()
    get display () { return this.#outputs };

    @property()
    get outputs () { return this.#outputs };

    @property(Number)
    get focused () {
        return this.#wss.find(ws => ws.focused)?.id ?? 0;
    }

    @property(Number)
    get urgent() {
        return this.#wss.find(ws => ws.urgent)?.id ?? 0;
    }

    @property()
    get rename () {
        return this.#wss
    }

    message (message: string): Commands {
        return JSON.parse(conn.message(i3ipc.MessageType.COMMAND, message));
    }
    async message_async (message: string): Promise<Commands> {
        return await JSON.parse(conn.message(i3ipc.MessageType.COMMAND, message));
    }

    constructor() {
        super()

        conn.on("workspace", async (conn: i3ipc.Connection, event: i3ipc.WorkspaceEvent) => {
            const workspaces = await JSON.parse(conn.message(i3ipc.MessageType.GET_WORKSPACES, ""));
            this.#wss = workspaces;

            const tree = await JSON.parse(conn.message(i3ipc.MessageType.GET_TREE, ""));
            this.#tree = tree;

            switch (event.change) {
                case "focus":
                    this.notify("focused")
                    break;

                case "urgent":
                    this.notify("urgent")
                    break;

                case "rename":
                    this.notify("rename")
                    break;

                default:
                    this.notify("wss")
                    break;
            }
        });

        conn.on("output", async (conn: i3ipc.Connection, event: i3ipc.WorkspaceEvent) => {
            const v = await JSON.parse(conn.message(i3ipc.MessageType.GET_OUTPUTS, ""));
            this.#outputs = v;
            this.notify("outputs");
        });
    }
}

export type Workspaces = Workspace[]

export interface Workspace {
    id: number
    type: string
    orientation: string
    percent: any
    urgent: boolean
    marks: any[]
    layout: string
    border: string
    current_border_width: number
    rect: Rect
    deco_rect: Rect
    window_rect: Rect
    geometry: Rect
    name: string
    window: any
    nodes: any[]
    floating_nodes: any[]
    focus: number[]
    fullscreen_mode: number
    sticky: boolean
    num: number
    output: string
    representation: string
    focused: boolean
    visible: boolean
}

export type Displays = Node[]

export type Commands = Command[]

export interface Command {
  success: boolean
  parse_error?: boolean
}

export interface Node {
  id: number
  type: string
  orientation: string
  percent: number | null
  urgent: boolean
  marks: string[]
  focused: boolean
  layout: "splith" | "splitv" | "stacked" | "tabbed" | "dockarea" | "output"
  border: "normal" | "none" | "pixel"
  current_border_width: number
  rect: Rect
  deco_rect: Rect
  window_rect: Rect
  geometry: Rect
  name: string
  window: any
  nodes: Node[]
  floating_nodes: Workspace[]
  focus: number[]
  fullscreen_mode: number
  sticky: boolean
  floating: "root" | "output" | "con" | "floating_con" | "workspace" | "dockarea"
  scratchpad_state: "none" | "fresh" | "changed"
  primary?: boolean
  make?: string
  model?: string
  serial?: string
  modes?: Mode[]
  non_desktop?: boolean
  active?: boolean
  dpms?: boolean
  power?: boolean
  scale?: number
  scale_filter?: string
  transform?: string
  adaptive_sync_status?: string
  layer_shell_surfaces?: LayerShellSurface[]
  current_workspace?: string
  current_mode?: CurrentMode
  max_render_time?: number
  allow_tearing?: boolean
  subpixel_hinting: string
}

export interface Mode {
    width: number
    height: number
    refresh: number
    picture_aspect_ratio: string
}

export interface LayerShellSurface {
    namespace: string
    layer: string
    extent: Extent
    effects: any[]
}

export interface Extent {
    width: number
    height: number
    x: number
    y: number
}

export interface CurrentMode {
    width: number
    height: number
    refresh: number
    picture_aspect_ratio: string
}

export interface Rect {
    x: number
    y: number
    width: number
    height: number
}