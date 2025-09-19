# Security Policy

## Supported Versions
Until the first stable release, only the main branch will receive security-related updates.

## Reporting a Vulnerability
Please use GitHub Security Advisories (Security tab > Report a vulnerability) or contact `hakimfidjel.pro@gmail.com`. Do not open a public issue for security reports.

When reporting, include:
- exact version or commit, OS, and stack (PHP, Node, Docker, Python)
- minimal reproduction steps
- expected vs actual impact (read/write, RCE, privilege escalation, etc.)
- proof-of-concept (command/cURL/script) and relevant logs or screenshots

## Disclosure approach
This project is provided "as is" and may be used at your own risk. There is no guaranteed SLA for triage or fixes. If you report a vulnerability, we will acknowledge receipt when possible and will evaluate and fix issues as resources allow. Do not assume any fixed deadlines.

## Scope
In scope:
- Code in this repository (Laravel + Inertia/React + Python wrappers), setup scripts, and example configs
- Issues affecting PAM authentication, command execution via Process::, YAML parsing for docker-compose, and sudoers permission handling

Out of scope:
- Denial-of-service testing or resource exhaustion attacks
- Reports without a practical proof-of-exploit
- Issues in third-party dependencies already fixed upstream
- Phishing, social engineering, or problems caused by external vendors

## Safe Harbor
If you test in good faith, avoid harming others, and do not disrupt availability, we will not pursue legal action. Avoid using real user data in tests.

## Operational recommendations
- Restrict sudoers entries to the minimum required (see README > Permissions)
- Protect the Docker socket and do not expose it publicly
- Use HTTPS with valid certificates in production and firewall admin ports
- Keep PHP/Node/Docker and dependencies up to date
- Review incoming docker-compose files for risky mounts or privileged containers

Thank you for helping keep VPS Manager secure.
