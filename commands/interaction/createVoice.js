import pkg from "discord.js";
const { SlashCommandBuilder, ChannelType } = pkg;
import "../../config/dotenv.js";

const requiredUsers = 2;
let currentUsers = 0;

export const data = new SlashCommandBuilder()
  .setName("init-game")
  .setDescription("Empieza la partida!");

export async function execute(interaction) {
  try {
    console.log("Ejecutando el comando init-game...");

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

    interaction.client.on("voiceStateUpdate", (oldState, newState) => {
      handleVoiceStateUpdate(mainChannel, oldState, newState);
    });

    console.log("Iteración de miembros completa.");

    const teamCategory = await interaction.guild.channels.create({
      name: "Equipos",
      type: ChannelType.GuildCategory,
    });

    if (currentUsers === requiredUsers) {
      for (let i = 1; i <= 2; i++) {
        await interaction.guild.channels.create({
          name: `Canal ${i}`,
          type: ChannelType.GuildVoice,
          parent: teamCategory.id,
        });
        console.log(`Canal ${i} creado.`);
      }

      await mainChannel.delete();
      console.log("Canal principal eliminado.");
    }

    interaction.reply("Canal principal creado.");
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
