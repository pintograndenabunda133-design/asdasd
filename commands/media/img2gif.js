const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const fs = require('fs');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('img2gif')
    .setDescription('Transforma uma imagem anexada em GIF (com efeito de zoom leve)')
    .addAttachmentOption(opt => opt.setName('imagem').setDescription('Imagem a converter').setRequired(true))
    .addIntegerOption(opt => opt.setName('duracao').setDescription('Duração em segundos (padrão 3, máx 8)').setMinValue(1).setMaxValue(8)),
  async execute(interaction) {
    const anexo = interaction.options.getAttachment('imagem');
    const duracao = interaction.options.getInteger('duracao') ?? 3;

    if (!anexo.contentType || !anexo.contentType.startsWith('image/')) {
      return interaction.reply({ content: 'Isso não parece ser uma imagem válida.', ephemeral: true });
    }

    await interaction.deferReply();

    const tmpIn = path.join(os.tmpdir(), `in-${interaction.id}${path.extname(anexo.name || '.png')}`);
    const tmpOut = path.join(os.tmpdir(), `out-${interaction.id}.gif`);

    try {
      const resposta = await fetch(anexo.url);
      const buffer = Buffer.from(await resposta.arrayBuffer());
      fs.writeFileSync(tmpIn, buffer);

      const frames = duracao * 25;
      await new Promise((resolve, reject) => {
        ffmpeg(tmpIn)
          .loop(duracao)
          .outputOptions([
            '-vf', `scale=480:-1,zoompan=z='min(zoom+0.0015,1.2)':d=${frames}:s=480x480,fps=12`,
          ])
          .output(tmpOut)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });

      const attachment = new AttachmentBuilder(tmpOut, { name: 'imagem.gif' });
      await interaction.editReply({ content: `🖼️ GIF de ${interaction.user}:`, files: [attachment] });
    } catch (err) {
      console.error(err);
      await interaction.editReply('Deu ruim ao converter a imagem. Tenta outra imagem/formato.');
    } finally {
      [tmpIn, tmpOut].forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
    }
  },
};
