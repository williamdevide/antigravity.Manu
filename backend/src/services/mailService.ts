import nodemailer from 'nodemailer';

export interface TicketNotificationPayload {
  ticketId: string;
  finalidade: string;
  tipoAtendimento: string;
  ambiente: {
    localNome: string;
    bloco: string;
    setor: string;
  };
  solicitante: {
    nome: string;
    email: string;
    nif: string;
  };
  descricao: string;
  tecnicos: Array<{ nome: string; nif?: string }>;
  materiais?: Array<{ descricao: string; quantidade: number }>;
  execucao: {
    dataInicio?: string;
    dataConclusao?: string;
    relatoTecnico: string;
  };
  avaliacao: {
    status: string;
    observacoes: string;
    validadoPor: {
      nome: string;
      email: string;
      nif: string;
      validadoEm: string;
    };
  };
  destinatariosDirecao: string[];
}

export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevMode: boolean = false;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      console.log(`[MailService] Conectado ao servidor SMTP: ${host}:${port}`);
    } else {
      this.isDevMode = true;
      console.log('[MailService] Modo de Desenvolvimento Ativo (Preview em Console habilitado). Configure SMTP_HOST, SMTP_USER e SMTP_PASS no .env para envio real.');
    }
  }

  private buildHtmlTemplate(payload: TicketNotificationPayload, paraDirecao: boolean): string {
    const dataConclusao = payload.execucao.dataConclusao
      ? new Date(payload.execucao.dataConclusao).toLocaleString('pt-BR')
      : new Date().toLocaleString('pt-BR');

    const listaTecnicos = payload.tecnicos.map((t) => t.nome).join(', ') || 'Equipe Geral';
    const listaMateriais = payload.materiais && payload.materiais.length > 0
      ? payload.materiais.map((m) => `<li>${m.quantidade}x ${m.descricao}</li>`).join('')
      : '<li>Nenhum material adicional requisitado</li>';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #172b4d; }
        .card { background-color: #ffffff; max-width: 650px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background-color: #e02424; padding: 24px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 28px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; background-color: #def7ec; color: #03543f; text-transform: uppercase; }
        .section-title { font-size: 15px; font-weight: 700; color: #1f2937; margin: 20px 0 10px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; }
        .field { margin-bottom: 8px; }
        .field strong { color: #4b5563; }
        .alert-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin: 16px 0; font-size: 14px; }
        .footer { background-color: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>SENAI Ourinhos — Gestão de Manutenção</h1>
          <p>Notificação Oficial de Conclusão de Ordem de Serviço</p>
        </div>
        <div class="content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-size: 18px; font-weight: 700; color: #111827;">O.S. #${payload.ticketId}</span>
            <span class="badge">${payload.avaliacao.status}</span>
          </div>

          <p style="font-size: 14px; line-height: 1.5;">
            ${paraDirecao
              ? 'Prezada <strong>Diretoria e Coordenação</strong>, informamos que a seguinte solicitação de manutenção predial foi concluída e homologada pelo encarregado do setor.'
              : `Prezado(a) <strong>${payload.solicitante.nome}</strong>, sua solicitação de manutenção foi devidamente concluída e aprovada.`
            }
          </p>

          <div class="section-title">📍 Localização e Classificação</div>
          <div class="field-grid">
            <div class="field"><strong>Ambiente:</strong> ${payload.ambiente.localNome}</div>
            <div class="field"><strong>Bloco / Setor:</strong> ${payload.ambiente.bloco} - ${payload.ambiente.setor}</div>
            <div class="field"><strong>Finalidade:</strong> ${payload.finalidade}</div>
            <div class="field"><strong>Tipo de Atendimento:</strong> ${payload.tipoAtendimento}</div>
          </div>

          <div class="section-title">📝 Descrição Original do Solicitante</div>
          <div class="alert-box">
            "${payload.descricao}"
            <div style="margin-top: 6px; font-size: 12px; color: #64748b;">
              Solicitado por: ${payload.solicitante.nome} (NIF: ${payload.solicitante.nif})
            </div>
          </div>

          <div class="section-title">🔧 Execução Técnica</div>
          <div class="field-grid">
            <div class="field"><strong>Técnicos Designados:</strong> ${listaTecnicos}</div>
            <div class="field"><strong>Concluído em:</strong> ${dataConclusao}</div>
          </div>
          <div class="alert-box" style="border-left-color: #10b981;">
            <strong>Relato da Manutenção:</strong><br/>
            ${payload.execucao.relatoTecnico || 'Serviço executado conforme padrão normativo.'}
          </div>

          <div class="section-title">📦 Materiais Utilizados</div>
          <ul style="font-size: 13px; color: #374151; padding-left: 20px;">
            ${listaMateriais}
          </ul>

          <div class="section-title">✅ Parecer da Liderança / Validação</div>
          <div class="field"><strong>Homologado por:</strong> ${payload.avaliacao.validadoPor.nome} (NIF: ${payload.avaliacao.validadoPor.nif})</div>
          <div class="field"><strong>Observações:</strong> ${payload.avaliacao.observacoes || 'Sem ressalvas.'}</div>
        </div>
        <div class="footer">
          Sistema SIG-Manu • Escola SENAI Ourinhos (Norma FR.7.94-36)<br/>
          Desenvolvido com o ecossistema Google Antigravity
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async sendCompletionNotification(payload: TicketNotificationPayload) {
    const results = {
      solicitanteEnviado: false,
      direcaoEnviada: false,
      erros: [] as string[],
      previewLogs: [] as string[],
    };

    const listaDirecao = payload.destinatariosDirecao.filter((e) => e && e.includes('@'));

    // Se estiver em modo dev (sem SMTP configurado), simula o envio com sucesso e registra logs
    if (this.isDevMode || !this.transporter) {
      console.log(`[SIMULAÇÃO E-MAIL] O.S. #${payload.ticketId} homologada com sucesso!`);
      console.log(` -> Para Solicitante: ${payload.solicitante.email} (${payload.solicitante.nome})`);
      console.log(` -> Para Direção (${listaDirecao.length} destinatários): ${listaDirecao.join(', ')}`);
      
      results.solicitanteEnviado = true;
      results.direcaoEnviada = listaDirecao.length > 0;
      results.previewLogs.push(`Simulação: e-mail registrado para ${payload.solicitante.email} e ${listaDirecao.length} membros da direção.`);
      return results;
    }

    // 1. Notificar o Solicitante via SMTP
    if (payload.solicitante.email) {
      try {
        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || '"SENAI Manutenção" <manutencao.ourinhos@sp.senai.br>',
          to: payload.solicitante.email,
          subject: `[SIG-Manu] Sua Solicitação #${payload.ticketId} foi Concluída e Aprovada`,
          html: this.buildHtmlTemplate(payload, false),
        });
        results.solicitanteEnviado = true;
      } catch (err: any) {
        results.erros.push(`Falha no envio ao solicitante: ${err.message}`);
      }
    }

    // 2. Notificar a Direção via SMTP
    if (listaDirecao.length > 0) {
      try {
        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || '"SIG-Manu Notificações" <manutencao.ourinhos@sp.senai.br>',
          to: listaDirecao.join(', '),
          subject: `[Relatório de Conclusão] O.S. #${payload.ticketId} - ${payload.ambiente.localNome}`,
          html: this.buildHtmlTemplate(payload, true),
        });
        results.direcaoEnviada = true;
      } catch (err: any) {
        results.erros.push(`Falha no envio à direção: ${err.message}`);
      }
    }

    return results;
  }
}
