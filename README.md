# Handwriting-keyboard-for-Linux. 

This is programm written for Linux desktop environment.

You can find compiled .deb, .rpm and .AppImage packages in releases page.

This instruction is for version 2.1 of the program. Instruction for version 2.0 is located at v2.0 branch of this repository. Instruction for version 1 is located at v1 branch of this repository.

To recognize handwriting (handwritten text) program uses Google API (default option) or [Digital ink recognition Server](https://github.com/BigIskander/Digital_ink_recognition_Server).

To send keyboard input program uses [xdotool](https://github.com/jordansissel/xdotool) (default option) or [ydotool](https://github.com/ReimuNotMoe/ydotool).

In order to use the programm xdotool package or ydotool package should be installed: 

```
sudo apt install xdotool
```

```
sudo apt install ydotool
```

As for sending keyboard input:
- **xdotool** - only supports X11 desktop environment 
- **ydotool** - works in X11 and Wayland desktop environment, **ydotoold** process should be running (in background or in separate terminal) in order to **ydotool** to work

## How to use the program

0) Launch the program with or without command line options 
1) write text in the canvas by using mouse or stylus (on graphical tablet) 
2) press to recognized text, program will copy text to clipboard and paste by triggering ***ctrl+V*** keypress

If program's window is in focus, before sending keyboard input program will trigger ***alt+Tab*** keypress to return focus to previous active window and only then send the input.

## Command line options 

```
Usage: handwriting-keyboard [OPTIONS]

Options:
      --server-url <server-url>
          Handwriting recognition server's URL, 
           default value is Google's API server 
           https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8

      --language <language>
          BCP 47 language tag, default value is zh-CN

      --dark-theme...
          Use dark theme.

      --use-ydotool...
          Use ydotool to send keyboard input. By default xdotool is used.

      --use-shift...
          Trigger shift+ctrl+V keypress to paste text from clipboard. 
          By default program uses ctrl+V.

      --fly-to-bottom...
          At launch program window will fly to the bottom of the screen 
           and resize to screen width.

      --return-keyboard...
          After sending keyboard input program will trigger alt+Tab keypress 
          to return focus back to keyboad's window.

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```

Example of using command line options:

```
handwriting-keyboard --language=en --dark-theme
```

In this case (above), program will recognize handwritten text as text in english language (since en BCP 47 language tag is set) and program's window will be in dark mode (since --dark-theme option is set).

## Notes about Wayland

This program (application) can work in Wayland desktop environment, however it is not fully supported.

Some specifics of using this program in Wayland:

1) **Always on top** property of the window can not be set programmatically in Wayland. As workaround you can set it manually by right clicking on title bar of the window and checking 'Always on top' option (it should work, at least in GNOME based desktop environment).

2) **--fly-to-bottom** command line option will not position program's window correctly.

3) **Xdotool** does not support Wayland. For that reasoun I would recommend to use this program with **ydotool** instead (i.e. to launch it with **--use-ydotool** command line option).

# Some technical details

Programm written by using tauri framework https://tauri.app/

Program based on script from https://github.com/ChenYuHo/handwriting.js

To recognize handwritten pattern program uses Google API (default option) or [Digital ink recognition Server](https://github.com/BigIskander/Digital_ink_recognition_Server).

To send keyboard input program uses [xdotool](https://github.com/jordansissel/xdotool) (default option) or [ydotool](https://github.com/ReimuNotMoe/ydotool).

In order to run from code or compile the programm: You need to install [Node.js 18](https://nodejs.org/en) or newer version and [Rust](https://www.rust-lang.org/) as well.

Install Node.js dependencies: 

```
npm install
```

Run program in development environment: 

```
npm run tauri dev
```

Run program in development environment with cli (command line) options: 

```
npm run tauri dev -- -- -- cli_options
```

Compile the programm: 

```
npm run tauri build
```

There is also version of this program using local OCR engine instead, it is available by this link: [https://github.com/BigIskander/Handwriting-keyboard-for-Linux-tesseract](https://github.com/BigIskander/Handwriting-keyboard-for-Linux-tesseract)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
