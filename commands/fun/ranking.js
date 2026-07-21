const { SlashCommandBuilder } = require('discord.js');
const { load, save } = require('../../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gado')
    .setDescription('Ranking de gado do servidor (zoeira)')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Adiciona pontos de gado a alguém')
        .addUserOption(opt => opt.setName('usuario').setDescription('Quem vai ganhar o ponto').setRequired(true))
    )
    .addSubcommand(sub => sub.setName('ranking').setDescription('Mostra o ranking de gado do servidor')),
  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'O ranking de gado só funciona dentro de um servidor, não em DM.', ephemeral: true });
    }
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const ranking = load('ranking-gado');
    if (!ranking[guildId]) ranking[guildId] = {};

    if (sub === 'add') {
      const usuario = interaction.options.getUser('usuario');
      ranking[guildId][usuario.id] = (ranking[guildId][usuario.id] || 0) + 1;
      save('ranking-gado', ranking);
      return interaction.reply(`🐄 ${usuario} agora tem **${ranking[guildId][usuario.id]}** ponto(s) de gado!`);
    }

    if (sub === 'ranking') {
      const entradas = Object.entries(ranking[guildId] || {}).sort((a, b) => b[1] - a[1]).slice(0, 10);
      if (entradas.length === 0) {
        return interaction.reply('Ninguém tem pontos de gado ainda. Servidor tá limpo (por enquanto).');
      }
      const texto = entradas.map(([id, pontos], i) => `${i + 1}. <@${id}> — ${pontos} ponto(s)`).join('\n');
      return interaction.reply(`🐄 **Ranking de gado:**\n${texto}`);
    }
  },
};
