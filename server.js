// Servidor Express com Autenticação e Agendamento
const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  connectDB,
  buscarContatos,
  buscarHistorico,
  obterEstatisticasDia,
  buscarMensagensPorPeriodo,
  Mensagem,
  Contato,
  Configuracao
} = require('./database');

const {
  criarUsuarioAdmin,
  autenticar,
  autorizar,
  login,
  registrar,
  alterarSenha,
  Usuario
} = require('./auth');

const {
  agendarMensagem,
  agendarMensagemRecorrente,
  cancelarAgendamento,
  listarAgendamentos,
  obterEstatisticasAgendamentos
} = require('./scheduler');

const googleCalendar = require('./google-calendar');

// Inicializar Google Calendar
googleCalendar.inicializar();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao banco e criar admin
connectDB().then(() => {
  criarUsuarioAdmin();
});

// ========== ROTAS DE AUTENTICAÇÃO (públicas) ==========

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email e senha são obrigatórios' 
      });
    }
    
    const resultado = await login(email, senha);
    
    if (!resultado.sucesso) {
      return res.status(401).json({ 
        success: false, 
        error: resultado.mensagem 
      });
    }
    
    res.json({ 
      success: true, 
      data: resultado 
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verificar token (para validar sessão)
app.get('/api/auth/verificar', autenticar, async (req, res) => {
  res.json({ 
    success: true, 
    usuario: req.usuario 
  });
});

// ========== ROTAS DE USUÁRIOS (protegidas) ==========

// Registrar novo usuário (apenas admin)
app.post('/api/usuarios', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const resultado = await registrar(req.body);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ 
        success: false, 
        error: resultado.mensagem 
      });
    }
    
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar usuários (apenas admin)
app.get('/api/usuarios', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Alterar senha
app.post('/api/usuarios/senha', autenticar, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const resultado = await alterarSenha(req.usuario._id, senhaAtual, novaSenha);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ 
        success: false, 
        error: resultado.mensagem 
      });
    }
    
    res.json({ success: true, message: resultado.mensagem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ROTAS DE AGENDAMENTO (protegidas) ==========

// Agendar mensagem única
app.post('/api/agendamentos', autenticar, async (req, res) => {
  try {
    const dados = {
      ...req.body,
      criadaPor: req.usuario._id
    };
    
    const resultado = await agendarMensagem(dados);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ 
        success: false, 
        error: resultado.mensagem 
      });
    }
    
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Agendar mensagem recorrente
app.post('/api/agendamentos/recorrente', autenticar, async (req, res) => {
  try {
    const dados = {
      ...req.body,
      criadaPor: req.usuario._id
    };
    
    const resultado = await agendarMensagemRecorrente(dados);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ 
        success: false, 
        error: resultado.mensagem 
      });
    }
    
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar agendamentos
app.get('/api/agendamentos', autenticar, async (req, res) => {
  try {
    const { status, tipo } = req.query;
    const filtros = {};
    
    if (status) filtros.status = status;
    if (tipo) filtros.tipo = tipo;
    
    const resultado = await listarAgendamentos(filtros);
    res.json({ success: true, data: resultado.agendamentos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancelar agendamento
app.delete('/api/agendamentos/:id', autenticar, async (req, res) => {
  try {
    const resultado = await cancelarAgendamento(req.params.id);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ 
        success: false, 
        error: resultado.mensagem 
      });
    }
    
    res.json({ success: true, message: resultado.mensagem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Estatísticas de agendamentos
app.get('/api/agendamentos/stats', autenticar, async (req, res) => {
  try {
    const stats = await obterEstatisticasAgendamentos();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ROTAS DO GOOGLE CALENDAR (protegidas) ==========

// Verificar se está conectado ao Google Calendar
app.get('/api/google-calendar/status', autenticar, async (req, res) => {
  try {
    const conectado = await googleCalendar.verificarConexao(req.usuario._id);
    res.json({ success: true, conectado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obter URL de autorização
app.get('/api/google-calendar/auth-url', autenticar, async (req, res) => {
  try {
    const resultado = googleCalendar.gerarUrlAutorizacao(req.usuario._id);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ success: false, error: resultado.mensagem });
    }
    
    res.json({ success: true, url: resultado.url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Callback OAuth (processar código)
app.get('/api/google-calendar/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).send('Código ou state ausente');
    }
    
    const resultado = await googleCalendar.trocarCodigoPorTokens(code, state);
    
    if (resultado.sucesso) {
      res.send(`
        <html>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>✅ Google Calendar Conectado!</h1>
            <p>Você pode fechar esta janela e voltar ao dashboard.</p>
            <script>
              setTimeout(() => window.close(), 3000);
            </script>
          </body>
        </html>
      `);
    } else {
      res.status(400).send(`
        <html>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>❌ Erro ao Conectar</h1>
            <p>${resultado.mensagem}</p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    res.status(500).send('Erro ao processar callback');
  }
});

// Desconectar Google Calendar
app.delete('/api/google-calendar/disconnect', autenticar, async (req, res) => {
  try {
    const resultado = await googleCalendar.desconectar(req.usuario._id);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ success: false, error: resultado.mensagem });
    }
    
    res.json({ success: true, message: resultado.mensagem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Criar evento no Google Calendar
app.post('/api/google-calendar/eventos', autenticar, async (req, res) => {
  try {
    const resultado = await googleCalendar.criarEvento(req.usuario._id, req.body);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ success: false, error: resultado.mensagem });
    }
    
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar próximos eventos
app.get('/api/google-calendar/eventos', autenticar, async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    const resultado = await googleCalendar.listarProximosEventos(req.usuario._id, parseInt(limite));
    
    if (!resultado.sucesso) {
      return res.status(400).json({ success: false, error: resultado.mensagem });
    }
    
    res.json({ success: true, data: resultado.eventos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sincronizar agendamento com Google Calendar
app.post('/api/google-calendar/sincronizar/:agendamentoId', autenticar, async (req, res) => {
  try {
    const { MensagemAgendada } = require('./scheduler');
    const agendamento = await MensagemAgendada.findById(req.params.agendamentoId);
    
    if (!agendamento) {
      return res.status(404).json({ success: false, error: 'Agendamento não encontrado' });
    }
    
    const resultado = await googleCalendar.sincronizarAgendamento(req.usuario._id, agendamento);
    
    if (!resultado.sucesso) {
      return res.status(400).json({ success: false, error: resultado.mensagem });
    }
    
    // Salvar ID do evento no agendamento
    agendamento.googleCalendarEventId = resultado.eventoId;
    await agendamento.save();
    
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ROTAS DO DASHBOARD (protegidas) ==========

// Dashboard - Estatísticas gerais
app.get('/api/dashboard', autenticar, async (req, res) => {
  try {
    const hoje = await obterEstatisticasDia();
    const totalContatos = await Contato.countDocuments();
    const contatosAtivos = await Contato.countDocuments({ 
      status: 'ativo',
      ultimoContato: { 
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const mensagensSemana = await Mensagem.countDocuments({
      timestamp: { $gte: seteDiasAtras }
    });

    res.json({
      success: true,
      data: {
        hoje,
        totalContatos,
        contatosAtivos,
        mensagensSemana
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar contatos
app.get('/api/contatos', autenticar, async (req, res) => {
  try {
    const { limite = 50, status, busca } = req.query;
    
    let filtros = {};
    if (status) filtros.status = status;
    if (busca) {
      filtros.$or = [
        { nome: { $regex: busca, $options: 'i' } },
        { telefone: { $regex: busca, $options: 'i' } }
      ];
    }
    
    const contatos = await buscarContatos(filtros, parseInt(limite));
    res.json({ success: true, data: contatos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Detalhes de um contato
app.get('/api/contatos/:chatId', autenticar, async (req, res) => {
  try {
    const contato = await Contato.findOne({ chatId: req.params.chatId });
    if (!contato) {
      return res.status(404).json({ success: false, error: 'Contato não encontrado' });
    }
    res.json({ success: true, data: contato });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Atualizar contato
app.put('/api/contatos/:chatId', autenticar, async (req, res) => {
  try {
    const { status, tags, notas } = req.body;
    const contato = await Contato.findOneAndUpdate(
      { chatId: req.params.chatId },
      { $set: { status, tags, notas } },
      { new: true }
    );
    res.json({ success: true, data: contato });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Histórico de conversa
app.get('/api/historico/:chatId', autenticar, async (req, res) => {
  try {
    const { limite = 100 } = req.query;
    const historico = await buscarHistorico(req.params.chatId, parseInt(limite));
    res.json({ success: true, data: historico });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mensagens por período
app.get('/api/mensagens', autenticar, async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    const inicio = dataInicio ? new Date(dataInicio) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const fim = dataFim ? new Date(dataFim) : new Date();
    
    const mensagens = await buscarMensagensPorPeriodo(inicio, fim);
    res.json({ success: true, data: mensagens });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Estatísticas por período
app.get('/api/estatisticas', autenticar, async (req, res) => {
  try {
    const { dias = 7 } = req.query;
    const estatisticas = [];
    
    for (let i = 0; i < parseInt(dias); i++) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const stats = await obterEstatisticasDia(data);
      estatisticas.push(stats);
    }
    
    res.json({ success: true, data: estatisticas.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Configurações
app.get('/api/configuracoes', autenticar, async (req, res) => {
  try {
    const configs = await Configuracao.find();
    res.json({ success: true, data: configs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/configuracoes', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const { chave, valor, descricao } = req.body;
    const config = await Configuracao.findOneAndUpdate(
      { chave },
      { valor, descricao, atualizadoEm: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Busca global
app.get('/api/buscar', autenticar, async (req, res) => {
  try {
    const { termo } = req.query;
    
    if (!termo) {
      return res.status(400).json({ success: false, error: 'Termo de busca obrigatório' });
    }
    
    const regex = { $regex: termo, $options: 'i' };
    
    const [contatos, mensagens] = await Promise.all([
      Contato.find({ 
        $or: [{ nome: regex }, { telefone: regex }] 
      }).limit(20),
      Mensagem.find({ 
        $or: [{ mensagem: regex }, { resposta: regex }] 
      }).limit(50).sort({ timestamp: -1 })
    ]);
    
    res.json({ 
      success: true, 
      data: { contatos, mensagens } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota principal - serve o HTML do dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Dashboard rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`🔐 Faça login com: admin@bot.com / admin123`);
});

module.exports = app;