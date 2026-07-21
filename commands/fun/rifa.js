const { SlashCommandBuilder } = require('discord.js');
const { load, save } = require('../../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rifa')
    .setDescription('Rifas de zoeira no servidor')
    .addSubcommand(sub => sub.setName('entrar').setDescription('Entra na rifa atual'))
    .addSubcommand(sub => sub.setName('sortear').setDescription('Sorteia um ganhador e reseta a rifa')),
  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'A rifa só funciona dentro de um servidor, não em DM.', ephemeral: true });
    }
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const rifas = load('rifas');
    if (!rifas[guildId]) rifas[guildId] = [];

    if (sub === 'entrar') {
      if (rifas[guildId].includes(interaction.user.id)) {
        return interaction.reply({ content: 'Você já tá na rifa, calma aí!', ephemeral: true });
      }
      rifas[guildId].push(interaction.user.id);
      save('rifas', rifas);
      return interaction.reply(`🎟️ ${interaction.user} entrou na rifa! Total de participantes: **${rifas[guildId].length}**`);
    }

    if (sub === 'sortear') {
      const participantes = rifas[guildId];
      if (!participantes || participantes.length === 0) {
        return interaction.reply({ content: 'Ninguém entrou na rifa ainda!', ephemeral: true });
      }
      const vencedorId = participantes[Math.floor(Math.random() * participantes.length)];
      rifas[guildId] = [];
      save('rifas', rifas);
      return interaction.reply(`🏆 O ganhador da rifa é... <@${vencedorId}>! Parabéns! 🎉`);
    }
  },
};
