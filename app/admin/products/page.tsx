'use client';

import React, { useEffect, useState } from 'react';
import { Package, Plus, CheckCircle2, Trash2, Pencil, X, AlertCircle } from 'lucide-react';
import type { ProductData } from '@/lib/types';

const TENANT_SLUG = 'demo-loja';

const EMPTY_FORM = {
  sku: '',
  title: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  isFeatured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Formulário
  const [form, setForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const notify = (type: 'ok' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`/api/products?tenantSlug=${TENANT_SLUG}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao carregar produtos');
      setProducts(data.products || []);
    } catch (err: any) {
      notify('error', err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p: ProductData) => {
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      title: p.title,
      description: p.description,
      price: String(p.price),
      stock: String(p.stockQuantity),
      imageUrl: p.imageUrl ?? '',
      isFeatured: p.isFeatured,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      tenantSlug: TENANT_SLUG,
      sku: form.sku.toUpperCase(),
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      stockQuantity: parseInt(form.stock, 10) || 0,
      imageUrl: form.imageUrl || null,
      isFeatured: form.isFeatured,
    };

    try {
      const res = await fetch(editingId ? `/api/products/${editingId}` : '/api/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao salvar produto');

      const saved: ProductData = data.product;
      setProducts((prev) =>
        editingId ? prev.map((p) => (p.id === editingId ? saved : p)) : [saved, ...prev]
      );

      notify('ok', editingId ? 'Produto atualizado com sucesso!' : 'Produto adicionado ao catálogo!');
      closeModal();
    } catch (err: any) {
      notify('error', err.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!window.confirm(`Excluir o produto "${prod?.title ?? ''}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao excluir produto');

      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify('ok', 'Produto removido do catálogo.');
    } catch (err: any) {
      notify('error', err.message || 'Erro ao excluir produto');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo de Produtos</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastre, edite e remova itens da vitrine. Ajuste preços e controle estoques.
          </p>
        </div>

        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Cadastrar Produto</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs rounded-xl flex items-center gap-2 border ${
            feedback.type === 'ok'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/25'
              : 'bg-red-500/10 text-red-300 border-red-400/25'
          }`}
        >
          {feedback.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="panel-solid max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Código SKU *</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="EX: PRES-005"
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="field-label">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="89.90"
                    className="input-dark"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Título do Produto *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nome do produto"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="field-label">Descrição</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detalhes, medidas e características..."
                  className="input-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Quantidade em Estoque *</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="20"
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="field-label">URL da Imagem</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="input-dark"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <label htmlFor="featured" className="text-xs text-slate-300 font-medium">
                  Destacar este produto na vitrine principal
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.07]">
                <button type="button" onClick={closeModal} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving
                    ? 'Salvando...'
                    : editingId
                    ? 'Salvar Alterações'
                    : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      <div className="panel-solid overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/[0.07] text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Carregando produtos...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={
                          p.imageUrl ||
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop'
                        }
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg border border-white/10"
                      />
                      <div>
                        <span className="font-semibold text-white block">{p.title}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">
                          {p.description}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{p.sku}</td>
                    <td className="p-4 font-bold text-white">R$ {p.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          p.stockQuantity > 5
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-red-500/15 text-red-300'
                        }`}
                      >
                        {p.stockQuantity} unid.
                      </span>
                    </td>
                    <td className="p-4">
                      {p.isFeatured && (
                        <span className="bg-amber-500/15 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Destaque
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          title="Editar"
                          className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Excluir"
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5 text-blue-400" />
        {products.length} produtos cadastrados.
      </p>
    </div>
  );
}
