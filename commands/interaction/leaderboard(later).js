import { createCanvas, loadImage, registerFont, Image } from "canvas";
import pkg from "discord.js";
import axios from "axios";
const { SlashCommandBuilder, AttachmentBuilder } = pkg;
import { UserSchema } from '../../Schemas/userSchema.js';
import { TeamSchema } from "../../Schemas/teamSchema.js";

registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("XD");

export async function execute(interaction) {
  const teams = await TeamSchema.find();

  const buffer = await generateLeaderboard(teams);

  const attachment = new AttachmentBuilder(buffer, { name: "leaderboard.png" });
  
  const embed = {
    image: { url: "attachment://leaderboard.png" },
    color: 0x00ff00, // Color de la embed (opcional)
  };

  interaction.reply({ embeds: [embed], files: [attachment] });
}

async function getTeams() {
  let teams = [];
  const users = await UserSchema.find()

  users.forEach(user => {
    if (!teams.some(team => team.hasOwnProperty(user.teamName))) {
      let team = {[user.teamName]: [user.discordTag]};
      teams.push(team);
    }
    else
    {
      console.log(teams);
      const i = teams.findIndex(team => team.hasOwnProperty(user.teamName));
      teams[i][user.teamName].push(user.discordTag);
    }
  });

  return teams;
}

async function generateLeaderboard(teams) {
  const canvas = createCanvas(600, 700);
  const ctx = canvas.getContext('2d');
      // Establecer el color de fondo en hexadecimal
  ctx.fillStyle = '#36393e'; // Cambia '#F0E68C' al color hexadecimal que desees

  // Llenar el canvas con el color de fondo
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Establecer estilos
  ctx.font = '16px Arial';

  let leaderboardData = await generateList(teams);
  console.log(leaderboardData)

  // Dibujar leaderboard
  leaderboardData.forEach(async (team, index) => {
    // Dibujar recuadro redondeado alrededor de cada participante
    const rectX = 10;
    const rectY = 30 + index * 80;
    const rectWidth = canvas.width - 20;
    const rectHeight = 60;
    const cornerRadius = 10; // Ajusta según sea necesario

    ctx.strokeStyle = 'black'; // Puedes cambiar 'black' al color que desees para el borde
    ctx.lineWidth = 2;

    // Iniciar el trazado del recuadro redondeado
    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight, cornerRadius);
    ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight, cornerRadius);
    ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, cornerRadius);
    ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, cornerRadius);
    ctx.closePath();

    ctx.stroke();

    // Establecer el color de fondo según la posición
    let bgColor;
    if (index === 0) {
      bgColor = 'gold'; // Primer lugar
    } else if (index === 1) {
      bgColor = 'silver'; // Segundo lugar
    } else if (index === 2) {
      bgColor = 'peru'; // Tercer lugar
    } else {
      bgColor = '#7289da'; // Otros lugares, color predeterminado
    }

    // Llenar el área del rectángulo con el color de fondo
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Dibujar imagen del avatar
    console.log(team)
    // Dibujar imagen del avatar

    const imgPath = team.imageSrc;
    const avatar = await loadImage(imgPath);
    ctx.drawImage(avatar, 0, 0, 50, 50); // Ajusta posición y tamaño según sea necesario

    // Dibujar información del equipo
    const textX = rectX + 60;
    const textY = rectY + 30;
    ctx.fillStyle = 'black'; // Puedes cambiar 'black' al color que desees para el texto
    ctx.fillText(`${index + 1}. ${team.teamName} - (${team.members})`, textX, textY);

    // Dibujar puntaje a la derecha del todo
    const scoreText = `Puntaje: ${team.score}`;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    const scoreX = rectX + rectWidth - scoreTextWidth - 10; // 10 píxeles de margen desde el borde derecho
    ctx.fillText(scoreText, scoreX, textY);    
  });
  return canvas.toBuffer()
}

async function generateList(teams) {
  let leaderboardData = [];
  teams.forEach(async team => {
    leaderboardData.push({imageSrc: team.img, teamName: team.name, members: `${team.memberid1} / ${team.memberid2}`, score: 1500});
  });

  return leaderboardData;
}