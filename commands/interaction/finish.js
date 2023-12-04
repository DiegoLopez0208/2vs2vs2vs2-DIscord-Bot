/* eslint-disable no-undef */
import axios from "axios";
import pkg from "discord.js";
const { SlashCommandBuilder } = pkg;
import { UserSchema } from "../../Schemas/userSchema.js";
import { MatchSchema } from "../../Schemas/matchSchema.js";



export const data = new SlashCommandBuilder()
  .setName("finish")
  .setDescription("Empieza el conteo de ✅.");

export async function execute(interaction) {
  try {
    // Cambiar interaction.reply por message.send
    const message = await interaction.channel.send({
      content: "Conteo de ✅(Maximo 8): ",
      fetchReply: true,
    });

    const filterReaction = (reaction , user) => {
      return reaction.emoji.name === "✅" && !user.bot
    };
    const collector = message.createReactionCollector({
      filter: filterReaction,
      time: 60000, // 60 segundos de tiempo de espera
      errors: ["time"],
      max: 1 // Maximo a poder escribir
    });

    collector.on("collect", (_reaction, user) => {
      console.log(`${user.tag} reaccionó con ✅`);
    });

    collector.on("end", (collected) => {
      console.log(`Se obtuvieron ${collected.size} reacciones.`);
      if (collected.size >= 1) {
        console.log (collected.size)
      } else {
        interaction.channel.send(
          `No se obtuvo la cantidad requerida de reacciones.`
        );
      }
    });

    await message.react("✅");
    let lastMatchId;
    let placement;

    const discordTag = interaction.user.username;
    const userInfo = await UserSchema.findOne({ discordTag });
    const riotName = userInfo.riotName
    const riotTag = userInfo.riotTag
    console.log (riotName, riotTag)

    const getPuuid = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotName}/${riotTag}?api_key=${process.env.RIOT_KEY}`)
    console.log (getPuuid)
    const { data } = getPuuid
    console.log ("This data:", data.puuid)
    const getMatchId = await axios.get(
      `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${data.puuid}/ids?count=1&api_key=${process.env.RIOT_KEY}`
    );
    
    if (getMatchId.data && getMatchId.data.length > 0) {
      lastMatchId = getMatchId.data[0];
    } else {
      return null;
    }
console.log (lastMatchId)
    const MatchInfo = await axios.get(
      `https://americas.api.riotgames.com/tft/match/v1/matches/${lastMatchId}?api_key=${process.env.RIOT_KEY}`
    );

    const matchDetails = MatchInfo.data;

    const participants = matchDetails.info.participants;
    participants.forEach((participant) => {
      if (data.puuid == participant.puuid) {
        placement = participant.placement;
        // championPick = participant.champion
        // championBan = participant.ban
      }
    });

    new MatchSchema({
      discordTag: interaction.user.username,
      puuid: userInfo.puuid,
      matchId: lastMatchId,
      placement: placement,
    }).save();
    console.log("Placement:", placement);
  } catch (error) {
    console.error("Error:", error);
  }
}
