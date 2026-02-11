# SneakVault – Plateforme E-commerce Fullstack

Marketplace fullstack dédiée aux sneakers.  

Le projet inclut une API REST + GraphQL sécurisée (Node.js / Express + MongoDB) ainsi qu’une application frontend React/Tailwind permettant de parcourir les produits, gérer le panier & le checkout, effectuer des paiements simulés, gérer les avis, suivre les livraisons, afficher des recommandations via une API externe de géolocalisation, et administrer la plateforme via un back-office.

---

## Table des matières

1. [Stack Technique](#stack-technique)  
2. [Structure du Projet](#structure-du-projet)  
3. [Fonctionnalités Principales](#fonctionnalités-principales)  
4. [API Backend](#api-backend)  
5. [Application Frontend](#application-frontend)  
6. [Workflow de Développement Local](#workflow-de-développement-local)  
7. [Ressources & Documentation](#ressources--documentation)  

---

## Stack Technique

- **Backend :**  
  Node.js, Express 4, Apollo Server 3/4, MongoDB / Mongoose, JWT, Swagger
- **Frontend :**  
  React 18, Vite, React Router, Axios, Tailwind CSS
- **Outils & Middlewares :**  
  morgan, body-parser, Joi (validation), rate-limiting, dotenv
- **API Externes :**  
  OpenStreetMap (Nominatim) pour la géolocalisation et la recherche de points relais

---

## Structure du Projet

Le dépôt contient :

- un dossier **backend/** → API REST + GraphQL  
- un dossier **frontend/** → application React SPA  
- un dossier **documentation/** avec les livrables liés au projet  
- les fichiers de configuration (Vite, eslint, env, etc.)

> Les deux parties fonctionnent ensemble mais peuvent être déployées ou testées indépendamment.

---

## Fonctionnalités Principales

### 🛍️ Catalogue Produits & Recherche

- Liste des produits  
- Pages de détails : stock, avis, prix, description  
- Recherche et filtrage  
- Ajout au panier

### 👤 Authentification & Profil

- Inscription / connexion via JWT  
- Gestion du profil utilisateur  
- Suppression de compte  
- Accès conditionnel aux données personnelles

### 🛒 Panier & Checkout

- Panier persistant par utilisateur  
- Vérification du stock en temps réel  
- Création de commande  
- Paiement simulé (mock processor)

### 💳 API Paiements

- Endpoints dédiés  
- Anti-spam via rate-limiting  
- Références de transaction  
- Suivi d’état (PENDING / SUCCESS / FAILED)

### 📦 API Stock

- Lecture et mise à jour du stock  
- Exposé en REST et GraphQL  
- Cohérence assurée lors du checkout

### ⭐ API Avis

- Ajout / suppression d’avis  
- Modération possible via rôle admin  
- Accès en REST et GraphQL

### 🚚 Livraisons & Suivi

- Lien direct entre commande et livraison  
- Statuts évolutifs : preparing, shipped, delivered…  
- Numéro de suivi et mise à jour

### 🤖 Recommandations & Points Relais

- Recommandations basées sur l’historique utilisateur  
- Suggestion de produits similaires  
- Recherche de points relais via géolocalisation (OpenStreetMap)

### 🛠️ Back-Office Admin

- Gestion des produits (CRUD)  
- Gestion des commandes  
- Gestion des utilisateurs  
- Suivi des paiements et stocks

### 🔗 Gateway GraphQL

Endpoint `/graphql` exposant :  
`Product`, `Stock`, `Payment`, `Review`, `Order`, `User` ainsi que les mutations associées.

### 🧑‍💻 Expérience Développeur

- Swagger UI `/api/docs`  
- Health check `/health`  
- Rate limits sur routes sensibles  
- Code organisé et documenté

---

## API Backend

### Prérequis

- **Node.js 18+** (testé avec Node 20.x)  
- **npm 9+**  
- **Instance MongoDB** (Atlas ou locale)

### Installation & lancement

```bash
cd backend/
npm install
npm start
```

## Application Frontend

### 🏠 1. Accueil

La page d’accueil présente l’ensemble des produits disponibles sur la plateforme.

Elle met en avant les articles les plus populaires, les promotions actuelles et propose une navigation simple pour explorer les différentes catégories.

L’utilisateur peut consulter les produits, accéder à leur fiche détaillée, les ajouter au panier ou poursuivre son parcours d'achat.

### 🤖 2. Recos

Cette page regroupe deux fonctionnalités propulsées par l’IA et la géolocalisation :

- **Recommandations produit**

Un moteur de recommandations analyse le profil utilisateur, son historique d’achat et ses interactions pour proposer des suggestions personnalisées.
Les produits recommandés sont pertinents, dynamiques et mis à jour selon le comportement en temps réel.

- **Points relais les plus proches**

À partir de la localisation de l’utilisateur, le système affiche automatiquement une liste de points relais disponibles autour de lui.
Chaque point relais comprend des informations utiles comme la distance, l’adresse et la disponibilité.
L’objectif est de simplifier la livraison et d’optimiser l’expérience de checkout.

### 🛒 3. Panier

La page Panier rassemble tous les produits sélectionnés par l’utilisateur.
Elle permet de :

- Consulter les articles ajoutés,

- Modifier les quantités,

- Supprimer un produit,

- Voir le total de la commande en temps réel,

- Accéder au paiement.

C’est une étape clé du tunnel d'achat, conçue pour être fluide et intuitive.

### 📦 4. Commande

La page Commande permet à l’utilisateur de finaliser son achat.
Elle inclut :

- La sélection ou la confirmation d’une adresse de livraison / point relais,

- Le récapitulatif complet des articles,

- Le choix du moyen de paiement,

- Un suivi en temps réel de l’état de la commande (en préparation, expédiée, livrée).

Une fois la commande validée, l’utilisateur peut consulter son statut à tout moment.

### 🛠️ 5. Page Admin

Cette interface est réservée aux administrateurs et permet de gérer l’ensemble du catalogue et des opérations :

- Gestion des produits (création, mise à jour, suppression),

- Gestion des stocks en temps réel,

- Visualisation des commandes et mise à jour de leur statut,

- Revue des paiements,

- Modération des avis clients.

Cette page centralise les outils essentiels pour administrer la plateforme de manière efficace et sécurisée.

### Installation & lancement

```bash
cd frontend/
npm install
npm run dev
```

## Workflow de Développement Local

### 1. Configuration de l’environnement

- Copier `backend/.env.example` → `backend/.env`
- Renseigner les variables : `PORT`, `JWT_SECRET`, `MONGODB_URI`

### 2. Installation des dépendances

- Dans `backend/` : `npm install`
- Dans `frontend/` : `npm install`

### 3. Initialisation des données

- Créer quelques utilisateurs et produits via :
  - Swagger UI
  - le shell MongoDB
  - ou un script de seed (optionnel)
- Les produits doivent comporter :  
  *name, brand, category, description, price, image, stock*

### 4. Lancer le backend

```bash
npm start
```

Le serveur démarre (Express + GraphQL sur un même port).

### 5. Lancer le frontend

```bash
npm run dev
```

Les requêtes sont envoyées au backend via les URL complètes définies dans api.js.

### 6. Explorer la documentation de l’API

- **REST :** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

- **GraphQL Playground :** [http://localhost:4000/graphql](http://localhost:4000/graphql)

### 7. Démonstration complète des fonctionnalités

- S’inscrire / se connecter

- Parcourir le catalogue

- Ajouter des produits au panier

- Passer une commande

- Laisser un avis sur un produit

- Explorer les tableaux de bord administrateur

## Ressources & Documentation

Le dossier `documentation/` regroupe l’ensemble des livrables réalisés durant le projet :

- **documentation/API_externe/**  
  Contient la documentation liée à l’intégration de l’API externe (géolocalisation, points relais, etc.).

- **documentation/APIs/**  
  Spécifications complètes des API REST et GraphQL (endpoints, schémas, exemples de requêtes/réponses).

- **documentation/architecture/**  
  Schémas d’architecture, documentation technique et notes de déploiement.
