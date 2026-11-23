# Application « Prières » — Mini-Projet Angular

Application web développée avec Angular par **Youssef Neji** permettant de consulter les horaires des cinq prières quotidiennes à l'aide de l'API REST gratuite **AlAdhan Prayer Times**.

## Fonctionnalités

- Affichage de la date du jour (calendrier grégorien et hijri).
- Affichage des horaires des cinq prières : **Fajr**, **Dhuhr**, **Asr**, **Maghrib** et **Isha** (ville par défaut : **Sfax, Tunisie**).
- Détermination automatique de la prochaine prière avec mise en évidence et compte à rebours en temps réel.
- Géolocalisation du navigateur avec affichage de la latitude et de la longitude obtenues.
- Recherche des horaires pour n'importe quelle ville (avec accès rapide à plusieurs villes tunisiennes).
- Navigation multi-pages via le routage Angular (`/horaires`, `/recherche`, `/a-propos`).

## Technologies utilisées

- **Angular 21** (composants standalone, `@if`, `@for`, `@switch`, `@Input`, `ngModel`, `HttpClient`, `Router`)
- **Tailwind CSS v4** (interface légère et responsive)
- **Police Montserrat** (Google Fonts)
- **API REST AlAdhan** (`https://api.aladhan.com/v1/timings` et `/timingsByCity`)

## Prérequis

- **Node.js** (version 20 ou supérieure recommandée)
- **npm**
- **Angular CLI** (`npm install -g @angular/cli` si non installé)

## Installation et démarrage

1. Ouvrir un terminal dans le dossier `MiniProject` :

```bash
cd MiniProject
```

2. Installer les dépendances :

```bash
npm install
```

*(Si votre version de npm signale un conflit de dépendances avec Vitest, exécutez `npm install --legacy-peer-deps`.)*

3. Lancer le serveur de développement :

```bash
npm start
```

ou :

```bash
ng serve
```

4. Ouvrir le navigateur à l'adresse : `http://localhost:4200`

## Compiler pour la production

```bash
npm run build
```

## Structure du projet

```text
src/app/
├── components/
│   ├── navbar/          # Barre de navigation principale
│   ├── next-prayer/     # Carte de la prochaine prière et compte à rebours
│   └── prayer-list/     # Liste des cinq prières avec mise en évidence
├── models/
│   └── prayer.model.ts  # Interfaces TypeScript pour l'API et l'affichage
├── pages/
│   ├── horaires/        # Page d'accueil (Sfax par défaut + géolocalisation)
│   ├── recherche/       # Page de recherche par ville
│   └── a-propos/        # Présentation du projet, API et méthodes de calcul
├── services/
│   └── prayer.service.ts # Appels HTTP AlAdhan et calcul du compte à rebours
├── app.config.ts
├── app.routes.ts
└── app.ts
```
