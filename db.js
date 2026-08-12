// ====================================================================
// Fichier : db.js (Projet DaddyChocolat - Niveau L2 Informatique)
// Description : Connexion à la base de données MySQL et initialisation
// ====================================================================

const mysql = require('mysql2');

// Configuration de la connexion MySQL (adaptée de projet_crud/backend/db.js)
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'daddychocolat_db',
    multipleStatements: true,
    charset: 'utf8mb4'
});

// Connexion au serveur MySQL
connection.connect((err) => {
    if (err) {
        console.error(' ATTENTION : Impossible de se connecter à la base MySQL localement.');
        console.error('Détail de l\'erreur :', err.message);
        console.log(' Astuce : Assurez-vous que Wamp, XAMPP ou MariaDB est bien démarré.');
        return;
    }

    console.log('Connecté à la base de données MySQL avec succès !');

    // 1. Création de la table des catégories
    const createCategories = `
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100) NOT NULL,
            description TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // 2. Création de la table des produits
    const createProduits = `
        CREATE TABLE IF NOT EXISTS produits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(150) NOT NULL,
            description TEXT,
            prix DECIMAL(10,2) NOT NULL,
            pourcentage_cacao INT DEFAULT 70,
            image_url VARCHAR(255),
            stock INT DEFAULT 50,
            categorie_id INT,
            actif TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // 3. Création de la table des clients
    const createClients = `
        CREATE TABLE IF NOT EXISTS clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            telephone VARCHAR(30),
            adresse TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // 4. Création de la table des commandes
    const createCommandes = `
        CREATE TABLE IF NOT EXISTS commandes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_id INT NOT NULL,
            total DECIMAL(10,2) NOT NULL,
            statut VARCHAR(50) DEFAULT 'En attente',
            date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // 5. Création de la table des lignes de commande
    const createLignesCommande = `
        CREATE TABLE IF NOT EXISTS lignes_commande (
            id INT AUTO_INCREMENT PRIMARY KEY,
            commande_id INT NOT NULL,
            produit_id INT NOT NULL,
            quantite INT NOT NULL,
            prix_unitaire DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
            FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    // Exécution séquentielle des créations de tables
    connection.query(createCategories, (err) => {
        if (err) console.error('Erreur création table categories :', err);
        else {
            connection.query(createProduits, (err) => {
                if (err) console.error('Erreur création table produits :', err);
                else {
                    connection.query(createClients, (err) => {
                        if (err) console.error('Erreur création table clients :', err);
                        else {
                            connection.query(createCommandes, (err) => {
                                if (err) console.error('Erreur création table commandes :', err);
                                else {
                                    connection.query(createLignesCommande, (err) => {
                                        if (err) console.error('Erreur création table lignes_commande :', err);
                                        else {
                                            console.log(' Toutes les tables MySQL ont été vérifiées/créées avec succès !');
                                            seedInitialData();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Fonction pour alimenter la base de données avec des données initiales si elle est vide
function seedInitialData() {
    connection.query('SELECT COUNT(*) AS count FROM categories', (err, result) => {
        if (err || result[0].count > 0) return;

        console.log(' Insertion des données de démonstration DaddyChocolat...');

        const insertCat = `
            INSERT INTO categories (id, nom, description) VALUES
            (1, 'Tablettes Noir d\\'Exception', 'Les grands crus de cacao noir de Madagascar'),
            (2, 'Gourmandises & Pralinés', 'Créations croustillantes et fondantes'),
            (3, 'Truffes & Coffrets', 'Sélection de truffes artisanales et coffrets cadeaux');
        `;

        connection.query(insertCat, (err) => {
            if (err) return console.error('Erreur seed categories:', err);

            const insertProd = `
                INSERT INTO produits (nom, description, prix, pourcentage_cacao, image_url, stock, categorie_id) VALUES
                ('Tablette Sambirano Noir 85%', 'Chocolat noir intense origine Sambirano aux notes d fruits rouges et d\\'épices.', 18000, 85, '/images/noir_sambirano_85.png', 45, 1),
                ('Tablette Lait Vanille Madagascar', 'Chocolat au lait onctueux parfumé à la vraie gousse de vanille Bourbon.', 16000, 45, '/images/lait_vanille_madagascar.png', 30, 1),
                ('Truffes au Cacao Brut', 'Truffes fondantes au cœur ganache pure origine, saupoudrées de cacao amer.', 25000, 75, '/images/truffes_cacao_brut.png', 20, 3),
                ('Coffret Dégustation Prestige', 'Assortiment d\\'exception de 16 pralines et chocolats artisanaux.', 45000, 70, '/images/coffret_degustation.png', 15, 3),
                ('Tablette Fleur de Sel & Cacao', 'Notes croquantes de fleur de sel de Diego-Suarez combinées au chocolat noir 72%.', 19000, 72, '/images/noir_sambirano_85.png', 40, 1),
                ('Praliné Noisette Cacao Sambirano', 'Bouchées pralinées au cœur de noisette torréfiée et enrobage noir 68%.', 22000, 68, '/images/truffes_cacao_brut.png', 25, 2);
            `;

            connection.query(insertProd, (err) => {
                if (err) console.error('Erreur seed produits:', err);
                else console.log(' Données de démonstration chargées avec succès !');
            });
        });
    });
}

module.exports = connection;
