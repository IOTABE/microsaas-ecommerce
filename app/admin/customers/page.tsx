'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Sparkles,
  MessageCircle,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { CustomerData } from '@/lib/types';

interface LeadItem {
  id: string;
  name: string;
  whatsapp: string;
  source: string;
  date: string;
}

const TENANT_SLUG = 'demo-loja';

const INITIAL_LEADS: LeadItem[] = [
  { id: 'l1', name: 'Mariana Lima', whatsapp: '11999887766', source: 'Home Widget', date: 'Hoje às 11:02' },
  { id: 'l2', name: 'Lucas Silveira', whatsapp: '21988776655', source: 'Home Widget', date: 'Hoje às 09:40' },
  { id: 'l3', name: 'Carla Dias', whatsapp: '31977665544', source: 'Pop-up Desconto', date: 'Ontem às 18:20' },
];

const EMPTY_FORM = {
  fullName: '',
  documentCpfCnpj: '',
  email: '',
  phone: '',
  city: '',
  state: 'SP',
  birthDate: '',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
}

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'customers'>('leads');
  const [leads] = useState(INITIAL_LEADS);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Cliente
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const notify = (type: 'ok' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch(`/api/customers?tenantSlug=${TENANT_SLUG}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao carregar clientes');
      setCustomers(data.customers || []);
    } catch (err: any) {
      notify('error', err.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (c: CustomerData) => {
    setEditingId(c.id);
    setForm({
      fullName: c.fullName,
      documentCpfCnpj: c.documentCpfCnpj,
      email: c.email,
      phone: c.phone,
      city: c.city,
      state: c.state,
      birthDate: c.birthDate ?? '',
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
      fullName: form.fullName,
      documentCpfCnpj: form.documentCpfCnpj,
      email: form.email,
      phone: form.phone,
      city: form.city,
      state: form.state,
      birthDate: form.birthDate || null,
    };

    try {
      const res = await fetch(editingId ? `/api/customers/${editingId}` : '/api/customers', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao salvar cliente');

      const saved: CustomerData = data.customer;
      setCustomers((prev) =>
        editingId ? prev.map((c) => (c.id === editingId ? saved : c)) : [saved, ...prev]
      );

      notify('ok', editingId ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
      closeModal();
    } catch (err: any) {
      notify('error', err.message || 'Erro ao salvar cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const cust = customers.find((c) => c.id === id);
    if (!window.confirm(`Excluir o cliente "${cust?.fullName ?? ''}"?`)) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao excluir cliente');

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      notify('ok', 'Cliente removido.');
    } catch (err: any) {
      notify('error', err.message || 'Erro ao excluir cliente');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads & Clientes</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Diferenciação clara entre contatos rápidos (Leads) e compradores completos (CRM).
          </p>
        </div>

        {activeTab === 'customers' && (
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Cadastrar Cliente Completo</span>
          </button>
        )}
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.07]">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'border-b-2 border-blue-500 text-blue-300'
              : 'text-slate-500 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Receptor de Leads (Home) - {leads.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-b-2 border-purple-500 text-purple-300'
              : 'text-slate-500 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clientes (Dados Completos) - {customers.length}</span>
        </button>
      </div>

      {/* TAB 1: LEADS (Nome + WhatsApp) */}
      {activeTab === 'leads' && (
        <div className="panel-solid overflow-hidden">
          <div className="p-4 bg-blue-500/10 border-b border-blue-400/20 flex items-center gap-2 text-xs text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>
              Contatos capturados pelo widget da vitrine. Ideal para envio de cupons e promoções.
            </span>
          </div>

          <div className="admin-scroll overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/[0.07] text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Origem</th>
                  <th className="p-4">Capturado em</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.03] transition">
                    <td className="p-4 font-bold text-white">{l.name}</td>
                    <td className="p-4 font-mono text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{l.whatsapp}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{l.source}</td>
                    <td className="p-4 text-slate-500 text-[11px]">{l.date}</td>
                    <td className="p-4 text-right">
                      <a
                        href={`https://wa.me/55${l.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/15 text-emerald-300 font-semibold rounded-lg hover:bg-emerald-500/25 border border-emerald-400/25 text-[11px] transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Chamar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENTES (Dados Completos) */}
      {activeTab === 'customers' && (
        <div className="panel-solid overflow-hidden">
          <div className="admin-scroll overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/[0.07] text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">CPF / CNPJ</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">Nascimento</th>
                  <th className="p-4">Localização</th>
                  <th className="p-4">Compras</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Nenhum cliente cadastrado.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.03] transition">
                      <td className="p-4">
                        <span className="font-bold text-white block">{c.fullName}</span>
                        <span className="text-slate-500 text-[11px]">{c.email}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-300">{c.documentCpfCnpj}</td>
                      <td className="p-4 text-slate-300">{c.phone}</td>
                      <td className="p-4 text-slate-400">{formatDate(c.birthDate)}</td>
                      <td className="p-4 text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {c.city} - {c.state}
                          </span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-purple-500/15 text-purple-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {c.totalOrders} pedidos
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(c)}
                            title="Editar"
                            className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
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
      )}

      {/* Modal de Cadastro / Edição de Cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="panel-solid max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {editingId ? 'Editar Cliente' : 'Novo Cliente (Dados Completos)'}
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
              <div>
                <label className="field-label">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">CPF ou CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={form.documentCpfCnpj}
                    onChange={(e) => setForm({ ...form, documentCpfCnpj: e.target.value })}
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="field-label">Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-dark"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">E-mail *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="field-label">Data de Nascimento</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="field-label">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="field-label">UF *</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                    className="input-dark"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.07]">
                <button type="button" onClick={closeModal} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
