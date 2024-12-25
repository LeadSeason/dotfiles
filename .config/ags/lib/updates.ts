import GObject, { register, property } from "astal/gobject";
import { monitorFile, readFileAsync } from "astal/file";


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

    @property(String)
    get updates (): string { return this.#updates }

    @property(Number)
    get updatesnum (): number { return this.#updatesnum }

    constructor() {
        super();
        
        const updatesFile = `/tmp/updates`;

        const updatesFileUpdate = async (path: string) => {
            const v = await readFileAsync(path);
            this.#updates = v;
            this.#updatesnum = v.split(/\r\n|\r|\n/).length - 1;
            this.notify("updates");
            this.notify("updatesnum");
        }
        
        updatesFileUpdate(updatesFile);

        monitorFile(updatesFile, async f => {
            updatesFileUpdate(f);
        })
    }
}
