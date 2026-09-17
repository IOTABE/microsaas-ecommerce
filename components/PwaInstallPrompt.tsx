'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Share, Plus, Smartphone } from 'lucide-react';

const DISMISS_KEY = 'pwa_install_dismissed_at';
const DISMISS_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Registra o Service Worker (necessário para instalabilidade)
    if ('serviceWorker' in navigator) {
      const register = () =>
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('[PWA] Falha ao registrar Service Worker:', err);
        });

      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }

    // Já está instalado / aberto como app?
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Usuário dispensou recentemente?
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;

    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);
    setIsIos(ios);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    // iOS/Safari não emite beforeinstallprompt: mostramos as instruções manuais
    const iosTimer = ios ? setTimeout(() => setVisible(true), 2500) : undefined;

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setVisible(false);
      setDeferredPrompt(null);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-5 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-lg relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f20]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-4">
        <div className="absolute -top-16 -right-10 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Smartphone className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Instale o app MicroSaaS</p>

            {isIos ? (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Toque em{' '}
                <Share className="inline w-3.5 h-3.5 -mt-0.5 text-blue-400" />{' '}
                <span className="text-slate-200 font-semibold">Compartilhar</span> e depois em{' '}
                <Plus className="inline w-3.5 h-3.5 -mt-0.5 text-blue-400" />{' '}
                <span className="text-slate-200 font-semibold">Adicionar à Tela de Início</span>.
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Adicione à sua tela inicial para abrir mais rápido, em tela cheia e como um app.
              </p>
            )}

            {!isIos && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Instalar agora
                </button>
                <button
                  onClick={dismiss}
                  className="px-3 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                >
                  Agora não
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
