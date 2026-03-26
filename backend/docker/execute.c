#!/usr/bin/env python3
"""C execution wrapper — reads user code from stdin, compiles with gcc, runs, returns JSON."""
import sys
import json
import subprocess
import tempfile
import os

def main():
    code = sys.stdin.read()

    with tempfile.NamedTemporaryFile(suffix='.c', delete=False, mode='w', dir='/tmp') as f:
        f.write(code)
        src = f.name

    bin_path = src[:-2]  # strip .c

    try:
        compile_proc = subprocess.run(
            ['gcc', '-o', bin_path, src, '-lm'],
            capture_output=True, text=True, timeout=15
        )
        if compile_proc.returncode != 0:
            print(json.dumps({
                'success': False,
                'stdout': '',
                'stderr': compile_proc.stderr or compile_proc.stdout,
                'exit_code': 1
            }))
            return

        run_proc = subprocess.run(
            [bin_path],
            capture_output=True, text=True, timeout=5
        )
        print(json.dumps({
            'success': run_proc.returncode == 0,
            'stdout': run_proc.stdout,
            'stderr': run_proc.stderr,
            'exit_code': run_proc.returncode
        }))

    except subprocess.TimeoutExpired:
        print(json.dumps({
            'success': False,
            'stdout': '',
            'stderr': 'Execution timed out (5 seconds)',
            'exit_code': 124
        }))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'stdout': '',
            'stderr': str(e),
            'exit_code': 1
        }))
    finally:
        for path in [src, bin_path]:
            try:
                os.unlink(path)
            except Exception:
                pass

main()
