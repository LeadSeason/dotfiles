#!/bin/python
# vim:ft=python

import i3ipc
from i3ipc.aio import Connection
from i3ipc import Event

from pprint import pprint
import json
import asyncio


async def main():
    async def on_event(self, e):
        await update_status()

    async def on_event_close(self, e):
        # Yeah sleeping makes stuff happen a lot slower but,
        # on close event it takes a short time to update
        # Sleeping 100ms make sure window is closed before
        # looking up
        await asyncio.sleep(0.1)
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
            WSDataSets.update({x:[]})

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

    global connector
    connector = await Connection(auto_reconnect=True).connect()

    connector.on(Event.WINDOW, on_event)
    connector.on(Event.WINDOW_CLOSE, on_event_close)
    connector.on(Event.WINDOW_NEW, on_event)
    connector.on(Event.WORKSPACE_INIT, on_event)
    connector.on(Event.WORKSPACE_MOVE, on_event)
    connector.on(Event.WORKSPACE_RENAME, on_event)
    connector.on(Event.WORKSPACE_URGENT, on_event)

    await update_status()

    await connector.main()

if __name__ == "__main__":
    eventLoop = asyncio.get_event_loop()
    eventLoop.run_until_complete(main())
