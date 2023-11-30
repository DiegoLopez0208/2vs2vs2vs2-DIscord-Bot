import { REST } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { clientId, guildId, token } from "./config.json";
import fs from "fs/promises";
import path from "path";

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");

try {
  const commandFolders = await fs.readdir(foldersPath);

  for (const folder of commandFolders) {
  
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter((file) =>
      file.endsWith(".js")
    );
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { data } = await import(filePath);
      commands.push(data.toJSON());
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST({ version: "10" }).setToken(token);

  // and deploy your commands!
  console.log(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error);
}
