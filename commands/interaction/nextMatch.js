import { SlashCommandBuilder } from "discord.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile } from "fs/promises";

dotenv.config();

// Obtén la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const data = new SlashCommandBuilder()
  .setName("next-match")
  .setDescription("Comando para mostrar la siguiente partida!");

export async function execute(interaction) {
  try {
    const jsonFilePath = path.join(__dirname, "/../../clashes.json");
    const fileContent = await readFile(jsonFilePath, "utf-8");
    const clashes = JSON.parse(fileContent);

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
