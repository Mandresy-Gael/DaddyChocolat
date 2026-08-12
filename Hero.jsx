import React from 'react';
import { Award, Sparkles, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero({ onExplore }) {
  return (
    <section className="relative overflow-hidden cacao-gradient text-[#F8F4EC] py-12 sm:py-16 md:py-24 border-b border-[#C89B3C]/40 shadow-2xl">
      {/* Motifs décoratifs d'arrière-plan avec lueurs d'or */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#C89B3C]/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#E6C275]/10 blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          
          {/* TEXTE D'ACCUEIL - CONTRASTE MAXIMAL ET HAUTE LISIBILITÉ */}
          <div className="text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#2B1710] border-2 border-[#C89B3C] text-[#F3E5AB] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md">
              <Sparkles size={16} className="text-[#E6C275]" />
              <span>Chocolaterie Artisanale de Madagascar</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              L'Or Noir de la <span className="text-[#E6C275] italic underline decoration-[#C89B3C]/60 decoration-wavy">Vallée du Sambirano</span>
            </h1>

            <p className="text-base sm:text-lg text-[#FFF8EE] font-normal leading-relaxed drop-shadow-sm max-w-xl">
              Découvrez nos tablettes et créations de chocolat pure origine, 100% pur beurre de cacao récolté à Ambanja. Un équilibre d'exception entre fruité acidulé et puissance aromatique.
            </p>

            {/* BOUTONS DÉCORÉS & ULTRA LISIBLES */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={onExplore}
                className="px-8 py-4 gold-btn-gradient text-[#1C0C07] font-extrabold text-base rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 transition-all border-2 border-[#FFE599] flex items-center space-x-3 cursor-pointer group"
              >
                <span>Explorer le Catalogue</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* AVANTAGES ET SECTEURS GARANTIS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#C89B3C]/30 text-xs sm:text-sm">
              <div className="flex items-center space-x-2.5 bg-[#2B1710]/80 p-2.5 rounded-xl border border-[#C89B3C]/30 shadow-sm">
                <Award className="text-[#E6C275] flex-shrink-0" size={22} />
                <span className="font-bold text-white">100% Sambirano</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-[#2B1710]/80 p-2.5 rounded-xl border border-[#C89B3C]/30 shadow-sm">
                <Sparkles className="text-[#E6C275] flex-shrink-0" size={22} />
                <span className="font-bold text-white">Artisanal Madagascar</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-[#2B1710]/80 p-2.5 rounded-xl border border-[#C89B3C]/30 shadow-sm">
                <Truck className="text-[#E6C275] flex-shrink-0" size={22} />
                <span className="font-bold text-white">Livraison Express</span>
              </div>
            </div>
          </div>

          {/* VISUEL PRINCIPAL HERO - PHOTO CENTRÉE ET MISE EN VALEUR */}
          <div className="relative flex justify-center items-center">
            {/* Aureole lumineuse dore d'arrière-plan */}
            <div className="absolute inset-0 bg-[#C89B3C]/20 rounded-full blur-2xl transform scale-95"></div>

            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-4 border-[#C89B3C] shadow-2xl bg-[#FAF6EE] p-8 flex items-center justify-center group">
              
              {/* IMAGE DU PRODUIT HÉROS CENTRÉE SANS EFFET DE ROGNAGE */}
              <img 
                src="/images/noir_sambirano_85.png" 
                alt="Tablette DaddyChocolat Sambirano 85%" 
                className="max-h-full max-w-full object-contain mx-auto my-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* BADGE DE QUALITÉ FIXE EN HAUT */}
              <div className="absolute top-4 right-4 gold-badge px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-white/40 shadow-lg">
                85% Cacao
              </div>

              {/* PANNEAU INFÉRIEUR LISIBLE */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-panel-dark border-2 border-[#C89B3C]/60 text-white shadow-xl backdrop-blur-md">
                <div className="text-[11px] uppercase font-black tracking-widest text-[#E6C275] mb-0.5">
                  Grand Cru d'Exception
                </div>
                <div className="font-serif-luxury font-bold text-lg sm:text-xl text-white">
                  Sambirano Noir 85%
                </div>
                <div className="text-base font-extrabold text-[#F3E5AB]">
                  18 000 Ariary
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

