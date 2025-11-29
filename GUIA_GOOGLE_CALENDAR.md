# 📅 Guia de Integração com Google Calendar

## 🎯 Funcionalidades

✅ Sincronizar agendamentos do bot com Google Calendar
✅ Criar eventos automaticamente
✅ Suporte para eventos recorrentes
✅ Visualizar próximos eventos no dashboard
✅ Lembretes automáticos
✅ Link direto para eventos no Calendar

## 📋 Pré-requisitos

- Conta Google
- Projeto no Google Cloud Console
- Credenciais OAuth 2.0

## 🚀 Configuração Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Selecionar projeto"** → **"Novo Projeto"**
3. Nome do projeto: `Bot WhatsApp`
4. Clique em **"Criar"**
5. Aguarde a criação do projeto
6. Selecione o projeto criado

### 2. Habilitar Google Calendar API

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Busque por: `Google Calendar API`
3. Clique na API e depois em **"Ativar"**
4. Aguarde a ativação

### 3. Configurar Tela de Consentimento OAuth

1. Vá em **"APIs e Serviços"** → **"Tela de consentimento OAuth"**
2. Escolha: **"Externo"** (ou "Interno" se for Google Workspace)
3. Clique em **"Criar"**

**Informações do app:**
- Nome do aplicativo: `Bot WhatsApp Dashboard`
- Email de suporte do usuário: seu@email.com
- Logo do aplicativo: (opcional)

**Domínio do app:**
- Domínio autorizado: `localhost` (para testes)

**Informações de contato do desenvolvedor:**
- Email: seu@email.com

4. Clique em **"Salvar e continuar"**

**Escopos:**
5. Clique em **"Adicionar ou remover escopos"**
6. Busque e adicione: `Google Calendar API` → `.../auth/calendar`
7. Clique em **"Atualizar"**
8. Clique em **"Salvar e continuar"**

**Usuários de teste** (se for app externo):
9. Adicione seu email como usuário de teste
10. Clique em **"Salvar e continuar"**
11. Revise e clique em **"Voltar ao painel"**

### 4. Criar Credenciais OAuth 2.0

1. Vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"Criar credenciais"** → **"ID do cliente OAuth"**
3. Tipo de aplicativo: **"Aplicativo da Web"**

**Configurações:**
- Nome: `Bot WhatsApp OAuth`
- URIs de redirecionamento autorizados: 
  - `http://localhost:3000/api/google-calendar/callback`
  - (Adicione sua URL de produção quando disponível)
- Origens JavaScript autorizadas:
  - `http://localhost:3000`

4. Clique em **"Criar"**
5. Uma janela mostrará o **Client ID** e **Client Secret**
6. Clique em **"Baixar JSON"**

### 5. Configurar Credenciais no Projeto

1. Renomeie o arquivo baixado para: `google-credentials.json`
2. Coloque na **raiz do projeto** (mesma pasta que bot-v2.js)

**Estrutura do arquivo:**
```json
{
  "web": {
    "client_id": "SEU_CLIENT_ID_AQUI.apps.googleusercontent.com",
    "project_id": "seu-projeto",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "SEU_CLIENT_SECRET_AQUI",
    "redirect_uris": [
      "http://localhost:3000/api/google-calendar/callback"
    ]
  }
}
```

### 6. Instalar Dependência

```bash
npm install googleapis
```

### 7. Atualizar package.json

Adicione ao arquivo `package.json`:

```json
"dependencies": {
  "googleapis": "^126.0.0"
}
```

### 8. Reiniciar o Sistema

```bash
# Parar o sistema (Ctrl+C)
# Reinstalar dependências
npm install

# Iniciar novamente
node start-all.js
```

## 🔗 Conectar Google Calendar

### Via Dashboard (Recomendado)

1. Acesse o dashboard: `http://localhost:3000`
2. Faça login
3. Vá na aba **"Agendamentos"**
4. Clique em **"Conectar Google Calendar"**
5. Uma nova janela se abrirá
6. Faça login com sua conta Google
7. Autorize o acesso ao Calendar
8. A janela fechará automaticamente
9. Verifique o status: deve aparecer "✅ Conectado"

