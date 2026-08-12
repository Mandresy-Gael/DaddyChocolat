import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Send, MapPin, User, Mail, Phone } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: 'Antananarivo, Madagascar'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nom || !formData.prenom || !formData.email) {
      setErrorMsg('Veuillez remplir les champs obligatoires (Nom, Prénom, Email).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          articles: cartItems,
          total: totalAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderComplete(true);
        setTimeout(() => {
          onOrderSuccess();
          setOrderComplete(false);
        }, 3000);
      } else {
        setErrorMsg(data.message || 'Une erreur est survenue lors de la commande.');
      }
    } catch (err) {
      setErrorMsg('Erreur de connexion au serveur backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-[#C89B3C]/40 animate-scale-up my-8">
        
        {/* EN-TÊTE MODAL LISIBLE */}
        <div className="p-6 bg-[#1C0C07] text-[#F8F4EC] flex justify-between items-center border-b-2 border-[#C89B3C]/40">
          <div>
            <span className="text-xs text-[#E6C275] uppercase tracking-widest font-black block mb-0.5">Finalisation</span>
            <h3 className="font-serif-luxury font-bold text-xl text-white">Valider ma commande</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* SUCCÈS COMMANDE */}
        {orderComplete ? (
          <div className="p-10 text-center space-y-4">
            <CheckCircle size={64} className="text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif-luxury font-bold text-2xl text-[#2B1710]">Commande Confirmée !</h4>
            <p className="text-sm text-[#6E5A4B] leading-relaxed">
              Merci <span className="font-bold text-[#2B1710]">{formData.prenom}</span>, votre commande DaddyChocolat a été enregistrée avec succès. Vous allez recevoir un email de confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-red-100 text-red-800 text-xs font-extrabold rounded-xl border-2 border-red-300">
                {errorMsg}
              </div>
            )}

            {/* INFORMATIONS LIVRAISON */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Nom *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Rakoto" 
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C] text-[#2B1710]"
                    />
                    <User size={16} className="absolute left-3 top-3 text-[#8C7B6B]" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Prénom *</label>
                  <input 
                    type="text" 
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Jean" 
                    className="w-full px-3 py-2.5 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C] text-[#2B1710]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Adresse Email *</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.rakoto@gmail.com" 
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C] text-[#2B1710]"
                  />
                  <Mail size={16} className="absolute left-3 top-3 text-[#8C7B6B]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Téléphone</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="034 00 000 00" 
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C] text-[#2B1710]"
                    />
                    <Phone size={16} className="absolute left-3 top-3 text-[#8C7B6B]" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Ville / Adresse</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Antananarivo" 
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C] text-[#2B1710]"
                    />
                    <MapPin size={16} className="absolute left-3 top-3 text-[#8C7B6B]" />
                  </div>
                </div>
              </div>
            </div>

            {/* RÉCAPITULATIF FINANCIER */}
            <div className="p-4 bg-[#FAF6EE] rounded-2xl border-2 border-[#C89B3C]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 my-4">
              <div>
                <span className="text-xs text-[#8C7B6B] block font-bold">Total commande ({cartItems.length} article(s))</span>
                <span className="font-serif-luxury font-black text-2xl text-[#2B1710]">
                  {new Intl.NumberFormat('fr-MG').format(totalAmount)} Ar
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-[#1C0C07] font-extrabold gold-btn-gradient px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                <CreditCard size={16} />
                <span>Paiement livraison</span>
              </div>
            </div>

            {/* BOUTON SOUMISSION DÉCORÉ */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 gold-btn-gradient text-[#1C0C07] font-extrabold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all border-2 border-white/50 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Send size={20} />
              <span>{isSubmitting ? 'Traitement en cours...' : 'Confirmer la Commande'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

