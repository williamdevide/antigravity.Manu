import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Package, 
  ChevronRight,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Ticket, TicketStatus, FinalidadeServico, Prioridade } from '../types';
import { TicketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';

interface KanbanBoardProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  viewMode?: 'kanban' | 'tabela';
}

interface ColumnConfig {
  id: TicketStatus;
  title: string;
  nextStatus?: TicketStatus;
  nextLabel?: string;
  accentBar: string;
  badgeClass: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'novo',
    title: 'Novo (Triagem)',
    nextStatus: 'planejado',
    nextLabel: 'Planejar',
    accentBar: 'bg-amber-500',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  },
  {
    id: 'planejado',
    title: 'Planejado',
    nextStatus: 'em_execucao',
    nextLabel: 'Iniciar',
    accentBar: 'bg-blue-500',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-900',
  },
  {
    id: 'em_execucao',
    title: 'Em Execução',
    nextStatus: 'concluido',
    nextLabel: 'Finalizar',
    accentBar: 'bg-indigo-500',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
  },
  {
    id: 'aguardando_material',
    title: 'Aguardando Peça',
    nextStatus: 'em_execucao',
    nextLabel: 'Retomar',
    accentBar: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-200 dark:border-orange-900',
  },
  {
    id: 'concluido',
    title: 'Aguardando Vistoria',
    nextStatus: 'finalizado',
    nextLabel: 'Homologar',
    accentBar: 'bg-purple-500',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900',
  },
  {
    id: 'finalizado',
    title: 'Finalizado / Aprovado',
    accentBar: 'bg-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tickets,
  onSelectTicket,
  viewMode = 'kanban',
}) => {
  const { currentUser, isTecnico, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFinalidade, setFilterFinalidade] = useState<string>('TODAS');
  const [filterPrioridade, setFilterPrioridade] = useState<string>('TODAS');
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Filtragem dos tickets
  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.descricao.toLowerCase().includes(term) ||
      t.numeroOS.toLowerCase().includes(term) ||
      t.ambiente.localNome.toLowerCase().includes(term) ||
      t.solicitante.nome.toLowerCase().includes(term);

    const matchesFinalidade = filterFinalidade === 'TODAS' || t.finalidade === filterFinalidade;
    const matchesPrioridade = filterPrioridade === 'TODAS' || t.prioridade === filterPrioridade;

    return matchesSearch && matchesFinalidade && matchesPrioridade;
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isTecnico) return;
    setDraggedTicketId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const id = e.dataTransfer.getData('text/plain') || draggedTicketId;
    if (id) {
      await TicketService.updateTicketStatus(id, targetStatus, currentUser || undefined);
      setDraggedTicketId(null);
    }
  };

  // Avançar status com 1-clique (ótimo para mobile)
  const handleAdvanceStatus = async (e: React.MouseEvent, ticket: Ticket, nextStatus?: TicketStatus) => {
    e.stopPropagation();
    if (!nextStatus || !isTecnico) return;
    await TicketService.updateTicketStatus(ticket.id, nextStatus, currentUser || undefined);
  };

  const getPriorityBadge = (p: Prioridade) => {
    switch (p) {
      case 'URGENTE':
        return 'bg-red-500 text-white font-extrabold animate-pulse';
      case 'ALTA':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800';
      case 'MEDIA':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900';
      case 'BAIXA':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getFinalidadeBadge = (f: FinalidadeServico) => {
    switch (f) {
      case 'CORRETIVA':
        return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900';
      case 'PREVENTIVA':
        return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900';
      case 'PREDITIVA':
        return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900';
      case 'MELHORIA':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Barra de Filtros e Busca Estilo Monday */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por número de O.S., sala, problema ou solicitante..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Finalidade:</span>
          </div>
          <select
            value={filterFinalidade}
            onChange={(e) => setFilterFinalidade(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium outline-hidden"
          >
            <option value="TODAS">Todas</option>
            <option value="CORRETIVA">Corretiva</option>
            <option value="PREVENTIVA">Preventiva</option>
            <option value="PREDITIVA">Preditiva</option>
            <option value="MELHORIA">Melhoria</option>
          </select>

          <div className="flex items-center gap-1.5 text-slate-500 font-semibold ml-2">
            <span>Prioridade:</span>
          </div>
          <select
            value={filterPrioridade}
            onChange={(e) => setFilterPrioridade(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium outline-hidden"
          >
            <option value="TODAS">Todas</option>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>

          <span className="hidden sm:inline text-slate-400 font-bold pl-2 border-l border-slate-200 dark:border-slate-800">
            {filteredTickets.length} registros
          </span>
        </div>

      </div>

      {/* VISÃO KANBAN */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none">
          {COLUMNS.map((col) => {
            const colTickets = filteredTickets.filter((t) => t.status === col.id);
            const isTarget = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex-1 min-w-[300px] max-w-[340px] bg-slate-100/80 dark:bg-slate-900/50 rounded-2xl border transition-all flex flex-col max-h-[calc(100vh-220px)] ${
                  isTarget
                    ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                    : 'border-slate-200/90 dark:border-slate-800/80'
                }`}
              >
                
                {/* Barra de Acento Superior Colorida */}
                <div className={`h-1.5 w-full rounded-t-2xl ${col.accentBar}`} />

                {/* Cabeçalho da Coluna */}
                <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 tracking-tight">
                    {col.title}
                  </h3>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${col.badgeClass}`}>
                    {colTickets.length}
                  </span>
                </div>

                {/* Lista de Cartões da Coluna */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1">
                  {colTickets.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-300/80 dark:border-slate-800 rounded-xl">
                      Nenhuma O.S. nesta etapa
                    </div>
                  ) : (
                    colTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        draggable={isTecnico}
                        onDragStart={(e) => handleDragStart(e, ticket.id)}
                        onClick={() => onSelectTicket(ticket)}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group active:scale-[0.99]"
                      >
                        {/* Topo do Card: Número OS & Badges */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                            {ticket.numeroOS}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getFinalidadeBadge(ticket.finalidade)}`}>
                              {ticket.finalidade}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPriorityBadge(ticket.prioridade)}`}>
                              {ticket.prioridade}
                            </span>
                          </div>
                        </div>

                        {/* Localização / Ambiente */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{ticket.ambiente.localNome}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mb-2 pl-5">
                          {ticket.ambiente.bloco} • {ticket.ambiente.setor}
                        </div>

                        {/* Descrição */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                          {ticket.descricao}
                        </p>

                        {/* Rodapé: Técnicos, Materiais e Botão Rápido de Avanço */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                          
                          {/* Equipe / Técnicos */}
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {ticket.tecnicosDesignados && ticket.tecnicosDesignados.length > 0 ? (
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {ticket.tecnicosDesignados[0].nome.split(' ')[0]}
                                {ticket.tecnicosDesignados.length > 1 && ` +${ticket.tecnicosDesignados.length - 1}`}
                              </span>
                            ) : (
                              <span className="italic text-slate-400">Pendente</span>
                            )}
                          </div>

                          {/* Ações e Indicadores */}
                          <div className="flex items-center gap-2">
                            {ticket.materiais && ticket.materiais.length > 0 && (
                              <span className="flex items-center gap-0.5 text-orange-500 font-bold" title="Materiais solicitados">
                                <Package className="w-3.5 h-3.5" />
                                <span>{ticket.materiais.length}</span>
                              </span>
                            )}

                            {/* Botão de Avanço Rápido (Mobile-friendly) */}
                            {col.nextStatus && isTecnico && (
                              <button
                                onClick={(e) => handleAdvanceStatus(e, ticket, col.nextStatus)}
                                title={`Mover para ${col.nextLabel}`}
                                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-700 dark:hover:bg-red-950/60 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center gap-1 transition-colors"
                              >
                                <span>{col.nextLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VISÃO TABELA ESTILO MONDAY */}
      {viewMode === 'tabela' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">O.S. / Código</th>
                  <th className="py-3 px-4">Ambiente</th>
                  <th className="py-3 px-4">Descrição do Serviço</th>
                  <th className="py-3 px-4">Finalidade</th>
                  <th className="py-3 px-4">Prioridade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Responsáveis</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket(t)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                      {t.numeroOS}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {t.ambiente.localNome}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {t.descricao}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getFinalidadeBadge(t.finalidade)}`}>
                        {t.finalidade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getPriorityBadge(t.prioridade)}`}>
                        {t.prioridade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold uppercase text-[11px] text-slate-700 dark:text-slate-300">
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {t.tecnicosDesignados?.map((tec) => tec.nome.split(' ')[0]).join(', ') || 'Pendente'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1 justify-end">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
