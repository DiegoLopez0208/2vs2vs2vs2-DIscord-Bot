import { SlashCommandBuilder } from "discord.js";
import { MatchSchema } from "../../Schemas/matchSchema.js";
import { UserSchema } from "../../Schemas/userSchema.js";

export const data = new SlashCommandBuilder()
  .setName("player-info")
  .setDescription("Muestra informacion del jugador:");

export async function execute(interaction) {
  try {
    console.log (interaction.user.username)
    await interaction.channel.send({
      content: "Muestra la información del jugador:",
    });

    const discordTag = interaction.user.username;
    const userInfo = await UserSchema.findOne({ discordTag });
    console.log ("Información del usuario:", userInfo);
    

    if (!userInfo) {
      return interaction.reply("No se encontró información para el usuario.");
    }

    const puuid = userInfo.puuid;

    const matchInfo = await MatchSchema.findOne({ puuid });

    if (matchInfo) {
      console.log("Información del Match:", matchInfo);
    } else {
      interaction.reply("No se encontró ningún match para el usuario.");
    }
  } catch (error) {
    console.error("Error:", error);
    interaction.reply("Ocurrió un error al procesar la solicitud.");
  }
}
