import sys
import json
import pam
import getpass
import pwd
import subprocess

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
    print(json.dumps({'auth': False, 'error': 'missing username'}))
    exit(1)

username = sys.argv[1]
# password = getpass.getpass()
password = sys.stdin.readline().strip()

auth = pam.pam()
if not auth.authenticate(username, password):
    print(json.dumps({'auth': False}))
    exit(0)

for cmd in REQUIRED_COMMANDS:
    if not user_can_run_command(username, cmd):
        print(json.dumps({
            'auth': False,
            'error': f'user {username} cannot run {cmd}'
        }))
        exit(0)

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
except:
    print(json.dumps({'auth': True, 'username': username}))
