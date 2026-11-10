# 📖 Manual de Implantação e Operação
## Sistema Integrado de Gestão de Manutenção Predial (SIG-Manu)
*SENAI Ourinhos — Norma Operacional FR.7.94-36*

---

## 1. Visão Geral da Arquitetura
O **SIG-Manu** é uma solução completa composta por:
1. **Frontend PWA (React 19 + Vite + Tailwind CSS + Lucide Icons):** Aplicação mobile-first para smartphones de professores/técnicos e visão rica em painel Kanban para a coordenação em desktops/tablets.
2. **Backend API (Node.js + Express + Nodemailer):** Micro-serviço transacional para envio de relatórios de conclusão de ordens de serviço por e-mail para a Direção e para o Solicitante.
3. **BaaS Firebase (Firestore, Auth, Storage):** Banco em tempo real via listeners `onSnapshot` e persistência em nuvem.

---

## 2. Pré-requisitos
* Node.js v18 ou superior instalado.
* Conexão à internet (ou operação em rede local com o fallback em tempo real integrado).

---

## 3. Como Executar o Projeto Localmente

### Opção A: Executar Frontend e Backend simultaneamente
Abra dois terminais na pasta do projeto:

**Terminal 1 — Iniciar Frontend:**
```bash
npm run dev:frontend
```
> O frontend estará acessível em: `http://localhost:5173`

**Terminal 2 — Iniciar Backend de Notificações:**
```bash
npm run dev:backend
```
> O backend estará acessível em: `http://localhost:3001`

---

## 4. Como Operar o Sistema no Dia a Dia

### Passo 1: Cadastro dos Ambientes e Impressão dos QR Codes
1. Acesse o sistema e selecione a aba **"Ambientes & QR Codes"**.
2. Clique no botão **"Imprimir Grade de Placas"** (ou use o atalho `Ctrl + P`).
3. O sistema gerará as placas formatadas com o logotipo oficial do SENAI, o nome da sala (ex: *Laboratório de Usinagem CNC*), o bloco e o QR Code.
4. Recorte e fixe as placas nas portas de cada ambiente escolar.

### Passo 2: Abertura do Chamado pelo Professor (Via Celular)
1. O professor aponta a câmera do celular para o QR Code da sala (ex: `SL-01`).
2. O sistema abre diretamente a tela de solicitação com o Local e Setor já preenchidos.
3. O professor seleciona a finalidade (*Corretiva, Preventiva, Preditiva ou Melhoria*), digita a descrição do defeito, anexa uma foto e clica em **"Emitir Ordem de Serviço"**.

### Passo 3: Gestão pelo Encarregado de Manutenção (Kanban CRM)
1. O chamado aparece **instantaneamente** na coluna **"Novo (Triagem)"** do Kanban.
2. O gestor clica no chamado, atribui um ou mais técnicos e define a data planejada.
3. Caso falte algum insumo (ex: lâmpada tubular, contator, dreno), o gestor ou técnico adiciona à aba **"Materiais & Peças"**, movendo o card para **"Aguardando Material"**.

### Passo 4: Execução pelo Técnico
1. O técnico assume o serviço, aponta o início dos trabalhos e realiza o conserto.
2. Ao finalizar, preenche o relato técnico na aba **"Apontamento de Execução"** e clica em **"Concluir Serviço & Enviar p/ Vistoria"**.

### Passo 5: Homologação e Disparo Automático de E-mails
1. O gestor vistoria a entrega, abre a aba **"Validação do Gestor"** e clica em **"Homologar & Notificar Stakeholders por E-mail"**.
2. O sistema registra o carimbo digital com o NIF do gestor e dispara automaticamente os e-mails formatados com o relatório oficial para:
   * O **Professor / Solicitante**.
   * A lista de e-mails da **Diretoria e Coordenação** cadastrada nas Configurações.

---

## 5. Configuração do Servidor SMTP para E-mails Reais
No arquivo `.env` da raiz, configure as variáveis de SMTP da sua instituição:

```ini
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="manutencao.ourinhos@sp.senai.br"
SMTP_PASS="sua-senha-de-app"
EMAIL_FROM="\"SENAI Manutenção Ourinhos\" <manutencao.ourinhos@sp.senai.br>"
```
*(Nota: Se nenhuma variável SMTP for fornecida, o sistema opera automaticamente em modo de desenvolvimento com visualização simulada dos envios nos logs da API).*

