import sys
import json
import subprocess

if len(sys.argv) < 3:
    print(json.dumps({'error': 'missing arguments'}))
    exit(1)

user = sys.argv[1]
command = sys.argv[2:]

cmd = ['sudo', '-u', user] + command

try:
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=10
    )
    print(json.dumps({
        'stdout': result.stdout,
        'stderr': result.stderr,
        'returncode': result.returncode,
        'successful': result.returncode == 0
    }))
except Exception as e:
    print(json.dumps({'error': str(e)}))
