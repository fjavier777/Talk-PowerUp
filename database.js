// ===================================
// BANCO DE DADOS - MongoDB + Mongoose
// Sistema completo de persistência
// ===================================

const mongoose = require('mongoose');

// Conexão com MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-bot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

// ===================================
// SCHEMAS
// ===================================

// Schema: Mensagens
const mensagemSchema = new mongoose.Schema({
  chatId: { type: String, required: true, index: true },
  nomeContato: { type: String, required: true },
  mensagem: { type: String, required: true },
  resposta: { type: String, required: true },
  tipo: { type: String, enum: ['recebida', 'enviada'], default: 'recebida' },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Schema: Contatos
const contatoSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true, index: true },
  nome: { type: String, required: true },
  telefone: String,
  primeiroContato: { type: Date, default: Date.now },
  ultimoContato: { type: Date, default: Date.now },
  totalMensagens: { type: Number, default: 0 },
  status: { type: String, enum: ['ativo', 'inativo', 'bloqueado'], default: 'ativo' },
  tags: [String],
  notas: String
});

// Schema: Configurações
const configuracaoSchema = new mongoose.Schema({
  chave: { type: String, required: true, unique: true },
  valor: mongoose.Schema.Types.Mixed,
  descricao: String,
  atualizadoEm: { type: Date, default: Date.now }
});

// Schema: Estatísticas
const estatisticaSchema = new mongoose.Schema({
  data: { type: Date, required: true, index: true },
  totalMensagens: { type: Number, default: 0 },
  totalContatos: { type: Number, default: 0 },
  novosContatos: { type: Number, default: 0 },
  tempoMedioResposta: Number,
  comandosMaisUsados: [{ comando: String, quantidade: Number }]
});

// Índices compostos
mensagemSchema.index({ chatId: 1, timestamp: -1 });
contatoSchema.index({ ultimoContato: -1 });
estatisticaSchema.index({ data: -1 });

// Models
const Mensagem = mongoose.model('Mensagem', mensagemSchema);
const Contato = mongoose.model('Contato', contatoSchema);
const Configuracao = mongoose.model('Configuracao', configuracaoSchema);
const Estatistica = mongoose.model('Estatistica', estatisticaSchema);

// ===================================
// FUNÇÕES AUXILIARES
// ===================================

// Salvar mensagem
const salvarMensagem = async (dados) => {
  try {
    const mensagem = new Mensagem(dados);
    await mensagem.save();
    await atualizarContato(dados.chatId, dados.nomeContato);
    return mensagem;
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    throw error;
  }
};

// Atualizar contato
const atualizarContato = async (chatId, nome) => {
  try {
    const contato = await Contato.findOneAndUpdate(
      { chatId },
      {
        $set: { nome, ultimoContato: new Date() },
        $inc: { totalMensagens: 1 },
        $setOnInsert: { primeiroContato: new Date() }
      },
      { upsert: true, new: true }
    );
    return contato;
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    throw error;
  }
};

// Buscar histórico
const buscarHistorico = async (chatId, limite = 50) => {
  try {
    return await Mensagem.find({ chatId })
      .sort({ timestamp: -1 })
      .limit(limite);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

// Buscar contatos
const buscarContatos = async (filtros = {}, limite = 100) => {
  try {
    return await Contato.find(filtros)
      .sort({ ultimoContato: -1 })
      .limit(limite);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw error;
  }
};

// Estatísticas do dia
const obterEstatisticasDia = async (data = new Date()) => {
  try {
    const inicioDia = new Date(data.setHours(0, 0, 0, 0));
    const fimDia = new Date(data.setHours(23, 59, 59, 999));
    
    const totalMensagens = await Mensagem.countDocuments({
      timestamp: { $gte: inicioDia, $lte: fimDia }
    });
    
    const novosContatos = await Contato.countDocuments({
      primeiroContato: { $gte: inicioDia, $lte: fimDia }
    });
    
    const totalContatos = await Contato.countDocuments();
    
    return { data: inicioDia, totalMensagens, totalContatos, novosContatos };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

// Buscar mensagens por período
const buscarMensagensPorPeriodo = async (dataInicio, dataFim) => {
  try {
    return await Mensagem.find({
      timestamp: { $gte: dataInicio, $lte: dataFim }
    }).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

// Salvar configuração
const salvarConfiguracao = async (chave, valor, descricao) => {
  try {
    return await Configuracao.findOneAndUpdate(
      { chave },
      { valor, descricao, atualizadoEm: new Date() },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    throw error;
  }
};

// Obter configuração
const obterConfiguracao = async (chave, valorPadrao = null) => {
  try {
    const config = await Configuracao.findOne({ chave });
    return config ? config.valor : valorPadrao;
  } catch (error) {
    console.error('Erro ao obter configuração:', error);
    return valorPadrao;
  }
};

// ===================================
// EXPORTS
// ===================================

module.exports = {
  connectDB,
  Mensagem,
  Contato,
  Configuracao,
  Estatistica,
  salvarMensagem,
  atualizarContato,
  buscarHistorico,
  buscarContatos,
  obterEstatisticasDia,
  buscarMensagensPorPeriodo,
  salvarConfiguracao,
  obterConfiguracao
};