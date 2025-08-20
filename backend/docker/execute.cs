using System;
using System.IO;
using System.Diagnostics;
using System.Text.Json;

class ExecutionResult
{
    public bool success { get; set; }
    public string stdout { get; set; } = "";
    public string stderr { get; set; } = "";
    public int exit_code { get; set; }
    public string? error { get; set; }
}

class Program
{
    static void Main()
    {
        try
        {
            // Read code from stdin
            string code = Console.In.ReadToEnd();
            
            // Write code to temporary file
            string tmpFile = "/tmp/user_code.cs";
            File.WriteAllText(tmpFile, code);
            
            // Compile the C# code
            var compileProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "csc",
                    Arguments = $"{tmpFile} -out:/tmp/user_program.exe",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            
            compileProcess.Start();
            string compileStdout = compileProcess.StandardOutput.ReadToEnd();
            string compileStderr = compileProcess.StandardError.ReadToEnd();
            compileProcess.WaitForExit();
            
            if (compileProcess.ExitCode != 0)
            {
                var result = new ExecutionResult
                {
                    success = false,
                    stdout = compileStdout,
                    stderr = compileStderr,
                    exit_code = compileProcess.ExitCode
                };
                Console.WriteLine(JsonSerializer.Serialize(result));
                return;
            }
            
            // Execute the compiled program
            var runProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "mono",
                    Arguments = "/tmp/user_program.exe",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            
            runProcess.Start();
            string runStdout = runProcess.StandardOutput.ReadToEnd();
            string runStderr = runProcess.StandardError.ReadToEnd();
            runProcess.WaitForExit();
            
            var finalResult = new ExecutionResult
            {
                success = runProcess.ExitCode == 0,
                stdout = runStdout,
                stderr = runStderr,
                exit_code = runProcess.ExitCode
            };
            
            Console.WriteLine(JsonSerializer.Serialize(finalResult));
        }
        catch (Exception ex)
        {
            var errorResult = new ExecutionResult
            {
                success = false,
                error = ex.Message,
                exit_code = 1
            };
            Console.WriteLine(JsonSerializer.Serialize(errorResult));
        }
    }
}