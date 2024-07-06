#!/bin/python
# vim:ft=python

from i3ipc.aio import Connection
from i3ipc import Event

import json
import asyncio


async def main():
    async def on_event(self, e):
        await update_status()

    async def update_status():
        workspaces = await connector.get_workspaces()
        displays = []
        for x in workspaces:
            if x.output not in displays:
                displays.append(x.output)

        displays.sort()

        WSDataSets = {}
        for x in displays:
            WSDataSets.update({x: []})

        for x in workspaces:
            wdata = {
                "workspaceType": "",
                "workspaceName": "",
                "workspaceID": "",
            }

            if x.urgent:
                wdata["workspaceType"] = "barUrgent"
            elif x.focused:
                wdata["workspaceType"] = "barFocused"

            wdata["workspaceID"] = x.name.split(":")[0]
            wdata["workspaceName"] = x.name

            WSDataSets[x.output].append(wdata)

        print(json.dumps(WSDataSets), flush=True)

    connector = await Connection(auto_reconnect=True).connect()

    connector.on(Event.WORKSPACE_FOCUS, on_event)
    connector.on(Event.WORKSPACE_INIT, on_event)
    connector.on(Event.WORKSPACE_EMPTY, on_event)
    connector.on(Event.WORKSPACE_URGENT, on_event)
    connector.on(Event.WORKSPACE_RELOAD, on_event)
    connector.on(Event.WORKSPACE_RENAME, on_event)
    connector.on(Event.WORKSPACE_RESTORED, on_event)
    connector.on(Event.WORKSPACE_MOVE, on_event)

    await update_status()

    await connector.main()

if __name__ == "__main__":
    asyncio.run(main())
