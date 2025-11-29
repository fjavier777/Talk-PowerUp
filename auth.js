// Sistema de Autenticação com JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Secret key (em produção, use variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui-mude-em-producao';
const JWT_EXPIRES_IN = '24h';

// Schema para usuários
const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'atendente', 'visualizador'],
    default: 'atendente'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  ultimoLogin: Date,
  tentativasLogin: {
    type: Number,
    default: 0
  },
  bloqueadoAte: Date
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaFornecida) {
  return await bcrypt.compare(senhaFornecida, this.senha);
};

// Método para verificar se está bloqueado
usuarioSchema.methods.estaBloqueado = function() {
  if (!this.bloqueadoAte) return false;
  return this.bloqueadoAte > new Date();
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Criar usuário admin padrão (apenas se não existir)
const criarUsuarioAdmin = async () => {
  try {
    const adminExiste = await Usuario.findOne({ email: 'admin@bot.com' });
    
    if (!adminExiste) {
      const admin = new Usuario({
        nome: 'Administrador',
        email: 'admin@bot.com',
        senha: 'admin123', // MUDE ISSO EM PRODUÇÃO!
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Usuário admin criado: admin@bot.com / admin123');
      console.log('⚠️  IMPORTANTE: Altere a senha padrão imediatamente!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
};

// Gerar token JWT
const gerarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario._id, 
      email: usuario.email, 
      role: usuario.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verificar token JWT
const verificarToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware de autenticação
const autenticar = async (req, res, next) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token não fornecido' 
      });
    }
    
    // Formato: Bearer TOKEN
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido' 
      });
    }
    
    // Verificar token
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expirado ou inválido' 
      });
    }
    
    // Buscar usuário
    const usuario = await Usuario.findById(decoded.id).select('-senha');
    
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuário não encontrado ou inativo' 
      });
    }
    
    // Adicionar usuário à requisição
    req.usuario = usuario;
    next();
    
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Falha na autenticação' 
    });
  }
};

// Middleware de autorização por role
const autorizar = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false, 
        error: 'Não autenticado' 
      });
    }
    
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Sem permissão para esta ação' 
      });
    }
    
    next();
  };
};

// Login
const login = async (email, senha) => {
  try {
    // Buscar usuário
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      return { 
        sucesso: false, 
        mensagem: 'Email ou senha incorretos' 
      };
    }
    
    // Verificar se está bloqueado
    if (usuario.estaBloqueado()) {
      return { 
        sucesso: false, 
        mensagem: 'Usuário temporariamente bloqueado. Tente novamente mais tarde.' 
      };
    }
    
    // Verificar se está ativo
    if (!usuario.ativo) {
      return { 
        sucesso: false, 
        mensagem: 'Usuário inativo' 
      };
    }
    
    // Comparar senha
    const senhaCorreta = await usuario.compararSenha(senha);
    
    if (!senhaCorreta) {
      // Incrementar tentativas de login
      usuario.tentativasLogin += 1;
      
      // Bloquear após 5 tentativas
      if (usuario.tentativasLogin >= 5) {
        usuario.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        await usuario.save();
        
        return { 
          sucesso: false, 
          mensagem: 'Muitas tentativas de login. Conta bloqueada por 15 minutos.' 
        };
      }
      
      await usuario.save();
      
      return { 
        sucesso: false, 
        mensagem: 'Email ou senha incorretos' 
      };
    }
    
    // Login bem-sucedido - resetar tentativas
    usuario.tentativasLogin = 0;
    usuario.bloqueadoAte = null;
    usuario.ultimoLogin = new Date();
    await usuario.save();
    
    // Gerar token
    const token = gerarToken(usuario);
    
    return {
      sucesso: true,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    };
    
  } catch (error) {
    console.error('Erro no login:', error);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao processar login' 
    };
  }
};

// Registrar novo usuário (apenas admin)
const registrar = async (dados) => {
  try {
    // Verificar se email já existe
    const usuarioExiste = await Usuario.findOne({ email: dados.email });
    
    if (usuarioExiste) {
      return { 
        sucesso: false, 
        mensagem: 'Email já cadastrado' 
      };
    }
    
    // Criar novo usuário
    const usuario = new Usuario(dados);
    await usuario.save();
    
    return {
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    };
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao criar usuário' 
    };
  }
};

// Alterar senha
const alterarSenha = async (usuarioId, senhaAtual, novaSenha) => {
  try {
    const usuario = await Usuario.findById(usuarioId);
    
    if (!usuario) {
      return { 
        sucesso: false, 
        mensagem: 'Usuário não encontrado' 
      };
    }
    
    // Verificar senha atual
    const senhaCorreta = await usuario.compararSenha(senhaAtual);
    
    if (!senhaCorreta) {
      return { 
        sucesso: false, 
        mensagem: 'Senha atual incorreta' 
      };
    }
    
    // Validar nova senha
    if (novaSenha.length < 6) {
      return { 
        sucesso: false, 
        mensagem: 'Nova senha deve ter pelo menos 6 caracteres' 
      };
    }
    
    // Atualizar senha
    usuario.senha = novaSenha;
    await usuario.save();
    
    return {
      sucesso: true,
      mensagem: 'Senha alterada com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao alterar senha' 
    };
  }
};

module.exports = {
  Usuario,
  criarUsuarioAdmin,
  gerarToken,
  verificarToken,
  autenticar,
  autorizar,
  login,
  registrar,
  alterarSenha
};