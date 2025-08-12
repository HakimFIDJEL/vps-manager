# vps manager

## Description

La description arrive (emoji planète)

## Installation
```bash
# Cloner le dépôt
git clone git@github.com:hakimfidjel/vps-manager.git
cd vps-manager

# Installer les dépendances PHP et JS
composer install
npm install

# Configuration
cp .env.example .env
php artisan key:generate

# Préparer la base de données
php artisan migrate

# Lancer le serveur backend
php artisan serve

# Lancer le serveur de développement Frontend
npm run dev

# Espace virtuel python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Préparation du projet et des permissions

### Chemin python
Ajouter dans le fichier `.env` la variable `PYTHON_PATH` :
```
PYTHON_PATH=/path/to/vps-manager/.venv/bin/python
```

### Avoir au moins un utilisateur avec les droits root

```
sudo visudo -f /etc/sudoers.d/vps-manager
<my_user> ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/mkdir, /bin/ls, /usr/bin/mv, /bin/rm, /bin/echo
```

En utilisation sur le VPS (via apache par exemple), vérifier quel utilisateur système utilise Laravel par exemple :
```
/etc/php/8.x/fpm/pool.d/www.conf
user = www-data
group = www-data
```

Il faut alors remplacer `my_user` par `www-data`


## Contributions

ça arrive aussi