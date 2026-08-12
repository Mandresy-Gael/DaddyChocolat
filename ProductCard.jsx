import React from 'react';
import { ShoppingCart, Award } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  // Format du prix en Ariary (Ar)
  const formattedPrice = new Intl.NumberFormat('fr-MG').format(product.prix);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#C89B3C]/25 shadow-md product-card-hover flex flex-col justify-between relative group">
      
      {/* BADGE % CACAO (Sceau d'Or signature) */}
      {product.pourcentage_cacao && (
        <div className="absolute top-3 right-3 z-10 gold-badge w-13 h-13 rounded-full flex flex-col items-center justify-center font-black text-xs shadow-lg border-2 border-white/60">
          <span>{product.pourcentage_cacao}%</span>
          <span className="text-[7px] uppercase tracking-widest font-bold">Cacao</span>
        </div>
      )}

      {/* IMAGE DU PRODUIT - PARFAITEMENT CENTRÉE ET NON ROGNÉE */}
      <div className="relative h-60 sm:h-64 bg-[#FAF6EE] p-5 flex items-center justify-center overflow-hidden border-b border-[#C89B3C]/15">
        <img 
          src={product.image_url || '/images/noir_sambirano_85.png'} 
          alt={product.nom}
          className="max-h-full max-w-full object-contain mx-auto my-auto drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/noir_sambirano_85.png';
          }}
        />
        <div className="absolute inset-0 bg-[#2B1710]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      {/* CONTENU DU PRODUIT */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#C89B3C] block mb-1">
            {product.categorie_nom || 'Chocolat d\'Exception'}
          </span>
          <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#2B1710] mb-2 line-clamp-1 group-hover:text-[#C89B3C] transition-colors">
            {product.nom}
          </h3>
          <p className="text-xs sm:text-sm text-[#6E5A4B] line-clamp-2 mb-4 leading-relaxed font-normal">
            {product.description || 'Chocolat artisanal de Madagascar.'}
          </p>
        </div>

        {/* PRIX ET BOUTON D'AJOUT AU PANIER DÉCORÉ & ULTRA LISIBLE */}
        <div className="pt-4 border-t border-[#F8F4EC] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8C7B6B] block">Prix unitaire</span>
            <span className="font-serif-luxury font-black text-base sm:text-lg text-[#2B1710]">
              {formattedPrice} <span className="text-xs font-bold text-[#C89B3C]">Ar</span>
            </span>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="px-4 py-2.5 dark-btn-gradient hover:gold-btn-gradient text-white hover:text-[#1C0C07] rounded-xl border-2 border-[#C89B3C] font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer group/btn"
            title="Ajouter au panier"
          >
            <ShoppingCart size={17} className="text-[#E6C275] group-hover/btn:text-[#1C0C07] transition-colors" />
            <span className="tracking-wide">Ajouter</span>
          </button>
        </div>
      </div>

    </div>
  );
}

