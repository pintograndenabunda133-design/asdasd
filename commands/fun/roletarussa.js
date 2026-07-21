const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleta-russa')
    .setDescription('Teste sua sorte na roleta (1 em 6 chances de "explodir", é só brincadeira)'),
  async execute(interaction) {
    const tambor = Math.floor(Math.random() * 6);
    if (tambor === 0) {
      await interaction.reply(`💥 BUM! ${interaction.user} "explodiu" na roleta! (calma, é só zoeira 😂)`);
    } else {
      await interaction.reply(`🔫 *click*... ${interaction.user} sobreviveu! (${tambor}/5 seguro)`);
    }
  },
};
