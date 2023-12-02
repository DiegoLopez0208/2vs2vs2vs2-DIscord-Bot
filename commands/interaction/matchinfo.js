/* eslint-disable no-undef */
import axios from "axios";
import "../../config/dotenv.js";
import pkg from "discord.js";
const { SlashCommandBuilder } = pkg;
import { UserSchema } from "../../Schemas/userSchema.js";

export const data = new SlashCommandBuilder()
  .setName("playerinfo")
  .setDescription("Provides information about the server.");

export async function execute(interaction) {
  try {
    const discordTag = "slothstormer";
    const userInfo = await UserSchema.findOne({ discordTag });
    let lastMatchId;

    const getMatchId = await axios.get(
      `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${userInfo.puuid}/ids?count=1&api_key=${process.env.RIOT_KEY}`
    );
    console.log(getMatchId);
    if (getMatchId.data && getMatchId.data.length > 0) {
      lastMatchId = getMatchId.data[0];
      console.log(lastMatchId);
    } else {
      return null;
    }
    const MatchInfo = await axios.get(
      `https://americas.api.riotgames.com/tft/match/v1/matches/${lastMatchId}?api_key=${process.env.RIOT_KEY}`
    );
    console.log(MatchInfo);
    const matchDetails = MatchInfo.data;

      const participants = matchDetails.info.participants;
      participants.forEach((participant) => {
        console.log("Puuid:", participant.puuid);
        console.log("Posición:", participant.placement);
      });


    if (userInfo) {
      console.log(userInfo);

      await interaction.reply(
        `This user has puuid ${userInfo.puuid} and discordTag ${userInfo.discordTag} and your position  ${participants[0].placement}.`
      );
    } else {
      await interaction.reply(
        "No user found with the provided puuid and discordTag."
      );
    }
  } catch (err) {
    console.error("Error al recuperar usuarios:", err);
    await interaction.reply("Error al recuperar información del servidor.");
  }
}
