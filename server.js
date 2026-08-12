// ====================================================================
// Fichier : server.js (Projet DaddyChocolat - Niveau L2 Informatique)
// Description : API REST Express pour gérer les Produits, Catégories & Commandes
// ====================================================================

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); 
app.use(cors());         

// Base de secours en mémoire si MySQL n'est pas actif localement
let fallbackProduits = [
    { id: 1, nom: 'Tablette Sambirano Noir 85%', description: 'Chocolat noir intense origine Sambirano aux notes de fruits rouges.', prix: 18000, pourcentage_cacao: 85, image_url: '/images/noir_sambirano_85.png', stock: 45, categorie_id: 1, actif: 1 },
    { id: 2, nom: 'Tablette Lait Vanille Madagascar', description: 'Chocolat au lait onctueux parfumé à la vraie gousse de vanille Bourbon.', prix: 16000, pourcentage_cacao: 45, image_url: '/images/lait_vanille_madagascar.png', stock: 30, categorie_id: 1, actif: 1 },
    { id: 3, nom: 'Truffes au Cacao Brut', description: 'Truffes fondantes au cœur ganache pure origine, saupoudrées de cacao amer.', prix: 25000, pourcentage_cacao: 75, image_url: '/images/truffes_cacao_brut.png', stock: 20, categorie_id: 3, actif: 1 },
    { id: 4, nom: 'Coffret Dégustation Prestige', description: 'Assortiment d\'exception de 16 pralines et chocolats artisanaux.', prix: 45000, pourcentage_cacao: 70, image_url: '/images/coffret_degustation.png', stock: 15, categorie_id: 3, actif: 1 }
];

let fallbackCategories = [
    { id: 1, nom: 'Tablettes Noir d\'Exception', description: 'Grands crus de cacao noir' },
    { id: 2, nom: 'Gourmandises & Pralinés', description: 'Créations croustillantes et fondantes' },
    { id: 3, nom: 'Truffes & Coffrets', description: 'Sélection artisanale pour cadeaux' }
];

let fallbackCommandes = [];
let fallbackClients = [];

// ====================================================================
// 1. ROUTES PRODUITS (CRUD)
// ====================================================================

// READ ALL : Obtenir tous les produits
app.get('/api/produits', (req, res) => {
    const query = `
        SELECT p.*, c.nom AS categorie_nom 
        FROM produits p 
        LEFT JOIN categories c ON p.categorie_id = c.id 
        WHERE p.actif = 1 
        ORDER BY p.id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.log(' Récupération MySQL impossible, utilisation des données locales.');
            return res.json(fallbackProduits.filter(p => p.actif === 1));
        }
        res.json(results);
    });
});

// READ ONE : Obtenir un seul produit par son ID
app.get('/api/produits/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM produits WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err || !results || results.length === 0) {
            const prod = fallbackProduits.find(p => p.id == id);
            if (!prod) return res.status(404).json({ message: 'Produit non trouvé' });
            return res.json(prod);
        }
        res.json(results[0]);
    });
});

// CREATE : Ajouter un nouveau produit chocolat
app.post('/api/produits', (req, res) => {
    const { nom, description, prix, pourcentage_cacao, image_url, stock, categorie_id } = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ message: 'Le nom et le prix sont obligatoires !' });
    }

    const query = `
        INSERT INTO produits (nom, description, prix, pourcentage_cacao, image_url, stock, categorie_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nom, description || '', prix, pourcentage_cacao || 70, image_url || '/images/noir_sambirano_85.png', stock || 50, categorie_id || 1], (err, result) => {
        if (err) {
            const newProd = {
                id: fallbackProduits.length + 1,
                nom, description, prix: parseFloat(prix),
                pourcentage_cacao: parseInt(pourcentage_cacao) || 70,
                image_url: image_url || '/images/noir_sambirano_85.png',
                stock: parseInt(stock) || 50,
                categorie_id: parseInt(categorie_id) || 1,
                actif: 1
            };
            fallbackProduits.push(newProd);
            return res.status(201).json({ message: 'Produit créé avec succès !', id: newProd.id });
        }
        res.status(201).json({ message: 'Produit créé avec succès !', id: result.insertId });
    });
});

