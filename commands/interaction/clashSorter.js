/* eslint-disable no-undef */
import pkg from "discord.js";
import fs from "fs";
const { SlashCommandBuilder } = pkg;
import "../../config/dotenv.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";
import createClashes from "../../functions/createClashes.js";

export const data = new SlashCommandBuilder()
  .setName("sort")
  .setDescription("Comando para crear los enfrentamientos");

export async function execute(interaction) {
  const teams = await TeamSchema.find();

  const clashes = createClashes(teams.length, teams);

  const jsonString = JSON.stringify(clashes);
  fs.writeFileSync("clashes.json", jsonString);

  await interaction.reply({ content: "Listo!", ephemeral: true });
}
