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

 export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
  ],
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
          `[ADVERTENCIA] El comando en ${filePath} está falta de una propiedad "data" o "execute" requerida.`
        );
      }
    }
  }

  client.once("ready", () => {
    console.log("[✅] El bot de Discord ha sido inicializado!");
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
            "[❌] Hubo un error al ejecutar este comando. Por favor, inténtalo de nuevo.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "[❌] Hubo un error al ejecutar este comando. Por favor, inténtalo de nuevo.",
          ephemeral: true,
        });
      }
    }
  });

  await client.login(token);
} catch (error) {
  console.error(error);
}
