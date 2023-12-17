import { createCanvas, loadImage, registerFont } from 'canvas';
import { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { TeamSchema } from "../../Schemas/teamSchema.js"
import { UserSchema } from '../../Schemas/userSchema.js';

// Registra la fuente si es necesario (ajusta la ruta según la ubicación de tu archivo de fuente)
registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName('team-info')
  .setDescription('Muestra información del equipo:');

export async function execute(interaction) {
  await interaction.reply({ content: "Informacion del Equipo:"});
  const { username: memberid1, username: memberid2 } = interaction.user;

  try {
    const teams = await TeamSchema.findOne({
      $or: [
        { memberid1 },
        { memberid2 }
      ]
    });
    const member1 = teams.memberid1
    const member2 = teams.memberid2
    const memberInfo1= await UserSchema.findOne ({
      discordTag: member1
    })
    const memberInfo2= await UserSchema.findOne ({
      discordTag: member2
    })
    console.log (memberInfo1)
    console.log (memberInfo2)
    const avatar1 = `https://cdn.discordapp.com/avatars/${memberInfo1.discordId}/${memberInfo1.discordAvatarId}`
    const avatar2 = `https://cdn.discordapp.com/avatars/${memberInfo2.discordId}/${memberInfo2.discordAvatarId}`


      // Crear el canvas
      const canvas = createCanvas(800, 800);
      const ctx = canvas.getContext('2d');

      // Cargar las imágenes
      const teamImg = await loadImage(teams.img);

      // Dibujar la información del equipo en el canvas
      // Ejemplo básico:
      ctx.fillStyle = '#3498db';
      ctx.fillRect(0, 0, 400, 200);

      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Roboto';
      ctx.fillText(`Equipo: ${teams.name}`, 10, 30);

      // Dibuja la imagen del equipo
      ctx.drawImage(teamImg, 10, 50, 80, 80);

      // Dibuja la información de los integrantes
      let yPosition = 150;

        const memberImg = await loadImage(avatar1);
        ctx.drawImage(memberImg, 10, yPosition, 60, 60);
        ctx.fillText(teams.memberid1, 80, yPosition + 30);
        yPosition += 70;
        const memberImg2 = await loadImage(avatar2);
        ctx.drawImage(memberImg2, 10, yPosition, 60, 60);
        ctx.fillText(teams.memberid2, 80, yPosition + 30);


      // Dibuja la puntuación
      ctx.fillText(`Puntuación: ${teams.points}`, 10, yPosition + 30);

      const buffer = await canvas.toBuffer()
      const attachment =  new AttachmentBuilder(buffer, { name: 'team-info.png' })
      const embed = new EmbedBuilder()
      .setColor("#00B0F6")
      .setImage('attachment://team-info.png'); // Cambiado aquí para referenciar directamente al archivo adjunto
    
    // Enviar el embed con la imagen del canvas directamente en el mensaje
    await interaction.followUp({
      embeds: [embed],
      files: [attachment],
    });

  } catch (error) {
    console.error('Error al buscar información del equipo:', error);
    await interaction.followUp({ content: 'Hubo un error al buscar la información del equipo.', ephemeral: true });
  }
}
