# Portfolio

## Description
Ce projet est un portfolio personnel développé avec **Next.js** et **Tailwind CSS**. Il met en avant mes compétences, mes projets et mon parcours professionnel.

## Technologies
- **Next.js** - Framework React pour le rendu côté serveur et statique
- **Tailwind CSS** - Framework CSS pour une conception rapide et responsive
- **Docker** - Conteneurisation de l'application pour un déploiement simplifié
- **Traefik** - Reverse proxy pour la gestion des certificats SSL et des routes
- **GitHub Actions** - CI/CD pour l'automatisation des déploiements

## Installation
```sh
# Cloner le dépôt
git clone https://github.com/HakimFIDJEL/portfolio.git
cd portfolio

# Installer les dépendances
npm install 

# Lancer le serveur de développement (scss, php artisan & vite)
npm run start
```

## Docker
```sh
# Construire et exécuter le conteneur Docker
docker build -t hakimfidjel/portfolio:latest .
docker run -d -p 3000:3000 hakimfidjel/portfolio:latest
```

## Déploiement sur VPS
Le projet est déployé sur mon vps personnel grâce à **Docker** & **Docker Compose**.

## CI/CD avec GitHub Actions
Le déploiement est automatisé via **GitHub Actions**, qui construit et déploie l'image Docker à chaque push sur la branche `prod`.

## Liens
- [Portfolio en ligne](https://hakimfidjel.fr)
- [Repository GitHub](https://github.com/HakimFIDJEL/portfolio)
