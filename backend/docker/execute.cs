using System;
using System.IO;
using System.Diagnostics;
using System.Text.Json;

class Program
{
    static void Main()
    {
        string code = Console.In.ReadToEnd();
        string tmpDir = Path.Combine("/tmp", "csharp_" + Guid.NewGuid().ToString("N"));

        try
        {
            Directory.CreateDirectory(tmpDir);

            // Create minimal csproj
            File.WriteAllText(Path.Combine(tmpDir, "run.csproj"),
                @"<Project Sdk=""Microsoft.NET.Sdk"">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>disable</Nullable>
    <ImplicitUsings>disable</ImplicitUsings>
    <AllowUnsafeBlocks>true</AllowUnsafeBlocks>
  </PropertyGroup>
</Project>");

            File.WriteAllText(Path.Combine(tmpDir, "Program.cs"), code);

            // Build
            var build = Run("dotnet", $"build \"{tmpDir}\" --nologo -v q -o \"{tmpDir}/out\"", 30);
            if (build.ExitCode != 0)
            {
                Print(false, "", build.Stderr.Length > 0 ? build.Stderr : build.Stdout, build.ExitCode);
                return;
            }

            // Run
            var run = Run("dotnet", $"\"{tmpDir}/out/run.dll\"", 10);
            Print(run.ExitCode == 0, run.Stdout, run.Stderr, run.ExitCode);
        }
        catch (Exception ex)
        {
            Print(false, "", ex.Message, 1);
        }
        finally
        {
            try { Directory.Delete(tmpDir, true); } catch { }
        }
    }

    static (string Stdout, string Stderr, int ExitCode) Run(string cmd, string args, int timeoutSec)
    {
        var psi = new ProcessStartInfo(cmd, args)
        {
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true
        };
        using var p = Process.Start(psi)!;
        string stdout = p.StandardOutput.ReadToEnd();
        string stderr = p.StandardError.ReadToEnd();
        p.WaitForExit(timeoutSec * 1000);
        if (!p.HasExited) { p.Kill(); return (stdout, "Execution timed out", 124); }
        return (stdout, stderr, p.ExitCode);
    }

    static void Print(bool success, string stdout, string stderr, int exitCode)
    {
        Console.WriteLine(JsonSerializer.Serialize(new
        {
            success,
            stdout,
            stderr,
            exit_code = exitCode
        }));
    }
}
