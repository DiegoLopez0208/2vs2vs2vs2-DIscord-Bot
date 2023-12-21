import pkg from "discord.js";
const { REST } = pkg;
import { Routes } from "discord-api-types/v10";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import "./config/dotenv.js";

const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;

const commands = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
      const { data } = await import(`file://${filePath}`);
      commands.push(data.toJSON());
    }
  }

  const rest = new REST({ version: "10" }).setToken(token);

  console.log(
    `[✅] Se inició la actualización de ${commands.length} comandos de la aplicación (/).`
  );

  const data = await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );

  console.log(
    `[✅] Se recargaron exitosamente ${data.length} comandos de la aplicación (/).`
  );
} catch (error) {
  console.error("❌", error);
}
