# 🚀 Guia Rápido de Início - Versão Completa

## Sistema Completo Implementado

✅ Bot WhatsApp com respostas automáticas
✅ Dashboard web com estatísticas
✅ Banco de dados MongoDB
✅ Sistema de autenticação (JWT)
✅ Agendamento de mensagens (única e recorrente)
✅ Integração com Google Calendar

## Instalação em 10 Minutos

### 1️⃣ Instalar MongoDB

**Windows:**
```bash
choco install mongodb
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

### 2️⃣ Criar o Projeto

```bash
# Criar pasta
mkdir bot-whatsapp-completo
cd bot-whatsapp-completo

# Criar subpasta public
mkdir public
```

### 3️⃣ Criar os Arquivos

Copie todos os arquivos fornecidos para a pasta do projeto:

```
bot-whatsapp-completo/
├── auth.js                      # Sistema de autenticação
├── scheduler.js                 # Sistema de agendamento
├── google-calendar.js           # Integração Google Calendar
├── database.js                  # Banco de dados
├── bot-v2.js                   # Bot principal
├── server.js                   # Servidor web
├── start-all.js                # Inicializador
├── package.json                # Dependências
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos a ignorar
└── public/
    ├── index.html              # Dashboard principal
    └── login.html              # Página de login
```

### 4️⃣ Instalar Dependências

```bash
npm install
```

Dependências instaladas:
- `@wppconnect-team/wppconnect` - WhatsApp
- `express` - Servidor web
- `mongoose` - MongoDB
- `jsonwebtoken` - Autenticação
- `bcryptjs` - Criptografia
- `node-cron` - Agendamentos
- `googleapis` - Google Calendar

### 5️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/whatsapp-bot
PORT=3000
NODE_ENV=development
JWT_SECRET=mude-este-secret-em-producao-123456789
```

### 6️⃣ Iniciar o Sistema

```bash
node start-all.js
```

Você verá:
```
✅ Bot iniciado com sucesso!
📱 Escaneie o QR Code para conectar
✅ Usuário admin criado: admin@bot.com / admin123
🌐 Dashboard rodando em http://localhost:3000
```

### 7️⃣ Conectar o WhatsApp

1. Aguarde o QR Code aparecer no terminal
2. Abra o WhatsApp no celular
3. Vá em: **Menu (⋮) > Aparelhos conectados > Conectar aparelho**
4. Escaneie o QR Code
5. ✅ Bot conectado!

### 8️⃣ Acessar o Dashboard

1. Abra: **http://localhost:3000**
2. Faça login com:
   - Email: `admin@bot.com`
   - Senha: `admin123`
3. ⚠️ **Altere a senha imediatamente!**

### 9️⃣ Configurar Google Calendar (Opcional)

Veja o guia completo: **GUIA_GOOGLE_CALENDAR.md**

Resumo rápido:
1. Criar projeto no Google Cloud Console
2. Ativar Google Calendar API
3. Criar credenciais OAuth 2.0
4. Baixar arquivo `google-credentials.json`
5. Colocar na raiz do projeto
6. Conectar via dashboard

---

## ✨ Primeiro Teste

### Testar o Bot

Envie uma mensagem para o número conectado:
```
oi
```

O bot deve responder:
```
Olá! 👋 Seja bem-vindo(a)!

Digite /menu para ver as opções disponíveis.
```

### Testar Menu

Digite:
```
/menu
```

Resposta:
```
🤖 Menu de Opções

1️⃣ Horário de atendimento
2️⃣ Serviços disponíveis
3️⃣ Falar com atendente
4️⃣ Sobre nós
5️⃣ Ver histórico

Digite o número da opção desejada!
```

---

## 📊 Funcionalidades do Dashboard

### Página Principal
- **Estatísticas em tempo real**
- Mensagens hoje
- Total de contatos
- Contatos ativos (7 dias)
- Mensagens da semana

### Aba Contatos
- Lista completa de contatos
- Busca por nome/telefone
- Total de mensagens por contato
- Status (ativo/inativo)
- Clique para ver histórico completo

### Aba Mensagens
- Todas as conversas
- Busca por conteúdo
- Visualização em formato chat
- Filtros por data

### Aba Agendamentos
- **Nova Mensagem Agendada**
- Mensagens únicas ou recorrentes
- Filtros por status e tipo
- Estatísticas de envios
- Cancelamento de agendamentos
- **Integração com Google Calendar**

### Aba Estatísticas
- Gráfico dos últimos 7 dias
- Análise de tendências
- Métricas de atividade

---

## 🎯 Casos de Uso Rápidos

### 1. Agendar Lembrete

No dashboard:
1. Agendamentos > + Nova Mensagem
2. Selecione contato
3. Digite mensagem
4. Escolha data/hora
5. Agendar

### 2. Mensagem Recorrente Semanal

