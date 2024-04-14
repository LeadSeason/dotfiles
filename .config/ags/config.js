import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import Bar from "./src/bar.js";

// Pre-process the scss file to css
const scss = `${App.configDir}/scss/style.scss`;
const css = `${App.configDir}/scss/style.css`;
exec(`sassc ${scss} ${css}`);

App.config({
    style: "./scss/style.css",
    icons: "./assets",
    windows: [Bar(0), Bar(1), Bar(2)],
})