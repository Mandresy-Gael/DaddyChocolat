import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Layers, ShoppingCart, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard({ products, categories, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('produits');
  const [commandes, setCommandes] = useState([]);
  
  // État du formulaire de création / édition de produit
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    nom: '',
    description: '',
    prix: '',
    pourcentage_cacao: '75',
    image_url: '/images/noir_sambirano_85.png',
    stock: '50',
    categorie_id: '1'
  });

  // État formulaire catégorie
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ nom: '', description: '' });

  const [notification, setNotification] = useState('');

  // Charger la liste des commandes
  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const res = await fetch('/api/commandes');
      if (res.ok) {
        const data = await res.json();
        setCommandes(data);
      }
    } catch (e) {
      console.log('Erreur chargement commandes admin');
    }
  };

  const showMsg = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Ouverture modal d'ajout ou modification produit
  const handleOpenProductForm = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        nom: prod.nom,
        description: prod.description || '',
        prix: prod.prix,
        pourcentage_cacao: prod.pourcentage_cacao || 70,
        image_url: prod.image_url || '/images/noir_sambirano_85.png',
        stock: prod.stock || 50,
        categorie_id: prod.categorie_id || 1
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        nom: '',
        description: '',
        prix: '',
        pourcentage_cacao: '75',
        image_url: '/images/noir_sambirano_85.png',
        stock: '50',
        categorie_id: categories[0]?.id || '1'
      });
    }
    setShowProductModal(true);
  };

  // Enregistrer (POST / PUT) un produit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `/api/produits/${editingProduct.id}` : '/api/produits';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        showMsg(editingProduct ? 'Produit modifié avec succès !' : 'Produit créé avec succès !');
        setShowProductModal(false);
        onRefreshData();
      }
    } catch (err) {
      showMsg('Erreur lors de l\'enregistrement du produit');
    }
  };

  // Supprimer (DELETE / Soft delete) un produit
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Voulez-vous vraiment désactiver ce produit ?')) return;

    try {
      const res = await fetch(`/api/produits/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('Produit désactivé avec succès !');
        onRefreshData();
      }
    } catch (err) {
      showMsg('Erreur lors de la suppression du produit');
    }
  };

  // Ajouter une catégorie
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm)
      });
      if (res.ok) {
        showMsg('Catégorie ajoutée avec succès !');
        setShowCatModal(false);
        setCatForm({ nom: '', description: '' });
        onRefreshData();
      }
    } catch (err) {
      showMsg('Erreur enregistrement catégorie');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* NOTIFICATION FLOTTANTE */}
      {notification && (
        <div className="mb-6 p-4 bg-emerald-800 text-white font-extrabold rounded-2xl shadow-xl border-2 border-emerald-500 flex items-center space-x-3 animate-fade-in">
          <CheckCircle size={22} className="text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* EN-TÊTE DASHBOARD ADMIN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b-2 border-[#C89B3C]/25 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-black text-[#C89B3C] block mb-1">Panneau de Contrôle L2</span>
          <h2 className="font-serif-luxury font-bold text-2xl sm:text-3xl text-[#2B1710]">
            Administration DaddyChocolat
          </h2>
        </div>

        <button 
          onClick={onRefreshData}
          className="px-5 py-2.5 bg-white border-2 border-[#C89B3C]/40 text-[#2B1710] hover:border-[#C89B3C] hover:bg-[#FAF6EE] rounded-xl font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-sm cursor-pointer transition-all"
        >
          <RefreshCw size={18} className="text-[#C89B3C]" />
          <span>Actualiser les données</span>
        </button>
      </div>

      {/* ONGLETS ADMIN RESPONSIVES ET DÉCORÉS */}
      <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-3 border-b-2 border-[#C89B3C]/20 no-scrollbar">
        <button 
          onClick={() => setActiveTab('produits')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2 flex-shrink-0 cursor-pointer border-2 transition-all ${
            activeTab === 'produits' 
              ? 'dark-btn-gradient text-white border-[#C89B3C] shadow-lg scale-105' 
              : 'bg-white text-[#2B1710] border-[#C89B3C]/30 hover:bg-[#FAF6EE]'
          }`}
        >
          <Package size={18} className={activeTab === 'produits' ? 'text-[#E6C275]' : 'text-[#8C7B6B]'} />
          <span>Gestion Produits ({products.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2 flex-shrink-0 cursor-pointer border-2 transition-all ${
            activeTab === 'categories' 
              ? 'dark-btn-gradient text-white border-[#C89B3C] shadow-lg scale-105' 
              : 'bg-white text-[#2B1710] border-[#C89B3C]/30 hover:bg-[#FAF6EE]'
          }`}
        >
          <Layers size={18} className={activeTab === 'categories' ? 'text-[#E6C275]' : 'text-[#8C7B6B]'} />
          <span>Catégories ({categories.length})</span>
        </button>

        <button 
          onClick={() => { setActiveTab('commandes'); fetchCommandes(); }}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2 flex-shrink-0 cursor-pointer border-2 transition-all ${
            activeTab === 'commandes' 
              ? 'dark-btn-gradient text-white border-[#C89B3C] shadow-lg scale-105' 
              : 'bg-white text-[#2B1710] border-[#C89B3C]/30 hover:bg-[#FAF6EE]'
          }`}
        >
          <ShoppingCart size={18} className={activeTab === 'commandes' ? 'text-[#E6C275]' : 'text-[#8C7B6B]'} />
          <span>Commandes ({commandes.length})</span>
        </button>
      </div>

      {/* ONGLET 1 : PRODUITS */}
      {activeTab === 'produits' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-serif-luxury font-bold text-xl text-[#2B1710]">Catalogue des Chocolats</h3>
            <button 
              onClick={() => handleOpenProductForm()}
              className="px-6 py-3 gold-btn-gradient text-[#1C0C07] font-extrabold text-xs sm:text-sm rounded-xl hover:scale-105 transition-all flex items-center space-x-2 shadow-lg border border-white/50 cursor-pointer"
            >
              <Plus size={18} />
              <span>Nouveau Produit</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#C89B3C]/30 shadow-lg overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead className="bg-[#1C0C07] text-white uppercase text-[11px] tracking-wider font-extrabold border-b-2 border-[#C89B3C]">
                <tr>
                  <th className="p-4 text-center">Visualisation</th>
                  <th className="p-4">Chocolat</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4">% Cacao</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF6EE]">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF6EE]/70 transition-colors">
                    <td className="p-4 text-center">
                      {/* THUMBNAIL CENTRÉ ET NON ROGNÉ */}
                      <div className="w-14 h-14 bg-[#FAF6EE] p-1 rounded-xl overflow-hidden border-2 border-[#C89B3C]/20 shadow-sm flex items-center justify-center mx-auto">
                        <img 
                          src={p.image_url || '/images/noir_sambirano_85.png'} 
                          alt={p.nom} 
                          className="max-h-full max-w-full object-contain mx-auto my-auto"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/images/noir_sambirano_85.png'; }}
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#2B1710]">{p.nom}</td>
                    <td className="p-4 text-[#8C7B6B] font-medium">{p.categorie_nom || 'Général'}</td>
                    <td className="p-4 font-serif-luxury font-black text-[#2B1710]">{new Intl.NumberFormat('fr-MG').format(p.prix)} Ar</td>
                    <td className="p-4 font-extrabold text-[#C89B3C]">{p.pourcentage_cacao}%</td>
                    <td className="p-4 font-bold">{p.stock} un.</td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenProductForm(p)}
                        className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-xl transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 rounded-xl transition-colors cursor-pointer"
                        title="Désactiver"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONGLET 2 : CATÉGORIES */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-serif-luxury font-bold text-xl text-[#2B1710]">Catégories de Chocolats</h3>
            <button 
              onClick={() => setShowCatModal(true)}
              className="px-6 py-3 gold-btn-gradient text-[#1C0C07] font-extrabold text-xs sm:text-sm rounded-xl hover:scale-105 transition-all flex items-center space-x-2 shadow-lg border border-white/50 cursor-pointer"
            >
              <Plus size={18} />
              <span>Nouvelle Catégorie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-3xl border-2 border-[#C89B3C]/25 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-2xl dark-btn-gradient text-[#E6C275] flex items-center justify-center font-black border border-[#C89B3C]">
                  #{c.id}
                </div>
                <h4 className="font-serif-luxury font-bold text-lg text-[#2B1710]">{c.nom}</h4>
                <p className="text-xs text-[#8C7B6B] leading-relaxed">{c.description || 'Aucune description disponible.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET 3 : COMMANDES */}
      {activeTab === 'commandes' && (
        <div>
          <h3 className="font-serif-luxury font-bold text-xl text-[#2B1710] mb-6">Historique des Commandes Reçues</h3>
          <div className="bg-white rounded-3xl border-2 border-[#C89B3C]/30 shadow-lg overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-[#1C0C07] text-white uppercase text-[11px] tracking-wider font-extrabold border-b-2 border-[#C89B3C]">
                <tr>
                  <th className="p-4">N° Cmd</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Montant Total</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF6EE]">
                {commandes.map(cmd => (
                  <tr key={cmd.id} className="hover:bg-[#FAF6EE]/70 transition-colors">
                    <td className="p-4 font-black text-[#C89B3C]">#CMD-{cmd.id}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-[#2B1710]">{cmd.client_nom || 'Client Externe'}</div>
                      <div className="text-xs text-[#8C7B6B]">{cmd.email}</div>
                    </td>
                    <td className="p-4 font-serif-luxury font-black text-[#2B1710]">
                      {new Intl.NumberFormat('fr-MG').format(cmd.total)} Ar
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                        {cmd.statut || 'En attente'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[#8C7B6B] font-medium">
                      {new Date(cmd.date_commande || Date.now()).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL GESTION PRODUIT (CREATE / EDIT) */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#C89B3C]/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-luxury font-bold text-xl text-[#2B1710]">
              {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Nom du Produit *</label>
                <input 
                  type="text" 
                  required
                  value={productForm.nom}
                  onChange={e => setProductForm({ ...productForm, nom: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Prix (Ariary) *</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.prix}
                    onChange={e => setProductForm({ ...productForm, prix: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">% Cacao</label>
                  <input 
                    type="number" 
                    value={productForm.pourcentage_cacao}
                    onChange={e => setProductForm({ ...productForm, pourcentage_cacao: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Stock Initial</label>
                  <input 
                    type="number" 
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Catégorie</label>
                  <select
                    value={productForm.categorie_id}
                    onChange={e => setProductForm({ ...productForm, categorie_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#2B1710] block mb-1">URL de l'image</label>
                <input 
                  type="text" 
                  value={productForm.image_url}
                  onChange={e => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#FAF6EE]">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 font-extrabold text-sm rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 dark-btn-gradient text-white font-extrabold text-sm rounded-xl border-2 border-[#C89B3C] shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GESTION CATÉGORIE */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#C89B3C]/40 space-y-4">
            <h3 className="font-serif-luxury font-bold text-xl text-[#2B1710]">Ajouter une Catégorie</h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Nom de la catégorie *</label>
                <input 
                  type="text"
                  required
                  value={catForm.nom}
                  onChange={e => setCatForm({ ...catForm, nom: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-[#2B1710] block mb-1">Description</label>
                <textarea 
                  value={catForm.description}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EE] border-2 border-[#C89B3C]/30 rounded-xl text-sm font-medium focus:outline-none focus:border-[#C89B3C]"
                  rows="2"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#FAF6EE]">
                <button 
                  type="button" 
                  onClick={() => setShowCatModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 font-extrabold text-sm rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 gold-btn-gradient text-[#1C0C07] font-extrabold text-sm rounded-xl border border-white/40 shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

