import { createCanvas, loadImage, registerFont } from "canvas";
import pkg from "discord.js";
const { SlashCommandBuilder, AttachmentBuilder } = pkg;

registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("XD");

export async function execute(interaction) {
  const users = [
    { username: "User1", score: 100 },
    // Agrega más usuarios según sea necesario
  ];

  const buffer = await generateLeaderboard(users);

  const attachment = new AttachmentBuilder(buffer, { name: "leaderboard.png" });

  const embed = {
    title: "Leaderboard",
    image: { url: "attachment://leaderboard.png" },
    color: 0x00ff00, // Color de la embed (opcional)
  };

  interaction.reply({ embeds: [embed], files: [attachment] });
}

async function generateLeaderboard(users) {
  const canvas = createCanvas(600, 800);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px Roboto";
  ctx.fillStyle = "black";

  let y = 50;

  for (const user of users) {
    const avatar = await loadImage(
      "https://cdn.discordapp.com/avatars/281561896841248769/4d6e6e8444a3af7536c78420b72d44e2"
    );

    ctx.drawImage(avatar, 10, y - 30, 40, 40);

    ctx.fillText(`${user.username} - ${user.score}`, 60, y);
    y += 60;
  }

  return canvas.toBuffer();
}
