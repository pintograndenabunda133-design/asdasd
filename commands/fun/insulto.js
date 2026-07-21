const { SlashCommandBuilder } = require('discord.js');

const ZOEIRAS = [
  'tem menos QI que um NPC de Roblox',
  'jogou tanto que o PC pediu arrego',
  'é tão sortudo que ganharia na roleta-russa até com 6 balas',
  'devia entrar pro ranking de gado oficial',
  'é a razão pela qual o servidor tem regra de "não spammar"',
  'perdeu de novo, clássico',
  'tá parecendo NPC hoje',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zoar')
    .setDescription('Manda uma zoeira leve em alguém do servidor')
    .addUserOption(opt => opt.setName('usuario').setDescription('Quem vai ser zoado').setRequired(true)),
  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const frase = ZOEIRAS[Math.floor(Math.random() * ZOEIRAS.length)];
    await interaction.reply(`😂 ${usuario} ${frase}!`);
  },
};
