package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"time"
)

type ExecutionResult struct {
	Success  bool   `json:"success"`
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
	ExitCode int    `json:"exit_code"`
	Error    string `json:"error,omitempty"`
}

func main() {
	// Read code from stdin
	scanner := bufio.NewScanner(os.Stdin)
	var codeLines []string
	
	for scanner.Scan() {
		codeLines = append(codeLines, scanner.Text())
	}
	
	if err := scanner.Err(); err != nil {
		result := ExecutionResult{
			Success:  false,
			Error:    "Failed to read code: " + err.Error(),
			ExitCode: 1,
		}
		outputResult(result)
		return
	}
	
	code := strings.Join(codeLines, "\n")
	
	// Write code to temporary file
	tmpFile, err := ioutil.TempFile("", "user_code_*.go")
	if err != nil {
		result := ExecutionResult{
			Success:  false,
			Error:    "Failed to create temporary file: " + err.Error(),
			ExitCode: 1,
		}
		outputResult(result)
		return
	}
	defer os.Remove(tmpFile.Name())
	
	if _, err := tmpFile.Write([]byte(code)); err != nil {
		result := ExecutionResult{
			Success:  false,
			Error:    "Failed to write code to file: " + err.Error(),
			ExitCode: 1,
		}
		outputResult(result)
		return
	}
	tmpFile.Close()
	
	// Execute the Go code with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	cmd := exec.CommandContext(ctx, "go", "run", tmpFile.Name())
	
	stdout, err := cmd.Output()
	exitCode := 0
	stderr := ""
	
	if err != nil {
		exitCode = 1
		if exitError, ok := err.(*exec.ExitError); ok {
			stderr = string(exitError.Stderr)
			exitCode = exitError.ExitCode()
		} else {
			stderr = err.Error()
		}
	}
	
	result := ExecutionResult{
		Success:  exitCode == 0,
		Stdout:   string(stdout),
		Stderr:   stderr,
		ExitCode: exitCode,
	}
	
	outputResult(result)
}

func outputResult(result ExecutionResult) {
	output, _ := json.Marshal(result)
	fmt.Println(string(output))
}