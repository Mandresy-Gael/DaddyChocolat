-- ============================================================
-- DaddyChocolat - Base de données
-- Chocolaterie premium malgache (cacao de la vallée du Sambirano)
-- ESSGAM L2 GL - Examen Adm et SQL Server - Projet E-commerce
-- Auteur : RANDRIAMANANA Mandresy Gaël (I20C)
-- ============================================================
-- Ce script recrée la base à partir de zéro.
-- Import : mysql -u root -p < daddychocolat.sql

DROP DATABASE IF EXISTS daddychocolat;
CREATE DATABASE daddychocolat CHARACTER SET utf8mb4;
USE daddychocolat;

-- ------------------------------------------------------------
-- TABLE : categories
-- Les familles de produits de la boutique
-- ------------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(80) NOT NULL,
    description VARCHAR(255)
);

-- ------------------------------------------------------------
-- TABLE : produits
-- Chaque chocolat vendu, rattaché à une catégorie
-- ------------------------------------------------------------
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    stock INT NOT NULL DEFAULT 0,
    pourcentage_cacao INT,
    actif TINYINT(1) NOT NULL DEFAULT 1,
    categorie_id INT NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

-- ------------------------------------------------------------
-- TABLE : clients
-- Coordonnées saisies au moment de la commande (pas de compte,
-- pas de mot de passe : simplification volontaire pour ce projet)
-- ------------------------------------------------------------
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    ville VARCHAR(80) NOT NULL
);

-- ------------------------------------------------------------
-- TABLE : commandes
-- Une commande passée sur le site
-- ------------------------------------------------------------
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    date_commande DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'validee', 'expediee', 'livree', 'annulee') NOT NULL DEFAULT 'en_attente',
    mode_paiement ENUM('orange_money', 'a_la_livraison') NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ------------------------------------------------------------
-- TABLE : commande_lignes
-- Le détail d'une commande : quels produits, quelle quantité
-- On garde le prix_unitaire ici car le prix d'un produit peut
-- changer plus tard : la facture ne doit pas bouger avec lui
-- ------------------------------------------------------------
CREATE TABLE commande_lignes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- ============================================================
-- TRIGGER
-- Quand une ligne de commande est enregistrée, le stock du
-- produit correspondant diminue automatiquement.
-- Ça évite d'oublier de mettre à jour le stock à la main
-- dans le code du serveur à chaque nouvelle commande.
-- ============================================================
DELIMITER //
CREATE TRIGGER apres_ajout_ligne_commande
AFTER INSERT ON commande_lignes
FOR EACH ROW
BEGIN
    UPDATE produits
    SET stock = stock - NEW.quantite
    WHERE id = NEW.produit_id;
END //
DELIMITER ;

-- ============================================================
-- PROCEDURE STOCKEE
-- Recalcule le total d'une commande à partir de ses lignes.
-- Appelée par le serveur juste après avoir inséré les lignes
-- d'une nouvelle commande (voir backend/routes/commandes.routes.js)
-- ============================================================
DELIMITER //
CREATE PROCEDURE calculer_total_commande(IN p_commande_id INT)
BEGIN
    UPDATE commandes
    SET total = (
        SELECT COALESCE(SUM(quantite * prix_unitaire), 0)
        FROM commande_lignes
        WHERE commande_id = p_commande_id
    )
    WHERE id = p_commande_id;
END //
DELIMITER ;

-- ============================================================
-- VUES
-- ============================================================

-- Produits avec le nom de leur catégorie directement lisible
-- (évite de refaire la jointure dans chaque requête du backend)
CREATE VIEW vue_catalogue AS
SELECT
    p.id,
    p.nom,
    p.description,
    p.prix,
    p.image_url,
    p.stock,
    p.pourcentage_cacao,
    p.actif,
    c.id AS categorie_id,
    c.nom AS categorie_nom
FROM produits p
JOIN categories c ON c.id = p.categorie_id;

-- Commandes avec les coordonnées du client, pour l'espace admin
CREATE VIEW vue_commandes_admin AS
SELECT
    co.id AS commande_id,
    co.date_commande,
    co.statut,
    co.mode_paiement,
    co.total,
    cl.nom AS client_nom,
    cl.prenom AS client_prenom,
    cl.telephone AS client_telephone,
    cl.email AS client_email,
    cl.adresse AS client_adresse,
    cl.ville AS client_ville
