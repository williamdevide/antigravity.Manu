import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Building, 
  Plus, 
  Printer, 
  MapPin, 
  ExternalLink, 
  QrCode, 
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { RoomEnvironment } from '../types';
import { TicketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';

interface RoomQRManagerProps {
  rooms: RoomEnvironment[];
  onOpenTicketForRoom: (roomId: string) => void;
  onRoomCreated?: () => void;
}

export const RoomQRManager: React.FC<RoomQRManagerProps> = ({
  rooms,
  onOpenTicketForRoom,
  onRoomCreated,
}) => {
  const { isAdmin } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [novoCodigo, setNovoCodigo] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoBloco, setNovoBloco] = useState('Bloco A');
  const [novoSetor, setNovoSetor] = useState('Metalmecânica');
  const [novoTipo, setNovoTipo] = useState('Laboratório');
  const [previewRoom, setPreviewRoom] = useState<RoomEnvironment | null>(null);

  const getQRUrl = (roomId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sigmanu.senai.br';
    return `${origin}/?localId=${roomId}`;
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoCodigo.trim()) return;

    await TicketService.createRoom({
      codigo: novoCodigo,
      nome: novoNome,
      bloco: novoBloco,
      setor: novoSetor,
      tipo: novoTipo,
      ativo: true,
    });

    setNovoCodigo('');
    setNovoNome('');
    setShowAddForm(false);
    onRoomCreated?.();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Topo com ações */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Gestão de Ambientes & Etiquetas com QR Code
            </h2>
            <span className="text-xs bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">
              {rooms.length} Salas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Gere etiquetas físicas para fixação nas salas de aula, oficinas e laboratórios do SENAI Ourinhos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimir Grade de Placas</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Fechar Cadastro' : 'Novo Ambiente'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Formulário de Criação de Ambiente */}
      {showAddForm && (
        <form onSubmit={handleCreateRoom} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-red-200 dark:border-red-900/50 space-y-4 animate-in fade-in">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-red-600" />
            Cadastrar Novo Ambiente / Sala
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Código da Sala (ex: SL-03, OF-MEC)
              </label>
              <input
                type="text"
                required
                value={novoCodigo}
                onChange={(e) => setNovoCodigo(e.target.value)}
                placeholder="SL-02"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Nome Completo do Ambiente
              </label>
              <input
                type="text"
                required
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Laboratório de Metrologia e Qualidade"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Bloco / Pavimento
              </label>
              <input
                type="text"
                value={novoBloco}
                onChange={(e) => setNovoBloco(e.target.value)}
                placeholder="Bloco B - Térreo"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Setor / Área Técnica
              </label>
              <input
                type="text"
                value={novoSetor}
                onChange={(e) => setNovoSetor(e.target.value)}
                placeholder="Eletroeletrônica"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Tipo do Ambiente
              </label>
              <select
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              >
                <option value="Laboratório">Laboratório</option>
                <option value="Oficina">Oficina</option>
                <option value="Sala de Aula">Sala de Aula</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Área Comum">Área Comum</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs"
            >
              Salvar Ambiente
            </button>
          </div>
        </form>
      )}

      {/* Grade de Ambientes e Placas QR Code */}
      <div id="print-area" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const qrUrl = getQRUrl(room.id);

          return (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between print:border-2 print:border-black print:rounded-none print:shadow-none print:break-inside-avoid"
            >
              <div>
                {/* Plaqueta SENAI */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm bg-red-600 text-white px-2 py-0.5 rounded print:text-black print:bg-transparent">
                      SENAI
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Ourinhos 7.94
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    {room.codigo}
                  </span>
                </div>

                {/* QR Code Centralizado */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 print:bg-transparent">
                  <QRCodeSVG
                    value={qrUrl}
                    size={140}
                    level="H"
                    includeMargin={true}
                    className="rounded-lg shadow-2xs print:shadow-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">
                    Aponte a câmera para abrir O.S.
                  </span>
                </div>

                {/* Detalhes do Ambiente */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {room.nome}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{room.bloco} • {room.setor}</span>
                  </div>
                </div>
              </div>

              {/* Ações da Placa (ocultas na impressão) */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
                <button
                  onClick={() => onOpenTicketForRoom(room.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Testar Abertura</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  {room.tipo}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

