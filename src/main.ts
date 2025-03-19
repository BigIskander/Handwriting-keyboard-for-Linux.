import { currentMonitor } from '@tauri-apps/api/window';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { LogicalSize, LogicalPosition } from '@tauri-apps/api/dpi';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Command } from "@tauri-apps/plugin-shell";
const appWindow = getCurrentWebviewWindow()
const pasteword = Command.create("xdotool", ['key', "--delay", "100", 'alt+Tab', 'ctrl+v']);
const pasteword2 = Command.create("xdotool2", ['key', "--delay", "100", 'ctrl+v']);
// @ts-ignore
var out: HTMLElement = document.getElementById('results')

function recognize() {
    if(can.trace.length > 0) can.recognize()
}

function displayRecognizedWords(data: any, err: any) {
    if(err) {
        out.innerHTML = '<div v-else class="errorMessage">' + 
                            err.message.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + 
                        '</div>'
    } else {
        out.innerHTML = ""
        for(var word of data) {
            out.innerHTML = out.innerHTML + 
                                '<div class="selectWordItem" onclick="choseWord(this.innerText)">' + 
                                    word.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + 
                                '</div>';
        }
    }
}

var offset = 20;
var voffset = 100;
var bottom_offset = 40;
(async () => {
    const monitor = await currentMonitor();
    if (monitor) {
        await appWindow.setSize(new LogicalSize(monitor.size.width, 300));
        await appWindow.setPosition(new LogicalPosition(monitor.position.x, monitor.position.y + monitor.size.height - window.outerHeight - bottom_offset));
    }
})();
// @ts-ignore
var mycan: HTMLElement = document.getElementById('can');
mycan.setAttribute('width', String(window.outerWidth  - offset));
mycan.setAttribute('height', String(window.outerHeight  - voffset));
window.onresize = () => { 
    mycan.setAttribute('width', String(window.outerWidth - offset));
    mycan.setAttribute('height', String(window.outerHeight - voffset));
    can.height = window.outerHeight - voffset;
    can.width = window.outerWidth - offset;
};

// @ts-ignore
var can = new handwriting.Canvas(mycan);
can.setCallBack((data: any, err: any) => displayRecognizedWords(data, err));
can.setMouseUpCallBack(() => recognize());
//Set line width shown on the canvas element (default: 3)
can.setLineWidth(3);
//Set options
can.setOptions({
    language: 'zh-CN',
    numOfReturn: 8
});

function erase() {
    can.erase();
    out.innerHTML = "";
}

async function choseWord(word: String, is_erase: Boolean = true) {
    await writeText(String(word));
    if(await appWindow.isFocused()) pasteword.execute();
    else pasteword2.execute();
    if(is_erase) erase();
}

export {
    erase,
    choseWord
}