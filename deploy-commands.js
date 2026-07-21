const config = require('./config');
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

// Contextos de integração do Discord:
// integration_types: 0 = GUILD_INSTALL (bot convidado num servidor), 1 = USER_INSTALL (app instalado na sua conta)
// contexts: 0 = servidor (Guild), 1 = DM com o bot, 2 = grupo/DM de outra pessoa (Private Channel)
const INTEGRATION_TYPES = [1]; // só User Install
const CONTEXTS = [0, 1, 2]; // funciona dentro de servidores, em DM do bot e em DMs/grupos com outras pessoas

const comandos = [];
const pastasDeComandos = ['fun', 'media', 'roblox'];
for (const pasta of pastasDeComandos) {
  const dir = path.join(__dirname, 'commands', pasta);
  const arquivos = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const arquivo of arquivos) {
    const comando = require(path.join(dir, arquivo));
    if (comando?.data) {
      const json = comando.data.toJSON();
      json.integration_types = INTEGRATION_TYPES;
      json.contexts = CONTEXTS;
      comandos.push(json);
    }
  }
}

const rest = new REST().setToken(config.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Registrando ${comandos.length} comando(s) como App instalável (User Install)...`);

    // Comandos de User Install SEMPRE são registrados globalmente (não dá pra restringir a um único servidor).
    const rota = Routes.applicationCommands(config.CLIENT_ID);

    await rest.put(rota, { body: comandos });

    console.log('✅ Comandos registrados com sucesso!');
    console.log('Registro global de App - pode demorar alguns minutos (às vezes até 1h) pra aparecer em todo lugar.');
  } catch (err) {
    console.error(err);
  }
})();
