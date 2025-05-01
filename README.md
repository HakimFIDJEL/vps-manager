# lri-starter-kit

## Description
lri-starter-kit est une base de projet vierge intégrant :
- **Laravel 12**
- **React 18**
- **Inertia.js 2**
- **Tailwind CSS v4**
- **shadcn/ui**

Cette base reprend la structure officielle de Laravel 12, en allégeant les composants :
- Suppression des pages et logiques d’authentification multiples
- Un seul `AuthController` et `AuthMiddleware`
- Un ensemble minimal de routes (accueil, erreurs, authentification)

La gestion des erreurs est centralisée via Inertia et `abort(...)`; toutes les erreurs HTTP renvoient vos pages React épurées dans `resources/js/pages/errors/errorPage.tsx`.

L’interface de démarrage fournit une page `welcome` servant de squelette de dashboard avec :
- Une barre latérale réactive (sidebar)
- Un en‑tête (header)

## Installation
```bash
# Cloner le dépôt
git clone git@github.com:hakimfidjel/lri-starter-kit.git
cd lri-starter-kit

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
```

## Contributions
Ce projet est pensé comme une base vierge. N’hésitez pas à forker et à l’adapter selon vos besoins.