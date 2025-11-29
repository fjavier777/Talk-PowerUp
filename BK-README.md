# 🤖 Bot WhatsApp com Dashboard e Banco de Dados

Sistema completo de atendimento automatizado para WhatsApp com interface web de gerenciamento e armazenamento persistente de dados.

## ⚠️ Avisos Importantes

- Este projeto é **apenas para fins educacionais**
- Utiliza bibliotecas não-oficiais que violam os Termos de Serviço do WhatsApp
- Pode resultar em banimento da conta
- **NÃO use em números comerciais importantes**
- Para uso profissional, utilize a WhatsApp Business API oficial

## 🎯 Funcionalidades

### Bot WhatsApp
✅ Atendimento automatizado 24/7
✅ Menu interativo com opções
✅ Histórico de conversas
✅ Respostas contextuais
✅ Simulação de digitação natural
✅ Armazenamento de todas interações

### Dashboard Web
✅ Visualização de estatísticas em tempo real
✅ Gerenciamento de contatos
✅ Histórico completo de conversas
✅ Busca avançada de mensagens
✅ Gráficos de atividade
✅ Interface responsiva e moderna

### Banco de Dados
✅ Armazenamento de mensagens
✅ Cadastro de contatos
✅ Estatísticas diárias
✅ Configurações personalizáveis
✅ Busca e filtros avançados

## 📋 Pré-requisitos

- **Node.js** 16 ou superior
- **MongoDB** instalado e rodando
- **Google Chrome** instalado
- **NPM** ou Yarn
- Número de WhatsApp para teste

## 🚀 Instalação

### Passo 1: Instalar o MongoDB

**Windows:**
```bash
# Baixe e instale de: https://www.mongodb.com/try/download/community
# Ou via Chocolatey:
choco install mongodb
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Passo 2: Clonar ou criar o projeto

```bash
mkdir bot-whatsapp-completo
cd bot-whatsapp-completo
```

### Passo 3: Criar estrutura de pastas

```bash
mkdir public
```

### Passo 4: Criar os arquivos

Crie os seguintes arquivos com os códigos fornecidos:
- `database.js` - Configuração do banco de dados
- `bot-v2.js` - Bot com integração ao banco
- `server.js` - Servidor do dashboard
- `public/index.html` - Interface web
- `package.json` - Dependências
- `.env` - Variáveis de ambiente (copie de .env.example)

### Passo 5: Instalar dependências

```bash
npm install
```

### Passo 6: Configurar variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite conforme necessário
nano .env
```

## 🎮 Como Usar

### Iniciar o Bot

Terminal 1 - Execute o bot:
```bash
npm start
```

1. Um QR Code aparecerá no terminal
2. Abra WhatsApp no celular
3. Vá em: Três pontos > Aparelhos conectados > Conectar aparelho
4. Escaneie o QR Code
5. Pronto! O bot começará a responder automaticamente

### Iniciar o Dashboard

Terminal 2 - Execute o servidor web:
```bash
npm run dashboard
```

Acesse no navegador: `http://localhost:3000`

## 📱 Comandos do Bot

- `/menu` ou `menu` - Exibe menu principal
- `1` - Horário de atendimento
- `2` - Serviços disponíveis
- `3` - Falar com atendente
- `4` - Sobre nós
- `5` - Ver histórico de conversas
- `oi`, `olá` - Saudação inicial
- `obrigado` - Agradecimento

## 🎨 Funcionalidades do Dashboard

### Página Principal
- **Cards de Estatísticas**: Mensagens hoje, total de contatos, contatos ativos, mensagens da semana
- **Atualização Automática**: Dados atualizados a cada 30 segundos

### Aba Contatos
- Lista completa de contatos
- Busca por nome ou telefone
- Total de mensagens por contato
- Data do último contato
- Status (ativo/inativo)
- Clique no contato para ver histórico

### Aba Mensagens
- Visualização de mensagens recentes
- Busca por conteúdo
- Histórico completo de conversas
- Interface estilo chat

### Aba Estatísticas
- Gráfico de mensagens dos últimos 7 dias
- Visualização de tendências
- Análise de atividade

## 🛠️ Estrutura do Banco de Dados

### Coleção: mensagens
```javascript
{
  chatId: String,          // ID do chat
  nomeContato: String,     // Nome do contato
  mensagem: String,        // Mensagem recebida
  resposta: String,        // Resposta enviada
  tipo: String,            // 'recebida' ou 'enviada'
  timestamp: Date          // Data/hora
}
```

