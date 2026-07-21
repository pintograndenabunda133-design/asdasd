const config = require('./config');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

const pastasDeComandos = ['fun', 'media', 'roblox'];
for (const pasta of pastasDeComandos) {
  const dir = path.join(__dirname, 'commands', pasta);
  const arquivos = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const arquivo of arquivos) {
    const comando = require(path.join(dir, arquivo));
    if (comando?.data?.name) {
      client.commands.set(comando.data.name, comando);
    }
  }
}

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const comando = client.commands.get(interaction.commandName);
  if (!comando) return;

  try {
    await comando.execute(interaction);
  } catch (err) {
    console.error(`Erro ao executar /${interaction.commandName}:`, err);
    const payload = { content: 'Deu ruim ao executar esse comando 😅', ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

client.login(config.DISCORD_TOKEN);
