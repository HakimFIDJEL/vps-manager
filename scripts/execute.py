#!/usr/bin/env python3
import sys
import subprocess

if len(sys.argv) < 3:
    sys.exit(1)

user = sys.argv[2]
command = sys.argv[3:] 

cmd_str = f"sudo -u {user} " + ' '.join(command)

try:
    result = subprocess.run(
        cmd_str,
        shell=True,
        capture_output=True,
        text=True,
        timeout=10
    )
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    sys.exit(result.returncode)

except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