### Coleção: contatos
```javascript
{
  chatId: String,          // ID único
  nome: String,            // Nome do contato
  telefone: String,        // Número de telefone
  primeiroContato: Date,   // Primeira interação
  ultimoContato: Date,     // Última interação
  totalMensagens: Number,  // Total de mensagens
  status: String,          // 'ativo', 'inativo', 'bloqueado'
  tags: [String],          // Tags personalizadas
  notas: String            // Anotações
}
```

### Coleção: configuracoes
```javascript
{
  chave: String,           // Nome da configuração
  valor: Mixed,            // Valor (qualquer tipo)
  descricao: String,       // Descrição
  atualizadoEm: Date       // Data de atualização
}
```

### Coleção: estatisticas
```javascript
{
  data: Date,              // Data do registro
  totalMensagens: Number,  // Total de mensagens
  totalContatos: Number,   // Total de contatos
  novosContatos: Number,   // Novos contatos do dia
  tempoMedioResposta: Number
}
```

## 🔧 Personalizações Avançadas

### Adicionar Novas Respostas

Edite o objeto `respostas` em `bot-v2.js`:

```javascript
const respostas = {
  '6': 'Nova opção aqui',
  '/comando': 'Resposta para comando personalizado'
};
```

### Modificar Lógica de Processamento

Edite a função `processarMensagem()` em `bot-v2.js`:

```javascript
async function processarMensagem(mensagem, chatId) {
  // Adicione sua lógica customizada aqui
  if (mensagem.includes('palavra-chave')) {
    return 'Resposta personalizada';
  }
}
```

### Adicionar Nova API no Dashboard

Edite `server.js`:

```javascript
app.get('/api/nova-rota', async (req, res) => {
  try {
    // Sua lógica aqui
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard` - Estatísticas gerais
- `GET /api/contatos` - Lista de contatos
- `GET /api/contatos/:chatId` - Detalhes de um contato
- `PUT /api/contatos/:chatId` - Atualizar contato
- `GET /api/historico/:chatId` - Histórico de conversa
- `GET /api/mensagens` - Mensagens por período
- `GET /api/estatisticas` - Estatísticas por período
- `POST /api/enviar` - Enviar mensagem
- `GET /api/configuracoes` - Listar configurações
- `POST /api/configuracoes` - Salvar configuração
- `GET /api/buscar` - Busca global

## 🚀 Próximas Melhorias

### Funcionalidades Sugeridas

1. **Integração com IA**
   - Claude API para respostas inteligentes
   - GPT para processamento de linguagem natural
   - Análise de sentimento

2. **Sistema de Filas**
   - Múltiplos atendentes
   - Distribuição automática
   - Transferência de conversas

3. **Agendamento**
   - Mensagens programadas
   - Campanhas automatizadas
   - Lembretes

4. **Relatórios Avançados**
   - Exportação para PDF/Excel
   - Gráficos detalhados
   - Análise de performance

5. **Integrações**
   - CRM (Hubspot, Salesforce)
   - E-commerce (WooCommerce, Shopify)
   - Pagamentos (Stripe, PayPal)

6. **Recursos de Mídia**
   - Envio de imagens
   - Vídeos e áudios
   - Documentos e PDFs

7. **Autenticação**
   - Login de usuários
   - Permissões por função
   - Auditoria de ações

## 🐛 Solução de Problemas

### MongoDB não conecta
```bash
# Verifique se está rodando
sudo systemctl status mongodb

# Reinicie o serviço
sudo systemctl restart mongodb
```

### QR Code não aparece
```bash
# Tente com headless: false
# Edite bot-v2.js e altere:
headless: false
```

### Porta 3000 já em uso
```bash
# No .env, altere:
PORT=3001
```

### Bot desconecta frequentemente
- Normal em bibliotecas não-oficiais
- Implemente sistema de reconexão automática
- Considere usar a API oficial

## 📚 Documentação Adicional

- [WPPConnect GitHub](https://github.com/wppconnect-team/wppconnect)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)

## ⚖️ Considerações Legais

Este projeto é **apenas para fins educacionais**. 

Para uso comercial profissional:
1. Use a **WhatsApp Business API oficial**
2. Contrate um Business Solution Provider (BSP)
3. Siga todos os Termos de Serviço
4. Implemente LGPD/GDPR compliance

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Este é um projeto educacional para aprendizado.

## 📄 Licença

MIT - Apenas para fins educacionais

---

**Desenvolvido para aprendizado e experimentação** 🚀