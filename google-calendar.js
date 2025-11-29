// Integração com Google Calendar API
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Schema para armazenar tokens OAuth
const googleTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },
  accessToken: String,
  refreshToken: String,
  expiryDate: Date,
  scope: [String],
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

const GoogleToken = mongoose.model('GoogleToken', googleTokenSchema);

// Configurações do OAuth2
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'google-credentials.json');

// Credenciais OAuth2 (serão obtidas do Google Cloud Console)
let credentials = null;

// Carregar credenciais
const carregarCredenciais = () => {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      credentials = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      return true;
    }
    console.warn('⚠️  Arquivo de credenciais do Google não encontrado.');
    console.warn('📖 Veja GUIA_GOOGLE_CALENDAR.md para configurar.');
    return false;
  } catch (error) {
    console.error('Erro ao carregar credenciais:', error);
    return false;
  }
};

// Criar cliente OAuth2
const criarClienteOAuth = () => {
  if (!credentials) {
    throw new Error('Credenciais do Google não carregadas');
  }

  const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
  
  return new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
};

// Gerar URL de autorização
const gerarUrlAutorizacao = (userId) => {
  try {
    const oAuth2Client = criarClienteOAuth();
    
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: userId.toString() // Para identificar o usuário depois
    });
    
    return {
      sucesso: true,
      url: authUrl
    };
  } catch (error) {
    console.error('Erro ao gerar URL de autorização:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao gerar URL de autorização'
    };
  }
};

// Trocar código por tokens
const trocarCodigoPorTokens = async (code, userId) => {
  try {
    const oAuth2Client = criarClienteOAuth();
    const { tokens } = await oAuth2Client.getToken(code);
    
    // Salvar tokens no banco
    await GoogleToken.findOneAndUpdate(
      { userId },
      {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: new Date(tokens.expiry_date),
        scope: tokens.scope.split(' '),
        atualizadoEm: new Date()
      },
      { upsert: true, new: true }
    );
    
    return {
      sucesso: true,
      mensagem: 'Google Calendar conectado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao trocar código por tokens:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao conectar com Google Calendar'
    };
  }
};

// Obter cliente autenticado
const obterClienteAutenticado = async (userId) => {
  try {
    const tokenData = await GoogleToken.findOne({ userId });
    
    if (!tokenData) {
      return null;
    }
    
    const oAuth2Client = criarClienteOAuth();
    
    oAuth2Client.setCredentials({
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken,
      expiry_date: tokenData.expiryDate.getTime(),
      scope: tokenData.scope.join(' ')
    });
    
    // Verificar se token precisa ser renovado
    if (tokenData.expiryDate < new Date()) {
      const { credentials: newTokens } = await oAuth2Client.refreshAccessToken();
      
      // Atualizar tokens no banco
      tokenData.accessToken = newTokens.access_token;
      tokenData.expiryDate = new Date(newTokens.expiry_date);
      tokenData.atualizadoEm = new Date();
      await tokenData.save();
      
      oAuth2Client.setCredentials(newTokens);
    }
    
    return oAuth2Client;
  } catch (error) {
    console.error('Erro ao obter cliente autenticado:', error);
    return null;
  }
};

// Verificar se usuário está conectado
const verificarConexao = async (userId) => {
  const tokenData = await GoogleToken.findOne({ userId });
  return !!tokenData;
};

// Desconectar Google Calendar
const desconectar = async (userId) => {
  try {
    await GoogleToken.deleteOne({ userId });
    return {
      sucesso: true,
      mensagem: 'Google Calendar desconectado'
    };
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao desconectar Google Calendar'
    };
  }
};

// Criar evento no Google Calendar
const criarEvento = async (userId, eventoData) => {
  try {
    const auth = await obterClienteAutenticado(userId);
    
    if (!auth) {
      return {
        sucesso: false,
        mensagem: 'Usuário não conectado ao Google Calendar'
      };
    }
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    const {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      localizacao,
      lembrete = 10, // minutos antes
      recorrencia
    } = eventoData;
    
    const evento = {
      summary: titulo,
      description: descricao,
      location: localizacao,
      start: {
        dateTime: dataInicio,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: dataFim || new Date(new Date(dataInicio).getTime() + 60 * 60 * 1000), // +1h se não especificado
        timeZone: 'America/Sao_Paulo'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: lembrete }
        ]
      }
    };
    
    // Adicionar recorrência se fornecida
    if (recorrencia) {
      evento.recurrence = [recorrencia];
    }
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento
    });
    
    return {
      sucesso: true,
      mensagem: 'Evento criado no Google Calendar',
      eventoId: response.data.id,
      link: response.data.htmlLink
    };
    
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return {
      sucesso: false,
      mensagem: error.message || 'Erro ao criar evento no Google Calendar'
    };
  }
};

