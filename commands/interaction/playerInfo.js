import pkg from "discord.js";

const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = pkg;
import axios from "axios";
import { MatchSchema } from "../../Schemas/matchSchema.js";
import { UserSchema } from "../../Schemas/userSchema.js";
import { createCanvas, loadImage, registerFont } from "canvas";

registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName("player-info")
  .setDescription("Muestra información del equipo:");

export async function execute(interaction) {
  try {
    const discordTag = interaction.user.username;
    console.log(discordTag);

    const matchInfo = await MatchSchema.find({ discordTag });
    const userInfo = await UserSchema.findOne({ discordTag });

    const getAvatarId = await axios.get(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userInfo.riotName}?api_key=${process.env.RIOT_KEY}`
    );

    const avatarId = getAvatarId.data.profileIconId;
    const summonerLevel = getAvatarId.data.summonerLevel;
    const version = "13.24.1";

    if (matchInfo && matchInfo.length > 0) {
      const canvas = createCanvas(600, 520);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#282b30");
      gradient.addColorStop(1, "#424549");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;

      let offsetY = 20;
      let gameNumber = 1;

      ctx.roundRect = function (x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
      };

      const borderRadius = 10;
      const borderColor = "#005080";

      for (const game of matchInfo) {
        const boxWidth = 560;
        const boxHeight = 160;
        const boxX = 20;
        const boxY = offsetY;
        const borderWidth = 5;

        ctx.fillStyle = borderColor;
        ctx.fillRect(boxX, boxY, borderWidth, boxHeight);

        ctx.fillStyle = "#2c2f33";
        ctx.roundRect(
          boxX + borderWidth,
          boxY,
          boxWidth - borderWidth,
          boxHeight,
          borderRadius
        );
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Roboto";
        ctx.fillText(`Partida: ${gameNumber}`, boxX + 10, offsetY + 30);
        ctx.fillText(`Match ID: ${game.matchId}`, boxX + 10, offsetY + 60);
        ctx.fillText(
          `Campeón Elegido: ${game.charSelected}`,
          boxX + 10,
          offsetY + 90
        );
        ctx.fillText(`Posición: ${game.placement}`, boxX + 10, offsetY + 120);

        const iconPath = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${game.charSelected}.png`;
        const icon = await loadImage(iconPath);
        ctx.drawImage(icon, boxX + boxWidth - 60, boxY + 20, 50, 50);

        offsetY += boxHeight + 20;
        gameNumber++;
      }

      const canvasImg = await canvas.toBuffer();
      const attachment = new AttachmentBuilder(canvasImg, {
        name: "player-info.png",
      });

      const embed = new EmbedBuilder()
        .setColor("#00B0F6")
        .setAuthor({
          name: `${userInfo.riotName} - Lvl:  ${summonerLevel}`,
          iconURL: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${avatarId}.png`,
          url: `https://www.op.gg/summoners/las/${userInfo.riotName}-${userInfo.riotTag}`,
        })
        .setTitle(`Información de las partidas de ${discordTag}: `)
        .setImage("attachment://player-info.png");

      await interaction.reply({
        embeds: [embed],
        files: [attachment],
      });
    } else {
      interaction.reply("No se encontró ningún match para el usuario.");
    }
  } catch (error) {
    console.error("Error:", error);
    interaction.reply("Ocurrió un error al procesar la solicitud.");
  }
}
