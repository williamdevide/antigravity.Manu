import http from 'http';

// Teste de inicialização do servidor e das rotas
const testPayload = {
  ticketId: 'OS-2026-TEST',
  finalidade: 'CORRETIVA',
  tipoAtendimento: 'INTERNO',
  ambiente: {
    localNome: 'Laboratório CNC 01',
    bloco: 'Bloco A',
    setor: 'Mecânica'
  },
  solicitante: {
    nome: 'Prof. Teste SENAI',
    email: 'teste@sp.senai.br',
    nif: '99999'
  },
  descricao: 'Teste automatizado de emissão e homologação de O.S.',
  tecnicos: [{ nome: 'Roberto Silveira', nif: '33412' }],
  materiais: [{ descricao: 'Fusível 10A', quantidade: 2 }],
  execucao: {
    dataInicio: new Date().toISOString(),
    dataConclusao: new Date().toISOString(),
    relatoTecnico: 'Troca de fusível efetuada e circuito testado.'
  },
  avaliacao: {
    status: 'APROVADO',
    observacoes: 'Homologado no teste unitário.',
    validadoPor: {
      nome: 'Encarregado Teste',
      email: 'encarregado@sp.senai.br',
      nif: '11111',
      validadoEm: new Date().toISOString()
    }
  },
  destinatariosDirecao: ['direcao@sp.senai.br', 'coordenacao@sp.senai.br']
};

console.log('[Teste] Carga do teste preparada com sucesso.');

