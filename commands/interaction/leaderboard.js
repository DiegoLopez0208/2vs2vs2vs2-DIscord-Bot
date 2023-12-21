import { createCanvas, loadImage, registerFont } from "canvas";
import pkg from "discord.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";

const { SlashCommandBuilder, AttachmentBuilder } = pkg;

registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Provee la informacion de la tabla de calificaciones.");

export async function execute(interaction) {
  const teams = await TeamSchema.find();
  const buffer = await generateLeaderboard(teams);
  const attachment = new AttachmentBuilder(buffer, { name: "leaderboard.png" });

  const embed = {
    title: "Tabla de calificaciones: ",
    image: { url: "attachment://leaderboard.png" },
    color: 0x00ff00,
  };

  interaction.reply({ embeds: [embed], files: [attachment] });
}

async function generateLeaderboard(teams) {
  const canvas = createCanvas(750, 600);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#282b30");
  gradient.addColorStop(1, "#424549");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "18px Arial";

  let leaderboardData = await generateList(teams);

  for (const [index, team] of leaderboardData.entries()) {
    const rectX = 10;
    const rectY = 30 + index * 80;
    const rectWidth = canvas.width - 20;
    const rectHeight = 60;

    const cornerRadius = 10;

    const iconX = rectX + 10;
    const iconY = rectY + 10;
    const iconWidth = 40;
    const iconHeight = 40;
    const iconRadius = 20;

    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.arcTo(
      rectX + rectWidth,
      rectY,
      rectX + rectWidth,
      rectY + rectHeight,
      cornerRadius
    );
    ctx.arcTo(
      rectX + rectWidth,
      rectY + rectHeight,
      rectX,
      rectY + rectHeight,
      cornerRadius
    );
    ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, cornerRadius);
    ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, cornerRadius);
    ctx.closePath();

    let bgColor;
    if (index === 0) {
      bgColor = "#ffd700";
    } else if (index === 1) {
      bgColor = "#c0c0c0";
    } else if (index === 2) {
      bgColor = " #CD7F32";
    } else {
      bgColor = "#7289da";
    }

    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.stroke();

    const playerIcon = await loadImage(team.imageSrc);

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      iconX + iconWidth / 2,
      iconY + iconHeight / 2,
      iconRadius,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(playerIcon, iconX, iconY, iconWidth, iconHeight);
    ctx.restore();

    const textX = rectX + 90;
    const textY = rectY + 35;
    const color = "#1e2124";

    ctx.fillStyle = color;
    ctx.fillText(
      `${index + 1}. ${team.teamName} / (${team.members})`,
      textX,
      textY
    );

    const scoreText = `Puntaje: ${team.score}`;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    const scoreX = rectX + rectWidth - scoreTextWidth - 20;
    ctx.fillText(scoreText, scoreX, textY);
  }

  return canvas.toBuffer();
}

async function generateList(teams) {
  let leaderboardData = [];
  for (const team of teams) {
    leaderboardData.push({
      imageSrc: team.img,
      teamName: team.name,
      members: `${team.memberName1} / ${team.memberName2}`,
      score: team.points,
    });
  }

  return leaderboardData;
}
