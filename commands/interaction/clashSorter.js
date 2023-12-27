import pkg from "discord.js";
const { SlashCommandBuilder } = pkg;
import "../../config/dotenv.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";
import createClashes from "../../functions/createClashes.js";
import { ClashSchema } from "../../Schemas/clashSchema.js";

export const data = new SlashCommandBuilder()
  .setName("sort")
  .setDescription("Comando para crear los enfrentamientos");

export async function execute(interaction) {
  // verificar uwu xd lol jaja salu2
  const teams = await TeamSchema.find();

  const clashes = createClashes(teams.length, teams);

  clashes.forEach(async clash => {
    const newClash = new ClashSchema({
      rest: clash.rest,
      plays: clash.plays,
    })
    await newClash.save();
  });

  await interaction.reply({ content: "Listo!", ephemeral: true });
}