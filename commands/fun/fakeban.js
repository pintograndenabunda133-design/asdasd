const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fake-ban')
    .setDescription('"Bane" alguém de brincadeira (não bane de verdade)')
    .addUserOption(opt => opt.setName('usuario').setDescription('Quem vai ser "banido"').setRequired(true))
    .addStringOption(opt => opt.setName('motivo').setDescription('Motivo da zoeira')),
  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo') ?? 'ser gado demais';

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('🔨 Usuário banido (de brincadeira)')
      .setDescription(`${usuario} foi banido do servidor por: **${motivo}**\n\n*(relaxa, é zoeira, ninguém foi banido de verdade)*`)
      .setThumbnail(usuario.displayAvatarURL());

    await interaction.reply({ embeds: [embed] });
  },
};
