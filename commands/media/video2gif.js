const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const fs = require('fs');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('video2gif')
    .setDescription('Transforma um vídeo anexado em GIF (reação)')
    .addAttachmentOption(opt => opt.setName('video').setDescription('Vídeo a converter (máx ~15s recomendado)').setRequired(true))
    .addIntegerOption(opt => opt.setName('duracao').setDescription('Segundos a converter, a partir do início (padrão 5, máx 10)').setMinValue(1).setMaxValue(10)),
  async execute(interaction) {
    const anexo = interaction.options.getAttachment('video');
    const duracao = interaction.options.getInteger('duracao') ?? 5;

    if (!anexo.contentType || !anexo.contentType.startsWith('video/')) {
      return interaction.reply({ content: 'Isso não parece ser um vídeo válido.', ephemeral: true });
    }
    if (anexo.size > 25 * 1024 * 1024) {
      return interaction.reply({ content: 'Vídeo muito grande (máx 25MB).', ephemeral: true });
    }

    await interaction.deferReply();

    const tmpIn = path.join(os.tmpdir(), `in-${interaction.id}${path.extname(anexo.name || '.mp4')}`);
    const tmpOut = path.join(os.tmpdir(), `out-${interaction.id}.gif`);

    try {
      const resposta = await fetch(anexo.url);
      const buffer = Buffer.from(await resposta.arrayBuffer());
      fs.writeFileSync(tmpIn, buffer);

      await new Promise((resolve, reject) => {
        ffmpeg(tmpIn)
          .setStartTime(0)
          .setDuration(duracao)
          .outputOptions([
            '-vf', 'fps=12,scale=360:-1:flags=lanczos',
          ])
          .output(tmpOut)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });

      const attachment = new AttachmentBuilder(tmpOut, { name: 'reacao.gif' });
      await interaction.editReply({ content: `🎬 GIF de reação de ${interaction.user}:`, files: [attachment] });
    } catch (err) {
      console.error(err);
      await interaction.editReply('Deu ruim ao converter o vídeo. Tenta um vídeo menor ou em outro formato.');
    } finally {
      [tmpIn, tmpOut].forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
    }
  },
};