FROM commandes co
JOIN clients cl ON cl.id = co.client_id;

-- Classement des produits les plus vendus (quantité et chiffre
-- d'affaires cumulés). Sert pour le tableau de bord admin.
CREATE VIEW vue_top_produits AS
SELECT
    p.id AS produit_id,
    p.nom,
    SUM(cl.quantite) AS quantite_vendue,
    SUM(cl.quantite * cl.prix_unitaire) AS chiffre_affaires
FROM commande_lignes cl
JOIN produits p ON p.id = cl.produit_id
GROUP BY p.id, p.nom
ORDER BY quantite_vendue DESC;

-- ============================================================
-- DONNEES DE DEPART
-- ============================================================

INSERT INTO categories (nom, description) VALUES
('Tablettes noires', 'Chocolat noir pur, du 60% au 85% de cacao'),
('Tablettes au lait', 'Plus doux, plus crémeux'),
('Pralinés et bonbons', 'Assortiments à croquer, en boîte ou au détail'),
('Coffrets cadeaux', 'Sélections composées pour offrir'),
('Chocolat blanc', 'Beurre de cacao, vanille, sans poudre de cacao');

INSERT INTO produits (nom, description, prix, image_url, stock, pourcentage_cacao, categorie_id) VALUES
('Sambirano 70%', 'Fèves de la vallée du Sambirano, notes fruitées et légèrement acidulées, typiques du cacao malgache.', 18000, '/images/sambirano-70.svg', 40, 70, 1),
('Noir Intense 85%', 'Pour les amateurs de chocolat corsé, torréfaction longue, très peu de sucre.', 19500, '/images/noir-intense-85.svg', 25, 85, 1),
('Noir Vanille de Madagascar 65%', 'Chocolat noir infusé à la vanille bourbon, cultivée dans le nord de l''île.', 20000, '/images/noir-vanille-65.svg', 30, 65, 1),
('Lait Caramel Fleur de Sel', 'Chocolat au lait, éclats de caramel et fleur de sel, texture fondante.', 17500, '/images/lait-caramel.svg', 35, 45, 2),
('Lait Noisette Entière', 'Chocolat au lait avec noisettes entières torréfiées.', 17000, '/images/lait-noisette.svg', 38, 42, 2),
('Lait Classique Sambirano', 'La base la plus douce de la gamme, pour découvrir le cacao malgache sans amertume.', 15500, '/images/lait-classique.svg', 50, 40, 2),
('Boîte de Pralinés Assortis (12 pièces)', 'Douze pralinés faits main : praliné amande, ganache passion, caramel beurre salé et plus.', 42000, '/images/pralines-12.svg', 15, NULL, 3),
('Bonbons Ganache Passion (sachet de 8)', 'Cœur fondant au fruit de la passion, enrobage noir 65%.', 21000, '/images/ganache-passion.svg', 22, 65, 3),
('Orangettes Chocolat Noir', 'Écorces d''orange confites enrobées de chocolat noir 70%.', 16000, '/images/orangettes.svg', 20, 70, 3),
('Coffret Découverte Sambirano', 'Quatre tablettes de la gamme noire, pour découvrir les différents pourcentages de cacao.', 65000, '/images/coffret-decouverte.svg', 12, NULL, 4),
('Coffret Prestige (8 pièces + 1 tablette)', 'Notre coffret le plus complet : pralinés, bonbons et une tablette Sambirano 70%, en boîte rigide.', 78000, '/images/coffret-prestige.svg', 8, NULL, 4),
('Blanc Vanille et Éclats de Noix de Coco', 'Chocolat blanc, vanille bourbon et copeaux de noix de coco grillés.', 17800, '/images/blanc-coco.svg', 18, NULL, 5),
('Blanc Fruits Rouges Lyophilisés', 'Chocolat blanc parsemé de fraises et framboises lyophilisées.', 18500, '/images/blanc-fruits-rouges.svg', 16, NULL, 5);
