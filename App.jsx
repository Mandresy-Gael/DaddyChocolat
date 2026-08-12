import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('boutique'); // 'boutique' ou 'admin'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Données de secours locales pour démo immédiate si le backend ne répond pas
  const localProducts = [
    { id: 1, nom: 'Tablette Sambirano Noir 85%', description: 'Chocolat noir intense origine Sambirano aux notes de fruits rouges.', prix: 18000, pourcentage_cacao: 85, image_url: '/images/noir_sambirano_85.png', stock: 45, categorie_id: 1 },
    { id: 2, nom: 'Tablette Lait Vanille Madagascar', description: 'Chocolat au lait onctueux parfumé à la vraie gousse de vanille Bourbon.', prix: 16000, pourcentage_cacao: 45, image_url: '/images/lait_vanille_madagascar.png', stock: 30, categorie_id: 1 },
    { id: 3, nom: 'Truffes au Cacao Brut', description: 'Truffes fondantes au cœur ganache pure origine, saupoudrées de cacao amer.', prix: 25000, pourcentage_cacao: 75, image_url: '/images/truffes_cacao_brut.png', stock: 20, categorie_id: 3 },
    { id: 4, nom: 'Coffret Dégustation Prestige', description: 'Assortiment d\'exception de 16 pralines et chocolats artisanaux.', prix: 45000, pourcentage_cacao: 70, image_url: '/images/coffret_degustation.png', stock: 15, categorie_id: 3 }
  ];

  const localCategories = [
    { id: 1, nom: 'Tablettes Noir d\'Exception', description: 'Grands crus de cacao' },
    { id: 2, nom: 'Gourmandises & Pralinés', description: 'Créations croustillantes' },
    { id: 3, nom: 'Truffes & Coffrets', description: 'Sélection cadeaux' }
  ];

  // Chargement des données au démarrage
  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/produits').catch(() => null),
        fetch('/api/categories').catch(() => null)
      ]);

      if (resProd && resProd.ok) {
        const prodData = await resProd.json();
        setProducts(prodData);
      } else {
        setProducts(localProducts);
      }

      if (resCat && resCat.ok) {
        const catData = await resCat.json();
        setCategories(catData);
      } else {
        setCategories(localCategories);
      }
    } catch (e) {
      setProducts(localProducts);
      setCategories(localCategories);
    }
  };

  // Ajout au panier
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantite: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  // Mise à jour quantité dans le panier
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prev => prev.map(item =>
        item.id === productId ? { ...item, quantite: newQuantity } : item
      ));
    }
  };

  // Retrait du panier
  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Nombre total d'articles dans le panier
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F6EFE3]">
      <div>
        {/* BARRE DE NAVIGATION */}
        <Navbar 
          cartCount={totalCartCount} 
          onOpenCart={() => setIsCartOpen(true)} 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* AFFICHAGE CONDITIONNEL CLIENT OU ADMIN */}
        {currentView === 'boutique' ? (
          <main>
            <Hero onExplore={() => {
              const elem = document.getElementById('boutique-section');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }} />
            
            <ProductList 
              products={products} 
              categories={categories} 
              onAddToCart={handleAddToCart} 
            />
          </main>
        ) : (
          <main>
            <AdminDashboard 
              products={products} 
              categories={categories} 
              onRefreshData={fetchProductsAndCategories} 
            />
          </main>
        )}
      </div>

      {/* MODAL DU PANIER */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* MODAL DE FINALISATION DE COMMANDE */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={() => {
          setCartItems([]);
          setIsCheckoutOpen(false);
          fetchProductsAndCategories();
        }}
      />

      {/* PIED DE PAGE */}
      <Footer />
    </div>
  );
}
