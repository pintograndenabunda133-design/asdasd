const { SlashCommandBuilder } = require('discord.js');

const RESPOSTAS = [
  'Com certeza!', 'Sem dúvidas.', 'Sim, sem sombra de dúvida.', 'Pode contar com isso.',
  'É bem provável.', 'Perspectiva boa.', 'Sim.', 'Os sinais apontam que sim.',
  'Resposta nebulosa, tente de novo.', 'Pergunte novamente mais tarde.',
  'Melhor eu não te dizer agora.', 'Não posso prever agora.',
  'Nem pensar.', 'Minha resposta é não.', 'Minhas fontes dizem que não.',
  'Perspectiva não muito boa.', 'Muito duvidoso.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Faça uma pergunta pra bola 8 mágica')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Sua pergunta').setRequired(true)),
  async execute(interaction) {
    const pergunta = interaction.options.getString('pergunta');
    const resposta = RESPOSTAS[Math.floor(Math.random() * RESPOSTAS.length)];
    await interaction.reply(`🎱 **Pergunta:** ${pergunta}\n**Resposta:** ${resposta}`);
  },
};
