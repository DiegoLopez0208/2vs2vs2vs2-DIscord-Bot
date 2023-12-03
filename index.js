/* eslint-disable no-undef */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { URL } from "url";
import pkg from "discord.js";
const { Client, Collection, GatewayIntentBits, Partials } = pkg;
import "./config/dotenv.js";
import "./mongoose/db.js";

const token = process.env.TOKEN;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Reaction],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");

try {
  const commandFolders = await fs.readdir(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const fileURL = new URL(`file://${filePath}`);
      const command = await import(fileURL);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  client.once("ready", () => {
    console.log("✅ The Discord Bot is Ready!");
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content:
            "❌ Hubo un error al ejecutar este comando. Por favor, inténtalo de nuevo.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "❌ Hubo un error al ejecutar este comando. Por favor, inténtalo de nuevo.",
          ephemeral: true,
        });
      }
    }
  });



  await client.login(token);
} catch (error) {
  console.error(error);
}
