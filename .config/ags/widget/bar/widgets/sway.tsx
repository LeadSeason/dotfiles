import { Gdk } from "astal/gtk3"
import { Variable, bind} from "astal"
import i3ipc from "gi://i3ipc"

export default ({monitor}: { monitor: Gdk.Monitor }) => {
    const conn = i3ipc.Connection.new(null)

    // Transalate Screen cordinates in to display names.
    const displayData: Displays = JSON.parse(conn.message(i3ipc.MessageType.GET_OUTPUTS, ""))
    const monitorWorkarea = monitor.get_workarea();

    const displayName = displayData.find(
      (display) => display.rect.x === monitorWorkarea.x && display.rect.y === monitorWorkarea.y
    )?.name;

    const wss = Variable<Workspaces>(JSON.parse("[]"));
    { // Run once to fill in temparary data.
        const WorkspaceJson = JSON.parse(
            conn.message(i3ipc.MessageType.GET_WORKSPACES, "")
        ).filter((item: Workspace) => item.output === displayName);

        wss.set(WorkspaceJson);
    }
    
    // On Workspace event
    conn.on('workspace', (conn: i3ipc.Connection) => {
        const WorkspaceJson = JSON.parse(
            conn.message(i3ipc.MessageType.GET_WORKSPACES, "")
        ).filter((item: Workspace) => item.output === displayName);

        wss.set(WorkspaceJson);
    })

    return <box 
        className="Workspaces"
        spacing={6}
        onDestroy={() => wss.drop()}
        >
        {bind(wss).as((wss) => wss.map((ws) => {
            return <button 
                    className={ws.focused ? "focused" : ""}
                    onClick={() => conn.message(i3ipc.MessageType.COMMAND,
                        /* Disable mouse_warping so mouse doesnt dissaper when clicking.*/
                        `mouse_warping output; workspace number ${ws.num}; mouse_warping container`
                    )}
                >
                {ws.name}
            </button>
        }))}
    </box>
}

type Workspaces = Workspace[]

interface Workspace {
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
  deco_rect: DecoRect
  window_rect: WindowRect
  geometry: Geometry
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

type Displays = Display[]

interface Display {
  id: number
  type: string
  orientation: string
  percent: number
  urgent: boolean
  marks: any[]
  layout: string
  border: string
  current_border_width: number
  rect: Rect
  deco_rect: DecoRect
  window_rect: WindowRect
  geometry: Geometry
  name: string
  window: any
  nodes: any[]
  floating_nodes: any[]
  focus: number[]
  fullscreen_mode: number
  sticky: boolean
  primary: boolean
  make: string
  model: string
  serial: string
  modes: Mode[]
  non_desktop: boolean
  active: boolean
  dpms: boolean
  power: boolean
  scale: number
  scale_filter: string
  transform: string
  adaptive_sync_status: string
  layer_shell_surfaces: LayerShellSurface[]
  current_workspace: string
  current_mode: CurrentMode
  max_render_time: number
  focused: boolean
  subpixel_hinting: string
}

interface Mode {
  width: number
  height: number
  refresh: number
  picture_aspect_ratio: string
}

interface LayerShellSurface {
  namespace: string
  layer: string
  extent: Extent
  effects: any[]
}

interface Extent {
  width: number
  height: number
  x: number
  y: number
}

interface CurrentMode {
  width: number
  height: number
  refresh: number
  picture_aspect_ratio: string
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

interface DecoRect {
  x: number
  y: number
  width: number
  height: number
}

interface WindowRect {
  x: number
  y: number
  width: number
  height: number
}

interface Geometry {
  x: number
  y: number
  width: number
  height: number
}