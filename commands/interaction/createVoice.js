import pkg from "discord.js";
const { SlashCommandBuilder, ChannelType } = pkg;
import { TeamSchema } from "../../Schemas/teamSchema.js";
import "../../config/dotenv.js";

let currentUsers = 0;

export const data = new SlashCommandBuilder()
  .setName("init-game")
  .setDescription("Empieza la partida!");

export async function execute(interaction) {
  try {
    console.log("Ejecutando el comando init-game...");
    const teams = await TeamSchema.find();
    console.log(teams);

    const mainCategory = await interaction.guild.channels.create({
      name: "General Voice",
      type: ChannelType.GuildCategory,
    });

    console.log("Categoría principal creada.");

    const mainChannel = await interaction.guild.channels.create({
      name: "Canal Principal",
      type: ChannelType.GuildVoice,
      parent: mainCategory.id,
    });

    interaction.client.on("voiceStateUpdate", async (oldState, newState) => {
      handleVoiceStateUpdate(mainChannel, oldState, newState);

      if(currentUsers == teams.length * 2)
      {
        const teamsCategory = await interaction.guild.channels.create({
          name: "Equipos",
          type: ChannelType.GuildCategory,
        });

        teams.forEach(async team => {
          await interaction.guild.channels.create({
            name: `${team.name}`,
            type: ChannelType.GuildVoice,
            parent: teamsCategory.id,
          });
        })
      }
    });




  } catch (error) {
    console.error("Error en execute:", error);
    interaction.reply("Hubo un error al ejecutar el comando.");
  }
}

function handleVoiceStateUpdate(mainChannel, oldState, newState) {
  if (newState.channel && newState.channel === mainChannel) {
    currentUsers++;
    console.log(
      `Usuario ${newState.member.user.tag} se unió a ${mainChannel.name}. Actualmente hay ${currentUsers} usuario/s.`
    );
  } else if (oldState.channel && oldState.channel === mainChannel) {
    currentUsers--;
    console.log(
      `Usuario ${oldState.member.user.tag} salió de ${mainChannel.name}. Actualmente hay ${currentUsers} usuario/s.`
    );
  }
}
