#!/usr/bin/env python3
import sys, shlex, subprocess

if len(sys.argv) < 3:
    sys.exit(1)

# sys.argv[1] = user, sys.argv[2:] = command parts (or one arg with spaces)
user = sys.argv[1]
raw = ' '.join(sys.argv[2:])   # couvre les deux cas
parts = shlex.split(raw)

# if caller accidentally prefixed 'sudo', remove it
if parts and parts[0] == 'sudo':
    parts = parts[1:]

cmd = ["sudo", "-u", user] + parts

try:
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    sys.exit(result.returncode)
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
