<div align="center">

# 🏢 SIG-Manu | Smart Facility Maintenance Platform
### Sistema Inteligente de Gestão de Manutenção Predial e Patrimonial

[![Developed with Google Antigravity](https://img.shields.io/badge/Developed%20with-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google)
[![SENAI Ourinhos](https://img.shields.io/badge/SENAI-Ourinhos%20SP-ED1C24?style=for-the-badge)](https://ourinhos.sp.senai.br/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20API-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[🇧🇷 Português](#-sobre-o-projeto) | [🇺🇸 English](#-about-the-project)

---
</div>

## 🇧🇷 Sobre o Projeto

O **SIG-Manu** é uma plataforma corporativa multi-ambiente para controle, rastreamento e governança de chamados de manutenção predial e patrimonial. Concebido a partir da norma e formulário físico oficial **FR.7.94-36** da Escola SENAI de Ourinhos, o sistema foi desenhado com arquitetura genérica e escalável para atender escolas, indústrias, condomínios e complexos de saúde.

### 🌟 Principais Recursos
* 📲 **Acionamento por QR Code por Ambiente:** Cada sala, laboratório ou oficina possui uma etiqueta com QR Code. O professor ou colaborador escaneia pelo smartphone e acessa o formulário de abertura já com o local e setor pré-selecionados.
* 📋 **Fidelidade à Ficha Normativa SENAI:** Registro de tipo de atendimento (Interno/Externo), finalidade (Preditiva, Preventiva, Corretiva, Melhoria), identificação por NIF e anexo de fotos da avaria.
* 📊 **Painel CRM / Kanban em Tempo Real:** Gestão de ordens de serviço similar a plataformas como Monday.com e Jira, com sincronização instantânea via Cloud Firestore (`onSnapshot`).
* 👥 **Atribuição Multi-Colaborador:** Alocação de um ou mais técnicos por ordem de serviço com apontamento de horas de início e término.
* 📦 **Gestão de Materiais e Suprimentos:** Solicitação e controle de peças a comprar vinculadas à ordem de serviço.
* 💬 **Chat Interno da O.S.:** Histórico de mensagens e esclarecimentos técnicos entre equipe de manutenção e liderança.
* ⚡ **Homologação por 1-Clique & Notificação:** Validação técnica do gestor com assinatura/credencial digital e disparo automático de e-mail informativo para a Direção e para o Solicitante.
* 🌓 **Temas Claro e Escuro (Dark/Light Mode):** Interface responsiva mobile-first com transição dinâmica de paleta visual.

---

## 🇺🇸 About the Project

**SIG-Manu** is an enterprise-grade, multi-environment platform for managing, tracking, and auditing building and facility maintenance service requests. Designed based on the official **FR.7.94-36** maintenance standard from SENAI Ourinhos, the platform features a generic, multi-tenant architecture adaptable to educational campuses, industrial plants, corporate complexes, and healthcare facilities.

### 🌟 Key Features
* 📲 **Room-Specific QR Code Trigger:** Every classroom, laboratory, or workshop features a physical QR Code. Staff scans it to instantly open a pre-populated ticket submission form.
* 📋 **Compliance with SENAI Standard:** Full capture of service type (Internal/External), purpose (Predictive, Preventive, Corrective, Improvement), NIF ID, and defect photo attachments.
* 📊 **Real-Time Kanban & CRM Management:** Monday.com-style workflow management powered by Cloud Firestore real-time listeners (`onSnapshot`).
* 👥 **Multi-Assignee Support:** Allocate multiple technicians per maintenance order with start/end time tracking.
* 📦 **Procurement & Materials Management:** Requisition and status tracking for spare parts and supplies needed for each order.
* ⚡ **1-Click Manager Approval & Automated Alerts:** Quick managerial sign-off with audit logging and immediate email dispatch to School Management and the Ticket Author.
* 🌓 **Dark & Light Mode:** Responsive mobile-first interface optimized for both on-field smartphones and management desktop dashboards.

---

## 🤖 Google Antigravity AI Engine & Agent Stack

Este projeto foi concebido e arquitetado utilizando a suíte avançada de agentes autônomos do **Google Antigravity**:

| Componente / Agente | Função no Projeto |
| :--- | :--- |
| **`agente-orquestrador`** | Roteamento estratégico na Arquitetura de 3 Camadas, manutenção do `promptHistory.md` e autorrecuperação. |
| **`firebase-firestore`** | Modelagem de dados NoSQL, regras de segurança granulares e consultas em tempo real. |
| **`firebase-auth-basics`** | Implementação de autenticação segura e RBAC (Solicitante, Técnico, Gestor). |
| **`modern-web-guidance`** | Práticas modernas de frontend em React 19, Tailwind CSS e acessibilidade WCAG. |

---

## 📁 Estrutura do Repositório / Project Structure

```text
├── .env                                # Variáveis de ambiente e chaves Firebase
├── README.md                           # Apresentação do projeto (Bilíngue)
├── /documentation                      # Especificações, requisitos e histórico
│   ├── promptHistory.md                # Registro integral de todos os prompts
│   ├── arquitetura_projeto.md          # Arquitetura técnica e diagramas
│   └── PROJETO_ENGENHARIA_SISTEMA_MANUTENCAO.md # Especificação executiva
├── /frontend                           # Aplicação React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/                 # Kanban, Forms, QR Scanner, Modal
│   │   ├── contexts/                   # Auth, Theme (Dark/Light), Realtime
│   │   ├── services/                   # Firebase Auth, Firestore, Storage
│   │   └── types/                      # Interfaces TypeScript
└── /backend                            # API Node.js / Express
    ├── src/
    │   ├── routes/                     # Rotas de e-mail e QR Code batch
    │   ├── services/                   # Nodemailer & Templates de e-mail
    │   └── server.ts
```

---

## 🚀 Como Executar / Getting Started

### Pré-requisitos
* Node.js 18+ instalado
* Conta no Firebase com Firestore e Auth habilitados

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/sig-manu.git
cd sig-manu

# 2. Instalar dependências do Frontend
cd frontend
npm install
npm run dev

# 3. Instalar dependências do Backend (Notificações)
cd ../backend
npm install
npm run dev
```

---

<div align="center">
  <sub>Desenvolvido com excelência técnica para o <b>SENAI Ourinhos</b> e a comunidade aberta.</sub><br>
  <sub><b>Google Antigravity Expert Edition</b></sub>
</div>

