'use client';

import React, { useState } from 'react';
import { Package, Plus, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/tenant';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [showModal, setShowModal] = useState(false);

  // Formulário
  const [sku, setSku] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const newProd = {
      id: `prod_${Date.now()}`,
      sku: sku.toUpperCase(),
      title,
      description,
      price: parseFloat(price) || 0,
      stockQuantity: parseInt(stock, 10) || 0,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
      isFeatured,
    };

    setProducts([newProd, ...products]);
    setShowModal(false);
    setSuccessMsg(true);

    // Limpa campos
    setSku('');
    setTitle('');
    setDescription('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setIsFeatured(false);

    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catálogo de Produtos</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre novos itens para a vitrine, ajuste preços e controle estoques.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Produto</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Produto adicionado com sucesso ao catálogo!</span>
        </div>
      )}

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Novo Produto</h2>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="EX: PRES-005"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="89.90"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome do produto"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes, medidas e características..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="20"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="featured" className="text-xs text-slate-700 font-medium">
                  Destacar este produto na vitrine principal
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">{p.title}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {p.description}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{p.sku}</td>
                  <td className="p-4 font-bold text-slate-900">R$ {p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        p.stockQuantity > 5
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {p.stockQuantity} unid.
                    </span>
                  </td>
                  <td className="p-4">
                    {p.isFeatured && (
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Destaque
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
