const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dado')
    .setDescription('Rola um dado')
    .addIntegerOption(opt =>
      opt.setName('lados').setDescription('Quantos lados o dado tem (padrão 6)').setMinValue(2).setMaxValue(1000)
    ),
  async execute(interaction) {
    const lados = interaction.options.getInteger('lados') ?? 6;
    const resultado = Math.floor(Math.random() * lados) + 1;
    await interaction.reply(`🎲 Você rolou um dado de ${lados} lados e caiu **${resultado}**!`);
  },
};
