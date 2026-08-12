import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  if (!isOpen) return null;

  // Calcul du prix total du panier en Ariary
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  const formattedTotal = new Intl.NumberFormat('fr-MG').format(totalAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-sm flex justify-end">
      
      {/* PANNEAU LATÉRAL DU PANIER RESPONSIVE */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300">
        
        {/* EN-TÊTE DU PANIER */}
        <div className="p-6 bg-[#1C0C07] text-[#F8F4EC] flex items-center justify-between border-b-2 border-[#C89B3C]/40 shadow-md">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="text-[#E6C275]" size={24} />
            <h2 className="font-serif-luxury font-bold text-xl text-white">Mon Panier Gourmand</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={22} />
          </button>
        </div>

        {/* LISTE DES ARTICLES */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 divide-y divide-[#F8F4EC]">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag size={64} className="text-[#C89B3C]/30 mb-4" />
              <p className="font-serif-luxury font-bold text-xl text-[#2B1710] mb-2">Votre panier est vide</p>
              <p className="text-sm text-[#8C7B6B] mb-6 max-w-xs">Laissez-vous tenter par nos créations pur beurre de cacao.</p>
              <button 
                onClick={onClose}
                className="px-6 py-3 gold-btn-gradient text-[#1C0C07] font-extrabold text-sm rounded-full hover:scale-105 shadow-md transition-all cursor-pointer border border-white/40"
              >
                Découvrir la boutique
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between space-x-4">
                
                {/* IMAGE DU PRODUIT - CENTRÉE */}
                <div className="w-16 h-16 bg-[#FAF6EE] rounded-xl p-1 overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-[#C89B3C]/25 shadow-sm">
                  <img 
                    src={item.image_url || '/images/noir_sambirano_85.png'} 
                    alt={item.nom} 
                    className="max-h-full max-w-full object-contain mx-auto my-auto"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/noir_sambirano_85.png'; }}
                  />
                </div>

                {/* INFOS & PRIX */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#2B1710] truncate">{item.nom}</h4>
                  <div className="text-xs text-[#C89B3C] font-extrabold">
                    {new Intl.NumberFormat('fr-MG').format(item.prix)} Ar / un.
                  </div>

                  {/* AJUSTEUR DE QUANTITÉ */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantite - 1)}
                      className="p-1.5 bg-[#FAF6EE] border border-[#C89B3C]/30 hover:bg-[#2B1710] hover:text-white text-[#2B1710] rounded-lg transition-colors cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black w-6 text-center text-[#2B1710]">{item.quantite}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantite + 1)}
                      className="p-1.5 bg-[#FAF6EE] border border-[#C89B3C]/30 hover:bg-[#2B1710] hover:text-white text-[#2B1710] rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* SOUS-TOTAL ET SUPPRESSION */}
                <div className="text-right flex-shrink-0">
                  <div className="font-serif-luxury font-black text-sm text-[#2B1710]">
                    {new Intl.NumberFormat('fr-MG').format(item.prix * item.quantite)} Ar
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors mt-2 inline-flex items-center space-x-1 cursor-pointer font-semibold"
                    title="Retirer l'article"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* PIED DU PANIER & COMMANDE - BOUTON DÉCORÉ ET TARS CLAIR */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#FAF6EE] border-t-2 border-[#C89B3C]/30 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-[#6E5A4B]">
              <span>Sous-total commande</span>
              <span className="font-serif-luxury font-black text-2xl text-[#2B1710]">{formattedTotal} Ar</span>
            </div>

            <p className="text-[11px] text-[#8C7B6B] italic">Taxes et frais de livraison inclus.</p>

            <button 
              onClick={onProceedToCheckout}
              className="w-full py-4 gold-btn-gradient text-[#1C0C07] font-extrabold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all border-2 border-white/50 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <span className="tracking-wide">Passer la commande</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

