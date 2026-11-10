import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Flame,
  Wifi,
  Sparkles
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { RoomQRManager } from './components/RoomQRManager';
import { NewTicketModal } from './components/NewTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { TicketService } from './services/ticketService';
import { Ticket, RoomEnvironment } from './types';
import { useAuth } from './contexts/AuthContext';

export function App() {
  const { currentUser } = useAuth();
  
  const [currentTab, setCurrentTab] = useState<'kanban' | 'tabela' | 'qrcodes'>('kanban');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomEnvironment[]>([]);
  const [isFirebaseSynced, setIsFirebaseSynced] = useState(true);
  
  // Modais
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [qrRoomId, setQrRoomId] = useState<string | null>(null);

  // Escuta em tempo real dos tickets e ambientes no Firestore
  useEffect(() => {
    const unsubTickets = TicketService.subscribeTickets((data) => {
      setTickets(data);
      setIsFirebaseSynced(true);
    });

    const unsubRooms = TicketService.subscribeRooms((data) => {
      setRooms(data);
    });

    // Detectar parâmetro de URL acionado por QR Code: ?localId=sala-01-cnc
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const localIdParam = urlParams.get('localId');
      if (localIdParam) {
        setQrRoomId(localIdParam);
        setIsNewTicketOpen(true);
      }
    }

    return () => {
      unsubTickets();
      unsubRooms();
    };
  }, []);

  // Recarregar ticket selecionado se for atualizado
  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  }, [tickets]);

  const handleOpenTicketForRoom = (roomId: string) => {
    setQrRoomId(roomId);
    setIsNewTicketOpen(true);
  };

  // Métricas do Dashboard
  const totalAbertos = tickets.filter((t) => t.status !== 'finalizado').length;
  const emExecucao = tickets.filter((t) => t.status === 'em_execucao').length;
  const aguardandoVistoria = tickets.filter((t) => t.status === 'concluido').length;
  const finalizados = tickets.filter((t) => t.status === 'finalizado').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-red-500 selection:text-white">
      
      {/* Barra de Navegação */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewTicket={() => {
          setQrRoomId(null);
          setIsNewTicketOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner de Métricas Rápidas & Status do Firebase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Chamados Ativos
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {totalAbertos}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Em Andamento
              </span>
              <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {emExecucao}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Aguardando Vistoria
              </span>
              <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                {aguardandoVistoria}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Homologados
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {finalizados}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Indicador de Status Firebase Real-time */}
        <div className="flex items-center justify-between px-2 pb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Firebase antigravitymanu-44a47 Ativo</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">• Atualizações simultâneas em tempo real</span>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Usuário: <strong>{currentUser?.nome}</strong> ({currentUser?.role})
          </span>
        </div>

        {/* Alternância de Abas: Kanban, Tabela ou QR Codes */}
        {currentTab === 'kanban' && (
          <KanbanBoard
            tickets={tickets}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            viewMode="kanban"
          />
        )}

        {currentTab === 'tabela' && (
          <KanbanBoard
            tickets={tickets}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            viewMode="tabela"
          />
        )}

        {currentTab === 'qrcodes' && (
          <RoomQRManager
            rooms={rooms}
            onOpenTicketForRoom={handleOpenTicketForRoom}
          />
        )}

      </main>

      {/* Modal de Abertura de Chamado */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => {
          setIsNewTicketOpen(false);
          setQrRoomId(null);
        }}
        rooms={rooms}
        initialRoomId={qrRoomId}
      />

      {/* Modal de Detalhes da O.S., Materiais e Homologação */}
      <TicketDetailModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Modal de Configuração de E-mails da Direção */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Rodapé Oficial */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>SIG-Manu</strong> • Escola SENAI de Ourinhos (Norma Operacional FR.7.94-36)
          </span>
          <span className="text-slate-400">
            Desenvolvido com <strong>Google Antigravity</strong> • Oracle Cloud VM Ready
          </span>
        </div>
      </footer>

    </div>
  );
}

export default App;
