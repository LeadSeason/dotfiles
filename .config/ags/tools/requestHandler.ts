import app from "ags/gtk4/app";

import SwayGaps from "./swaygaps";
import Config from "../config";

import { idleDim, idleDimReturn } from "./powerManagement";
import { reloadStyle } from "./utils";

import { showMedia } from "../widgets/media/media";
import { showOSD } from "../widgets/osd/osd";
import { showScratchpad } from "../widgets/scratchpad/scratchpad";

const swayGaps = SwayGaps.get_default()

export default async function requestHandler(request: string, res: (response: string) => void) {
    res(await registry.execute(request))
}

type CommandResponse = string | Promise<string>

type NameList<T> = [T, ...T[]]
interface CommandEntry {
    /** Commands name */
    name: NameList<string>
    /** Subcommands */
    subCommands?: string[]
    /** Short description for help */
    description: string
    /** Main function that runs when command is executed */
    main: (args?: string[]) => CommandResponse
}


class CommandRegistry {
    static instance: CommandRegistry

    static get_default() {
        if (!this.instance)
            this.instance = new CommandRegistry()

        return this.instance
    }
    private commands: CommandEntry[] = []

    /** Register a command */
    register(command: CommandEntry): void {
        command.name.forEach(element => {
            if (element.includes(" "))
                throw new Error(`Invalid altName "${element}" — spaces are not allowed`);
        });
        
        if (command.name.length === 0) 
            throw new Error(`Command must have at least 1 name ${command}`)

        this.commands.push(command)
    }

    async execute(request: string): Promise<string> {
        const parts = request.trim().split(/\s+/)
        const normalized = parts.shift()?.toLowerCase() ?? ""
        const args = parts

        const entry = this.commands.find(cmd =>
            cmd.name.some(name => name.toLowerCase() === normalized)
        )

        if (!entry) {
            return `Unknown request: ${request}. Type "help" for a list of commands.`
        }

        try {
            const result = await entry.main(args)
            return `${Config.instanceName}: ${result}`
        } catch (err) {
            return `${Config.instanceName} Error: ${(err as Error).message}`
        }
    }

    help(): string {
        let out = "Available commands:\n"
        for (const cmd of this.commands) {
            out += `\n- ${cmd.name[0]}\n`
            out += `  Aliases: ${cmd.name.join(", ")}\n`
            out += `  ${cmd.description}\n`
        }
        return out.trim()
    }
}
const registry = CommandRegistry.get_default()

registry.register({
    name: ["reloadStyle", "reloadstyle", "style"],
    description: "Reloads the style",
    main: async () => {
        return await reloadStyle()
    }
})

registry.register({
    name: ["toggleGaps"],
    description: "Toggles gaps",
    main: () => {
        swayGaps.toggleGaps()
        return `${Config.instanceName}: Toggled gaps`
    }
})

registry.register({
    name: ["media"],
    description: "Show Media widget",
    main: () => {
        showMedia()
        return `Media showing`
    }
})

registry.register({
    name: ["scratchpad"],
    description: "Show scratchpad widget",
    main: () => {
        showScratchpad()
        return `Scratchpad Launched`
    }
})

registry.register({
    name: ["dim"],
    description: "Dim the computer screen & kb",
    main: () => {
        idleDim()
        return `PowerManagement dimmed`
    }
})

registry.register({
    name: ["undim", "undodim"],
    description: "Undo the dim",
    main: () => {
        idleDimReturn()
        return `PowerManagement undid dimmed`
    }
})

registry.register({
    name: ["showoff"],
    description: "Show off all the widgets",
    main: () => {
        showMedia()
        showOSD()
        showScratchpad()
        return (`Showing off ... `)
    }
})

registry.register({
    name: ["quit", "exit"],
    description: "quit Application",
    main: () => {
        app.quit(0);
        return "exiting ..."
    }
})

registry.register({
    name: ["help", "commands", "?"],
    description: "Lists all available commands",
    main: () => registry.help()
})
