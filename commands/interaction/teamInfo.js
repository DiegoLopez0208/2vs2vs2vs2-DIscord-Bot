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
// Crear el canvas
// Crear el canvas
const canvas = createCanvas(600, 400);
const ctx = canvas.getContext("2d");

// Cargar las imágenes
const teamImg = await loadImage(team.img);
const memberImg1 = await loadImage(avatar1);
const memberImg2 = await loadImage(avatar2);

// Dibujar la información del equipo en el canvas
// Fondo con gradiente menos oscuro
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, "#282b30");
gradient.addColorStop(1, "#424549");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 600, 400);

// Título del equipo
ctx.fillStyle = "#ffffff";
ctx.font = "bold 30px Roboto";
ctx.fillText(`Equipo: ${team.name}`, 10, 40);

// Imagen del equipo con borde redondeado y sombra
ctx.save();
ctx.beginPath();
ctx.arc(530, 60, 50, 0, 2 * Math.PI);
ctx.strokeStyle = "#1e2124";
ctx.lineWidth = 5;
ctx.shadowColor = "#000000";
ctx.shadowBlur = 10;
ctx.stroke();
ctx.closePath();
ctx.clip();
ctx.drawImage(teamImg, 480, 10, 100, 100);
ctx.restore();

// Dibuja la información de los integrantes con recuadro y sombra
let yPosition = 150;
const iconSize = 60;

// Miembro 1
ctx.save();
ctx.beginPath();
ctx.arc(40, yPosition + iconSize / 2, iconSize / 2, 0, 2 * Math.PI);
ctx.strokeStyle = "#7289da";
ctx.lineWidth = 5;
ctx.shadowColor = "#000000";
ctx.shadowBlur = 5;
ctx.stroke();
ctx.clip();
ctx.drawImage(memberImg1, 10, yPosition, iconSize, iconSize);
ctx.restore();

ctx.fillStyle = "#ffffff";
ctx.font = "14px Roboto";
ctx.fillText(`Integrante 1: ${memberInfo1.discordTag}`, 80, yPosition + 30);
yPosition += 80;

// Miembro 2
ctx.save();
ctx.beginPath();
ctx.arc(40, yPosition + iconSize / 2, iconSize / 2, 0, 2 * Math.PI);
ctx.strokeStyle = "#7289da";
ctx.lineWidth = 5;
ctx.shadowColor = "#000000";
ctx.shadowBlur = 5;
ctx.stroke();
ctx.clip();
ctx.drawImage(memberImg2, 10, yPosition, iconSize, iconSize);
ctx.restore();

ctx.fillStyle = "#ffffff";
ctx.font = "14px Roboto";
ctx.fillText(`Integrante 2: ${memberInfo2.discordTag}`, 80, yPosition + 30);

// Dibuja la puntuación con sombra
ctx.fillStyle = "#ffffff";
ctx.font = "bold 20px Roboto";
ctx.shadowColor = "#000000";
ctx.shadowBlur = 8;
ctx.fillText(`Puntuación: ${team.points}`, 450, yPosition + 150);

const buffer = await canvas.toBuffer();
const attachment = new AttachmentBuilder(buffer, { name: "team-info.png" });
const embed = new EmbedBuilder()
  .setTitle(`Información del equipo: ${team.name}`)
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