### Via API

```bash
# 1. Obter URL de autorização
curl -X GET http://localhost:3000/api/google-calendar/auth-url \
  -H "Authorization: Bearer SEU_TOKEN"

# Resposta: { "url": "https://accounts.google.com/..." }

# 2. Abra a URL no navegador
# 3. Autorize o acesso
# 4. Você será redirecionado automaticamente
```

## 📊 Usando a Integração

### 1. Sincronizar Agendamento Individual

**Via Dashboard:**
1. Na tabela de agendamentos
2. Clique no botão **"📅 Sync"** ao lado do agendamento
3. Um evento será criado no Google Calendar

**Via API:**
```bash
curl -X POST http://localhost:3000/api/google-calendar/sincronizar/ID_DO_AGENDAMENTO \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 2. Sincronizar Todos os Agendamentos

**Via Dashboard:**
1. Na seção de Google Calendar
2. Clique em **"🔄 Sincronizar Todos"**
3. Todos os agendamentos pendentes serão sincronizados

### 3. Criar Evento Manualmente

```bash
curl -X POST http://localhost:3000/api/google-calendar/eventos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Reunião Importante",
    "descricao": "Discussão sobre o projeto",
    "dataInicio": "2024-12-25T10:00:00",
    "dataFim": "2024-12-25T11:00:00",
    "localizacao": "Sala 1",
    "lembrete": 15
  }'
```

### 4. Listar Próximos Eventos

```bash
curl -X GET http://localhost:3000/api/google-calendar/eventos?limite=10 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🎨 Formato dos Eventos

### Evento de Agendamento Único

```
Título: WhatsApp: João Silva
Descrição: Mensagem agendada para:

Olá João! Lembrete importante sobre a reunião.

📱 Contato: João Silva
🤖 Bot WhatsApp

Local: WhatsApp
Data: 25/12/2024 10:00
Lembrete: 10 minutos antes
```

### Evento Recorrente (Semanal)

```
Título: WhatsApp: Equipe Vendas
Descrição: Follow-up semanal automático
Recorrência: Toda Segunda e Quarta às 09:00
```

### Evento Recorrente (Mensal)

```
Título: WhatsApp: Contador
Descrição: Lembrete mensal de relatório
Recorrência: Todo dia 25 do mês às 16:00
```

## 🔧 Personalização

### Alterar Tempo de Lembrete

Edite `google-calendar.js`:

```javascript
reminders: {
  useDefault: false,
  overrides: [
    { method: 'popup', minutes: 30 }, // Mudar de 10 para 30 minutos
    { method: 'email', minutes: 60 }  // Adicionar lembrete por email
  ]
}
```

### Alterar Timezone

Edite `google-calendar.js`:

```javascript
start: {
  dateTime: dataInicio,
  timeZone: 'America/New_York' // Mudar timezone
}
```

### Adicionar Participantes

Edite `google-calendar.js` na função `criarEvento`:

```javascript
const evento = {
  // ... outros campos
  attendees: [
    { email: 'participante1@email.com' },
    { email: 'participante2@email.com' }
  ],
  // ...
};
```

### Alterar Cor do Evento

```javascript
const evento = {
  // ... outros campos
  colorId: '9' // 1-11, cores disponíveis no Calendar
};
```

## 🐛 Solução de Problemas

### Erro: "Credenciais não encontradas"

**Solução:**
1. Verifique se `google-credentials.json` está na raiz do projeto
2. Confirme o formato do arquivo JSON
3. Reinicie o servidor

### Erro: "Access denied" ou "Unauthorized"

**Solução:**
1. Verifique se a API do Calendar está ativada
2. Confirme os escopos na tela de consentimento
3. Adicione seu email como usuário de teste (se app externo)
4. Revogue acesso e autorize novamente: https://myaccount.google.com/permissions

### Erro: "Redirect URI mismatch"

