import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Store, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1C0C07]/95 backdrop-blur-md text-[#F8F4EC] border-b-2 border-[#C89B3C]/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO DADDYCHOCOLAT */}
        <div 
          onClick={() => { setCurrentView('boutique'); setMobileMenuOpen(false); }} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full gold-btn-gradient text-[#1C0C07] flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-105 transition-transform border-2 border-white/50">
            DC
          </div>
          <div>
            <span className="font-serif-luxury text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-[#E6C275] transition-colors block">
              DaddyChocolat
            </span>
            <span className="block text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#E6C275]">
              Vallée du Sambirano • Madagascar
            </span>
          </div>
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center space-x-6 font-bold text-sm">
          <button 
            onClick={() => setCurrentView('boutique')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              currentView === 'boutique' 
                ? 'bg-[#C89B3C]/20 text-[#E6C275] border-2 border-[#C89B3C] shadow-inner font-extrabold' 
                : 'text-[#F8F4EC]/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Store size={18} />
            <span>La Boutique</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('admin')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all border-2 ${
              currentView === 'admin' 
                ? 'gold-btn-gradient text-[#1C0C07] border-[#FFE599] font-extrabold shadow-lg scale-105' 
                : 'border-[#C89B3C] text-[#E6C275] hover:bg-[#C89B3C]/20'
            }`}
          >
            <ShieldCheck size={18} />
            <span>Gestion Admin (L2)</span>
          </button>
        </nav>

        {/* BOUTONS ACTIONS : PANIER + MENU MOBILE */}
        <div className="flex items-center space-x-3">
          {/* BOUTON PANIER DÉCORÉ & LISIBLE */}
          <button 
            onClick={onOpenCart}
            className="relative flex items-center space-x-2.5 px-4 py-2 bg-[#3D2015] hover:bg-[#C89B3C] text-white hover:text-[#1C0C07] rounded-full transition-all shadow-lg border-2 border-[#C89B3C] group cursor-pointer"
            title="Voir mon panier"
          >
            <ShoppingBag size={20} className="text-[#E6C275] group-hover:text-[#1C0C07] transition-colors" />
            <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline">Panier</span>
            {cartCount > 0 && (
              <span className="bg-[#A82835] text-white text-xs font-black px-2 py-0.5 rounded-full border border-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* HAMBURGER TOGGLE MENU MOBILE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#2B1710] border border-[#C89B3C]/40 text-[#E6C275] hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* MENU DEROULANT MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2B1710] border-t border-[#C89B3C]/30 px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <button 
            onClick={() => { setCurrentView('boutique'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              currentView === 'boutique' ? 'bg-[#C89B3C] text-[#1C0C07]' : 'text-white hover:bg-white/10'
            }`}
          >
            <Store size={20} />
            <span>La Boutique Chocolat</span>
          </button>

          <button 
            onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm border ${
              currentView === 'admin' ? 'bg-[#C89B3C] text-[#1C0C07] border-[#C89B3C]' : 'border-[#C89B3C]/50 text-[#E6C275]'
            }`}
          >
            <ShieldCheck size={20} />
            <span>Panneau de Gestion Admin (L2)</span>
          </button>
        </div>
      )}
    </header>
  );
}

