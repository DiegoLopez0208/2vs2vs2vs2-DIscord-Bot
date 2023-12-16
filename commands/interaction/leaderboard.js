import { createCanvas, loadImage, registerFont } from "canvas";
import pkg from "discord.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";

const { SlashCommandBuilder, AttachmentBuilder } = pkg;

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
    color: 0x00ff00,
  };

  interaction.reply({ embeds: [embed], files: [attachment] });
}

async function generateLeaderboard(teams) {
  const canvas = createCanvas(600, 700);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#36393e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '16px Arial';

  let leaderboardData = await generateList(teams);

  for (const [index, team] of leaderboardData.entries()) {
    const rectX = 10;
    const rectY = 30 + index * 80;
    const rectWidth = canvas.width - 20;
    const rectHeight = 60;
    const cornerRadius = 10;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight, cornerRadius);
    ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight, cornerRadius);
    ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, cornerRadius);
    ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, cornerRadius);
    ctx.closePath();
    ctx.stroke();

    let bgColor;
    if (index === 0) {
      bgColor = 'gold';
    } else if (index === 1) {
      bgColor = 'silver';
    } else if (index === 2) {
      bgColor = 'peru';
    } else {
      bgColor = '#7289da';
    }

    ctx.fillStyle = bgColor;
    ctx.fill();

    const iconX = rectX + 10;
    const iconY = rectY + 10;
    const iconWidth = 40;
    const iconHeight = 40;

    const playerIcon = await loadImage(team.imageSrc);
    ctx.drawImage(playerIcon, iconX, iconY, iconWidth, iconHeight);

    const textX = rectX + 60;
    const textY = rectY + 30;
    ctx.fillStyle = 'black';
    ctx.fillText(`${index + 1}. ${team.teamName} - (${team.members})`, textX, textY);

    const scoreText = `Puntaje: ${team.score}`;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    const scoreX = rectX + rectWidth - scoreTextWidth - 10;
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
      members: `${team.memberid1} / ${team.memberid2}`,
      score: 1500,
    });
  }

  return leaderboardData;
}
