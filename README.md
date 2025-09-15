# VPS Manager

*Manage, deploy, and host any project on your VPS with an intuitive web interface powered by Docker Compose*.

![VPS Manager Logo](./public/assets/images/logo-dark.png)

## Description

VPS Manager started as a side project with a simple goal: to manage, deploy, and host my own projects on a personal VPS.  

It is designed to work on any server or computer that meets the required dependencies. A "project" can represent anything that can be hosted on a server — from Minecraft servers, websites, databases, and scripts, to APIs, WebSocket servers, and reverse proxies.  

Each project is managed through Docker Compose, ensuring isolated environments with all necessary dependencies. All projects are stored under a dedicated `/projects` root directory, while VPS Manager itself runs continuously on the VPS, providing a user-friendly web interface to interact directly with the server through the browser.  

> The project is built to be highly scalable, with a long-term roadmap aiming to go beyond project management into full server management and direct system interaction.

## Requirements

VPS Manager is a Laravel 12 + Inertia + React application.

To run it properly, you need:

- **OS**: Ubuntu 24.04+ (or Debian-based)
- **PHP**: 8.2+ with `mbstring`, `tokenizer`, `xml`, `curl`, `zip`, `pdo`, `pdo_mysql` (or `pdo_sqlite`)
- **Node.js**: 20+ (npm bundled)
- **Composer**: 2.x+
- **Docker Engine** + **Docker Compose v2** (plugin)
- **Python 3** (PAM auth / command wrappers)
- **Apache HTTP Server** with `php-fpm` (recommended) or `mod_php`

## Permissions

The Linux user running the app must be allowed to execute required system commands (Docker, etc.).

> To see which user/group PHP-FPM uses, check `/etc/php/8.x/fpm/pool.d/www.conf` (default: `www-data`).

Update `sudoers` (replace `<my_user>`):

```bash
sudo visudo -f /etc/sudoers.d/vps-manager
<my_user> ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/mkdir, /bin/ls, /usr/bin/mv, /bin/rm, /bin/echo
```

You’ll find install steps for both the requirements and the app in **Installation**.

## Installation

### Requirements

> Execute each commands with root permissions by running `sudo su`

- **PHP (v8.3.x)**
```bash
apt update

apt install -y php8.3 php8.3-cli php8.3-fpm \
  php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip \
  php8.3-sqlite3 php8.3-mysql

php --version
```

- **Node (v20.x)**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | -E bash -

apt install -y nodejs

node --version
npm --version
```

- **Composer (v2.7.1)**
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

HASH=$(curl -s https://composer.github.io/installer.sig)
php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); exit(1); } echo PHP_EOL;"

php composer-setup.php --install-dir=/usr/local/bin --filename=composer

php -r "unlink('composer-setup.php');"

composer --version
```

- **Python (v3.*)**
```bash
apt update
apt install -y python3 python3-pip python3-venv

python3 --version
pip3 --version
```

- **Docker & Docker Compose (v2.29.7)**

> Installation of docker depends on the OS of your server.

```bash
apt update
apt install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release; echo $VERSION_CODENAME) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

docker --version
docker compose version
```

- **Apache**
```
# Apache installation 
apt update
apt install -y apache2 php8.3-fpm openssl

a2enmod rewrite ssl headers proxy_fcgi setenvif
a2enconf php8.3-fpm
a2ensite default-ssl || true

# Define apache ports
cat >/etc/apache2/ports.conf <<'EOF'
Listen 9000
Listen 9443
EOF

# Generate self-signed certificate with SAN=IP
IP=$(hostname -I | awk '{print $1}')
openssl req -x509 -newkey rsa:2048 -nodes -days 825 \
  -keyout /etc/ssl/private/vps.key -out /etc/ssl/certs/vps.crt \
  -subj "/CN=$IP" -addext "subjectAltName=IP:$IP"
chmod 600 /etc/ssl/private/vps.key

# Adapt VirtualHost HTTP → redirect to HTTPS
cat >/etc/apache2/sites-available/000-default.conf <<EOF
<VirtualHost *:9000>
    ServerName $IP
    RewriteEngine On
    RewriteCond %{HTTP_HOST} ^([^:]+) [NC]
    RewriteRule ^ https://%1:9443%{REQUEST_URI} [R=301,L]
    DocumentRoot /var/www/html
</VirtualHost>
EOF

# Adapt VirtualHost for HTTPS with self-signed cert
cat >/etc/apache2/sites-available/default-ssl.conf <<'EOF'
<VirtualHost *:9443>
  ServerName $IP
  DocumentRoot /var/www/html/public

  SSLEngine On
  SSLCertificateFile /etc/ssl/certs/vps.crt
  SSLCertificateKeyFile /etc/ssl/private/vps.key

  <Directory /var/www/html/public>
    AllowOverride All
    Require all granted
    Options -Indexes
  </Directory>

  <FilesMatch "\.php$">
    SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost/"
  </FilesMatch>
  DirectoryIndex index.php
</VirtualHost>
EOF

# Check config and restart
apache2ctl -t
systemctl restart apache2
ss -ltnp | egrep ':9000|:9443'

# Open firewall ports
ufw allow 9000/tcp
ufw allow 9443/tcp
ufw reload

# Create test file
echo "It works" >/var/www/html/index.html

```

You should now be able to access VPS Manager at:
- `http://<your_server_ip>:9000` (auto-redirects)
- `https://<your_server_ip>:9443` (self-signed cert, browser warning expected)

> Keep in mind that ports `9000` and `9443` are reserved by Apache for VPS Manager. Do not use them in your Docker projects.

### VPS Manager

- **Git**

// Explication sur comment installer git, dire qu'il faut une clé ssh et s'authentifier mais la démonstration n'est pas faite ici donc il faut chercher sur internet, il faut que git soit installé et que l'utilisateur soit authentifié.

- **Fetch the project**
```bash
cd /var/www/html

rm -f index.html

git clone git@github.com:HakimFIDJEL/vps-manager.git .

sudo chown -R <your_user>:<your_user> /var/www/html
sudo chgrp -R www-data /var/www/html/storage /var/www/html/bootstrap/cache
sudo chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
```

- **Dependencies**
```bash
# Laravel dependencies
composer install

# Node dependencies
npm install
npm run build

# Python requirements
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# App requirements
cp .env.example .env
php artisan key:generate

# Add the variable PYTHON_PATH
nano .env
PYTHON_PATH=/path/to/vps-manager/.venv/bin/python

```

## Usage

> When logging in, make sure your user has the right permissions as stated in **Permissions** and that `PasswordAuthentication` is set to `yes` in the files `/etc/ssh/sshd_config` and `/etc/ssh/sshd_config.d/*` if they exist.

## Documentation

## Contributing

## License


