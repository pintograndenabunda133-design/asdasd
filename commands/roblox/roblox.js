const { SlashCommandBuilder } = require('discord.js');
const { noblox, garantirLogin } = require('../../utils/roblox');
const { load, save } = require('../../utils/storage');

const PRESENCE_TEXTO = {
  0: '⚫ Offline',
  1: '🟢 Online (fora de jogo)',
  2: '🎮 Jogando',
  3: '🛠️ No Roblox Studio',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roblox')
    .setDescription('Integração com Roblox')
    .addSubcommand(sub =>
      sub.setName('vincular')
        .setDescription('Vincula seu usuário do Discord ao seu nome de usuário do Roblox')
        .addStringOption(opt => opt.setName('usuario_roblox').setDescription('Seu username no Roblox').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('Vê se alguém tá online e em qual jogo (precisa estar vinculado)')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário do Discord vinculado').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('online')
        .setDescription('Lista quem dos vinculados no servidor está online agora')
    )
    .addSubcommand(sub =>
      sub.setName('add-amigo')
        .setDescription('Manda um pedido de amizade no Roblox pra alguém vinculado')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário do Discord vinculado').setRequired(true))
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const links = load('roblox-links');

    if (sub === 'vincular') {
      const username = interaction.options.getString('usuario_roblox');
      try {
        await garantirLogin();
        const id = await noblox.getIdFromUsername(username);
        links[interaction.user.id] = { username, id };
        save('roblox-links', links);
        return interaction.reply(`✅ Vinculado! Seu Discord agora aponta pro Roblox **${username}** (ID ${id}).`);
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: 'Não achei esse usuário no Roblox, confere o nome.', ephemeral: true });
      }
    }

    if (sub === 'status') {
      const usuario = interaction.options.getUser('usuario');
      const link = links[usuario.id];
      if (!link) {
        return interaction.reply({ content: `${usuario.username} ainda não vinculou a conta Roblox (use /roblox vincular).`, ephemeral: true });
      }
      try {
        await garantirLogin();
        const [presenca] = await noblox.getPresences([link.id]);
        const texto = PRESENCE_TEXTO[presenca.userPresenceType] ?? 'Desconhecido';
        let msg = `**${link.username}** (Discord: ${usuario}) — ${texto}`;
        if (presenca.userPresenceType === 2 && presenca.lastLocation) {
          msg += `\nJogando: **${presenca.lastLocation}**`;
        }
        return interaction.reply(msg);
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: 'Erro ao consultar a presença no Roblox.', ephemeral: true });
      }
    }

    if (sub === 'online') {
      const entradas = Object.entries(links);
      if (entradas.length === 0) {
        return interaction.reply('Ninguém vinculou a conta Roblox ainda (use /roblox vincular).');
      }
      try {
        await garantirLogin();
        const ids = entradas.map(([, l]) => l.id);
        const presencas = await noblox.getPresences(ids);
        const linhas = entradas.map(([discordId, l]) => {
          const p = presencas.find(pr => pr.userId === l.id);
          const texto = p ? (PRESENCE_TEXTO[p.userPresenceType] ?? '?') : '?';
          const jogo = p && p.userPresenceType === 2 && p.lastLocation ? ` — ${p.lastLocation}` : '';
          return `<@${discordId}> (${l.username}): ${texto}${jogo}`;
        });
        return interaction.reply(`📡 **Status Roblox dos vinculados:**\n${linhas.join('\n')}`);
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: 'Erro ao consultar as presenças no Roblox.', ephemeral: true });
      }
    }

    if (sub === 'add-amigo') {
      const usuario = interaction.options.getUser('usuario');
      const link = links[usuario.id];
      if (!link) {
        return interaction.reply({ content: `${usuario.username} ainda não vinculou a conta Roblox.`, ephemeral: true });
      }
      try {
        await garantirLogin();
        await noblox.sendFriendRequest(link.id);
        return interaction.reply(`🤝 Pedido de amizade enviado pra **${link.username}** no Roblox!`);
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: 'Erro ao mandar pedido de amizade (talvez já sejam amigos, ou limite de pedidos atingido).', ephemeral: true });
      }
    }
  },
};
