# 🚀 Instalação Completa - Guia Passo a Passo

## 📋 Checklist Pré-Instalação

Antes de começar, certifique-se de ter:

- [ ] **Node.js 16+** instalado ([nodejs.org](https://nodejs.org))
- [ ] **MongoDB** instalado e rodando
- [ ] **Git** instalado (opcional)
- [ ] **Editor de código** (VS Code recomendado)
- [ ] **Navegador moderno** (Chrome, Firefox, Edge)
- [ ] **WhatsApp** no celular com número de teste
- [ ] **30 minutos** de tempo disponível

## 🎯 Instalação em 10 Passos

### Passo 1: Instalar MongoDB (5 min)

#### Windows
```powershell
# Opção 1: Chocolatey
choco install mongodb

# Opção 2: Download manual
# https://www.mongodb.com/try/download/community
# Instalar e iniciar serviço MongoDB
```

#### macOS
```bash
# Usando Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community

# Verificar status
brew services list | grep mongodb
```

#### Linux (Ubuntu/Debian)
```bash
# Atualizar pacotes
sudo apt-get update

# Instalar MongoDB
sudo apt-get install -y mongodb

# Iniciar serviço
sudo systemctl start mongodb

# Habilitar no boot
sudo systemctl enable mongodb

# Verificar status
sudo systemctl status mongodb
```

✅ **Verificar instalação:**
```bash
mongo --version
# Deve mostrar: MongoDB shell version v...
```

---

### Passo 2: Criar Estrutura do Projeto (1 min)

```bash
# Criar pasta principal
mkdir bot-whatsapp-completo
cd bot-whatsapp-completo

# Criar subpasta public
mkdir public

# Verificar estrutura
ls -la
# Deve mostrar: public/
```

---

### Passo 3: Criar Arquivos de Configuração (3 min)

#### 3.1 Criar package.json

```bash
# Criar arquivo
touch package.json

# Abrir com editor
nano package.json
# ou
code package.json
```

Copie o conteúdo do artefato **"package.json"** gerado anteriormente.

#### 3.2 Criar .env.example

```bash
touch .env.example
nano .env.example
```

Copie o conteúdo do artefato **".env.example"**.

#### 3.3 Criar .env

```bash
# Copiar template
cp .env.example .env

# Editar
nano .env
```

**IMPORTANTE**: Altere esta linha:
```env
JWT_SECRET=SEU_SECRET_UNICO_AQUI_XYZ789_MUDE_ISSO
```

#### 3.4 Criar .gitignore

```bash
touch .gitignore
nano .gitignore
```

Copie o conteúdo do artefato **".gitignore"**.

✅ **Verificar:**
```bash
ls -la
# Deve mostrar: package.json, .env, .env.example, .gitignore, public/
```

---

### Passo 4: Criar Arquivos do Backend (10 min)

#### 4.1 database.js

```bash
touch database.js
nano database.js
```

Copie o conteúdo do artefato **"database.js - Banco de Dados Completo"**.

#### 4.2 auth.js

```bash
touch auth.js
nano auth.js
```

Copie o conteúdo do artefato **"auth.js - Sistema de Autenticação"** (mensagens anteriores).

#### 4.3 scheduler.js

```bash
touch scheduler.js
nano scheduler.js
```

Copie o conteúdo do artefato **"scheduler.js - Sistema de Agendamento"**.

#### 4.4 google-calendar.js

```bash
touch google-calendar.js
nano google-calendar.js
```

Copie o conteúdo do artefato **"google-calendar.js - Integração com Google Calendar"**.

#### 4.5 bot-v2.js

```bash
touch bot-v2.js
nano bot-v2.js
```

Copie o conteúdo do artefato **"bot-v2.js - Bot com Banco de Dados"**.

Certifique-se de incluir as importações:
```javascript
const { configurarCliente, iniciarProcessador } = require('./scheduler');
```

#### 4.6 server.js

```bash
touch server.js
nano server.js
```

Copie o conteúdo do artefato **"server.js - Servidor do Dashboard"** (versão completa com todas as rotas).

#### 4.7 start-all.js

```bash
touch start-all.js
nano start-all.js
```

Copie o conteúdo do artefato **"start-all.js - Iniciar Bot e Dashboard"**.

✅ **Verificar:**
```bash
ls -la *.js
# Deve mostrar: 7 arquivos .js
```

---

### Passo 5: Criar Arquivos do Frontend (5 min)

#### 5.1 public/index.html

```bash
touch public/index.html
nano public/index.html
```

Copie o conteúdo do artefato **"public/index.html - Dashboard Web"**.

**IMPORTANTE**: Inclua também a seção de Google Calendar do artefato **"Google Calendar UI - Adicionar ao Dashboard"**.

#### 5.2 public/login.html

```bash
touch public/login.html
nano public/login.html
```

Copie o conteúdo do artefato **"public/login.html - Página de Login"**.

✅ **Verificar:**
```bash
ls -la public/
# Deve mostrar: index.html, login.html
```

---

### Passo 6: Criar Documentação (5 min)

#### 6.1 README.md

```bash
touch README.md
nano README.md
```

Copie o conteúdo do artefato **"README.md - Documentação Completa"**.

#### 6.2 QUICK_START.md

```bash
touch QUICK_START.md
```

Copie o último **"QUICK_START.md"** atualizado.

#### 6.3 GUIA_AUTH_SCHEDULER.md

```bash
touch GUIA_AUTH_SCHEDULER.md
```

Copie o artefato **"GUIA_AUTENTICACAO_AGENDAMENTO.md"**.

#### 6.4 GUIA_GOOGLE_CALENDAR.md

```bash
touch GUIA_GOOGLE_CALENDAR.md
```

Copie o artefato **"GUIA_GOOGLE_CALENDAR.md - Setup Completo"**.

✅ **Verificar:**
```bash
ls -la *.md
# Deve mostrar: 4 arquivos .md
```

---

### Passo 7: Instalar Dependências (2 min)

```bash
# Instalar todas as dependências
npm install

# Aguardar instalação...
# Pode levar 1-2 minutos

# Verificar instalação
npm list --depth=0
```

Deve mostrar:
```
bot-whatsapp-completo@4.0.0
├── @wppconnect-team/wppconnect@1.29.2
├── bcryptjs@2.4.3
├── cors@2.8.5
├── dotenv@16.3.1
├── express@4.18.2
├── googleapis@126.0.0
├── jsonwebtoken@9.0.2
├── mongoose@7.6.0
└── node-cron@3.0.2
```

✅ **Se houver erros:**
```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules
rm -rf node_modules package-lock.json

# Instalar novamente
npm install
```

---

### Passo 8: Verificar Estrutura Final (1 min)

```bash
# Listar todos os arquivos
tree -L 2
# ou
ls -la
```

Estrutura esperada:
```
bot-whatsapp-completo/
├── node_modules/          (após npm install)
├── public/
│   ├── index.html
│   └── login.html
├── .env
├── .env.example
├── .gitignore
├── auth.js
├── bot-v2.js
├── database.js
├── google-calendar.js
├── GUIA_AUTH_SCHEDULER.md
├── GUIA_GOOGLE_CALENDAR.md
├── package.json
├── package-lock.json      (após npm install)
├── QUICK_START.md
├── README.md
├── scheduler.js
├── server.js
└── start-all.js
```

✅ **Contagem de arquivos:**
- 7 arquivos .js (backend)
- 2 arquivos .html (frontend)
- 4 arquivos .md (documentação)
- 4 arquivos de config
- 1 pasta node_modules
- **Total: 18 itens**

---

### Passo 9: Iniciar o Sistema (2 min)

```bash
# Opção 1: Iniciar tudo junto (recomendado)
npm run start:all
```

Você verá:
```
🚀 Iniciando sistema completo...

[BOT] ✅ MongoDB conectado
[BOT] ✅ Usuário admin criado: admin@bot.com / admin123
[BOT] ✅ Bot iniciado com sucesso!
[BOT] 📱 Escaneie o QR Code para conectar

[DASHBOARD] ✅ MongoDB conectado
[DASHBOARD] 🌐 Dashboard rodando em http://localhost:3000
[DASHBOARD] 🔐 Faça login com: admin@bot.com / admin123
```

**Ou separado:**

Terminal 1:
```bash
npm start
```

Terminal 2 (nova aba):
```bash
npm run dashboard
```

✅ **Verificar:**
- Bot deve mostrar QR Code no console
- Dashboard deve estar acessível em http://localhost:3000

---

### Passo 10: Conectar e Testar (5 min)

#### 10.1 Conectar WhatsApp

1. Veja o **QR Code** no terminal
2. Abra **WhatsApp** no celular
3. Vá em: **Menu (⋮) > Aparelhos conectados**
4. Clique em **"Conectar aparelho"**
5. **Escaneie o QR Code**
6. Aguarde mensagem: **"✅ Bot conectado"**

#### 10.2 Acessar Dashboard

1. Abra navegador: **http://localhost:3000**
2. Será redirecionado para: **/login**
3. Faça login:
   - **Email**: admin@bot.com
   - **Senha**: admin123
4. Clique em **"Entrar"**
5. Será redirecionado para dashboard

#### 10.3 Testar Bot

Envie mensagem para o número conectado:
```
oi
```

Resposta esperada:
```
Olá! 👋 Seja bem-vindo(a)!

Digite /menu para ver as opções disponíveis.
```

#### 10.4 Testar Menu

Digite:
```
/menu
```

Deve mostrar menu completo com 5 opções.

#### 10.5 Verificar Dashboard

1. Vá na aba **"Contatos"**
2. Deve aparecer seu contato
3. Clique no contato
4. Veja histórico da conversa

✅ **Sistema funcionando perfeitamente!**

---

## 🎉 Instalação Concluída!

### ✅ Checklist Final

Marque cada item:

- [ ] MongoDB instalado e rodando
- [ ] Todos os arquivos criados (18 itens)
- [ ] Dependências instaladas (npm install)
- [ ] Arquivo .env configurado
- [ ] Sistema iniciado (npm run start:all)
- [ ] WhatsApp conectado (QR Code)
- [ ] Dashboard acessível (http://localhost:3000)
- [ ] Login realizado (admin@bot.com)
- [ ] Bot respondendo mensagens
- [ ] Histórico aparecendo no dashboard

### 🎯 Próximos Passos

Agora você pode:

1. **Alterar senha admin**
   - Dashboard > Menu usuário > Alterar Senha

2. **Personalizar respostas**
   - Editar arquivo `bot-v2.js`

3. **Criar agendamento**
   - Dashboard > Agendamentos > + Nova Mensagem

4. **Configurar Google Calendar** (opcional)
   - Seguir `GUIA_GOOGLE_CALENDAR.md`

5. **Criar novos usuários**
   - Dashboard > Usuários > + Novo (apenas admin)

6. **Explorar API**
   - Testar endpoints REST
   - Ler documentação completa

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"

```bash
# Opção 1: Matar processo
lsof -ti:3000 | xargs kill -9

# Opção 2: Mudar porta
# Editar .env
PORT=3001
```

### Erro: "MongoDB connection failed"

```bash
# Verificar se está rodando
sudo systemctl status mongodb

# Iniciar se não estiver
sudo systemctl start mongodb

# Testar conexão
mongo --eval "db.version()"
```

### Erro: "QR Code não aparece"

Editar `bot-v2.js`:
```javascript
headless: false // Mudar de true para false
```

### Erro: "Cannot read property 'sendText'"

- WhatsApp não está conectado
- Escaneie o QR Code novamente
- Verifique conexão com internet

---

## 📞 Suporte

### Documentação Disponível

1. **README.md** - Documentação principal completa
2. **QUICK_START.md** - Guia rápido de uso
3. **GUIA_AUTH_SCHEDULER.md** - Autenticação e agendamento detalhado
4. **GUIA_GOOGLE_CALENDAR.md** - Setup Google Calendar passo a passo

### Logs Úteis

```bash
# Logs do sistema
npm run start:all

# Logs do MongoDB
sudo journalctl -u mongodb

# Limpar logs
# Ctrl+C para parar
# Iniciar novamente
```

### Reset Completo

```bash
# 1. Parar sistema
Ctrl+C (em ambos terminais)

# 2. Limpar banco
mongo whatsapp-bot --eval "db.dropDatabase()"

# 3. Remover sessão WhatsApp
rm -rf tokens/

# 4. Limpar node_modules
rm -rf node_modules package-lock.json

# 5. Reinstalar
npm install

# 6. Iniciar novamente
npm run start:all
```

---

## 🎓 Tutorial em Vídeo (Opcional)

Se preferir, você pode gravar sua própria instalação:

1. Gravar tela durante instalação
2. Narrar cada passo
3. Mostrar troubleshooting comum
4. Demonstrar uso do sistema
5. Compartilhar com comunidade

---

## ✅ Verificação de Qualidade

Antes de considerar instalação completa:

```bash
# 1. Testar bot
# Enviar: oi, /menu, 1, 2, 3, 4, 5

# 2. Testar dashboard
# Visitar todas as 4 abas
# Fazer uma busca
# Criar um agendamento de teste

# 3. Testar autenticação
# Fazer logout
# Fazer login novamente
# Tentar acessar sem estar logado

# 4. Verificar banco
mongo whatsapp-bot --eval "db.stats()"
# Deve mostrar estatísticas

# 5. Verificar logs
# Não deve ter erros críticos
# Apenas warnings aceitáveis
```

---

## 🎉 Parabéns!

Você instalou com sucesso o **Bot WhatsApp Completo v4.0**!

Sistema está:
- ✅ Instalado
- ✅ Configurado
- ✅ Rodando
- ✅ Testado
- ✅ Pronto para uso

**Tempo total**: ~30 minutos
**Dificuldade**: Intermediária
**Status**: ✅ COMPLETO

---

**Desenvolvido para aprendizado** 🚀

Boa sorte com seu bot!