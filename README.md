# DaddyChocolat — Application E-Commerce (Projet Final L2)

## Présentation du Projet
Application web e-commerce réalisée dans le cadre de l'examen **ESSGAM L2 GL** (Sujet N°1 : *Gestion des Commandes et Produits*).  
**DaddyChocolat** est un site vitrine et boutique en ligne dédié au chocolat d'exception pure origine de la vallée du Sambirano (Madagascar).

---

##  Structure du Projet `Choco_final`

- **`backend/`** : API REST bâtie avec **Node.js**, **Express.js** et **MySQL2**. Contient les fichiers fondamentaux `db.js` et `server.js` (calqués sur le modèle du TP CRUD L2).
- **`frontend/`** : Interface utilisateur réactive construite avec **React**, **Vite** et **Tailwind CSS**.
- **`frontend/public/images/`** : Images haute définition des produits de chocolat générées spécifiquement pour l'application.

---

##  Instructions de Lancement

### 1. Démarrer le Backend (Node.js / Express)
```bash
cd backend
npm install
node server.js
```
*Le serveur API démarre sur `http://localhost:5000`.*  
> **Note Base de Données (MySQL)** : Si un serveur MySQL (XAMPP / Wamp / MariaDB) est actif sur `localhost:3306`, les tables (`categories`, `produits`, `clients`, `commandes`, `lignes_commande`) sont créées et alimentées automatiquement au lancement. Si MySQL n'est pas démarré, le backend utilise automatiquement un jeu de données de secours en mémoire pour garantir une démonstration sans crash !

### 2. Démarrer le Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*L'application s'ouvre dans votre navigateur sur `http://localhost:3000`.*

---

##  Fonctionnalités Développées (Niveau L2)

1. **Espace Client (Boutique)** :
   - Consultation du catalogue des chocolats avec affichage des images et du pourcentage de cacao signature.
   - Filtrage par catégorie et barre de recherche interactive.
   - Gestion dynamique du panier (ajout, suppression, calcul du total en Ariary).
   - Validation de commande avec enregistrement du client et de ses articles dans la base de données.

2. **Espace Administrateur (Gestion CRUD)** :
   - **Création & Modification** de produits et catégories.
   - **Désactivation / Soft Delete** de produits.
   - **Consultation des commandes** passées par les clients.
