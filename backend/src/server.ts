import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { MailService } from './services/mailService.js';

// Carrega .env da raiz do projeto ou local
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mailService = new MailService();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'SIG-Manu Backend Notification Engine',
    timestamp: new Date().toISOString(),
    allowedAdmin: process.env.ALLOWED_ADMIN_EMAIL || null,
  });
});

// Disparo de notificação quando o chamado é concluído e aprovado pelo gestor
app.post('/api/notify/ticket-completed', async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    if (!payload.ticketId || !payload.avaliacao || !payload.solicitante) {
      return res.status(400).json({
        error: 'Carga incompleta. ticketId, avaliacao e solicitante são obrigatórios.',
      });
    }

    const resultado = await mailService.sendCompletionNotification(payload);

    return res.status(200).json({
      success: true,
      message: 'Processamento de e-mails concluído.',
      detalhes: resultado,
    });
  } catch (error: any) {
    console.error('Erro ao processar notificação de e-mail:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno no servidor de envio.',
    });
  }
});

app.listen(port, () => {
  console.log(`[SIG-Manu Backend] Servidor rodando na porta ${port}`);
});

