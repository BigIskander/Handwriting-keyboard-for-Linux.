import { currentMonitor } from '@tauri-apps/api/window';
import { appWindow, LogicalSize, LogicalPosition } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri';
import { writeText } from '@tauri-apps/api/clipboard';
import { Command } from "@tauri-apps/api/shell";
const pasteword = new Command("xdotool", ['key', "--delay", "100", 'alt+Tab', 'ctrl+v']);
// @ts-ignore
var out: HTMLElement = document.getElementById('results')

async function recognizeText() {
    // if (can.drawing)
    // @ts-ignore
    // mycan.toBlob(async (blob) => {
    //     let reader = new FileReader();
    //     reader.readAsDataURL(blob);
    //     reader.onloadend = function () {
    //         // console.log(reader.result);
    //         console.log(reader.result.split('base64,')[1]);
    //         invoke('recognize_text', {base64Image: reader.result.split('base64,')[1]}).then((response) => { 
    //             console.log(response.slice(0, -2));
    //             displayRecognizedText(response.slice(0, -2), null); 
    //         }).catch((err) => { displayRecognizedText("", err) });
    //     }
    //     // console.log(blob);
    //     // var rr = await blob.text();
    //     // console.log(rr);
    //     // invoke('recognize_text', {base64Image: rr}).then((response) => { displayRecognizedText(response.slice(0, -2), null); }).catch((err) => { displayRecognizedText("", err) });
    // });
    var image_data = await mycan.toDataURL().split('base64,')[1];
    // @ts-ignore
    await invoke('recognize_text', {base64Image: image_data}).then((response) => { console.log(response); displayRecognizedText(response.slice(0, -2), null); }).catch((err) => { displayRecognizedText("", err) });
}

function displayRecognizedText(text: any, err: any) {
    if(err) {
        out.innerHTML = '<div v-else class="errorMessage">' + err + '</div>'
    } else {
        out.innerHTML = '<div class="selectWordItem" onclick="choseWord(\'' + text + '\')">' + text + '</div>';
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
can.setMouseUpCallBack(() => recognizeText());
//Set line width shown on the canvas element (default: 3)
can.setLineWidth(3);

function erase() {
    can.erase();
    out.innerHTML = "";
}

async function choseWord(word: String) {
    await writeText(String(word));
    pasteword.spawn();
    erase();
}

export {
    erase,
    choseWord
}