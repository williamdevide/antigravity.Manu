export type UserRole = 'solicitante' | 'tecnico' | 'gestor';

export type TicketStatus = 
  | 'novo' 
  | 'planejado' 
  | 'em_execucao' 
  | 'aguardando_material' 
  | 'concluido' 
  | 'finalizado' 
  | 'reprovado';

export type TipoAtendimento = 'INTERNO' | 'EXTERNO';

export type FinalidadeServico = 'PREDITIVA' | 'PREVENTIVA' | 'CORRETIVA' | 'MELHORIA';

export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type StatusMaterial = 'SOLICITADO' | 'EM_COTACAO' | 'COMPRADO' | 'DISPONIVEL_ESTOQUE';

export interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  nif: string;
  role: UserRole;
  setor?: string;
  avatarUrl?: string;
}

export interface RoomEnvironment {
  id: string;
  codigo: string;
  nome: string;
  bloco: string;
  setor: string;
  tipo: string;
  qrCodeUrl?: string;
  ativo: boolean;
  criadoEm?: string;
}

export interface MaterialItem {
  id: string;
  descricao: string;
  quantidade: number;
  statusCompra: StatusMaterial;
  observacao?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  autor: {
    uid: string;
    nome: string;
    role: UserRole;
  };
  conteudo: string;
  anexos?: string[];
  criadoEm: string;
}

export interface Ticket {
  id: string;
  numeroOS: string;
  tipoAtendimento: TipoAtendimento;
  finalidade: FinalidadeServico;
  prioridade: Prioridade;
  status: TicketStatus;
  
  // Solicitante
  solicitante: {
    uid: string;
    nome: string;
    nif: string;
    email: string;
  };
  
  // Localização
  ambiente: {
    localId: string;
    localNome: string;
    bloco: string;
    setor: string;
  };
  
  // Detalhes do Pedido
  descricao: string;
  fotosAvaria?: string[];
  
  // Gestão / Planejamento
  planejamento?: {
    dataPlanejada?: string;
    tempoEstimadoHoras?: number;
    atribuidoPor?: string;
  };
  
  // Técnicos alocados (suporte a múltiplos)
  tecnicosDesignados?: Array<{
    uid: string;
    nome: string;
    nif?: string;
  }>;
  
  // Materiais necessários
  materiais?: MaterialItem[];
  
  // Execução
  execucao?: {
    dataInicio?: string;
    dataConclusao?: string;
    relatoTecnico?: string;
    fotosConclusao?: string[];
  };
  
  // Avaliação e Validação do Gestor
  avaliacao?: {
    status: 'APROVADO' | 'PENDENCIAS' | 'REPROVADO';
    observacoes?: string;
    validadoPor: {
      uid: string;
      nome: string;
      nif: string;
      email: string;
      validadoEm: string;
    };
  };
  
  // Notificações
  notificacao?: {
    emailEnviadoSolicitante: boolean;
    emailEnviadoDirecao: boolean;
    enviadoEm?: string;
  };
  
  criadoEm: string;
  atualizadoEm: string;
}

export interface NotificationSettings {
  emailsDirecao: string[];
  enviarAoFinalizar: boolean;
  notificarTecnicosNaAtribuicao: boolean;
}

