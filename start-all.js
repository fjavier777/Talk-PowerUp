// Script para iniciar Bot e Dashboard simultaneamente
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando sistema completo...\n');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Função para formatar logs
function log(prefix, color, message) {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset} ${message}`);
}

// Iniciar o Bot
const bot = spawn('node', ['bot-v2.js'], {
  cwd: __dirname,
  stdio: 'pipe'
});

bot.stdout.on('data', (data) => {
  const message = data.toString().trim();
  if (message) {
    log('BOT', colors.green, message);
  }
});

bot.stderr.on('data', (data) => {
  const message = data.toString().trim();
  if (message && !message.includes('DeprecationWarning')) {
    log('BOT', colors.red, message);
  }
});

bot.on('close', (code) => {
  log('BOT', colors.yellow, `Processo encerrado com código ${code}`);
  if (code !== 0) {
    log('BOT', colors.red, 'Bot encerrado com erro. Verifique os logs acima.');
  }
});

// Aguardar 2 segundos antes de iniciar o dashboard
setTimeout(() => {
  // Iniciar o Dashboard
  const dashboard = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  dashboard.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      log('DASHBOARD', colors.blue, message);
    }
  });

  dashboard.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message && !message.includes('DeprecationWarning')) {
      log('DASHBOARD', colors.red, message);
    }
  });

  dashboard.on('close', (code) => {
    log('DASHBOARD', colors.yellow, `Processo encerrado com código ${code}`);
    if (code !== 0) {
      log('DASHBOARD', colors.red, 'Dashboard encerrado com erro. Verifique os logs acima.');
    }
  });
}, 2000);

// Tratar sinais de encerramento
process.on('SIGINT', () => {
  console.log('\n\n🛑 Encerrando sistema...');
  bot.kill('SIGINT');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Encerrando sistema...');
  bot.kill('SIGTERM');
  process.exit(0);
});

// Mensagem inicial
console.log(`
${colors.bright}${colors.green}╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║          🤖 BOT WHATSAPP + DASHBOARD WEB                      ║
║                                                                ║
║  Bot iniciando...        Aguarde o QR Code                    ║
║  Dashboard iniciando...  http://localhost:3000                ║
║                                                                ║
║  Pressione Ctrl+C para encerrar                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}
`);

// Keepalive
setInterval(() => {
  // Mantém o processo vivo
}, 1000);