import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  Package, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Camera, 
  ShieldCheck, 
  Mail, 
  MessageSquare,
  Wrench
} from 'lucide-react';
import { Ticket, StatusMaterial, MaterialItem, TicketStatus } from '../types';
import { TicketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const { currentUser, isAdmin, isTecnico } = useAuth();

  const [activeTab, setActiveTab] = useState<'geral' | 'tecnicos' | 'materiais' | 'execucao' | 'validacao'>('geral');
  
  // Estado para novo material
  const [novoMaterialDesc, setNovoMaterialDesc] = useState('');
  const [novoMaterialQtd, setNovoMaterialQtd] = useState(1);
  const [novoMaterialStatus, setNovoMaterialStatus] = useState<StatusMaterial>('SOLICITADO');

  // Estado para execução do técnico
  const [relatoTecnico, setRelatoTecnico] = useState('');
  const [fotoConclusao, setFotoConclusao] = useState('');

  // Estado para validação do gestor
  const [statusAvaliacao, setStatusAvaliacao] = useState<'APROVADO' | 'PENDENCIAS' | 'REPROVADO'>('APROVADO');
  const [observacoesGestor, setObservacoesGestor] = useState('Serviço vistoriado e aprovado com sucesso.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  // Técnicos pré-cadastrados para seleção
  const listaTecnicosDisponiveis = [
    { uid: 'tec_roberto', nome: 'Roberto Silveira', nif: '33412' },
    { uid: 'tec_marcos', nome: 'Marcos Oliveira', nif: '22901' },
    { uid: 'tec_andre', nome: 'André Luiz Santos', nif: '55102' },
    { uid: 'gestor_joao', nome: 'João Paulo Ferreira (Encarregado)', nif: '11234' },
  ];

  const handleToggleTecnico = async (tec: { uid: string; nome: string; nif: string }) => {
    if (!isAdmin) return;
    const atuais = ticket.tecnicosDesignados || [];
    const existe = atuais.some((t) => t.uid === tec.uid);
    let novaLista = [];

    if (existe) {
      novaLista = atuais.filter((t) => t.uid !== tec.uid);
    } else {
      novaLista = [...atuais, tec];
    }

    await TicketService.assignTechnicians(ticket.id, novaLista, currentUser?.nome || 'Gestor');
    onUpdated?.();
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMaterialDesc.trim()) return;

    await TicketService.addMaterial(ticket.id, {
      descricao: novoMaterialDesc,
      quantidade: novoMaterialQtd,
      statusCompra: novoMaterialStatus,
    });

    setNovoMaterialDesc('');
    setNovoMaterialQtd(1);
    onUpdated?.();
  };

  const handleFinalizarExecucao = async () => {
    if (!relatoTecnico.trim()) {
      alert('Por favor, informe o relato do serviço realizado.');
      return;
    }
    setIsSubmitting(true);
    await TicketService.completeExecution(ticket.id, relatoTecnico, fotoConclusao ? [fotoConclusao] : []);
    setIsSubmitting(false);
    onUpdated?.();
    alert('Serviço concluído e enviado para validação da liderança!');
  };

  const handleHomologarGestor = async () => {
    if (!currentUser) return;
    setIsSubmitting(true);
    await TicketService.validateTicket(
      ticket.id,
      statusAvaliacao,
      observacoesGestor,
      currentUser
    );
    setIsSubmitting(false);
    onUpdated?.();
    alert(`O.S. ${statusAvaliacao === 'APROVADO' ? 'Homologada e Finalizada' : 'Atualizada'} com sucesso! E-mails de notificação processados.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Cabeçalho da OS */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-white text-red-600 font-bold px-2 py-0.5 rounded text-xs">
              SENAI 7.94
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg leading-tight">
                  {ticket.numeroOS}
                </h2>
                <span className="text-xs bg-red-800/70 px-2 py-0.5 rounded font-mono">
                  {ticket.id}
                </span>
              </div>
              <p className="text-xs text-red-100">
                {ticket.ambiente.localNome} • {ticket.finalidade}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação Estilo CRM */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-6 text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('geral')}
            className={`py-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'geral'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ficha Oficial (FR.7.94)
          </button>
          
          <button
            onClick={() => setActiveTab('tecnicos')}
            className={`py-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'tecnicos'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Equipe / Técnicos
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {ticket.tecnicosDesignados?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('materiais')}
            className={`py-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'materiais'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Materiais & Peças
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {ticket.materiais?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('execucao')}
            className={`py-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'execucao'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Apontamento de Execução
          </button>

          <button
            onClick={() => setActiveTab('validacao')}
            className={`py-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'validacao'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Validação do Gestor
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          
          {/* ABA GERAL: FICHA FR.7.94-36 */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold uppercase">Atendimento</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.tipoAtendimento}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase">Finalidade</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">{ticket.finalidade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase">Prioridade</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.prioridade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase">Status Atual</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">{ticket.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Localização da Manutenção
                </h4>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">{ticket.ambiente.localNome}</span>
                  </div>
                  <span className="text-slate-500">{ticket.ambiente.bloco} • {ticket.ambiente.setor}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Solicitante
                </h4>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ticket.solicitante.nome}</div>
                  <div className="text-slate-500">NIF: {ticket.solicitante.nif} • {ticket.solicitante.email}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Descrição do Serviço Solicitado
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {ticket.descricao}
                </div>
              </div>

              {ticket.fotosAvaria && ticket.fotosAvaria.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Fotos da Avaria
                  </h4>
                  <div className="flex gap-2">
                    {ticket.fotosAvaria.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Avaria"
                        className="w-24 h-24 object-cover rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA TÉCNICOS DESIGNADOS (MULTI-RESPONSÁVEL) */}
          {activeTab === 'tecnicos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Responsáveis pelo Serviço
                  </h4>
                  <p className="text-xs text-slate-500">
                    O encarregado pode designar múltiplos colaboradores para esta O.S.
                  </p>
                </div>
                {!isAdmin && (
                  <span className="text-[11px] text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded">
                    Somente o Gestor pode alterar
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listaTecnicosDisponiveis.map((tec) => {
                  const selecionado = ticket.tecnicosDesignados?.some((t) => t.uid === tec.uid);
                  return (
                    <div
                      key={tec.uid}
                      onClick={() => handleToggleTecnico(tec)}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        selecionado
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      } ${isAdmin ? 'cursor-pointer hover:border-red-400' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          selecionado ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {tec.nome[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{tec.nome}</div>
                          <div className="text-[11px] text-slate-500">NIF: {tec.nif}</div>
                        </div>
                      </div>
                      {selecionado && <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA MATERIAIS & PEÇAS A COMPRAR */}
          {activeTab === 'materiais' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Insumos e Peças Necessárias
                  </h4>
                  <p className="text-xs text-slate-500">
                    Controle de compras e almoxarifado atrelado à ordem de serviço.
                  </p>
                </div>
              </div>

              {/* Form para adicionar material */}
              <form onSubmit={handleAddMaterial} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="Nome do material (ex: Lâmpada LED, Parafuso M8, Contator)..."
                  value={novoMaterialDesc}
                  onChange={(e) => setNovoMaterialDesc(e.target.value)}
                  className="flex-1 min-w-[200px] text-xs sm:text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                />
                <input
                  type="number"
                  min="1"
                  value={novoMaterialQtd}
                  onChange={(e) => setNovoMaterialQtd(Number(e.target.value))}
                  className="w-16 text-xs sm:text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden text-center"
                />
                <select
                  value={novoMaterialStatus}
                  onChange={(e) => setNovoMaterialStatus(e.target.value as StatusMaterial)}
                  className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-hidden"
                >
                  <option value="SOLICITADO">Solicitado</option>
                  <option value="EM_COTACAO">Em Cotação</option>
                  <option value="COMPRADO">Comprado</option>
                  <option value="DISPONIVEL_ESTOQUE">Em Estoque</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </form>

              {/* Lista de materiais adicionados */}
              <div className="space-y-2">
                {ticket.materiais && ticket.materiais.length > 0 ? (
                  ticket.materiais.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {mat.quantidade}x {mat.descricao}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {mat.statusCompra.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    Nenhum material adicionado a esta ordem de serviço.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA APONTAMENTO DE EXECUÇÃO */}
          {activeTab === 'execucao' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Registro de Execução do Técnico
                </h4>
                <p className="text-xs text-slate-500">
                  Apontamento oficial de horários e relato técnico do conserto.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 font-bold block">INÍCIO DA EXECUÇÃO</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {ticket.execucao?.dataInicio
                      ? new Date(ticket.execucao.dataInicio).toLocaleString('pt-BR')
                      : 'Não iniciado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">CONCLUSÃO DA EXECUÇÃO</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {ticket.execucao?.dataConclusao
                      ? new Date(ticket.execucao.dataConclusao).toLocaleString('pt-BR')
                      : 'Pendente'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Relato do Serviço Executado
                </label>
                <textarea
                  rows={4}
                  value={relatoTecnico || ticket.execucao?.relatoTecnico || ''}
                  onChange={(e) => setRelatoTecnico(e.target.value)}
                  placeholder="Descreva as ações realizadas, peças substituídas, testes efetuados..."
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              {isTecnico && ticket.status !== 'finalizado' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleFinalizarExecucao}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Serviço & Enviar p/ Vistoria</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ABA VALIDAÇÃO E HOMOLOGAÇÃO DO GESTOR */}
          {activeTab === 'validacao' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Homologação Oficial por 1-Clique (Gestor de Manutenção)</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Ao aprovar, o sistema carimba digitalmente seu NIF/Nome e dispara automaticamente o relatório de e-mail para a <strong>Diretoria</strong> e para o <strong>Solicitante</strong>.
                </p>
              </div>

              {ticket.avaliacao ? (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Resultado da Avaliação:</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {ticket.avaliacao.status}
                    </span>
                  </div>
                  <div><strong>Validado por:</strong> {ticket.avaliacao.validadoPor.nome} (NIF: {ticket.avaliacao.validadoPor.nif})</div>
                  <div><strong>Data da Validação:</strong> {new Date(ticket.avaliacao.validadoPor.validadoEm).toLocaleString('pt-BR')}</div>
                  <div><strong>Observações:</strong> {ticket.avaliacao.observacoes}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Parecer da Liderança Imediata
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['APROVADO', 'PENDENCIAS', 'REPROVADO'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusAvaliacao(st)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            statusAvaliacao === st
                              ? st === 'APROVADO'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Observações / Justificativa da Vistoria
                    </label>
                    <textarea
                      rows={3}
                      value={observacoesGestor}
                      onChange={(e) => setObservacoesGestor(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {isAdmin ? (
                    <button
                      onClick={handleHomologarGestor}
                      disabled={isSubmitting}
                      className="w-full py-3 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>{isSubmitting ? 'Processando Notificações...' : 'Homologar & Notificar Stakeholders por E-mail'}</span>
                    </button>
                  ) : (
                    <div className="text-center p-3 text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      Apenas usuários com perfil <strong>Gestor</strong> podem homologar e finalizar a O.S.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

