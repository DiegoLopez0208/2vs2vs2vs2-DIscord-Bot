const { EmbedBuilder, SlashCommandBuilder } = pkg;
import axios from "axios";
import pkg from "discord.js";
import { MatchSchema } from "../../Schemas/matchSchema.js";
import { UserSchema } from "../../Schemas/userSchema.js";

export const data = new SlashCommandBuilder()
  .setName("player-info")
  .setDescription("Muestra información del jugador:");

export async function execute(interaction) {
  try {
    await interaction.reply({
      content: "Muestra la información del jugador:",
    });

    const discordTag = interaction.user.username;
    console.log(discordTag);

    const matchInfo = await MatchSchema.find({ discordTag });
    const userInfo = await UserSchema.findOne({ discordTag });

    const getAvatarId = await axios.get(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userInfo.riotName}?api_key=${process.env.RIOT_KEY}`
    );

    const avatarId = getAvatarId.data.profileIconId
    const summonerLevel = getAvatarId.data.summonerLevel
    const version = "13.24.1"


    if (matchInfo && matchInfo.length > 0) {

      const embed = new EmbedBuilder()
        .setColor("#317702")
        .setAuthor({ name: `${userInfo.riotName} - Lvl:  ${summonerLevel}`, iconURL:`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${avatarId}.png` , url: `https://www.op.gg/summoners/las/${userInfo.riotName}-${userInfo.riotTag}` })
        .setTitle(`Información de partidas de ${discordTag}`)
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/${userInfo.discordId}/${userInfo.discordAvatarId}`
        )
        .setTimestamp();


      matchInfo.forEach((game, index) => {
        embed.addFields(
          { name: '\u200B', value: '\u200B' },
          {
          name: `Partida: ${index + 1}`,
          value: `**Match ID:** ${game.matchId}\n**Campeon Elegido:** ${game.charSelected}\n**Posicion:** ${game.placement}`,
          inline: true,
        });
      });


      interaction.followUp({ embeds: [embed] });
    } else {
      interaction.followUp("No se encontró ningún match para el usuario.");
    }
  } catch (error) {
    console.error("Error:", error);
    interaction.followUp("Ocurrió un error al procesar la solicitud.");
  }
}
