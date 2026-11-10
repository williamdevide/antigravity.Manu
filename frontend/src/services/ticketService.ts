import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Ticket, 
  RoomEnvironment, 
  NotificationSettings, 
  MaterialItem,
  TicketStatus,
  UserProfile
} from '../types';

export const INITIAL_ROOMS: RoomEnvironment[] = [
  {
    id: 'sala-01-cnc',
    codigo: 'SL-01',
    nome: 'Laboratório de Usinagem CNC',
    bloco: 'Bloco A - Superior',
    setor: 'Mecânica de Precisão',
    tipo: 'Laboratório',
    ativo: true,
  },
  {
    id: 'oficina-mecanica',
    codigo: 'OF-MEC',
    nome: 'Oficina de Ajustagem Mecânica e Solda',
    bloco: 'Bloco A - Térreo',
    setor: 'Metalmecânica',
    tipo: 'Oficina',
    ativo: true,
  },
  {
    id: 'lab-eletrica',
    codigo: 'LB-ELET',
    nome: 'Laboratório de Eletroeletrônica e CLP',
    bloco: 'Bloco B - Térreo',
    setor: 'Eletroeletrônica',
    tipo: 'Laboratório',
    ativo: true,
  },
  {
    id: 'lab-informatica-1',
    codigo: 'LB-INFO-01',
    nome: 'Laboratório de Informática 01 (CAD/CAM)',
    bloco: 'Bloco B - 1º Andar',
    setor: 'Tecnologia da Informação',
    tipo: 'Laboratório',
    ativo: true,
  },
  {
    id: 'sala-professores',
    codigo: 'SL-PROF',
    nome: 'Sala dos Docentes e Coordenação',
    bloco: 'Bloco Administrativo',
    setor: 'Coordenação Pedagógica',
    tipo: 'Administrativo',
    ativo: true,
  },
  {
    id: 'auditorio-central',
    codigo: 'AUD-01',
    nome: 'Auditório Nobre SENAI Ourinhos',
    bloco: 'Bloco Central',
    setor: 'Eventos & Comunidade',
    tipo: 'Auditório',
    ativo: true,
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'OS-2026-0001',
    numeroOS: 'FR.7.94-36/001',
    tipoAtendimento: 'INTERNO',
    finalidade: 'CORRETIVA',
    prioridade: 'ALTA',
    status: 'novo',
    solicitante: {
      uid: 'prof_carlos',
      nome: 'Prof. Carlos Eduardo Santos',
      nif: '48912',
      email: 'carlos.santos@sp.senai.br',
    },
    ambiente: {
      localId: 'sala-01-cnc',
      localNome: 'Laboratório de Usinagem CNC',
      bloco: 'Bloco A - Superior',
      setor: 'Mecânica de Precisão',
    },
    descricao: 'Ar-condicionado 24.000 BTUs apresentando gotejamento de água sobre o Torno CNC 02 e ruído metálico na turbina do evaporador.',
    criadoEm: new Date(Date.now() - 3600000 * 4).toISOString(),
    atualizadoEm: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'OS-2026-0002',
    numeroOS: 'FR.7.94-36/002',
    tipoAtendimento: 'INTERNO',
    finalidade: 'PREVENTIVA',
    prioridade: 'MEDIA',
    status: 'planejado',
    solicitante: {
      uid: 'prof_marcos',
      nome: 'Prof. Marcos Alcantara',
      nif: '39011',
      email: 'marcos.alcantara@sp.senai.br',
    },
    ambiente: {
      localId: 'lab-eletrica',
      localNome: 'Laboratório de Eletroeletrônica e CLP',
      bloco: 'Bloco B - Térreo',
      setor: 'Eletroeletrônica',
    },
    descricao: 'Inspeção termográfica e reaperto de conexões dos disjuntores das bancadas de comando elétrico.',
    planejamento: {
      dataPlanejada: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      tempoEstimadoHoras: 3,
      atribuidoPor: 'João Paulo Ferreira (Encarregado)',
    },
    tecnicosDesignados: [
      { uid: 'tec_roberto', nome: 'Roberto Silveira', nif: '33412' }
    ],
    criadoEm: new Date(Date.now() - 3600000 * 10).toISOString(),
    atualizadoEm: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'OS-2026-0003',
    numeroOS: 'FR.7.94-36/003',
    tipoAtendimento: 'INTERNO',
    finalidade: 'CORRETIVA',
    prioridade: 'URGENTE',
    status: 'em_execucao',
    solicitante: {
      uid: 'prof_carlos',
      nome: 'Prof. Carlos Eduardo Santos',
      nif: '48912',
      email: 'carlos.santos@sp.senai.br',
    },
    ambiente: {
      localId: 'oficina-mecanica',
      localNome: 'Oficina de Ajustagem Mecânica e Solda',
      bloco: 'Bloco A - Térreo',
      setor: 'Metalmecânica',
    },
    descricao: 'Troca de luminárias LED na cabine de solda e reparo da tomada industrial trifásica de 380V com fuga de corrente.',
    planejamento: {
      dataPlanejada: new Date().toISOString().split('T')[0],
      tempoEstimadoHoras: 2,
      atribuidoPor: 'João Paulo Ferreira (Encarregado)',
    },
    tecnicosDesignados: [
      { uid: 'tec_roberto', nome: 'Roberto Silveira', nif: '33412' },
      { uid: 'tec_andre', nome: 'André Luiz Santos', nif: '55102' }
    ],
    materiais: [
      {
        id: 'mat_01',
        descricao: 'Lâmpada Tubular LED 18W 6500K T8',
        quantidade: 4,
        statusCompra: 'DISPONIVEL_ESTOQUE'
      },
      {
        id: 'mat_02',
        descricao: 'Plugue Fêmea Industrial 3P+T 32A 380V',
        quantidade: 1,
        statusCompra: 'COMPRADO'
      }
    ],
    execucao: {
      dataInicio: new Date(Date.now() - 3600000).toISOString(),
      relatoTecnico: 'Lâmpadas tubulares substituídas. Equipe trabalhando no isolamento da fiação da tomada 380V.',
    },
    criadoEm: new Date(Date.now() - 3600000 * 20).toISOString(),
    atualizadoEm: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const INITIAL_SETTINGS: NotificationSettings = {
  emailsDirecao: [
    'direcao.ourinhos@sp.senai.br',
    'coordenacao.ourinhos@sp.senai.br',
    'williamdevide@gmail.com'
  ],
  enviarAoFinalizar: true,
  notificarTecnicosNaAtribuicao: true,
};

// Canal Broadcast para sincronização multi-aba
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sigmanu_realtime') : null;

// Helpers de persistência local resiliente
function getLocalTickets(): Ticket[] {
  const data = localStorage.getItem('sigmanu_tickets');
  if (data) {
    try { return JSON.parse(data); } catch {}
  }
  localStorage.setItem('sigmanu_tickets', JSON.stringify(INITIAL_TICKETS));
  return INITIAL_TICKETS;
}

function saveLocalTickets(tickets: Ticket[]) {
  localStorage.setItem('sigmanu_tickets', JSON.stringify(tickets));
  channel?.postMessage({ type: 'TICKETS_UPDATED', tickets });
}

function getLocalRooms(): RoomEnvironment[] {
  const data = localStorage.getItem('sigmanu_rooms');
  if (data) {
    try { return JSON.parse(data); } catch {}
  }
  localStorage.setItem('sigmanu_rooms', JSON.stringify(INITIAL_ROOMS));
  return INITIAL_ROOMS;
}

function saveLocalRooms(rooms: RoomEnvironment[]) {
  localStorage.setItem('sigmanu_rooms', JSON.stringify(rooms));
  channel?.postMessage({ type: 'ROOMS_UPDATED', rooms });
}

export const TicketService = {
  // Semeia dados iniciais no Firestore caso a coleção esteja vazia
  async seedInitialDataIfEmpty() {
    try {
      const roomsSnapshot = await getDocs(collection(db, 'rooms'));
      if (roomsSnapshot.empty) {
        console.log('[TicketService] Semeando ambientes padrão no Firestore...');
        for (const room of INITIAL_ROOMS) {
          await setDoc(doc(db, 'rooms', room.id), room);
        }
      }

      const ticketsSnapshot = await getDocs(collection(db, 'tickets'));
      if (ticketsSnapshot.empty) {
        console.log('[TicketService] Semeando chamados padrão no Firestore...');
        for (const t of INITIAL_TICKETS) {
          await setDoc(doc(db, 'tickets', t.id), t);
        }
      }
    } catch (err: any) {
      console.warn('[TicketService] Conexão Firestore em modo offline/cache:', err.message);
    }
  },

  // Escuta em tempo real dos chamados (Firestore onSnapshot + Fallback Local)
  subscribeTickets(callback: (tickets: Ticket[]) => void): () => void {
    let unsubscribeFirestore: (() => void) | null = null;

    try {
      const q = query(collection(db, 'tickets'), orderBy('criadoEm', 'desc'));
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Ticket[] = [];
            snapshot.forEach((d) => list.push(d.data() as Ticket));
            callback(list);
            saveLocalTickets(list);
          } else {
            // Se o Firestore estiver vazio, dispara o seed e usa os locais
            this.seedInitialDataIfEmpty();
            callback(getLocalTickets());
          }
        },
        (error) => {
          console.warn('[TicketService] Firestore offline ou restrito. Usando sincronização local real-time:', error.message);
          callback(getLocalTickets());
        }
      );
    } catch {
      callback(getLocalTickets());
    }

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TICKETS_UPDATED') {
        callback(event.data.tickets);
      }
    };

    channel?.addEventListener('message', onMessage);

    return () => {
      unsubscribeFirestore?.();
      channel?.removeEventListener('message', onMessage);
    };
  },

  // Criar novo chamado
  async createTicket(ticketData: Omit<Ticket, 'id' | 'numeroOS' | 'criadoEm' | 'atualizadoEm' | 'status'>): Promise<Ticket> {
    const localTickets = getLocalTickets();
    const count = localTickets.length + 1;
    const ticketId = `OS-2026-${String(count).padStart(4, '0')}`;
    const agora = new Date().toISOString();

    const novoTicket: Ticket = {
      ...ticketData,
      id: ticketId,
      numeroOS: `FR.7.94-36/${String(count).padStart(3, '0')}`,
      status: 'novo',
      criadoEm: agora,
      atualizadoEm: agora,
    };

    localTickets.unshift(novoTicket);
    saveLocalTickets(localTickets);

    try {
      await setDoc(doc(db, 'tickets', ticketId), novoTicket);
    } catch (e) {
      console.warn('[TicketService] Erro ao salvar ticket no Firestore, mantido em cache local:', e);
    }

    return novoTicket;
  },

  // Mover status no Kanban
  async updateTicketStatus(ticketId: string, status: TicketStatus, user?: UserProfile) {
    const tickets = getLocalTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    tickets[index].status = status;
    tickets[index].atualizadoEm = new Date().toISOString();

    if (status === 'em_execucao' && !tickets[index].execucao?.dataInicio) {
      tickets[index].execucao = {
        ...tickets[index].execucao,
        dataInicio: new Date().toISOString(),
        relatoTecnico: tickets[index].execucao?.relatoTecnico || '',
      };
    }

    saveLocalTickets(tickets);

    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status,
        atualizadoEm: tickets[index].atualizadoEm,
        ...(tickets[index].execucao ? { execucao: tickets[index].execucao } : {}),
      });
    } catch {}
  },

  // Atribuir responsáveis (múltiplos colaboradores)
  async assignTechnicians(ticketId: string, tecnicos: Array<{ uid: string; nome: string; nif?: string }>, gestorNome: string) {
    const tickets = getLocalTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    tickets[index].tecnicosDesignados = tecnicos;
    tickets[index].planejamento = {
      ...tickets[index].planejamento,
      atribuidoPor: gestorNome,
    };
    if (tickets[index].status === 'novo') {
      tickets[index].status = 'planejado';
    }
    tickets[index].atualizadoEm = new Date().toISOString();

    saveLocalTickets(tickets);

    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        tecnicosDesignados: tecnicos,
        planejamento: tickets[index].planejamento,
        status: tickets[index].status,
        atualizadoEm: tickets[index].atualizadoEm,
      });
    } catch {}
  },

  // Adicionar item de material
  async addMaterial(ticketId: string, item: Omit<MaterialItem, 'id'>) {
    const tickets = getLocalTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    const novoItem: MaterialItem = {
      ...item,
      id: `mat_${Date.now()}`,
    };

    const lista = tickets[index].materiais || [];
    lista.push(novoItem);
    tickets[index].materiais = lista;
    tickets[index].atualizadoEm = new Date().toISOString();

    saveLocalTickets(tickets);

    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        materiais: lista,
        atualizadoEm: tickets[index].atualizadoEm,
      });
    } catch {}
  },

  // Concluir execução pelo técnico
  async completeExecution(ticketId: string, relato: string, fotosConclusao: string[] = []) {
    const tickets = getLocalTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    tickets[index].status = 'concluido';
    tickets[index].execucao = {
      ...tickets[index].execucao,
      dataConclusao: new Date().toISOString(),
      relatoTecnico: relato,
      fotosConclusao,
    };
    tickets[index].atualizadoEm = new Date().toISOString();

    saveLocalTickets(tickets);

    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: 'concluido',
        execucao: tickets[index].execucao,
        atualizadoEm: tickets[index].atualizadoEm,
      });
    } catch {}
  },

  // Validação por 1-Clique pelo Gestor + Disparo de Notificações
  async validateTicket(
    ticketId: string, 
    statusAvaliacao: 'APROVADO' | 'PENDENCIAS' | 'REPROVADO', 
    observacoes: string, 
    gestor: UserProfile
  ) {
    const tickets = getLocalTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    const novoStatus: TicketStatus = statusAvaliacao === 'APROVADO' ? 'finalizado' : 'reprovado';
    const agora = new Date().toISOString();

    tickets[index].status = novoStatus;
    tickets[index].avaliacao = {
      status: statusAvaliacao,
      observacoes,
      validadoPor: {
        uid: gestor.uid,
        nome: gestor.nome,
        nif: gestor.nif,
        email: gestor.email,
        validadoEm: agora,
      },
    };
    tickets[index].atualizadoEm = agora;

    saveLocalTickets(tickets);

    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: novoStatus,
        avaliacao: tickets[index].avaliacao,
        atualizadoEm: agora,
      });
    } catch {}

    // Disparo assíncrono para a API de e-mail no backend
    if (statusAvaliacao === 'APROVADO') {
      const settings = this.getSettings();
      this.notifyBackendCompletion({
        ...tickets[index],
        notificacao: {
          emailEnviadoSolicitante: true,
          emailEnviadoDirecao: true,
          enviadoEm: agora,
        }
      }, settings.emailsDirecao);
    }
  },

  // Chamada à API backend de e-mails
  async notifyBackendCompletion(ticket: Ticket, emailsDirecao: string[]) {
    try {
      const backendUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? '/api/notify/ticket-completed'
        : 'http://localhost:3001/api/notify/ticket-completed';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticket.id,
          finalidade: ticket.finalidade,
          tipoAtendimento: ticket.tipoAtendimento,
          ambiente: ticket.ambiente,
          solicitante: ticket.solicitante,
          descricao: ticket.descricao,
          tecnicos: ticket.tecnicosDesignados || [],
          materiais: ticket.materiais || [],
          execucao: ticket.execucao || { relatoTecnico: 'Concluído' },
          avaliacao: ticket.avaliacao,
          destinatariosDirecao: emailsDirecao,
        }),
      });
      return await response.json();
    } catch (e) {
      console.warn('[TicketService] Backend de notificação offline ou inacessível no momento:', e);
      return { success: false, offline: true };
    }
  },

  // Gestão de Ambientes
  subscribeRooms(callback: (rooms: RoomEnvironment[]) => void): () => void {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
        if (!snapshot.empty) {
          const list: RoomEnvironment[] = [];
          snapshot.forEach((d) => list.push(d.data() as RoomEnvironment));
          callback(list);
          saveLocalRooms(list);
        } else {
          this.seedInitialDataIfEmpty();
          callback(getLocalRooms());
        }
      }, () => callback(getLocalRooms()));
    } catch {
      callback(getLocalRooms());
    }

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ROOMS_UPDATED') {
        callback(event.data.rooms);
      }
    };
    channel?.addEventListener('message', onMessage);

    return () => {
      unsubscribe?.();
      channel?.removeEventListener('message', onMessage);
    };
  },

  async createRoom(room: Omit<RoomEnvironment, 'id' | 'criadoEm'>): Promise<RoomEnvironment> {
    const rooms = getLocalRooms();
    const id = room.nome.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Math.floor(Math.random() * 1000);
    const novo: RoomEnvironment = {
      ...room,
      id,
      criadoEm: new Date().toISOString(),
    };
    rooms.push(novo);
    saveLocalRooms(rooms);

    try {
      await setDoc(doc(db, 'rooms', id), novo);
    } catch {}

    return novo;
  },

  getSettings(): NotificationSettings {
    const data = localStorage.getItem('sigmanu_settings');
    if (data) {
      try { return JSON.parse(data); } catch {}
    }
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: NotificationSettings) {
    localStorage.setItem('sigmanu_settings', JSON.stringify(settings));
  }
};
