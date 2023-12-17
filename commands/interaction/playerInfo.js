import pkg from 'discord.js';

const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = pkg;
import axios from 'axios';
import { MatchSchema } from '../../Schemas/matchSchema.js';
import { UserSchema } from '../../Schemas/userSchema.js';
import { createCanvas, loadImage, registerFont } from 'canvas';

// Asegúrate de tener la fuente Arial.ttf en tu proyecto
registerFont("fonts/Roboto-Bold.ttf", { family: "Roboto" });

export const data = new SlashCommandBuilder()
  .setName('player-info')
  .setDescription('Muestra información del equipo:');

export async function execute(interaction) {
  try {
    await interaction.reply({ content: "Informacion del jugador:"});
    const discordTag = interaction.user.username;
    console.log(discordTag);

    const matchInfo = await MatchSchema.find({ discordTag });
    const userInfo = await UserSchema.findOne({ discordTag });

    const getAvatarId = await axios.get(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userInfo.riotName}?api_key=${process.env.RIOT_KEY}`
    );

    const avatarId = getAvatarId.data.profileIconId;
    const summonerLevel = getAvatarId.data.summonerLevel;
    const version = '13.24.1';

    if (matchInfo && matchInfo.length > 0) {
      // Crear el canvas y dibujar en él
      const canvas = createCanvas(600, 520);
      const ctx = canvas.getContext('2d');

      // Establecer estilos
      ctx.fillStyle = '#36393e'; // Color hexadecimal del fondo
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white'; // Color del texto
      ctx.font = '16px Roboto';

      let offsetY = 20;
      let gameNumber = 1;
      for (const game of matchInfo) {
        // Dibujar recuadro alrededor de cada partida
        const boxWidth = 560;
        const boxHeight = 160;
        const boxX = 20;
        const boxY = offsetY;
        const borderWidth = 5;
        const borderColor = '#00B0F6';

        ctx.fillStyle = borderColor;
        ctx.fillRect(boxX, boxY, borderWidth, boxHeight); // Borde izquierdo

        ctx.fillStyle = '#2c2f33'; // Color de fondo del recuadro
        ctx.fillRect(boxX + borderWidth, boxY, boxWidth - borderWidth, boxHeight);

        // Dibujar información de la partida dentro del recuadro
        ctx.fillStyle = 'white'; // Restablecer el color del texto
        ctx.fillText(`Partida: ${gameNumber}`, boxX + 10, offsetY + 30);
        ctx.fillText(`Match ID: ${game.matchId}`, boxX + 10, offsetY + 60);
        ctx.fillText(
          `Campeón Elegido: ${game.charSelected}`,
          boxX + 10,
          offsetY + 90
        );
        ctx.fillText(`Posición: ${game.placement}`, boxX + 10, offsetY + 120);
        // Dibujar el icono del campeón
        const iconPath = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${game.charSelected}.png`;
        const icon =  await loadImage(iconPath);
        ctx.drawImage(icon, boxX + boxWidth - 60, boxY + 20, 50, 50);

        offsetY += boxHeight + 20; // Ajusta según sea necesario
        gameNumber++;
      }
     const canvasImg = await canvas.toBuffer()
      const attachment =  new AttachmentBuilder(canvasImg, { name: 'player-info.png' })

      const embed = new EmbedBuilder()
        .setColor("#00B0F6")
        .setAuthor({ name: `${userInfo.riotName} - Lvl:  ${summonerLevel}`, iconURL:`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${avatarId}.png` , url: `https://www.op.gg/summoners/las/${userInfo.riotName}-${userInfo.riotTag}` })
        .setTitle(`Información de las partidas de ${discordTag}: `)
        .setImage('attachment://player-info.png'); // Cambiado aquí para referenciar directamente al archivo adjunto
      
      // Enviar el embed con la imagen del canvas directamente en el mensaje
      await interaction.followUp({
        embeds: [embed],
        files: [attachment],
      });
    } else {
      interaction.followUp('No se encontró ningún match para el usuario.');
    }
  } catch (error) {
    console.error('Error:', error);
    interaction.followUp(
      'Ocurrió un error al procesar la solicitud.'
    );
  }
}

