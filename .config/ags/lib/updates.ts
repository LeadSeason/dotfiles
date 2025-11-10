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

        const updatesFile = `/run/user/1000/system_updates`;

        const updatesFileUpdate = async (path: string) => {
            let v
            try {
                v = await readFileAsync(path);
            } catch (error) {
                console.log(path)
                console.log("Mrrpt")
                return
            }
            this.#updates = v;
            this.#updatesnum = v.split(/\r\n|\r|\n/).length - 1;
            this.notify("updates");
            this.notify("updatesnum");
            this.notify("over50");
        }

        updatesFileUpdate(updatesFile);

        try {
            monitorFile(updatesFile, async f => {
                try {
                    updatesFileUpdate(f);
                    
                } catch (error) {
                    
                    console.log("meaw")
                    console.log(error)
                }
            })
            
        } catch (error) {
            console.log("Mrrr")
            console.log(error)
        }
    }
}
