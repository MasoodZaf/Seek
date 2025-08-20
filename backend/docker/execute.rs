use std::io::{self, Read};
use std::fs::File;
use std::process::Command;
use serde_json::json;

fn main() {
    // Read code from stdin
    let mut code = String::new();
    if let Err(e) = io::stdin().read_to_string(&mut code) {
        let result = json!({
            "success": false,
            "error": format!("Failed to read code: {}", e),
            "exit_code": 1
        });
        println!("{}", result);
        return;
    }
    
    // Write code to temporary file
    let tmp_file = "/tmp/user_code.rs";
    if let Err(e) = std::fs::write(tmp_file, &code) {
        let result = json!({
            "success": false,
            "error": format!("Failed to write code to file: {}", e),
            "exit_code": 1
        });
        println!("{}", result);
        return;
    }
    
    // Compile the Rust code
    let compile_output = Command::new("rustc")
        .args(&[tmp_file, "-o", "/tmp/user_program"])
        .output();
    
    let compile_result = match compile_output {
        Ok(output) => output,
        Err(e) => {
            let result = json!({
                "success": false,
                "error": format!("Failed to compile: {}", e),
                "exit_code": 1
            });
            println!("{}", result);
            return;
        }
    };
    
    if !compile_result.status.success() {
        let result = json!({
            "success": false,
            "stdout": String::from_utf8_lossy(&compile_result.stdout),
            "stderr": String::from_utf8_lossy(&compile_result.stderr),
            "exit_code": compile_result.status.code().unwrap_or(1)
        });
        println!("{}", result);
        return;
    }
    
    // Execute the compiled program
    let run_output = Command::new("/tmp/user_program")
        .output();
    
    let run_result = match run_output {
        Ok(output) => output,
        Err(e) => {
            let result = json!({
                "success": false,
                "error": format!("Failed to execute: {}", e),
                "exit_code": 1
            });
            println!("{}", result);
            return;
        }
    };
    
    let result = json!({
        "success": run_result.status.success(),
        "stdout": String::from_utf8_lossy(&run_result.stdout),
        "stderr": String::from_utf8_lossy(&run_result.stderr),
        "exit_code": run_result.status.code().unwrap_or(1)
    });
    
    println!("{}", result);
}