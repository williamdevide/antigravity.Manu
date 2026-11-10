import React, { useState } from 'react';
import { 
  Wrench, 
  Sun, 
  Moon, 
  QrCode, 
  PlusCircle, 
  LayoutDashboard, 
  Settings, 
  UserCircle,
  Menu,
  X,
  Layers,
  Table
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: 'kanban' | 'tabela' | 'qrcodes';
  setCurrentTab: (tab: 'kanban' | 'tabela' | 'qrcodes') => void;
  onOpenNewTicket: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewTicket,
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, switchRole, currentRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'gestor':
        return 'bg-red-600 text-white';
      case 'tecnico':
        return 'bg-blue-600 text-white';
      case 'solicitante':
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo e Identidade Visual SENAI */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-600/25 ring-2 ring-red-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  SIG<span className="text-red-600">Manu</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 tracking-wider">
                  SENAI 7.94
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Escola SENAI de Ourinhos • Gestão de Manutenção
              </p>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setCurrentTab('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentTab === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-red-600" />
              <span>Quadro Kanban</span>
            </button>

            <button
              onClick={() => setCurrentTab('tabela')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentTab === 'tabela'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-4 h-4 text-blue-600" />
              <span>Visão Tabela</span>
            </button>

            <button
              onClick={() => setCurrentTab('qrcodes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentTab === 'qrcodes'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Placas QR Code</span>
            </button>
          </nav>

          {/* Ações Rápidas & Perfil */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botão Novo Chamado */}
            <button
              onClick={onOpenNewTicket}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Solicitação</span>
              <span className="sm:hidden">Abrir O.S.</span>
            </button>

            {/* Alternador de Perfis (Simulador RBAC) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-bold px-2">Perfil:</span>
              {(['gestor', 'tecnico', 'solicitante'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold text-[11px] transition-all cursor-pointer ${
                    currentRole === r
                      ? getRoleBadgeColor(r) + ' shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Configurações */}
            <button
              onClick={onOpenSettings}
              title="Configurações e E-mails da Direção"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Botão Tema */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Menu Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Menu Mobile Retrátil */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-3 gap-2 pb-2">
              <button
                onClick={() => { setCurrentTab('kanban'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 ${
                  currentTab === 'kanban' ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => { setCurrentTab('tabela'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 ${
                  currentTab === 'tabela' ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Tabela</span>
              </button>
              <button
                onClick={() => { setCurrentTab('qrcodes'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 ${
                  currentTab === 'qrcodes' ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QR Codes</span>
              </button>
            </div>

            {/* Alternar Perfil Mobile */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Alternar Perfil Ativo:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['gestor', 'tecnico', 'solicitante'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`py-1 rounded-lg text-xs font-bold capitalize ${
                      currentRole === r ? getRoleBadgeColor(r) : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
