import sys
import os
import json
import getpass
import pwd
import subprocess

# Try import pam with a clear fallback message
try:
    import pam  # type: ignore
    PAM_AVAILABLE = True
except Exception:
    PAM_AVAILABLE = False

REQUIRED_COMMANDS = [
    '/usr/bin/docker',
    '/usr/bin/mkdir',
    '/bin/ls',
    '/usr/bin/mv',
    '/bin/rm',
]

def user_can_run_command(user, cmd):
    try:
        result = subprocess.run(
            ['sudo', '-l', '-U', user],
            capture_output=True,
            text=True
        )
        for line in result.stdout.splitlines():
            if 'NOPASSWD' in line and cmd in line:
                return True
        return False
    except Exception:
        return False

if len(sys.argv) != 2:
    print(json.dumps({'auth': False, 'error': 'The username is required'}))
    sys.exit(1)

if not PAM_AVAILABLE:
    print(json.dumps({
        'auth': False,
        'error': "The authentication python package pam is not installed, follow the README for installation instructions."
    }))
    sys.exit(1)

username = sys.argv[1]
password = sys.stdin.readline().strip()

auth = pam.pam()
if not auth.authenticate(username, password):
    print(json.dumps({'auth': False}))
    sys.exit(0)    

# -- DEBUG -- #
# print(json.dumps({
#     'auth': False,
#     'error': f'This is a test'
# }))
# sys.exit(0)
# -- DEBUG -- #

# for cmd in REQUIRED_COMMANDS:
#     if not user_can_run_command(username, cmd):
#         print(json.dumps({
#             'auth': False,
#             'error': f'The user {username} cannot run {cmd}'
#         }))
#         sys.exit(0)

try:
    user_info = pwd.getpwnam(username)
    print(json.dumps({
        'auth': True,
        'username': username,
        'uid': user_info.pw_uid,
        'gid': user_info.pw_gid,
        'home': user_info.pw_dir,
        'shell': user_info.pw_shell
    }))
except Exception:
    print(json.dumps({'auth': True, 'username': username}))