// UPDATE : Modifier un produit existant
app.put('/api/produits/:id', (req, res) => {
    const { id } = req.params;
    const { nom, description, prix, pourcentage_cacao, image_url, stock, categorie_id } = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ message: 'Le nom et le prix sont obligatoires !' });
    }

    const query = `
        UPDATE produits 
        SET nom = ?, description = ?, prix = ?, pourcentage_cacao = ?, image_url = ?, stock = ?, categorie_id = ?
        WHERE id = ?
    `;

    db.query(query, [nom, description, prix, pourcentage_cacao, image_url, stock, categorie_id, id], (err, result) => {
        if (err) {
            const idx = fallbackProduits.findIndex(p => p.id == id);
            if (idx !== -1) {
                fallbackProduits[idx] = { ...fallbackProduits[idx], nom, description, prix: parseFloat(prix), pourcentage_cacao: parseInt(pourcentage_cacao), stock: parseInt(stock) };
            }
            return res.json({ message: 'Produit mis à jour avec succès !', id });
        }
        res.json({ message: 'Produit mis à jour avec succès !', id });
    });
});

// DELETE : Désactiver (soft delete) un produit
app.delete('/api/produits/:id', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE produits SET actif = 0 WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            const idx = fallbackProduits.findIndex(p => p.id == id);
            if (idx !== -1) fallbackProduits[idx].actif = 0;
            return res.json({ message: 'Produit supprimé/désactivé avec succès !' });
        }
        res.json({ message: 'Produit supprimé/désactivé avec succès !' });
    });
});

// ====================================================================
// 2. ROUTES CATEGORIES
// ====================================================================

// READ ALL CATEGORIES
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM categories ORDER BY id ASC';
    db.query(query, (err, results) => {
        if (err) return res.json(fallbackCategories);
        res.json(results);
    });
});

// CREATE CATEGORIE
app.post('/api/categories', (req, res) => {
    const { nom, description } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom de la catégorie est obligatoire !' });

    const query = 'INSERT INTO categories (nom, description) VALUES (?, ?)';
    db.query(query, [nom, description || ''], (err, result) => {
        if (err) {
            const newCat = { id: fallbackCategories.length + 1, nom, description };
            fallbackCategories.push(newCat);
            return res.status(201).json({ message: 'Catégorie créée !', id: newCat.id });
        }
        res.status(201).json({ message: 'Catégorie créée !', id: result.insertId });
    });
});

// ====================================================================
// 3. ROUTES COMMANDES & CLIENTS
// ====================================================================

// CREATE COMMANDE
app.post('/api/commandes', (req, res) => {
    const { nom, prenom, email, telephone, adresse, articles, total } = req.body;

    if (!nom || !prenom || !email || !articles || articles.length === 0) {
        return res.status(400).json({ message: 'Informations de livraison et articles manquants !' });
    }

    // 1. Inscription du client
    const insertClient = 'INSERT INTO clients (nom, prenom, email, telephone, adresse) VALUES (?, ?, ?, ?, ?)';
    db.query(insertClient, [nom, prenom, email, telephone || '', adresse || ''], (err, clientRes) => {
        const clientId = err ? (fallbackClients.length + 1) : clientRes.insertId;
        if (err) fallbackClients.push({ id: clientId, nom, prenom, email, telephone, adresse });

        // 2. Création de la commande
        const insertCommande = 'INSERT INTO commandes (client_id, total, statut) VALUES (?, ?, ?)';
        db.query(insertCommande, [clientId, total, 'En attente'], (errCmd, cmdRes) => {
            const cmdId = errCmd ? (fallbackCommandes.length + 1) : cmdRes.insertId;

            // 3. Lignes de commande
            articles.forEach(art => {
                const insertLigne = 'INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)';
                db.query(insertLigne, [cmdId, art.id, art.quantite, art.prix]);
                // Décrémentation du stock
                db.query('UPDATE produits SET stock = stock - ? WHERE id = ?', [art.quantite, art.id]);
            });

            if (errCmd) {
                fallbackCommandes.push({ id: cmdId, client_nom: `${prenom} ${nom}`, total, date_commande: new Date(), statut: 'En attente', articles });
            }

            res.status(201).json({
                message: 'Commande enregistrée avec succès ! Merci pour votre confiance.',
                commande_id: cmdId
            });
        });
    });
});

// READ ALL COMMANDES (Pour l'espace Admin)
app.get('/api/commandes', (req, res) => {
    const query = `
        SELECT c.id, c.total, c.statut, c.date_commande, CONCAT(cl.prenom, ' ', cl.nom) AS client_nom, cl.email, cl.telephone
        FROM commandes c
        JOIN clients cl ON c.client_id = cl.id
        ORDER BY c.id DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.json(fallbackCommandes);
        res.json(results);
    });
});

// GET STATS (Pour le tableau de bord Admin)
app.get('/api/stats', (req, res) => {
    res.json({
        total_produits: fallbackProduits.length,
        total_commandes: fallbackCommandes.length,
        total_categories: fallbackCategories.length,
        chiffre_affaires: fallbackCommandes.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0)
    });
});

// Démarrage du serveur Express
app.listen(PORT, () => {
    console.log(` Serveur DaddyChocolat démarré sur : http://localhost:${PORT}`);
});
