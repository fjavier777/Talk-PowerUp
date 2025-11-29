# 🤖 Bot WhatsApp Completo v4.0

Sistema completo de atendimento automatizado para WhatsApp com dashboard web, autenticação, agendamento de mensagens e integração com Google Calendar.

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)
![Status](https://img.shields.io/badge/status-educational-orange.svg)

## ⚠️ Aviso Importante

**Este projeto é apenas para fins educacionais.** 

Utiliza bibliotecas não-oficiais que violam os Termos de Serviço do WhatsApp e pode resultar em banimento da conta. **NÃO use em números comerciais importantes.**

Para uso profissional, utilize a **WhatsApp Business API oficial**.

## 🎯 Funcionalidades

### 🤖 Bot WhatsApp
- ✅ Atendimento automatizado 24/7
- ✅ Menu interativo com opções personalizáveis
- ✅ Histórico completo de conversas
- ✅ Respostas contextuais
- ✅ Simulação de "digitando..."
- ✅ Salvamento automático no banco de dados

### 📊 Dashboard Web
- ✅ Interface moderna e responsiva
- ✅ Estatísticas em tempo real
- ✅ Gerenciamento de contatos
- ✅ Histórico completo de mensagens
- ✅ Busca avançada
- ✅ Gráficos de atividade
- ✅ Atualização automática (30s)

### 🔐 Sistema de Autenticação
- ✅ Login seguro com JWT
- ✅ Tokens com expiração configurável (24h)
- ✅ 3 níveis de acesso:
  - **Admin**: Acesso total
  - **Atendente**: Criar e gerenciar agendamentos
  - **Visualizador**: Apenas visualizar dados
- ✅ Bloqueio após 5 tentativas falhas (15 min)
- ✅ Alteração de senha
- ✅ Gestão de usuários

### 📅 Agendamento de Mensagens
- ✅ **Mensagens Únicas**: Agende para data/hora específica
- ✅ **Mensagens Recorrentes**:
  - Diária: Todos os dias
  - Semanal: Dias da semana específicos
  - Mensal: Dia do mês específico
- ✅ Processamento automático a cada minuto
- ✅ Retry automático em caso de falha (até 3x)
- ✅ Variáveis dinâmicas: `{nome}`, `{data}`, `{hora}`
- ✅ Cancelamento de agendamentos
- ✅ Estatísticas detalhadas

### 📆 Integração Google Calendar
- ✅ Autenticação OAuth 2.0
- ✅ Criar eventos automaticamente
- ✅ Sincronizar agendamentos do bot
- ✅ Suporte a eventos recorrentes
- ✅ Visualizar próximos eventos
- ✅ Lembretes configuráveis
- ✅ Link direto para eventos

### 🗄️ Banco de Dados MongoDB
- ✅ Armazenamento de mensagens
- ✅ Cadastro de contatos
- ✅ Estatísticas diárias
- ✅ Configurações personalizáveis
- ✅ Índices otimizados
- ✅ Busca avançada

### 🔌 API REST
- ✅ 30+ endpoints documentados
- ✅ Autenticação JWT em todas rotas
- ✅ Tratamento de erros robusto
- ✅ Responses padronizados
- ✅ CORS configurado

## 📋 Pré-requisitos

- **Node.js** 16.0.0 ou superior
- **MongoDB** instalado e rodando
- **NPM** 7.0.0 ou superior
- **Google Chrome** (para WhatsApp)
- Número de **WhatsApp** para teste
- (Opcional) Conta **Google** para Calendar

## 🚀 Instalação

### 1. Clone ou Crie o Projeto

```bash
mkdir bot-whatsapp-completo
cd bot-whatsapp-completo
mkdir public
```

### 2. Instale o MongoDB

**Windows:**
```bash
choco install mongodb
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 3. Crie os Arquivos

Copie todos os arquivos fornecidos nos artefatos para as respectivas pastas (consulte `GUIA COMPLETO - Todos os Arquivos`).

### 4. Instale as Dependências

```bash
npm install
```

### 5. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
nano .env
```

**IMPORTANTE**: Altere o `JWT_SECRET` para um valor único e seguro:

```env
JWT_SECRET=seu-secret-super-seguro-aqui-xyz789
```

### 6. Inicie o Sistema

**Opção 1: Tudo Junto (Recomendado)**
```bash
npm run start:all
```

**Opção 2: Separado**
```bash
# Terminal 1 - Bot
npm start

# Terminal 2 - Dashboard
npm run dashboard
```

### 7. Conecte o WhatsApp

1. Aguarde o **QR Code** aparecer no terminal
2. Abra o **WhatsApp** no celular
3. Vá em: **Menu (⋮) > Aparelhos conectados > Conectar aparelho**
4. Escaneie o QR Code
5. ✅ Bot conectado!

### 8. Acesse o Dashboard

1. Abra o navegador: **http://localhost:3000**
2. Faça login com:
   - Email: `admin@bot.com`
   - Senha: `admin123`
3. **⚠️ IMPORTANTE**: Altere a senha imediatamente!

## 📱 Comandos do Bot

| Comando | Descrição |
|---------|-----------|
| `/menu` ou `menu` | Exibe o menu principal |
| `1` | Horário de atendimento |
| `2` | Serviços disponíveis |
| `3` | Falar com atendente |
| `4` | Sobre nós |
| `5` | Ver histórico de conversas |
| `oi`, `olá`, `ola` | Saudação inicial |
| `obrigado`, `valeu` | Agradecimento |

## 🎨 Usando o Dashboard

### Página Principal
- **Cards de Estatísticas**: Mensagens hoje, total de contatos, contatos ativos, mensagens da semana
- **Atualização Automática**: Dados atualizados automaticamente a cada 30 segundos

### Aba Contatos
- Lista completa de todos os contatos
- Busca por nome ou telefone
- Total de mensagens por contato
- Data do último contato
- Status (ativo/inativo/bloqueado)
- **Clique em um contato** para ver histórico completo

### Aba Mensagens
- Visualização de todas as conversas
- Busca por conteúdo de mensagens
- Interface estilo chat
- Filtros por data

### Aba Agendamentos
- **Botão "+ Nova Mensagem"**: Criar novo agendamento
- **Filtros**: Por status (pendente, enviada, falhada, cancelada) e tipo (única, recorrente)
- **Estatísticas**: Pendentes, enviadas e recorrentes ativas
- **Integração Google Calendar**: Conectar, sincronizar e visualizar eventos
- **Ações**: Cancelar agendamentos e sincronizar com Calendar

### Aba Estatísticas
- Gráfico de mensagens dos últimos 7 dias
- Análise de tendências
- Métricas de atividade

## 📅 Agendamento de Mensagens

### Mensagem Única

Agende uma mensagem para ser enviada em data e hora específicas.

**Exemplo:**
```
Contato: João Silva
Mensagem: Lembrete: Reunião amanhã às 14h!
Data: 25/12/2024 09:00
```

### Mensagem Recorrente

#### Diária
Enviada todos os dias no horário especificado.
```
Horário: 08:00
Mensagem: Bom dia! Lembrete diário.
```

#### Semanal
Enviada nos dias da semana selecionados.
```
Dias: Segunda, Quarta, Sexta
Horário: 14:00
Mensagem: Follow-up semanal!
```

#### Mensal
Enviada no dia do mês especificado.
```
Dia: 25
Horário: 16:00
Mensagem: Relatório mensal disponível.
```

### Variáveis Dinâmicas

Use variáveis nas mensagens:
```
Olá {nome}!

Hoje é {data} e são {hora}.

Lembrete importante para você!
```

## 🔗 Integração com Google Calendar

### Configuração

Veja o guia completo em: **GUIA_GOOGLE_CALENDAR.md**

**Resumo:**
1. Crie projeto no Google Cloud Console
2. Ative Google Calendar API
3. Crie credenciais OAuth 2.0
4. Baixe `google-credentials.json`
5. Coloque na raiz do projeto
6. Reinicie o sistema
7. No dashboard: Conectar Google Calendar

### Uso

1. **Conectar**: Clique em "Conectar Google Calendar" na aba Agendamentos
2. **Sincronizar Individual**: Clique no botão "📅 Sync" ao lado do agendamento
3. **Sincronizar Todos**: Clique em "🔄 Sincronizar Todos"
4. **Ver Eventos**: Lista de próximos 5 eventos aparece automaticamente

## 🔐 Sistema de Usuários

### Níveis de Acesso

| Funcionalidade | Admin | Atendente | Visualizador |
|----------------|-------|-----------|--------------|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Ver Contatos/Mensagens | ✅ | ✅ | ✅ |
| Agendar Mensagens | ✅ | ✅ | ❌ |
| Cancelar Agendamentos | ✅ | Próprios | ❌ |
| Criar Usuários | ✅ | ❌ | ❌ |
| Alterar Configurações | ✅ | ❌ | ❌ |
| Conectar Google Calendar | ✅ | ✅ | ❌ |

### Criar Novo Usuário

**Via Dashboard (Admin):**
1. Menu do usuário > Gerenciar Usuários
2. + Novo Usuário
3. Preencha: Nome, Email, Senha, Role
4. Salvar

**Via API:**
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

## 🔌 API REST

### Autenticação

Todas as rotas (exceto login) requerem token JWT no header:
```
Authorization: Bearer SEU_TOKEN
```

### Principais Endpoints

#### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/verificar` - Verificar token

#### Usuários
- `POST /api/usuarios` - Criar usuário (admin)
- `GET /api/usuarios` - Listar usuários (admin)
- `POST /api/usuarios/senha` - Alterar senha

#### Dashboard
- `GET /api/dashboard` - Estatísticas gerais
- `GET /api/contatos` - Listar contatos
- `GET /api/contatos/:chatId` - Detalhes do contato
- `GET /api/historico/:chatId` - Histórico de conversa
- `GET /api/mensagens` - Mensagens por período
- `GET /api/estatisticas` - Estatísticas por período

#### Agendamentos
- `POST /api/agendamentos` - Agendar mensagem única
- `POST /api/agendamentos/recorrente` - Agendar recorrente
- `GET /api/agendamentos` - Listar agendamentos
- `DELETE /api/agendamentos/:id` - Cancelar agendamento
- `GET /api/agendamentos/stats` - Estatísticas

#### Google Calendar
- `GET /api/google-calendar/status` - Status conexão
- `GET /api/google-calendar/auth-url` - URL autorização
- `DELETE /api/google-calendar/disconnect` - Desconectar
- `POST /api/google-calendar/eventos` - Criar evento
- `GET /api/google-calendar/eventos` - Listar eventos
- `POST /api/google-calendar/sincronizar/:id` - Sincronizar

## 🗄️ Estrutura do Banco de Dados

### Coleções

#### mensagens
```javascript
{
  chatId: String,
  nomeContato: String,
  mensagem: String,
  resposta: String,
  tipo: String, // 'recebida' ou 'enviada'
  timestamp: Date
}
```

#### contatos
```javascript
{
  chatId: String,
  nome: String,
  telefone: String,
  primeiroContato: Date,
  ultimoContato: Date,
  totalMensagens: Number,
  status: String, // 'ativo', 'inativo', 'bloqueado'
  tags: [String],
  notas: String
}
```

#### usuarios
```javascript
{
  nome: String,
  email: String,
  senha: String, // hash bcrypt
  role: String, // 'admin', 'atendente', 'visualizador'
  ativo: Boolean,
  ultimoLogin: Date,
  tentativasLogin: Number,
  bloqueadoAte: Date
}
```

#### mensagensagendadas
```javascript
{
  chatId: String,
  nomeContato: String,
  mensagem: String,
  dataAgendamento: Date,
  status: String, // 'pendente', 'enviada', 'falhou', 'cancelada'
  tipo: String, // 'unica', 'recorrente'
  recorrencia: {
    frequencia: String,
    diasSemana: [Number],
    diaMes: Number,
    horario: String
  },
  googleCalendarEventId: String
}
```

## 🛠️ Personalização

### Modificar Respostas do Bot

Edite `bot-v2.js`:

```javascript
const respostas = {
  '/menu': `🤖 *Seu Menu Personalizado*\n\n...`,
  '1': `Sua resposta personalizada`,
  // Adicione mais opções
  '6': `Nova opção aqui`
};
```

### Adicionar Novos Comandos

```javascript
async function processarMensagem(mensagem, chatId) {
  const texto = mensagem.toLowerCase().trim();
  
  // Seu novo comando
  if (texto.includes('palavra-chave')) {
    return 'Sua resposta personalizada';
  }
  
  // ... resto do código
}
```

### Customizar Dashboard

Edite `public/index.html` para:
- Alterar cores e estilos
- Adicionar novos cards
- Modificar layout
- Incluir novas funcionalidades

## 🐛 Solução de Problemas

### MongoDB não conecta
```bash
# Verificar status
sudo systemctl status mongodb

# Iniciar
sudo systemctl start mongodb
```

### QR Code não aparece
Edite `bot-v2.js`:
```javascript
headless: false // Altere de true para false
```

### Porta 3000 em uso
No `.env`:
```
PORT=3001
```

### Token inválido/expirado
- Faça logout e login novamente
- Verifique se JWT_SECRET está correto no `.env`

### Mensagens não são enviadas
- Confirme que bot está conectado
- Veja logs no console
- Verifique conexão com internet

### Agendamentos não executam
- Verifique se MongoDB está rodando
- Confirme que data/hora são futuras
- Veja status no dashboard

### Google Calendar não conecta
- Verifique `google-credentials.json` na raiz
- Confirme redirect URI no Google Cloud Console
- Adicione seu email como usuário de teste

## 📚 Documentação Adicional

- **QUICK_START.md** - Guia de início rápido
- **GUIA_AUTH_SCHEDULER.md** - Autenticação e agendamento
- **GUIA_GOOGLE_CALENDAR.md** - Integração Google Calendar

## 🔒 Segurança

### Boas Práticas

1. ✅ Altere a senha admin após primeiro login
2. ✅ Mude `JWT_SECRET` no `.env` (produção)
3. ✅ Não commite credenciais no git
4. ✅ Use HTTPS em produção
5. ✅ Configure firewall adequadamente
6. ✅ Faça backup regular do MongoDB
7. ✅ Monitore logs de acesso
8. ✅ Revise permissões de usuários

### Em Produção

- Use variáveis de ambiente seguras
- Configure SSL/TLS
- Implemente rate limiting
- Adicione logging avançado
- Configure monitoramento
- Use serviço gerenciado de MongoDB
- Habilite autenticação MongoDB

## 📊 Performance

### Limites Recomendados

- **Contatos simultâneos**: 100-200
- **Mensagens/dia**: 1000-2000
- **Agendamentos ativos**: 500
- **Usuários logados**: 10-20

### Otimizações

- Índices MongoDB otimizados
- Cache de consultas frequentes
- Lazy loading no frontend
- Paginação de resultados
- Compressão de responses

## 🤝 Contribuindo

Este é um projeto educacional. Sugestões e melhorias são bem-vindas!

## 📄 Licença

MIT License - Apenas para fins educacionais

## ⚖️ Considerações Legais

**Para uso profissional:**
1. Utilize a WhatsApp Business API oficial
2. Contrate um Business Solution Provider (BSP)
3. Siga todos os Termos de Serviço
4. Implemente compliance LGPD/GDPR
5. Obtenha consentimento dos usuários

## 🆘 Suporte

### Logs Úteis

```bash
# Logs do Bot e Dashboard
# Veja no console onde executou npm start

# Logs MongoDB
sudo journalctl -u mongodb

# Limpar logs
npm run clean-logs
```

### Resetar Sistema

```bash
# Limpar banco de dados
mongo whatsapp-bot --eval "db.dropDatabase()"

# Remover sessão WhatsApp
rm -rf tokens/

# Reinstalar dependências
rm -rf node_modules
npm install
```

## 🚀 Roadmap Futuro

Possíveis melhorias:
- [ ] Integração com IA (Claude/GPT)
- [ ] Envio de mídia (imagens, vídeos)
- [ ] Templates de mensagens
- [ ] Chatbot com contexto
- [ ] Análise de sentimento
- [ ] Dashboard de métricas avançadas
- [ ] Múltiplos atendentes
- [ ] Sistema de filas
- [ ] Integração CRM
- [ ] App mobile

---

**Desenvolvido para aprendizado e experimentação** 🚀

Para dúvidas, consulte a documentação completa ou os guias específicos.