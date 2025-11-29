# 🔐 Guia de Autenticação e Agendamento

## 📋 Novos Recursos Implementados

### 1. Sistema de Autenticação
✅ Login com JWT (JSON Web Tokens)
✅ Controle de acesso por roles (admin, atendente, visualizador)
✅ Proteção de rotas da API
✅ Sistema de bloqueio após tentativas falhas
✅ Alteração de senha

### 2. Agendamento de Mensagens
✅ Mensagens únicas agendadas
✅ Mensagens recorrentes (diária, semanal, mensal)
✅ Cancelamento de agendamentos
✅ Estatísticas de agendamentos
✅ Processamento automático a cada minuto
✅ Retry automático em caso de falha

## 🚀 Instalação Rápida

### 1. Instalar novas dependências

```bash
npm install
```

As novas dependências incluem:
- `jsonwebtoken` - Autenticação JWT
- `bcryptjs` - Hash de senhas
- `node-cron` - Agendamento de tarefas

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

**IMPORTANTE**: Altere o `JWT_SECRET` em produção!

### 3. Criar estrutura de arquivos

Certifique-se de ter todos os arquivos:

```
bot-whatsapp-completo/
├── auth.js                 # Sistema de autenticação
├── scheduler.js            # Sistema de agendamento
├── database.js             # Banco de dados
├── bot-v2.js              # Bot principal
├── server.js              # Servidor web (atualizado)
├── start-all.js           # Inicializador
├── package.json           # Dependências (atualizado)
├── .env                   # Variáveis de ambiente
└── public/
    ├── index.html         # Dashboard (atualizado)
    └── login.html         # Página de login (novo)
```

### 4. Iniciar o sistema

```bash
# Opção 1: Tudo junto
node start-all.js

# Opção 2: Separado
# Terminal 1:
npm start

# Terminal 2:
npm run dashboard
```

## 🔐 Sistema de Autenticação

### Credenciais Padrão

Ao iniciar pela primeira vez, um usuário admin é criado automaticamente:

```
Email: admin@bot.com
Senha: admin123
```

**⚠️ IMPORTANTE: Altere a senha imediatamente após o primeiro login!**

### Fluxo de Login

1. Acesse `http://localhost:3000`
2. Você será redirecionado para `/login`
3. Digite email e senha
4. Token JWT é gerado e armazenado no localStorage
5. Redirecionamento para dashboard

### Roles (Permissões)

#### Admin
- Acesso total ao sistema
- Criar/editar usuários
- Alterar configurações
- Cancelar agendamentos
- Ver todos os dados

#### Atendente
- Ver contatos e mensagens
- Criar agendamentos
- Cancelar próprios agendamentos
- Ver estatísticas básicas

#### Visualizador
- Apenas visualizar dados
- Sem permissão para modificar

### Gerenciar Usuários

**Criar novo usuário (apenas admin):**

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@empresa.com",
    "senha": "senha123",
    "role": "atendente"
  }'
```

**Alterar senha:**

No dashboard: Menu do usuário > Alterar Senha

Ou via API:
```bash
curl -X POST http://localhost:3000/api/usuarios/senha \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "senhaAtual": "senha-antiga",
    "novaSenha": "senha-nova"
  }'
```

### Segurança

✅ Senhas com hash bcrypt (10 rounds)
✅ Tokens JWT com expiração de 24h
✅ Bloqueio após 5 tentativas de login (15 min)
✅ Proteção contra ataques de força bruta
✅ Validação de token em todas requisições

## 📅 Sistema de Agendamento

### Tipos de Agendamento

#### 1. Mensagem Única

Envia uma vez na data/hora especificada.

**Exemplo:**
- Enviar "Feliz Aniversário!" dia 15/12/2024 às 09:00

**Como usar:**
1. Dashboard > Agendamentos > + Nova Mensagem
2. Selecione "Mensagem Única"
3. Escolha contato, mensagem e data/hora
4. Clique em "Agendar"

#### 2. Mensagem Recorrente

Envia automaticamente em intervalos regulares.

**Frequências disponíveis:**

##### Diária
Envia todos os dias no horário especificado.
- Exemplo: Lembrete diário às 08:00

##### Semanal
Envia nos dias da semana selecionados.
- Exemplo: Toda segunda e quarta às 14:00

##### Mensal
Envia no dia do mês especificado.
- Exemplo: Todo dia 1 às 09:00

### Variáveis nas Mensagens

Use variáveis dinâmicas nas mensagens:

```
Olá {nome}!

Hoje é {data} e são {hora}.

Lembrete importante para você!
```

Variáveis disponíveis:
- `{nome}` - Nome do contato
- `{data}` - Data atual
- `{hora}` - Hora atual

### Via API

**Agendar mensagem única:**

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "5511999999999@c.us",
    "nomeContato": "João Silva",
    "mensagem": "Olá! Lembrete importante.",
    "dataAgendamento": "2024-12-25T10:00:00"
  }'
```

**Agendar mensagem recorrente (semanal):**

