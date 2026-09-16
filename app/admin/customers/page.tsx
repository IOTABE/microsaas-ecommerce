'use client';

import React, { useState } from 'react';
import { Users, Sparkles, MessageCircle, Mail, MapPin, Plus, CheckCircle2 } from 'lucide-react';

interface LeadItem {
  id: string;
  name: string;
  whatsapp: string;
  source: string;
  date: string;
}

interface CustomerItem {
  id: string;
  fullName: string;
  documentCpfCnpj: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
}

const INITIAL_LEADS: LeadItem[] = [
  { id: 'l1', name: 'Mariana Lima', whatsapp: '11999887766', source: 'Home Widget', date: 'Hoje às 11:02' },
  { id: 'l2', name: 'Lucas Silveira', whatsapp: '21988776655', source: 'Home Widget', date: 'Hoje às 09:40' },
  { id: 'l3', name: 'Carla Dias', whatsapp: '31977665544', source: 'Pop-up Desconto', date: 'Ontem às 18:20' },
];

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: 'c1',
    fullName: 'Beatriz Vasconcelos',
    documentCpfCnpj: '123.456.789-00',
    email: 'beatriz@email.com',
    phone: '(11) 99876-1122',
    city: 'São Paulo',
    state: 'SP',
    totalOrders: 3,
  },
  {
    id: 'c2',
    fullName: 'Rodrigo Mendonça',
    documentCpfCnpj: '987.654.321-99',
    email: 'rodrigo@email.com',
    phone: '(21) 98765-4321',
    city: 'Rio de Janeiro',
    state: 'RJ',
    totalOrders: 1,
  },
];

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'customers'>('leads');
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

  // Modal de Novo Cliente Completo
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [documentCpfCnpj, setDocumentCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: CustomerItem = {
      id: `cust_${Date.now()}`,
      fullName,
      documentCpfCnpj,
      email,
      phone,
      city,
      state,
      totalOrders: 0,
    };
    setCustomers([newCust, ...customers]);
    setShowModal(false);
    // Limpa
    setFullName('');
    setDocumentCpfCnpj('');
    setEmail('');
    setPhone('');
    setCity('');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads & Clientes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diferenciação clara entre contatos rápidos (Leads) e compradores completos (CRM).
          </p>
        </div>

        {activeTab === 'customers' && (
          <button
            onClick={() => setShowModal(true)}
            className="py-2.5 px-4 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Cliente Completo</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Receptor de Leads (Home) - {leads.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clientes (Dados Completos) - {customers.length}</span>
        </button>
      </div>

      {/* TAB 1: LEADS (Nome + WhatsApp) */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2 text-xs text-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>
              Contatos capturados pelo widget da vitrine. Ideal para envio de cupons e promoções.
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Origem</th>
                <th className="p-4">Capturado em</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{l.name}</td>
                  <td className="p-4 font-mono text-slate-600 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{l.whatsapp}</span>
                  </td>
                  <td className="p-4 text-slate-500">{l.source}</td>
                  <td className="p-4 text-slate-400 text-[11px]">{l.date}</td>
                  <td className="p-4 text-right">
                    <a
                      href={`https://wa.me/55${l.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 border border-emerald-200 text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Chamar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CLIENTES (Dados Completos) */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">CPF / CNPJ</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Localização</th>
                <th className="p-4">Compras</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{c.fullName}</span>
                    <span className="text-slate-400 text-[11px]">{c.email}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{c.documentCpfCnpj}</td>
                  <td className="p-4 text-slate-600">{c.phone}</td>
                  <td className="p-4 text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {c.city} - {c.state}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {c.totalOrders} pedidos
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Cadastro Completo de Cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Novo Cliente (Dados Completos)</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CPF ou CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={documentCpfCnpj}
                    onChange={(e) => setDocumentCpfCnpj(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">UF *</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
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
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
