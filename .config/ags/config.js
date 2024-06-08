import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

import { forMonitors } from './src/utils/utils.js';
import Bar from "./src/bar/main.js";
import volumeOverlay from "./src/volumeOverlay/main.js";

// Pre-process the scss file to css
const scss = `${App.configDir}/scss/style.scss`;
const css = `${App.configDir}/scss/style.css`;
Utils.exec(`sassc ${scss} ${css}`);

const windows = () => [
    forMonitors(Bar),
    volumeOverlay()
]

App.config({
    style: "./scss/style.css",
    icons: "./assets",
    windows: windows().flat(1),
})