```bash
curl -X POST http://localhost:3000/api/agendamentos/recorrente \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "5511999999999@c.us",
    "nomeContato": "João Silva",
    "mensagem": "Lembrete semanal!",
    "frequencia": "semanal",
    "diasSemana": [1, 3, 5],
    "horario": "14:00"
  }'
```

**Cancelar agendamento:**

```bash
curl -X DELETE http://localhost:3000/api/agendamentos/ID_DO_AGENDAMENTO \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Funcionamento do Processador

O processador de agendamentos:

1. **Executa a cada minuto** (configurado com node-cron)
2. **Busca mensagens pendentes** que já atingiram a data/hora
3. **Envia automaticamente** via WhatsApp
4. **Atualiza status**:
   - `pendente` → `enviada` (sucesso)
   - `pendente` → `falhou` (erro)
5. **Tenta novamente** em caso de falha (até 3 tentativas)
6. **Reagenda recorrentes** após envio bem-sucedido

### Estatísticas

No dashboard, veja:
- Total de mensagens pendentes
- Total de mensagens enviadas
- Mensagens recorrentes ativas
- Próximas 5 mensagens a serem enviadas

## 🔧 Personalização Avançada

### Adicionar Nova Frequência

Edite `scheduler.js` e adicione no `calcularProximaExecucao()`:

```javascript
case 'quinzenal':
  proxima.setDate(proxima.getDate() + 14);
  break;
```

### Notificações de Agendamento

Adicione webhook para notificar quando mensagem é enviada:

```javascript
// Em scheduler.js, após enviar mensagem:
await notificarWebhook({
  tipo: 'mensagem_enviada',
  agendamento: agendamento._id,
  contato: agendamento.nomeContato,
  timestamp: new Date()
});
```

### Limitar Horário de Envio

Evite enviar mensagens fora do horário comercial:

```javascript
// Em scheduler.js, antes de enviar:
const hora = new Date().getHours();
if (hora < 8 || hora > 18) {
  // Reagendar para próximo dia útil
  return;
}
```

## 📊 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/auth/verificar` | Verificar token | Sim |

### Usuários

| Método | Endpoint | Descrição | Role |
|--------|----------|-----------|------|
| POST | `/api/usuarios` | Criar usuário | Admin |
| GET | `/api/usuarios` | Listar usuários | Admin |
| POST | `/api/usuarios/senha` | Alterar senha | Todos |

### Agendamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/agendamentos` | Agendar única | Sim |
| POST | `/api/agendamentos/recorrente` | Agendar recorrente | Sim |
| GET | `/api/agendamentos` | Listar | Sim |
| DELETE | `/api/agendamentos/:id` | Cancelar | Sim |
| GET | `/api/agendamentos/stats` | Estatísticas | Sim |

## 🐛 Solução de Problemas

### Token inválido ou expirado

- Faça login novamente
- Verifique se JWT_SECRET está correto

### Mensagens não são enviadas

- Verifique se o bot está conectado
- Veja logs do processador no console
- Confirme que node-cron está rodando

### Usuário bloqueado

- Aguarde 15 minutos
- Ou acesse o banco e limpe manualmente:

```javascript
db.usuarios.updateOne(
  { email: "email@exemplo.com" },
  { $set: { tentativasLogin: 0, bloqueadoAte: null } }
)
```

### Agendamento não executa

- Verifique timezone do servidor
- Confirme que data/hora estão no futuro
- Veja status no dashboard (pendente/cancelada/enviada)

## 🎯 Casos de Uso

### 1. Lembretes de Consulta

```javascript
// Agendar lembrete 1 dia antes
const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
amanha.setHours(9, 0, 0, 0);

{
  chatId: "cliente@c.us",
  nomeContato: "Cliente",
  mensagem: "Lembrete: Você tem consulta amanhã às 14h!",
  dataAgendamento: amanha
}
```

### 2. Follow-up Automático

```javascript
// Enviar follow-up toda segunda-feira
{
  chatId: "lead@c.us",
  nomeContato: "Lead",
  mensagem: "Olá {nome}! Tudo bem? Vamos conversar sobre sua proposta?",
  frequencia: "semanal",
  diasSemana: [1], // Segunda
  horario: "10:00"
}
```

### 3. Relatório Mensal

```javascript
// Enviar relatório todo dia 1
{
  chatId: "gestor@c.us",
  nomeContato: "Gestor",
  mensagem: "Relatório mensal disponível. Acesse: link.com",
  frequencia: "mensal",
  diaMes: 1,
  horario: "08:00"
}
```

## 📚 Próximos Passos

1. **Integração com Calendário** - Sincronizar com Google Calendar
2. **Templates de Mensagem** - Salvar mensagens frequentes
3. **Grupos de Contatos** - Enviar para múltiplos contatos
4. **Análise de Resposta** - Detectar se cliente respondeu
5. **Webhook de Eventos** - Notificar sistemas externos

---

**Desenvolvido para aprendizado** 🚀

Para uso profissional, sempre utilize a WhatsApp Business API oficial.