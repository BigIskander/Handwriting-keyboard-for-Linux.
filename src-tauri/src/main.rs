// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


fn main() {
    tauri::Builder::default()
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
