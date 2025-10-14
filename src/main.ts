import { currentMonitor } from '@tauri-apps/api/window';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { LogicalSize, LogicalPosition } from '@tauri-apps/api/dpi';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { getMatches } from '@tauri-apps/plugin-cli';
import { Command } from "@tauri-apps/plugin-shell";
const appWindow = getCurrentWebviewWindow()
const pasteword = Command.create("xdotool", ['key', "--delay", "100", 'alt+Tab', 'ctrl+v']);
const pasteword2 = Command.create("xdotool2", ['key', "--delay", "100", 'ctrl+v']);
const pastewordShift = Command.create("xdotool8", ['key', "--delay", "100", 'alt+Tab', 'shift+ctrl+v']);
const pastewordShift2 = Command.create("xdotool9", ['key', "--delay", "100", 'shift+ctrl+v']);
const altTab = Command.create("xdotool3", ['key', '--delay', '100', 'alt+Tab']);
const backSpace = Command.create("xdotool4", ['key', "--delay", "100", 'alt+Tab', 'BackSpace']);
const backSpace2 = Command.create("xdotool5", ['key', "--delay", "100", 'BackSpace']);
const enter = Command.create("xdotool6", ['key', "--delay", "100", 'alt+Tab', 'Return']);
const enter2 = Command.create("xdotool7", ['key', "--delay", "100", 'Return']);
const pastewordY = Command.create("ydotool", ['key', '56:1', '15:1', '56:0', '15:0', '29:1', '47:1', '29:0', '47:0']);
const pastewordY2 = Command.create("ydotool2", ['key', '29:1', '47:1', '29:0', '47:0']);
const pastewordShiftY = Command.create("ydotool8", ['key', '56:1', '15:1', '56:0', '15:0', '42:1', '29:1', '47:1', '42:0', '29:0', '47:0']);
const pastewordShiftY2 = Command.create("ydotool9", ['key', '42:1', '29:1', '47:1', '42:0', '29:0', '47:0']);
const altTabY = Command.create("ydotool3", ['key', '56:1', '15:1', '56:0', '15:0']);
const backSpaceY = Command.create("ydotool4", ['key', '56:1', '15:1', '56:0', '15:0', '14:1', '14:0']);
const backSpaceY2 = Command.create("ydotool5", ['key', '14:1', '14:0']);
const enterY = Command.create("ydotool6", ['key', '56:1', '15:1', '56:0', '15:0', '28:1', '28:0']);
const enterY2 = Command.create("ydotool7", ['key', '28:1', '28:0']);
// @ts-ignore
var out: HTMLElement = document.getElementById('results')
// @ts-ignore
var clearButton: HTMLElement = document.getElementById('clearButton')
var useYdotool = false;
var returnKeyboard = false;
var useShift = false;

