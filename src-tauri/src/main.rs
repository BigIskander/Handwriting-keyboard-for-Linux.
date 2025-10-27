// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use tauri_plugin_cli::CliExt;
use gtk::prelude::GtkWindowExt;
use tauri::Manager;
use tauri::LogicalSize;
use tauri::window::Color;
use std::sync::Mutex;

// dark theme? [value read from CLI]
static DARK_THEME: Mutex<String> = {
    let dark_theme = String::new();
    Mutex::new(dark_theme)
};

// workaround
// set_accept_focus(false) property doesn't work in main window
#[tauri::command]
fn open_keyboard_window(app: tauri::AppHandle) {
    let url = tauri::WebviewUrl::App("keyboard.html".into());
    let window = tauri::webview::WebviewWindowBuilder::new(&app, "local", url)
        .use_https_scheme(true)
        .build()
        .unwrap();
    window.set_title("手写").unwrap();
    window.set_always_on_top(true).unwrap();
    let min_size: LogicalSize<u32> = tauri::LogicalSize::from((800, 300));
    window.set_min_size(Some(min_size)).unwrap();
    window.set_size(min_size).unwrap();
    let dark_theme = DARK_THEME.lock().unwrap();
    if !dark_theme.is_empty() {
        window.set_background_color(Some(Color(0, 0, 0, 0))).unwrap();
    }
    let gtk_window = window.gtk_window().unwrap();
    gtk_window.set_accept_focus(false);
    window.show().unwrap();
    app.get_webview_window("main").unwrap().close().unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_cli::init())
        .setup(|app| {
            println!("-------------------------------------------------------------------------------\n\
                        Handwriting keyboard for Linux desktop environment. \n\
                        To recognize handwritten pattern program uses Google API or \n\
                        \t Digital ink recognition Server. \n\
                        Github page: \n\
                        https://github.com/BigIskander/Handwriting-keyboard-for-Linux./tree/main \n\
                        App version: 2.1.0 \n\
                        \n\
                        launch app with '--help' command line option to Print help \n\
                      -------------------------------------------------------------------------------");
            let main_window = app.get_webview_window("main").unwrap();
            match app.cli().matches() {
                Ok(matches) => {
                    // example taken from: https://qiita.com/takavfx/items/4743ceaf9fccc87eac52 
                    // print --help or CLI options
                    if let Some(x) = matches.args.get("help").clone() {
                        println!("  \n\
                                    Handwriting keyboard for Linux desktop environment. \n\
                                    How to use the program: \n\
                                    \n\
                                    1) write text in the canvas by using mouse or stylus (on graphical tablet) \n\
                                    2) press 'recognize' button \n\
                                    3) press to recognized text, programm will \n\
                                    \t copy it to clipboard and paste by \n\
                                    \t triggering ctrl+V (or shift+ctrl+V) keypress \n\
                                    \n\
                                    To recognize handwritten pattern program uses Google's API Server or \n\
                                    \t Digital ink recognition Server.
                                    \n\
                                    To send the keyboard input programm uses xdotool or ydotool.\n\
                                    xdotool - only supports X11 desktop environment \n\
                                    ydotool - works in X11 and Wayland desktop environment \n\
                                    \t if you decide to use ydotool \n\
                                    \t ydotoold process should be running in order to ydotool to work \n\
                                    \n\
                                    If programs window is in focus, program will trigger alt+Tab keypress \n\
                                    \t to return focus to previous active window and then send the input
                                ");
                        println!("{}", x.value.as_str().unwrap());
                        app.app_handle().exit(0);
                        return Ok(());
                    }
                    // print --version
                    if let Some(_) = matches.args.get("version").clone() {
                        println!("{}, Version: {}",
                            app.config().product_name.clone().expect("Failed to get product name."),
                            app.config().version.clone().expect("Failed to get version number.")
                        );
                        app.app_handle().exit(0);
                        return Ok(());
                    }
                    let dark_theme = &matches.args.get("dark-theme").expect("Error reading CLI.").value;
                    if dark_theme == true {
                        main_window.set_background_color(Some(Color(0, 0, 0, 0))).unwrap();
                        DARK_THEME.lock().unwrap().insert_str(0, "ok");
                    }
                }
                Err(err) => { 
                    println!("Error reading CLI.");
                    println!("{}", err.to_string());
                    app.app_handle().exit(1);
                    return Ok(()); 
                }
            } 
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_keyboard_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
