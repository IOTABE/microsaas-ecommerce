'use client';

import React, { useState } from 'react';
import { Palette, KeyRound, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';

export default function BrandingAndProfilePage() {
  // Cores
  const [primaryColor, setPrimaryColor] = useState('#e11d48');
  const [secondaryColor, setSecondaryColor] = useState('#881337');
  const [backgroundColor, setBackgroundColor] = useState('#fff1f2');
  const [logoUrl, setLogoUrl] = useState(
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=120&h=120&fit=crop&crop=faces'
  );
  const [deliveryFee, setDeliveryFee] = useState('15.00');

  // Senhas
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('A nova senha e a confirmação não coincidem!');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Perfil, Branding & Segurança</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Personalize a identidade visual (cores e logo) da sua vitrine e altere sua senha de acesso.
        </p>
      </div>

      {/* Seção 1: Identidade Visual & Cores */}
      <form
        onSubmit={handleSaveBranding}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-5 h-5 text-pink-600" />
          <h2 className="font-bold text-slate-900 text-sm">Configuração de Cores & Logo</h2>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurações visuais salvas com sucesso!</span>
          </div>
        )}

        {/* Cores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cor Primária (Botões e Destaques)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="text-xs font-mono p-2 border border-slate-200 rounded-lg w-28"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cor Secundária (Textos e Bordas)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="text-xs font-mono p-2 border border-slate-200 rounded-lg w-28"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cor de Fundo do Banner (Background)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="text-xs font-mono p-2 border border-slate-200 rounded-lg w-28"
              />
            </div>
          </div>
        </div>

        {/* Logo URL */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">URL do Logotipo</label>
          <div className="flex items-center gap-3">
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://sua-empresa.com/logo.png"
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Prévia do Logo"
                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
              />
            )}
          </div>
        </div>

        {/* Taxa de Entrega Padrão */}
        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Taxa de Entrega para Pedidos &lt; R$ 150,00 (R$)
          </label>
          <input
            type="number"
            step="0.50"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Pedidos iguais ou superiores a R$ 150,00 recebem Frete Grátis automaticamente.
          </span>
        </div>

        <button
          type="submit"
          className="py-2.5 px-5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações Visuais</span>
        </button>
      </form>

      {/* Seção 2: Troca de Senha */}
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-900 text-sm">Segurança & Alteração de Senha</h2>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Senha alterada com sucesso!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Senha Atual *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nova Senha *</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirmar Nova Senha *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          <KeyRound className="w-4 h-4" />
          <span>Atualizar Senha</span>
        </button>
      </form>
    </div>
  );
}
