// Sistema de Agendamento de Mensagens
const mongoose = require('mongoose');
const cron = require('node-cron');

// Schema para mensagens agendadas
const mensagemAgendadaSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    index: true
  },
  nomeContato: {
    type: String,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  dataAgendamento: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pendente', 'enviada', 'falhou', 'cancelada'],
    default: 'pendente',
    index: true
  },
  tentativas: {
    type: Number,
    default: 0
  },
  erro: String,
  enviadaEm: Date,
  criadaPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  criadaEm: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['unica', 'recorrente'],
    default: 'unica'
  },
  recorrencia: {
    frequencia: {
      type: String,
      enum: ['diaria', 'semanal', 'mensal']
    },
    diasSemana: [Number], // 0-6 (domingo a sábado)
    diaMes: Number, // 1-31
    horario: String // HH:mm
  },
  ativa: {
    type: Boolean,
    default: true
  },
  googleCalendarEventId: String, // ID do evento no Google Calendar
  sincronizadoComCalendar: {
    type: Boolean,
    default: false
  }
});

const MensagemAgendada = mongoose.model('MensagemAgendada', mensagemAgendadaSchema);

// Referência ao cliente do WhatsApp (será definida depois)
let clienteWhatsApp = null;

// Configurar cliente do WhatsApp
const configurarCliente = (cliente) => {
  clienteWhatsApp = cliente;
  console.log('✅ Cliente WhatsApp configurado no agendador');
};

// Agendar mensagem única
const agendarMensagem = async (dados) => {
  try {
    const { chatId, nomeContato, mensagem, dataAgendamento, criadaPor } = dados;
    
    // Validar data
    const dataAgenda = new Date(dataAgendamento);
    if (dataAgenda <= new Date()) {
      return {
        sucesso: false,
        mensagem: 'Data de agendamento deve ser futura'
      };
    }
    
    // Criar agendamento
    const agendamento = new MensagemAgendada({
      chatId,
      nomeContato,
      mensagem,
      dataAgendamento: dataAgenda,
      criadaPor,
      tipo: 'unica'
    });
    
    await agendamento.save();
    
    console.log(`📅 Mensagem agendada para ${nomeContato} em ${dataAgenda}`);
    
    return {
      sucesso: true,
      mensagem: 'Mensagem agendada com sucesso',
      agendamento: {
        id: agendamento._id,
        dataAgendamento: agendamento.dataAgendamento,
        status: agendamento.status
      }
    };
    
  } catch (error) {
    console.error('Erro ao agendar mensagem:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao agendar mensagem'
    };
  }
};

// Agendar mensagem recorrente
const agendarMensagemRecorrente = async (dados) => {
  try {
    const { 
      chatId, 
      nomeContato, 
      mensagem, 
      frequencia, 
      horario,
      diasSemana,
      diaMes,
      criadaPor 
    } = dados;
    
    // Validar dados de recorrência
    if (!['diaria', 'semanal', 'mensal'].includes(frequencia)) {
      return {
        sucesso: false,
        mensagem: 'Frequência inválida'
      };
    }
    
    // Calcular próxima execução
    const proximaExecucao = calcularProximaExecucao(frequencia, horario, diasSemana, diaMes);
    
    // Criar agendamento
    const agendamento = new MensagemAgendada({
      chatId,
      nomeContato,
      mensagem,
      dataAgendamento: proximaExecucao,
      criadaPor,
      tipo: 'recorrente',
      recorrencia: {
        frequencia,
        diasSemana,
        diaMes,
        horario
      }
    });
    
    await agendamento.save();
    
    console.log(`🔄 Mensagem recorrente agendada para ${nomeContato}`);
    
    return {
      sucesso: true,
      mensagem: 'Mensagem recorrente agendada com sucesso',
      agendamento: {
        id: agendamento._id,
        proximaExecucao: agendamento.dataAgendamento,
        frequencia: frequencia
      }
    };
    
  } catch (error) {
    console.error('Erro ao agendar mensagem recorrente:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao agendar mensagem recorrente'
    };
  }
};

// Calcular próxima execução
const calcularProximaExecucao = (frequencia, horario, diasSemana, diaMes) => {
  const agora = new Date();
  const [hora, minuto] = horario.split(':').map(Number);
  
  let proxima = new Date();
  proxima.setHours(hora, minuto, 0, 0);
  
  switch (frequencia) {
    case 'diaria':
      // Se já passou a hora de hoje, agendar para amanhã
      if (proxima <= agora) {
        proxima.setDate(proxima.getDate() + 1);
      }
      break;
      
    case 'semanal':
      // Encontrar próximo dia da semana
      const diaAtual = proxima.getDay();
      let diasAdicionar = diasSemana
        .map(d => (d - diaAtual + 7) % 7 || 7)
        .sort((a, b) => a - b)[0];
      
      proxima.setDate(proxima.getDate() + diasAdicionar);
      
      // Se é hoje mas já passou a hora, pegar próximo dia da semana
      if (proxima <= agora) {
        diasAdicionar = diasSemana
          .map(d => (d - diaAtual + 7) % 7)
          .filter(d => d > 0)
          .sort((a, b) => a - b)[0] || 7;
        proxima.setDate(agora.getDate() + diasAdicionar);
      }
      break;
      
    case 'mensal':
      proxima.setDate(diaMes);
      
      // Se já passou este mês, agendar para próximo mês
      if (proxima <= agora) {
        proxima.setMonth(proxima.getMonth() + 1);
        proxima.setDate(diaMes);
      }
      break;
  }
  
  return proxima;
};