// Atualizar evento no Google Calendar
const atualizarEvento = async (userId, eventoId, dadosAtualizados) => {
  try {
    const auth = await obterClienteAutenticado(userId);
    
    if (!auth) {
      return {
        sucesso: false,
        mensagem: 'Usuário não conectado ao Google Calendar'
      };
    }
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Buscar evento existente
    const eventoExistente = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventoId
    });
    
    // Mesclar dados
    const eventoAtualizado = {
      ...eventoExistente.data,
      ...dadosAtualizados
    };
    
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventoId,
      resource: eventoAtualizado
    });
    
    return {
      sucesso: true,
      mensagem: 'Evento atualizado no Google Calendar',
      link: response.data.htmlLink
    };
    
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao atualizar evento no Google Calendar'
    };
  }
};

// Deletar evento do Google Calendar
const deletarEvento = async (userId, eventoId) => {
  try {
    const auth = await obterClienteAutenticado(userId);
    
    if (!auth) {
      return {
        sucesso: false,
        mensagem: 'Usuário não conectado ao Google Calendar'
      };
    }
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventoId
    });
    
    return {
      sucesso: true,
      mensagem: 'Evento removido do Google Calendar'
    };
    
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao remover evento do Google Calendar'
    };
  }
};

// Listar próximos eventos
const listarProximosEventos = async (userId, maxResultados = 10) => {
  try {
    const auth = await obterClienteAutenticado(userId);
    
    if (!auth) {
      return {
        sucesso: false,
        mensagem: 'Usuário não conectado ao Google Calendar'
      };
    }
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: maxResultados,
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    const eventos = response.data.items.map(evento => ({
      id: evento.id,
      titulo: evento.summary,
      descricao: evento.description,
      inicio: evento.start.dateTime || evento.start.date,
      fim: evento.end.dateTime || evento.end.date,
      link: evento.htmlLink
    }));
    
    return {
      sucesso: true,
      eventos
    };
    
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao listar eventos do Google Calendar',
      eventos: []
    };
  }
};

// Converter agendamento para evento do Google Calendar
const agendamentoParaEvento = (agendamento) => {
  const dataInicio = new Date(agendamento.dataAgendamento);
  const dataFim = new Date(dataInicio.getTime() + 15 * 60 * 1000); // +15 min
  
  let recorrencia = null;
  
  if (agendamento.tipo === 'recorrente' && agendamento.recorrencia) {
    const { frequencia, diasSemana, diaMes } = agendamento.recorrencia;
    
    switch (frequencia) {
      case 'diaria':
        recorrencia = 'RRULE:FREQ=DAILY';
        break;
      case 'semanal':
        const dias = diasSemana.map(d => ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][d]).join(',');
        recorrencia = `RRULE:FREQ=WEEKLY;BYDAY=${dias}`;
        break;
      case 'mensal':
        recorrencia = `RRULE:FREQ=MONTHLY;BYMONTHDAY=${diaMes}`;
        break;
    }
  }
  
  return {
    titulo: `WhatsApp: ${agendamento.nomeContato}`,
    descricao: `Mensagem agendada para:\n\n${agendamento.mensagem}\n\n📱 Contato: ${agendamento.nomeContato}\n🤖 Bot WhatsApp`,
    dataInicio: dataInicio.toISOString(),
    dataFim: dataFim.toISOString(),
    localizacao: 'WhatsApp',
    lembrete: 10,
    recorrencia
  };
};

// Sincronizar agendamento com Google Calendar
const sincronizarAgendamento = async (userId, agendamento) => {
  try {
    const eventoData = agendamentoParaEvento(agendamento);
    const resultado = await criarEvento(userId, eventoData);
    
    return resultado;
  } catch (error) {
    console.error('Erro ao sincronizar agendamento:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao sincronizar com Google Calendar'
    };
  }
};

// Inicializar (carregar credenciais)
const inicializar = () => {
  const credenciaisCarregadas = carregarCredenciais();
  
  if (credenciaisCarregadas) {
    console.log('✅ Google Calendar: Credenciais carregadas');
  } else {
    console.log('⚠️  Google Calendar: Configure as credenciais para usar');
  }
  
  return credenciaisCarregadas;
};

module.exports = {
  GoogleToken,
  inicializar,
  gerarUrlAutorizacao,
  trocarCodigoPorTokens,
  verificarConexao,
  desconectar,
  criarEvento,
  atualizarEvento,
  deletarEvento,
  listarProximosEventos,
  sincronizarAgendamento,
  agendamentoParaEvento
};