import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter, Layers, Sparkles } from 'lucide-react';

export default function ProductList({ products, categories, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage des produits par recherche textuelle et par catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.categorie_id == selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="boutique-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* EN-TÊTE DE LA BOUTIQUE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#C89B3C]/25 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-black text-[#C89B3C] block mb-1">Notre Collection d'Exception</span>
          <h2 className="font-serif-luxury font-bold text-2xl sm:text-4xl text-[#2B1710]">
            Chocolats & Douceurs Sambirano
          </h2>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Rechercher un chocolat..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-2 border-[#C89B3C]/30 focus:outline-none focus:border-[#C89B3C] text-sm text-[#2B1710] font-medium shadow-sm transition-all focus:ring-2 focus:ring-[#C89B3C]/20"
          />
          <Search size={20} className="absolute left-3.5 top-3.5 text-[#8C7B6B]" />
        </div>
      </div>

      {/* FILTRES PAR CATÉGORIE - BOUTONS DÉCORÉS & LISIBLES */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 pt-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center space-x-2 flex-shrink-0 cursor-pointer border-2 ${
            selectedCategory === 'all' 
              ? 'dark-btn-gradient text-white border-[#C89B3C] shadow-lg scale-105' 
              : 'bg-white text-[#2B1710] border-[#C89B3C]/30 hover:border-[#C89B3C] hover:bg-[#FAF6EE] shadow-sm'
          }`}
        >
          <Layers size={16} className={selectedCategory === 'all' ? 'text-[#E6C275]' : 'text-[#8C7B6B]'} />
          <span>Tous les produits ({products.length})</span>
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 flex-shrink-0 cursor-pointer border-2 ${
              selectedCategory == cat.id 
                ? 'dark-btn-gradient text-white border-[#C89B3C] shadow-lg scale-105' 
                : 'bg-white text-[#2B1710] border-[#C89B3C]/30 hover:border-[#C89B3C] hover:bg-[#FAF6EE] shadow-sm'
            }`}
          >
            <span>{cat.nom}</span>
          </button>
        ))}
      </div>

      {/* GRILLE DE PRODUITS RESPONSIVE */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-[#C89B3C]/30 shadow-md max-w-md mx-auto my-12 space-y-4">
          <Filter size={52} className="mx-auto text-[#C89B3C] opacity-60" />
          <h3 className="font-serif-luxury font-bold text-xl text-[#2B1710]">Aucun chocolat trouvé</h3>
          <p className="text-sm text-[#8C7B6B]">Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
          <button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-6 py-3 gold-btn-gradient text-[#1C0C07] font-extrabold text-sm rounded-full hover:scale-105 shadow-md transition-all border border-white/50 cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

    </section>
  );
}

