import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = new SlashCommandBuilder()
  .setName("next-match")
  .setDescription("Comando para mostrar la siguiente partida!");

export async function execute(interaction) {
  try {
    const currentModuleURL = new URL(import.meta.url);
    const currentModulePath = path.dirname(currentModuleURL.pathname);
    const jsonFilePath = path.join(currentModulePath, "../../clashes.json");
    const jsonFileURL = `file:${jsonFilePath}`;

    console.log(jsonFileURL)

    const res = await fetch(jsonFileURL);
    const clashes = await res.json();

    console.log(clashes);

  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    interaction.reply({
      content: "Ocurrió un error al cargar el archivo JSON.",
      ephemeral: true,
    });
  }

  interaction.reply({ content: `anashei`, ephemeral: true });
}