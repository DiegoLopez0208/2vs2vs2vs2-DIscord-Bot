import { MatchSchema } from "../../Schemas/matchSchema.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";
import { UserSchema } from "../../Schemas/userSchema.js";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("view-db")
  .setDescription("Provides information about the server.");

export async function execute(interaction) {
  try {
    // Consultar datos de MatchSchema
    const matches = await MatchSchema.find({});
    console.log("Datos de la base de datos para MatchSchema:");
    console.log(matches);

    // Consultar datos de TeamSchema
    const teams = await TeamSchema.find({});
    console.log("Datos de la base de datos para TeamSchema:");
    console.log(teams);

    // Consultar datos de UserSchema
    const users = await UserSchema.find({});
    console.log("Datos de la base de datos para UserSchema:");
    console.log(users);

    interaction.reply({
      content: "Consulta la consola para ver los datos.",
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error al buscar datos en la base de datos:", error);
    interaction.reply({
      content: "Hubo un error al buscar datos en la base de datos.",
      ephemeral: true,
    });
  }
}