function recognize() {
    // @ts-ignore
    if(can.trace.length > 0) {
        // @ts-ignore
        can.recognize()
        clearButton.innerText = "\"清空\"" // clear canvas
    }
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

// @ts-ignore
var mycan: HTMLElement = document.getElementById('can');
mycan.setAttribute('width', String(window.outerWidth  - offset));
mycan.setAttribute('height', String(window.outerHeight  - voffset));
// @ts-ignore
var mycan_wrap: HTMLElement = document.getElementById('can_wrapper');
// @ts-ignore
mycan_wrap.style.backgroundSize = mycan.height + "px " + mycan.height + "px";
// @ts-ignore
var can;

(async () => {
    var args = await getMatches();
    var is_dark_theme = Boolean(args.args["dark-theme"].value);
    var serverUrl = args.args["server-url"].value || "https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8";
    var language = args.args["language"].value || 'zh-CN';
    useYdotool = Boolean(args.args["use-ydotool"].value);
    returnKeyboard = Boolean(args.args["return-keyboard"].value);
    useShift = Boolean(args.args["use-shift"].value);
    // switch to dark theme
    if(is_dark_theme) {
        document.body.className = 'dark';
        document.body.style.backgroundColor = "black";
        document.body.style.color = "white";
    }
    // Set up canvas
    // @ts-ignore
    can = new handwriting.Canvas(mycan, 5, serverUrl);
    can.setCallBack((data: any, err: any) => displayRecognizedWords(data, err));
    can.setMouseUpCallBack(() => recognize());
    // Canvas colors
    can.setFillStyle("transparent");
    if(is_dark_theme) {
        can.setStrokeColor("white");
    } else {
        can.setStrokeColor("black");
    }
    //Set line width shown on the canvas element (default: 3)
    can.setLineWidth(5);
    //Set options
    can.setOptions({
        language: language,
        numOfReturn: 8
    });

    window.onresize = () => { 
        mycan.setAttribute('width', String(window.outerWidth - offset));
        mycan.setAttribute('height', String(window.outerHeight - voffset));
        // @ts-ignore
        can.height = window.outerHeight - voffset;
        // @ts-ignore
        can.width = window.outerWidth - offset;
        // @ts-ignore
        mycan_wrap.style.backgroundSize = mycan.height + "px " + mycan.height + "px";
        // Canvas colors
        // @ts-ignore
        can.setFillStyle("transparent");
        if(is_dark_theme) {
            // @ts-ignore
            can.setStrokeColor("white");
        } else {
            // @ts-ignore
            can.setStrokeColor("black");
        }
    };
   
    const monitor = await currentMonitor();
    if (monitor) {
        if(args.args["fly-to-bottom"].value == true) {
            await appWindow.setSize(new LogicalSize(monitor.size.width, 300));
            await appWindow.setPosition(new LogicalPosition(monitor.position.x, monitor.position.y + monitor.size.height - window.outerHeight - bottom_offset));
        }
    }
})();

async function erase() {
    // @ts-ignore
    if(can.trace.length > 0) { 
        // clear canvas
        // @ts-ignore
        can.erase();
        out.innerHTML = "";
        clearButton.innerText = "退格键" // BackSpace key
    } else {
        // trigger BackSpace keypress
        try {
            if(await appWindow.isFocused()) {
                if(useYdotool) await backSpaceY.execute();
                else await backSpace.execute();
            } else {
                if(useYdotool) await backSpaceY2.execute();
                else await backSpace2.execute();
            }
            if(returnKeyboard && !(await appWindow.isFocused())) {
                if(useYdotool) altTabY.execute();
                else altTab.execute();
            }
        } catch(err) {
            displayRecognizedWords("", { message: "Send text input (xdotool or ydotool) error: " + err });
        }
    }  
}

async function enterKeyPress() {
    // trigger Enter keypress
    try {
        if(await appWindow.isFocused()) {
            if(useYdotool) await enterY.execute();
            else await enter.execute();
        } else {
            if(useYdotool) await enterY2.execute(); 
            else await enter2.execute();
        }
        if(returnKeyboard && !(await appWindow.isFocused())) {
            if(useYdotool) altTabY.execute();
            else altTab.execute();
        }
    } catch(err) {
        displayRecognizedWords("", { message: "Send text input (xdotool or ydotool) error: " + err });
    }
}

async function choseWord(word: String, is_erase: Boolean = true) {
    await writeText(String(word));
    try {
        if(await appWindow.isFocused()) {
            if(useShift) {
                if(useYdotool) await pastewordShiftY.execute();
                else await pastewordShift.execute();
            } else {
                if(useYdotool) await pastewordY.execute();
                else await pasteword.execute();
            }
        } else {
            if(useShift) {
                if(useYdotool) await pastewordShiftY2.execute();
                else await pastewordShift2.execute();
            } else {
                if(useYdotool) await pastewordY2.execute();
                else await pasteword2.execute();
            }
        }
        if(returnKeyboard && !(await appWindow.isFocused())) {
            if(useYdotool) altTabY.execute();
            else altTab.execute();
        }
        if(is_erase) erase();
    } catch(err) {
        displayRecognizedWords("", { message: "Send text input (xdotool or ydotool) error: " + err });
    }    
}

export {
    erase,
    enterKeyPress,
    choseWord
}