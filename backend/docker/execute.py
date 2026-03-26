#!/usr/bin/env python3
"""Python execution wrapper — reads user code from stdin, runs it, returns JSON.
Docker provides the isolation so no sandbox restrictions are needed."""
import sys
import json
import subprocess
import tempfile
import os

def main():
    code = sys.stdin.read()

    with tempfile.NamedTemporaryFile(suffix='.py', delete=False, mode='w', dir='/tmp') as f:
        f.write(code)
        src = f.name

    try:
        proc = subprocess.run(
            ['python3', src],
            capture_output=True, text=True, timeout=10
        )
        print(json.dumps({
            'success': proc.returncode == 0,
            'stdout': proc.stdout,
            'stderr': proc.stderr,
            'exit_code': proc.returncode
        }))

    except subprocess.TimeoutExpired:
        print(json.dumps({
            'success': False, 'stdout': '',
            'stderr': 'Execution timed out (10 seconds limit)',
            'exit_code': 124
        }))
    except Exception as e:
        print(json.dumps({
            'success': False, 'stdout': '',
            'stderr': str(e),
            'exit_code': 1
        }))
    finally:
        try:
            os.unlink(src)
        except Exception:
            pass

main()
