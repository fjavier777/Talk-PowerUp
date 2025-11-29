// Bot de Atendimento WhatsApp com Banco de Dados e Agendamento
const wppconnect = require('@wppconnect-team/wppconnect');
const {
  connectDB,
  salvarMensagem,
  buscarHistorico,
  obterEstatisticasDia
} = require('./database');

const {
  configurarCliente,
  iniciarProcessador
} = require('./scheduler');

// Conectar ao banco de dados
connectDB();

// Iniciar processador de agendamentos
iniciarProcessador();

// Configuração do bot
const botConfig = {
  session: 'bot-atendimento',
  headless: true,
  devtools: false,
  useChrome: true,
  debug: false,
  logQR: true,
  browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  autoClose: 60000,
  disableWelcome: true
};

// Base de conhecimento do bot
const respostas = {
  '/menu': `🤖 *Menu de Opções*\n\n1️⃣ Horário de atendimento\n2️⃣ Serviços disponíveis\n3️⃣ Falar com atendente\n4️⃣ Sobre nós\n5️⃣ Ver histórico\n\nDigite o número da opção desejada!`,
  
  '1': `⏰ *Horário de Atendimento*\n\nSegunda a Sexta: 8h às 18h\nSábado: 9h às 13h\nDomingo: Fechado\n\nDigite /menu para voltar ao menu principal.`,
  
  '2': `💼 *Nossos Serviços*\n\n✅ Consultoria\n✅ Desenvolvimento\n✅ Suporte técnico\n✅ Treinamentos\n\nDigite /menu para voltar ao menu principal.`,
  
  '3': `👤 *Transferindo para atendente...*\n\nAguarde um momento que já vamos te atender!`,
  
  '4': `ℹ️ *Sobre Nós*\n\nSomos uma empresa focada em soluções tecnológicas inovadoras.\n\nDigite /menu para voltar ao menu principal.`,
  
  '5': `📋 *Seu Histórico*\n\nBuscando suas últimas conversas...`
};

// Variável global para o cliente
let clienteWhatsApp = null;

// Função para processar mensagens
async function processarMensagem(mensagem, chatId) {
  const texto = mensagem.toLowerCase().trim();
  
  // Comandos especiais
  if (texto === '/menu' || texto === 'menu') {
    return respostas['/menu'];
  }
  
  // Ver histórico
  if (texto === '5') {
    const historico = await buscarHistorico(chatId, 5);
    if (historico.length > 0) {
      let textoHistorico = '📋 *Últimas 5 conversas:*\n\n';
      historico.reverse().forEach((msg, index) => {
        const data = new Date(msg.timestamp).toLocaleString('pt-BR');
        textoHistorico += `${index + 1}. [${data}]\n`;
        textoHistorico += `   Você: ${msg.mensagem}\n`;
        textoHistorico += `   Bot: ${msg.resposta.substring(0, 50)}...\n\n`;
      });
      return textoHistorico + 'Digite /menu para voltar ao menu.';
    } else {
      return 'Você ainda não tem histórico de conversas.\n\nDigite /menu para começar.';
    }
  }
  
  // Opções do menu
  if (respostas[texto]) {
    return respostas[texto];
  }
  
  // Saudações
  if (texto.includes('oi') || texto.includes('olá') || texto.includes('ola')) {
    return `Olá! 👋 Seja bem-vindo(a)!\n\nDigite /menu para ver as opções disponíveis.`;
  }
  
  // Agradecimentos
  if (texto.includes('obrigado') || texto.includes('obrigada') || texto.includes('valeu')) {
    return `Por nada! 😊 Estamos aqui para ajudar.\n\nDigite /menu se precisar de mais alguma coisa.`;
  }
  
  // Resposta padrão
  return `Desculpe, não entendi sua mensagem. 🤔\n\nDigite /menu para ver as opções disponíveis.`;
}

// Iniciar o bot
wppconnect
  .create(botConfig)
  .then((client) => {
    clienteWhatsApp = client;
    start(client);
  })
  .catch((error) => {
    console.error('Erro ao iniciar o bot:', error);
  });

function start(client) {
  console.log('✅ Bot iniciado com sucesso!');
  console.log('📱 Escaneie o QR Code para conectar');
  
  // Configurar cliente no agendador
  configurarCliente(client);

  // Listener para novas mensagens
  client.onMessage(async (message) => {
    try {
      // Ignora mensagens de grupos e de mídia
      if (message.isGroupMsg || message.isMedia) return;

      const chatId = message.from;
      const nomeContato = message.notifyName || message.sender.pushname || 'Usuário';
      
      console.log(`📩 Mensagem de ${nomeContato}: ${message.body}`);

      // Simula "digitando..."
      await client.startTyping(chatId);
      
      // Processa a mensagem
      const resposta = await processarMensagem(message.body, chatId);
      
      // Pequeno delay para parecer mais natural
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Envia a resposta
      await client.sendText(chatId, resposta);
      
      // Para de "digitar"
      await client.stopTyping(chatId);
      
      console.log(`✅ Resposta enviada para ${nomeContato}`);

      // Salva no banco de dados
      await salvarMensagem({
        chatId,
        nomeContato,
        mensagem: message.body,
        resposta,
        tipo: 'recebida'
      });

    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  });

  // Listener para status de conexão
  client.onStateChange((state) => {
    console.log('Estado da conexão:', state);
    if (state === 'CONFLICT' || state === 'UNLAUNCHED') {
      console.log('⚠️ Conexão encerrada. Reiniciando...');
    }
  });

  // Estatísticas diárias a cada hora
  setInterval(async () => {
    try {
      const stats = await obterEstatisticasDia();
      console.log('📊 Estatísticas do dia:', stats);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
    }
  }, 3600000); // 1 hora
}

// Função para enviar mensagem programada (pode ser chamada externamente)
async function enviarMensagemProgramada(chatId, mensagem) {
  try {
    if (!clienteWhatsApp) {
      throw new Error('Bot não está conectado');
    }
    await clienteWhatsApp.sendText(chatId, mensagem);
    
    // Salva no banco
    await salvarMensagem({
      chatId,
      nomeContato: 'Sistema',
      mensagem: 'Mensagem programada',
      resposta: mensagem,
      tipo: 'enviada'
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem programada:', error);
    return false;
  }
}

// Exporta funções para uso no dashboard
module.exports = {
  enviarMensagemProgramada,
  getClient: () => clienteWhatsApp
};

// Tratamento de erros
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});

console.log('🚀 Iniciando bot de WhatsApp com banco de dados...');