**Solução:**
1. No Google Cloud Console, vá em "Credenciais"
2. Edite o OAuth Client ID
3. Adicione exatamente: `http://localhost:3000/api/google-calendar/callback`
4. Salve e tente novamente

### Token expirado

**Solução:**
- O sistema renova automaticamente usando o refresh token
- Se persistir, desconecte e reconecte no dashboard

### Eventos não aparecem no Calendar

**Solução:**
1. Verifique se está usando o calendar "primary"
2. Confirme timezone do servidor
3. Veja logs do console para erros
4. Teste criar evento manualmente via API

### "Approval needed"

Se aparecer "This app needs approval":

**Solução:**
1. Google Cloud Console → OAuth consent screen
2. Clique em "Publish App" (se for interno)
3. Ou adicione seu email em "Test users" (se for externo)

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/google-calendar/status` | Verificar se está conectado |
| GET | `/api/google-calendar/auth-url` | Obter URL de autorização |
| GET | `/api/google-calendar/callback` | Callback OAuth (automático) |
| DELETE | `/api/google-calendar/disconnect` | Desconectar |
| POST | `/api/google-calendar/eventos` | Criar evento |
| GET | `/api/google-calendar/eventos` | Listar próximos eventos |
| POST | `/api/google-calendar/sincronizar/:id` | Sincronizar agendamento |

## 🔒 Segurança

### Tokens Armazenados

- Tokens OAuth são salvos criptografados no MongoDB
- Cada usuário tem seus próprios tokens
- Refresh tokens permitem renovação automática
- Tokens expiram após uso prolongado (revogação)

### Boas Práticas

1. **Não compartilhe** `google-credentials.json`
2. **Adicione ao .gitignore:**
   ```
   google-credentials.json
   ```
3. **Use variáveis de ambiente em produção**
4. **Limite escopos** apenas ao necessário
5. **Revise acessos periodicamente**

## 🌐 Deploy em Produção

### 1. Atualizar Redirect URI

No Google Cloud Console:
```
https://seudominio.com/api/google-calendar/callback
```

### 2. Usar Variáveis de Ambiente

Ao invés de arquivo JSON, use:

```javascript
// google-calendar.js
const credentials = {
  web: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI]
  }
};
```

`.env`:
```
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_REDIRECT_URI=https://seudominio.com/api/google-calendar/callback
```

### 3. Publicar App (Opcional)

Se quiser que qualquer usuário use:
1. Google Cloud Console → OAuth consent screen
2. Clique em "Publish App"
3. Preencha política de privacidade
4. Submeta para verificação do Google

## 📈 Recursos Avançados

### Webhook de Notificações

Receba notificações quando eventos mudarem:

```javascript
// Adicionar ao google-calendar.js
const assistirEvento = async (auth, eventoId) => {
  const calendar = google.calendar({ version: 'v3', auth });
  
  await calendar.events.watch({
    calendarId: 'primary',
    eventId: eventoId,
    requestBody: {
      id: uuid(),
      type: 'web_hook',
      address: 'https://seudominio.com/api/calendar-webhook'
    }
  });
};
```

### Buscar Eventos por Texto

```javascript
const buscarEventos = async (userId, query) => {
  const auth = await obterClienteAutenticado(userId);
  const calendar = google.calendar({ version: 'v3', auth });
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    q: query,
    maxResults: 10
  });
  
  return response.data.items;
};
```

### Múltiplos Calendários

```javascript
// Listar calendários
const listarCalendarios = async (userId) => {
  const auth = await obterClienteAutenticado(userId);
  const calendar = google.calendar({ version: 'v3', auth });
  
  const response = await calendar.calendarList.list();
  return response.data.items;
};

// Criar em calendário específico
await calendar.events.insert({
  calendarId: 'calendario-id-aqui',
  resource: evento
});
```

## 📚 Recursos Úteis

- [Google Calendar API Docs](https://developers.google.com/calendar/api/v3/reference)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Node.js Client Library](https://github.com/googleapis/google-api-nodejs-client)
- [Playground de Testes](https://developers.google.com/oauthplayground/)

---

**Integração completa implementada! 📅✨**