// Enviar mensagem agendada
const enviarMensagemAgendada = async (agendamento) => {
  try {
    if (!clienteWhatsApp) {
      throw new Error('Cliente WhatsApp não configurado');
    }
    
    // Enviar mensagem
    await clienteWhatsApp.sendText(agendamento.chatId, agendamento.mensagem);
    
    // Atualizar status
    agendamento.status = 'enviada';
    agendamento.enviadaEm = new Date();
    agendamento.tentativas += 1;
    
    // Se for recorrente, calcular próxima execução
    if (agendamento.tipo === 'recorrente' && agendamento.ativa) {
      const { frequencia, horario, diasSemana, diaMes } = agendamento.recorrencia;
      agendamento.dataAgendamento = calcularProximaExecucao(
        frequencia, 
        horario, 
        diasSemana, 
        diaMes
      );
      agendamento.status = 'pendente';
    }
    
    await agendamento.save();
    
    console.log(`✅ Mensagem enviada para ${agendamento.nomeContato}`);
    
    return true;
    
  } catch (error) {
    console.error('Erro ao enviar mensagem agendada:', error);
    
    // Atualizar com erro
    agendamento.status = 'falhou';
    agendamento.erro = error.message;
    agendamento.tentativas += 1;
    
    // Tentar novamente em 5 minutos se ainda não excedeu tentativas
    if (agendamento.tentativas < 3) {
      agendamento.dataAgendamento = new Date(Date.now() + 5 * 60 * 1000);
      agendamento.status = 'pendente';
    }
    
    await agendamento.save();
    
    return false;
  }
};

// Processar mensagens agendadas (executar a cada minuto)
const processarAgendamentos = async () => {
  try {
    const agora = new Date();
    
    // Buscar mensagens pendentes que já chegaram na hora
    const mensagensPendentes = await MensagemAgendada.find({
      status: 'pendente',
      dataAgendamento: { $lte: agora },
      ativa: true
    }).limit(50); // Processar no máximo 50 por vez
    
    if (mensagensPendentes.length > 0) {
      console.log(`⏰ Processando ${mensagensPendentes.length} mensagens agendadas...`);
    }
    
    // Enviar cada mensagem
    for (const agendamento of mensagensPendentes) {
      await enviarMensagemAgendada(agendamento);
      
      // Pequeno delay entre envios para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('Erro ao processar agendamentos:', error);
  }
};

// Iniciar processamento de agendamentos (executa a cada minuto)
const iniciarProcessador = () => {
  // Executar a cada minuto
  cron.schedule('* * * * *', () => {
    processarAgendamentos();
  });
  
  console.log('✅ Processador de agendamentos iniciado (executa a cada minuto)');
  
  // Executar imediatamente na inicialização
  processarAgendamentos();
};

// Cancelar agendamento
const cancelarAgendamento = async (agendamentoId) => {
  try {
    const agendamento = await MensagemAgendada.findById(agendamentoId);
    
    if (!agendamento) {
      return {
        sucesso: false,
        mensagem: 'Agendamento não encontrado'
      };
    }
    
    if (agendamento.status === 'enviada') {
      return {
        sucesso: false,
        mensagem: 'Não é possível cancelar uma mensagem já enviada'
      };
    }
    
    agendamento.status = 'cancelada';
    agendamento.ativa = false;
    await agendamento.save();
    
    return {
      sucesso: true,
      mensagem: 'Agendamento cancelado com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao cancelar agendamento'
    };
  }
};

// Listar agendamentos
const listarAgendamentos = async (filtros = {}) => {
  try {
    const query = { ...filtros };
    
    const agendamentos = await MensagemAgendada.find(query)
      .sort({ dataAgendamento: 1 })
      .populate('criadaPor', 'nome email')
      .limit(100);
    
    return {
      sucesso: true,
      agendamentos
    };
    
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao listar agendamentos',
      agendamentos: []
    };
  }
};

// Obter estatísticas de agendamentos
const obterEstatisticasAgendamentos = async () => {
  try {
    const total = await MensagemAgendada.countDocuments();
    const pendentes = await MensagemAgendada.countDocuments({ status: 'pendente', ativa: true });
    const enviadas = await MensagemAgendada.countDocuments({ status: 'enviada' });
    const falhadas = await MensagemAgendada.countDocuments({ status: 'falhou' });
    const recorrentes = await MensagemAgendada.countDocuments({ tipo: 'recorrente', ativa: true });
    
    // Próximas 5 mensagens
    const proximas = await MensagemAgendada.find({ 
      status: 'pendente', 
      ativa: true 
    })
      .sort({ dataAgendamento: 1 })
      .limit(5)
      .select('nomeContato mensagem dataAgendamento');
    
    return {
      total,
      pendentes,
      enviadas,
      falhadas,
      recorrentes,
      proximas
    };
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      total: 0,
      pendentes: 0,
      enviadas: 0,
      falhadas: 0,
      recorrentes: 0,
      proximas: []
    };
  }
};

module.exports = {
  MensagemAgendada,
  configurarCliente,
  agendarMensagem,
  agendarMensagemRecorrente,
  cancelarAgendamento,
  listarAgendamentos,
  iniciarProcessador,
  obterEstatisticasAgendamentos
};