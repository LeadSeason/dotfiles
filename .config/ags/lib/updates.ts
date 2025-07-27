import GObject, { register, getter } from "ags/gobject";
import { monitorFile, readFileAsync } from "ags/file";


@register({ GTypeName: "ArchUpdates" })
export default class ArchUpdates extends GObject.Object {
    static instance: ArchUpdates;

    static get_default() {
        if (!this.instance)
            this.instance = new ArchUpdates();

        return this.instance;
    }

    #updates: string = "";
    // Cannot have Uppercase letter, this.notify wont work if it has uppercase letters
    #updatesnum: number = 0;

    @getter(String)
    get updates (): string { return this.#updates }

    @getter(Number)
    get updatesnum (): number { return this.#updatesnum }

    @getter(Boolean)
    get over50 (): boolean { return this.#updatesnum > 50 }

    constructor() {
        super();

        const updatesFile = `/tmp/updates`;

        const updatesFileUpdate = async (path: string) => {
            const v = await readFileAsync(path);
            this.#updates = v;
            this.#updatesnum = v.split(/\r\n|\r|\n/).length - 1;
            this.notify("updates");
            this.notify("updatesnum");
            this.notify("over50");
        }

        updatesFileUpdate(updatesFile);

        monitorFile(updatesFile, async f => {
            updatesFileUpdate(f);
        })
    }
}
