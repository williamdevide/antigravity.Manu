import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  CheckCircle2, 
  Building,
  Send,
  Image as ImageIcon,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TicketService } from '../services/ticketService';
import { 
  RoomEnvironment, 
  TipoAtendimento, 
  FinalidadeServico, 
  Prioridade 
} from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: RoomEnvironment[];
  initialRoomId?: string | null;
  onTicketCreated?: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  rooms,
  initialRoomId,
  onTicketCreated,
}) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tipoAtendimento, setTipoAtendimento] = useState<TipoAtendimento>('INTERNO');
  const [finalidade, setFinalidade] = useState<FinalidadeServico>('CORRETIVA');
  const [prioridade, setPrioridade] = useState<Prioridade>('MEDIA');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  useEffect(() => {
    if (initialRoomId) {
      setSelectedRoomId(initialRoomId);
    } else if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [initialRoomId, rooms]);

  if (!isOpen) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Upload real de foto pelo celular ou arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      alert('Por favor, descreva detalhadamente a solicitação.');
      return;
    }

    setIsSubmitting(true);

    try {
      await TicketService.createTicket({
        tipoAtendimento,
        finalidade,
        prioridade,
        solicitante: {
          uid: currentUser?.uid || 'guest',
          nome: currentUser?.nome || 'Solicitante Geral',
          nif: currentUser?.nif || '00000',
          email: currentUser?.email || 'solicitante@sp.senai.br',
        },
        ambiente: {
          localId: selectedRoom?.id || 'geral',
          localNome: selectedRoom?.nome || 'Ambiente Não Especificado',
          bloco: selectedRoom?.bloco || 'Geral',
          setor: selectedRoom?.setor || 'Geral',
        },
        descricao,
        fotosAvaria: fotoUrl ? [fotoUrl] : [],
      });

      setSucesso(true);
      setTimeout(() => {
        setSucesso(false);
        setDescricao('');
        setFotoUrl('');
        onClose();
        onTicketCreated?.();
      }, 1200);
    } catch (err) {
      console.error('Erro ao abrir chamado:', err);
      alert('Houve um erro ao registrar a solicitação no banco.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Cabeçalho Oficial SENAI FR.7.94-36 */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="bg-white text-red-600 font-black px-2.5 py-1 rounded-lg text-sm tracking-wider shadow-xs">
              SENAI
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-tight">
                ESCOLA SENAI DE OURINHOS - 7.94
              </h2>
              <p className="text-xs text-red-100 font-medium">
                SOLICITAÇÃO DE SERVIÇOS (FR.7.94-36)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sucesso ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce mb-3" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Ordem de Serviço Emitida com Sucesso!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              O encarregado de manutenção e a equipe técnica foram acionados em tempo real.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
            
            {/* Aviso QR Code Vinculado */}
            {initialRoomId && selectedRoom && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-3 text-red-800 dark:text-red-300 text-xs sm:text-sm">
                <Building className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <strong>QR Code Reconhecido:</strong> Ambiente{' '}
                  <span className="font-bold underline">{selectedRoom.nome}</span> ({selectedRoom.bloco}).
                </div>
              </div>
            )}

            {/* Linha 1: Tipo de Atendimento & Solicitante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Tipo de Atendimento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['INTERNO', 'EXTERNO'] as TipoAtendimento[]).map((tipo) => (
                    <button
                      type="button"
                      key={tipo}
                      onClick={() => setTipoAtendimento(tipo)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        tipoAtendimento === tipo
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Solicitante Autenticado
                </label>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {currentUser?.nome}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    NIF: {currentUser?.nif} • {currentUser?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Linha 2: Sala & Setor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Ambiente / Sala
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden font-medium"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.codigo} - {room.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Bloco & Setor Responsável
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${selectedRoom?.bloco || ''} — ${selectedRoom?.setor || ''}`}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 cursor-not-allowed outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Linha 3: Finalidade do Serviço */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Finalidade do Serviço (Norma SENAI)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['PREDITIVA', 'PREVENTIVA', 'CORRETIVA', 'MELHORIA'] as FinalidadeServico[]).map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFinalidade(f)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      finalidade === f
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 4: Prioridade */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Prioridade Estimada
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'] as Prioridade[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPrioridade(p)}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      prioridade === p
                        ? p === 'URGENTE'
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 5: Descrição do Serviço */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Descrição do Serviço Solicitado *
              </label>
              <textarea
                required
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Exemplo: Fiação exposta na bancada de tornos, ar-condicionado pingando água, lâmpada queimada..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>

            {/* Linha 6: Evidência Fotográfica (Câmera ou Arquivo) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Foto da Avaria (Câmera ou Galeria)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-red-600" />
                  <span>Tirar Foto / Carregar</span>
                </button>

                {fotoUrl && (
                  <div className="relative group">
                    <img
                      src={fotoUrl}
                      alt="Avaria"
                      className="w-14 h-14 object-cover rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setFotoUrl('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Gravando O.S....' : 'Emitir Ordem de Serviço'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
