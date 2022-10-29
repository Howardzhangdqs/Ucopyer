#![windows_subsystem = "windows"]

use std::process::{Command};

fn main() {
    Command::new("cmd").args(&["/c", "hide.bat"])
        .output().unwrap_or_else(|e| {
            panic!("failed to execute process: {}", e)
        });
}