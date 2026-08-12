import React from 'react';
import { MapPin, Phone, Mail, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C0C07] text-[#FAF6EE] border-t-2 border-[#C89B3C]/40 pt-12 pb-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/15">
          
          {/* COLONNE 1 : MARQUE */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-full gold-btn-gradient text-[#1C0C07] flex items-center justify-center font-black text-base border border-white/50 shadow-md">
                DC
              </div>
              <span className="font-serif-luxury text-2xl font-bold text-white tracking-wide">DaddyChocolat</span>
            </div>
            <p className="text-xs text-[#FAF6EE]/90 leading-relaxed mb-4 font-normal">
              Chocolaterie artisanale d'exception. Cacao 100% pur beurre de cacao originaire de la fertile vallée du Sambirano, Madagascar.
            </p>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#E6C275] bg-[#2B1710] px-3.5 py-2 rounded-xl border border-[#C89B3C]/50 shadow-sm">
              <Award size={16} className="text-[#E6C275]" />
              <span>Label Qualité Sambirano Premium</span>
            </div>
          </div>

          {/* COLONNE 2 : CONTACT */}
          <div>
            <h4 className="font-serif-luxury font-bold text-lg text-[#E6C275] mb-4">Nos Coordonnées</h4>
            <ul className="space-y-3 text-xs text-[#FAF6EE]/90 font-medium">
              <li className="flex items-center space-x-2.5">
                <MapPin size={18} className="text-[#E6C275] flex-shrink-0" />
                <span>Ambanja / Antananarivo, Madagascar</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={18} className="text-[#E6C275] flex-shrink-0" />
                <span>+261 34 12 345 67</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={18} className="text-[#E6C275] flex-shrink-0" />
                <span>contact@daddychocolat.mg</span>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 : CADRE UNIVERSITAIRE */}
          <div>
            <h4 className="font-serif-luxury font-bold text-lg text-[#E6C275] mb-4">Projet d'Examen L2 GL</h4>
            <p className="text-xs text-[#FAF6EE]/90 leading-relaxed mb-2">
              Évaluation ESSGAM L2 GL - Sujet N°1 : Gestion des Commandes et Produits (E-commerce).
            </p>
            <p className="text-[11px] text-[#C89B3C] font-semibold">
              Stack : ReactJS (Vite), Node.js (Express), MySQL, Tailwind CSS.
            </p>
          </div>

        </div>

        {/* COPYRIGHT & MENTION */}
        <div className="pt-6 text-center text-xs text-[#FAF6EE]/70 flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <span>&copy; 2026 DaddyChocolat Madagascar. Tous droits réservés.</span>
          <span>Développé pour l'examen ESSGAM</span>
        </div>
      </div>
    </footer>
  );
}

