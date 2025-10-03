# 🍎 NutriTrack

**NutriTrack** est une application web intelligente de suivi nutritionnel qui utilise l'intelligence artificielle (Google Gemini) pour analyser automatiquement les repas à partir d'images et fournir des recommandations personnalisées.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API et Services](#-api-et-services)
- [Base de données](#-base-de-données)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🔐 Authentification

- **Inscription** : Création de compte avec profil détaillé (âge, poids, taille, objectifs)
- **Connexion** : Authentification sécurisée avec sessions
- **Profil utilisateur** : Gestion des informations personnelles

### 📸 Analyse intelligente des repas

- **Upload d'images** : Téléchargement de photos de repas
- **Analyse IA** : Utilisation de Google Gemini pour identifier les aliments
- **Calcul nutritionnel** : Estimation automatique des calories, protéines, glucides et lipides
- **Recommandations** : Suggestions personnalisées basées sur l'analyse

### 📊 Suivi nutritionnel

- **Historique** : Visualisation de tous les repas analysés
- **Dashboard** : Vue d'ensemble des données nutritionnelles
- **Recommandations** : Conseils adaptés aux conditions de santé

### 🎯 Personnalisation

- **Profils adaptés** : Support pour diabète, hypertension, obésité, athlètes
- **Objectifs personnalisés** : Perte de poids, contrôle du diabète, amélioration des performances
- **Niveaux d'activité** : Faible, moyen, élevé

## 🛠 Technologies utilisées

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Base de données relationnelle
- **bcrypt** - Hachage des mots de passe
- **express-session** - Gestion des sessions

### Intelligence Artificielle

- **Google Gemini AI** - Analyse d'images et génération de recommandations
- **@google/generative-ai** - SDK officiel Google

### Frontend

- **EJS** - Moteur de template
- **Tailwind CSS** - Framework CSS utilitaire
- **Express EJS Layouts** - Gestion des layouts

### Outils de développement

- **Nodemon** - Redémarrage automatique du serveur
- **Husky** - Git hooks
- **Prettier** - Formatage de code
- **Commitlint** - Validation des messages de commit

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **MySQL** (version 8.0 ou supérieure)
- **Clé API Google Gemini** (obtenez-la sur [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/wassimyazza/NutriTrack-.git
cd NutriTrack
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

```bash
# Créer la base de données
mysql -u root -p
CREATE DATABASE nutritrack;
USE nutritrack;

# Importer les tables
mysql -u root -p nutritrack < tables.sql
```

### 4. Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet (copiez le contenu ci-dessous) :

```env
# Configuration de la base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=nutritrack

# Configuration de la session
SESSION_SECRET=votre_clé_secrète_très_longue_et_sécurisée_ici

# Configuration Google Gemini AI
GEMINI_API_KEY=votre_clé_api_gemini_ici

# Configuration du serveur
PORT=3000

# Configuration de l'environnement
NODE_ENV=development
```

> ⚠️ **Important** : Remplacez les valeurs par vos propres configurations et ne commitez jamais le fichier `.env` !

## ⚙️ Configuration

### Base de données

Le fichier `tables.sql` contient la structure complète de la base de données avec des données d'exemple.

### Google Gemini AI

1. Rendez-vous sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une nouvelle clé API
3. Ajoutez-la dans votre fichier `.env`

## 🎮 Utilisation

### Démarrer l'application

```bash
# Mode développement (avec Tailwind CSS en watch)
npm run dev

# Ou séparément
npm start
npm run tailwind
```

### Accéder à l'application

Ouvrez votre navigateur et allez sur : `http://localhost:3000`

### Workflow utilisateur

1. **Inscription** : Créez votre compte avec vos informations personnelles
2. **Connexion** : Connectez-vous à votre compte
3. **Upload** : Téléchargez une photo de votre repas
4. **Analyse** : L'IA analyse automatiquement votre repas
5. **Suivi** : Consultez vos résultats et recommandations
6. **Historique** : Visualisez tous vos repas précédents

## 📁 Structure du projet

```
NutriTrack/
├── app/
│   ├── controllers/          # Contrôleurs MVC
│   │   ├── AuthController.js
│   │   ├── MealController.js
│   │   ├── DashboardController.js
│   │   └── ...
│   ├── models/              # Modèles de données
│   │   ├── User.js
│   │   ├── Meal.js
│   │   └── ...
│   ├── services/            # Services externes
│   │   └── geminiService.js
│   ├── middlewares/         # Middlewares Express
│   └── validators/          # Validation des données
├── config/                  # Configuration
│   └── multer.js           # Configuration upload fichiers
├── database/               # Configuration base de données
│   └── db.js
├── public/                 # Fichiers statiques
│   ├── css/
│   ├── images/
│   └── main.js
├── routes/                 # Définition des routes
│   └── web.js
├── views/                  # Templates EJS
│   ├── auth/
│   ├── meals/
│   ├── dashboard/
│   └── ...
├── server.js              # Point d'entrée de l'application
├── tables.sql             # Structure de la base de données
└── package.json
```

## 🔌 API et Services

### Google Gemini Service

Le service `geminiService.js` utilise l'API Google Gemini pour :

- Analyser les images de repas
- Identifier les aliments
- Calculer les valeurs nutritionnelles
- Générer des recommandations personnalisées

### Endpoints principaux

- `POST /meals/analyze` - Analyse d'une image de repas
- `GET /meals/:id` - Détails d'un repas
- `GET /historique` - Historique des repas
- `GET /dashboard` - Tableau de bord utilisateur
- `GET /profile` - Profil utilisateur

## 🗄️ Base de données

### Tables principales

- **users** : Informations utilisateurs et profils nutritionnels
- **meals** : Repas analysés avec valeurs nutritionnelles
- **user_meals** : Association utilisateur-repas
- **recommendations** : Recommandations générées par l'IA

### Relations

- Un utilisateur peut avoir plusieurs repas
- Un repas peut avoir plusieurs recommandations
- Historique complet des repas par utilisateur
