import React, { useState, useEffect } from 'react';
import { X, Mail, Plus, Trash2, CheckCircle2, Shield, Server, RefreshCw } from 'lucide-react';
import { TicketService } from '../services/ticketService';
import { NotificationSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<NotificationSettings>(TicketService.getSettings());
  const [novoEmail, setNovoEmail] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    if (isOpen) {
      checkBackend();
    }
  }, [isOpen]);

  const checkBackend = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch('http://localhost:3001/api/health');
      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  if (!isOpen) return null;

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoEmail.trim() || !novoEmail.includes('@')) return;
    if (settings.emailsDirecao.includes(novoEmail.trim())) return;

    const updated = {
      ...settings,
      emailsDirecao: [...settings.emailsDirecao, novoEmail.trim()],
    };
    setSettings(updated);
    TicketService.saveSettings(updated);
    setNovoEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    const updated = {
      ...settings,
      emailsDirecao: settings.emailsDirecao.filter((e) => e !== email),
    };
    setSettings(updated);
    TicketService.saveSettings(updated);
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updated as NotificationSettings);
    TicketService.saveSettings(updated as NotificationSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-base">
              Configurações de Notificação por E-mail
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Status do Backend de Envio */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-slate-500" />
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Motor de Envio de E-mails (Node.js API)
                </div>
                <div className="text-[11px] text-slate-400">
                  Porta 3001 • Nodemailer & Templates Oficiais SENAI
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                backendStatus === 'online'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : backendStatus === 'checking'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}>
                {backendStatus === 'online' ? 'Online' : backendStatus === 'checking' ? 'Testando...' : 'Pronto (Inicie o backend)'}
              </span>
              <button onClick={checkBackend} title="Testar Conexão">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          </div>

          {/* Lista de Destinatários da Direção */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Lista de E-mails da Direção / Coordenação (Stakeholders)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Todos os e-mails cadastrados aqui recebem cópia do relatório técnico imediatamente após o aceite do gestor.
            </p>

            <form onSubmit={handleAddEmail} className="flex gap-2 mb-3">
              <input
                type="email"
                placeholder="exemplo: coordenacao.ourinhos@sp.senai.br"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </form>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {settings.emailsDirecao.map((email) => (
                <div
                  key={email}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Opções de Disparo */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enviarAoFinalizar}
                onChange={() => handleToggle('enviarAoFinalizar')}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Disparar e-mail à Direção e ao Solicitante ao Homologar a O.S.
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs sm:text-sm"
            >
              Fechar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