1. Agendamentos > + Nova Mensagem
2. Tipo: "Mensagem Recorrente"
3. Frequência: "Semanal"
4. Dias: Segunda, Quarta, Sexta
5. Horário: 09:00
6. Agendar

### 3. Sincronizar com Google Calendar

1. Conecte o Google Calendar
2. Na lista de agendamentos
3. Clique em "📅 Sync"
4. Evento criado automaticamente!

---

## 📱 Comandos do Bot

| Comando | Descrição |
|---------|-----------|
| `/menu` | Menu principal |
| `1` | Horário de atendimento |
| `2` | Serviços disponíveis |
| `3` | Falar com atendente |
| `4` | Sobre nós |
| `5` | Ver histórico |
| `oi`, `olá` | Saudação |
| `obrigado` | Agradecimento |

---

## 🔐 Usuários e Permissões

### Credenciais Padrão
- Email: `admin@bot.com`
- Senha: `admin123`

### Níveis de Acesso

| Funcionalidade | Admin | Atendente | Visualizador |
|----------------|-------|-----------|--------------|
| Ver dados | ✅ | ✅ | ✅ |
| Agendar mensagens | ✅ | ✅ | ❌ |
| Criar usuários | ✅ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ |

### Criar Novo Usuário

No dashboard (admin):
1. Menu do usuário > Gerenciar Usuários
2. + Novo Usuário
3. Preencha dados
4. Escolha role
5. Salvar

---

## 🐛 Problemas Comuns

### ❌ MongoDB não conecta
```bash
sudo systemctl start mongodb
```

### ❌ QR Code não aparece
Edite `bot-v2.js`:
```javascript
headless: false
```

### ❌ Porta 3000 em uso
No `.env`:
```
PORT=3001
```

### ❌ Token inválido
- Faça logout e login novamente
- Verifique JWT_SECRET no .env

### ❌ Mensagens não são agendadas
- Confirme que MongoDB está rodando
- Veja logs do console
- Verifique data/hora futura

---

## 📚 Documentação Completa

### Guias Disponíveis

1. **README.md** - Documentação geral do projeto
2. **GUIA_AUTENTICACAO_AGENDAMENTO.md** - Sistema de auth e agendamento
3. **GUIA_GOOGLE_CALENDAR.md** - Integração com Google Calendar
4. **QUICK_START.md** - Este guia (início rápido)

### Estrutura de Arquivos

```
Documentação/
├── README.md                           # Principal
├── GUIA_AUTENTICACAO_AGENDAMENTO.md   # Auth + Scheduler
├── GUIA_GOOGLE_CALENDAR.md            # Google Calendar
└── QUICK_START.md                      # Guia rápido

Código/
├── auth.js                             # Autenticação
├── scheduler.js                        # Agendamentos
├── google-calendar.js                  # Calendar API
├── database.js                         # MongoDB
├── bot-v2.js                          # Bot principal
├── server.js                          # API REST
└── start-all.js                       # Inicializador

Frontend/
└── public/
    ├── index.html                      # Dashboard
    └── login.html                      # Login
```

---

## 🎓 Próximos Passos

### Nível Iniciante
1. ✅ Personalize as respostas do bot
2. ✅ Adicione novos comandos
3. ✅ Crie mais usuários
4. ✅ Teste agendamentos

### Nível Intermediário
1. 🔄 Integre com APIs externas
2. 🔄 Adicione envio de mídia
3. 🔄 Crie templates de mensagens
4. 🔄 Configure webhooks

### Nível Avançado
1. 🚀 Integre IA (Claude/GPT)
2. 🚀 Implemente análise de sentimento
3. 🚀 Crie dashboard de métricas avançadas
4. 🚀 Configure em produção

---

## 💡 Dicas Importantes

⚠️ **Segurança**
- Altere senha admin imediatamente
- Mude JWT_SECRET em produção
- Não commite credenciais
- Use HTTPS em produção

⚠️ **Uso Responsável**
- Apenas para fins educacionais
- Não use em números comerciais
- Respeite a privacidade dos usuários
- Para uso profissional, use API oficial

✅ **Backup**
- Faça backup do MongoDB regularmente
- Salve as conversas importantes
- Mantenha cópias das credenciais

✅ **Performance**
- Limite de 100 contatos simultâneos
- Agendamentos processados a cada minuto
- Dashboard atualiza a cada 30 segundos

---

## 🤝 Suporte

### Logs Úteis
- Bot: Console do terminal 1
- Dashboard: Console do terminal 2
- MongoDB: `sudo journalctl -u mongodb`

### Resetar Sistema
```bash
# Limpar banco de dados
mongo whatsapp-bot --eval "db.dropDatabase()"

# Remover sessão WhatsApp
rm -rf tokens/

# Reinstalar
npm install
```

---

**Sistema completo pronto para uso! 🚀**

Comece testando, personalize conforme sua necessidade e evolua o projeto gradualmente.