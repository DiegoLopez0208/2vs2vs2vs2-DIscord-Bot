import { createCanvas, loadImage, registerFont } from "canvas";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";
import { UserSchema } from "../../Schemas/userSchema.js";

// Registra la fuente si es necesario (ajusta la ruta según la ubicación de tu archivo de fuente)
registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName("team-info")
  .setDescription("Muestra información del equipo:");

export async function execute(interaction) {
  await interaction.reply({ content: "Informacion del Equipo:" });

  const { username: memberid1, username: memberid2 } = interaction.user;

  try {
    const team = await TeamSchema.findOne({
      $or: [{ memberid1 }, { memberid2 }],
    });

    if (!team) {
      throw new Error("No se encontró información del equipo.");
    }

    const memberInfo1 = await UserSchema.findOne({
      discordTag: team.memberid1,
    });

    const memberInfo2 = await UserSchema.findOne({
      discordTag: team.memberid2,
    });

    const avatar1 = `https://cdn.discordapp.com/avatars/${memberInfo1.discordId}/${memberInfo1.discordAvatarId}`;
    const avatar2 = `https://cdn.discordapp.com/avatars/${memberInfo2.discordId}/${memberInfo2.discordAvatarId}`;

    // Crear el canvas
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext("2d");

    // Cargar las imágenes
    const teamImg = await loadImage(team.img);
    const memberImg1 = await loadImage(avatar1);
    const memberImg2 = await loadImage(avatar2);

    // Dibujar la información del equipo en el canvas
    // Fondo
    ctx.fillStyle = "#36393f"; // Color de fondo oscuro
    ctx.fillRect(0, 0, 600, 400);

    // Título del equipo
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Roboto";
    ctx.fillText(`Equipo: ${team.name}`, 10, 40);

    // Imagen del equipo con borde redondeado
    ctx.save(); // Guarda el estado actual del contexto
    ctx.beginPath();
    ctx.arc(550, 60, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
    ctx.clip(); // Recorta el contexto para que la imagen se ajuste al círculo
    ctx.drawImage(teamImg, 500, 10, 100, 100);
    ctx.restore(); // Restaura el contexto para eliminar el recorte

    // Dibuja la información de los integrantes
    let yPosition = 150;

    // Miembro 1
    ctx.drawImage(memberImg1, 10, yPosition, 60, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Roboto";
    ctx.fillText(`Miembro 1: ${memberInfo1.discordTag}`, 80, yPosition + 30);

    yPosition += 80; // Ajuste de posición para el próximo miembro

    // Miembro 2
    ctx.drawImage(memberImg2, 10, yPosition, 60, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Roboto";
    ctx.fillText(`Miembro 2: ${memberInfo2.discordTag}`, 80, yPosition + 30);

    // Dibuja la puntuación
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Roboto";
    ctx.fillText(`Puntuación: ${team.points}`, 450, yPosition + 150);

    const buffer = await canvas.toBuffer();
    const attachment = new AttachmentBuilder(buffer, { name: "team-info.png" });
    const embed = new EmbedBuilder()
      .setTitle(`Información del equipo: `)
      .setColor("#00B0F6")
      .setImage("attachment://team-info.png");

    await interaction.followUp({
      embeds: [embed],
      files: [attachment],
    });
  } catch (error) {
    console.error("Error al buscar información del equipo:", error);
    await interaction.followUp({
      content: "Hubo un error al buscar la información del equipo.",
      ephemeral: true,
    });
  }
}
