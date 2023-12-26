import axios from "axios";
import pkg from "discord.js";
const { SlashCommandBuilder } = pkg;
import { UserSchema } from "../../Schemas/userSchema.js";
import { MatchSchema } from "../../Schemas/matchSchema.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";
import getTeams from "../../functions/getTeams.js";
import assignPoints from "../../functions/assignPoints.js";

var finish = false;

export const data = new SlashCommandBuilder()
  .setName("finish")
  .setDescription("Empieza el conteo de ✅.");

export async function execute(interaction) {
  let teams = getTeams();
  try {
    const message = await interaction.channel.send({
      content: "Conteo de ✅ (Máximo 8): ",
      fetchReply: true,
    });

    const filterReaction = (reaction, user) => {
      return reaction.emoji.name === "✅" && !user.bot;
    };

    const maxReactions = 1;
    let reactionCount = 0;

    const collector = message.createReactionCollector({
      filter: filterReaction,
      time: 60000,
      max: maxReactions,
      errors: ["time"],
    });

    collector.on("collect", async (_reaction, user) => {
      try {
        console.log(`⭕ ${user.username} reaccionó con ✅`);

        reactionCount++;
        console.log(`⭕ Número actual de reacciones: ${reactionCount}`);

        const discordTag = user.username;
        const userInfo = await UserSchema.findOne({ discordTag });

        if (!userInfo) {
          interaction.reply(
            `❌ No se encontró información del usuario ${interaction.user.username}.`
          );
          return;
        }

        const { riotName, riotTag } = userInfo;

        const getPuuid = await axios.get(
          `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotName}/${riotTag}?api_key=${process.env.RIOT_KEY}`
        );

        const { data: riotData } = getPuuid;

        const getMatchId = await axios.get(
          `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${riotData.puuid}/ids?count=1&api_key=${process.env.RIOT_KEY}`
        );

        const lastMatchId = getMatchId.data[0];

        if (!lastMatchId) {
          interaction.reply(
            `❌ No se encontró información de la última partida para ${user.tag}.`
          );
          return;
        }

        const matchInfo = await axios.get(
          `https://americas.api.riotgames.com/lol/match/v5/matches/${lastMatchId}?api_key=${process.env.RIOT_KEY}`
        );

        const participants = matchInfo.data.info.participants;
        const participant = participants.find(
          (p) => p.puuid === riotData.puuid
        );

        if (!participant) {
          interaction.reply(
            `❌ No se encontró información del participante en la última partida para ${user.tag}.`
          );
          return;
        }

        const placement = participant.placement;
        const championPick = participant.championName;

        new MatchSchema({
          discordTag: user.username,
          matchId: lastMatchId,
          placement: placement,
          charSelected: championPick,
        }).save();

        const { username: memberName1, username: memberName2 } = user;

        const userTeam = await TeamSchema.findOne({
          $or: [{ memberName1 }, { memberName2 }],
        });
        console.log(userTeam);
        (await teams).forEach(async (team) => {
          console.log("placement:", placement);
          console.log(
            team.name,
            userTeam.name,
            team.name == userTeam.name,
            !team.updated
          );
          if (team.name == userTeam.name && !team.updated) {
            console.log(
              "team:",
              team.name,
              "sumando",
              assignPoints(placement),
              "puntos"
            );
            await TeamSchema.updateOne(
              { name: team.name },
              { $inc: { points: assignPoints(placement) } }
            );
            team.updated = true;
          }
        });

        console.log(`⭕ Información recopilada para ${user.tag}.`);
      } catch (error) {
        console.error(
          `❌ Error al procesar información para ${user.tag}:`,
          error
        );
      }
    });
    await message.react("✅");
    collector.on("end", async () => {
      if (reactionCount > 0) {
        console.log(`⭕️ Se obtuvieron ${reactionCount} reacciones.`);
        interaction.channel.send({
          content: "Reacciones terminadas",
        });
        finish = true;
      } else {
        interaction.channel.send(
          "No se obtuvo la cantidad requerida de reacciones."
        );
      }
    });
  } catch (error) {
    console.error("Error:", error);
    interaction.reply("❌ Hubo un error al ejecutar el comando.");
  }
}

const isFinished = () => {
  return finish;
}

export default isFinished;