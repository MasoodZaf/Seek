#!/usr/bin/env python3
import sys
import json
import signal
import resource
import io
from contextlib import redirect_stdout, redirect_stderr

def set_limits():
    # Set CPU time limit (5 seconds)
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    # Set memory limit (64MB)
    resource.setrlimit(resource.RLIMIT_AS, (64 * 1024 * 1024, 64 * 1024 * 1024))

def timeout_handler(signum, frame):
    raise TimeoutError("Code execution timed out")

def main():
    try:
        # Set resource limits
        set_limits()
        
        # Set timeout alarm
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(5)
        
        # Read code from stdin
        code = sys.stdin.read()
        
        # Capture stdout and stderr
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        result = {
            "success": True,
            "stdout": "",
            "stderr": "",
            "exit_code": 0
        }
        
        try:
            # Compile the code to check for syntax errors
            compiled_code = compile(code, '<user_code>', 'exec')
            
            # Execute with captured output
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                exec(compiled_code, {"__builtins__": {
                    "print": print,
                    "len": len,
                    "range": range,
                    "str": str,
                    "int": int,
                    "float": float,
                    "list": list,
                    "dict": dict,
                    "tuple": tuple,
                    "set": set,
                    "abs": abs,
                    "max": max,
                    "min": min,
                    "sum": sum,
                    "sorted": sorted,
                    "reversed": reversed,
                    "enumerate": enumerate,
                    "zip": zip,
                    "map": map,
                    "filter": filter,
                    "type": type,
                    "isinstance": isinstance,
                    "hasattr": hasattr,
                    "getattr": getattr,
                    "setattr": setattr,
                    "round": round,
                    "pow": pow,
                    "divmod": divmod,
                    "chr": chr,
                    "ord": ord,
                    "bool": bool,
                    "Exception": Exception,
                    "ValueError": ValueError,
                    "TypeError": TypeError,
                    "IndexError": IndexError,
                    "KeyError": KeyError,
                    "AttributeError": AttributeError
                }})
                
        except Exception as e:
            result["success"] = False
            result["stderr"] = str(e)
            result["exit_code"] = 1
        
        # Cancel the alarm
        signal.alarm(0)
        
        # Get captured output
        result["stdout"] = stdout_capture.getvalue()
        result["stderr"] += stderr_capture.getvalue()
        
        # Print result as JSON
        print(json.dumps(result))
        
    except TimeoutError:
        print(json.dumps({
            "success": False,
            "stdout": "",
            "stderr": "Code execution timed out (5 seconds limit)",
            "exit_code": 124
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "stdout": "",
            "stderr": f"Execution error: {str(e)}",
            "exit_code": 1
        }))

if __name__ == "__main__":
    main()