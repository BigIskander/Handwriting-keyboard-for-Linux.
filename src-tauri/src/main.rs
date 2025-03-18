// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use gtk::prelude::GtkWindowExt;
use tauri::Manager;
use tauri::LogicalSize;

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
    let gtk_window = window.gtk_window().unwrap();
    gtk_window.set_accept_focus(false);
    window.show().unwrap();
    app.get_webview_window("main").unwrap().close().unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|_| {
            println!("-------------------------------------------------------------------------------\n\
                        Handwriting keyboard for Linux X11 desktop environment. \n\
                        Currently supports Chinese language only. \n\
                        To recognize handwritten pattern program uses Google API. \n\
                        Github page: \n\
                        https://github.com/BigIskander/Handwriting-keyboard-for-Linux./tree/main \n\
                      -------------------------------------------------------------------------------");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_keyboard_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
