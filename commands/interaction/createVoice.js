import pkg from "discord.js";
const { SlashCommandBuilder, ChannelType } = pkg;
import "../../config/dotenv.js";

const requiredUsers = 1;
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

    console.log("Canal principal creado.");

    interaction.guild.members.cache.forEach((member) => {
      if (member.voice.channel) {
        member.voice.setChannel(mainChannel);
        currentUsers++;
        console.log("ready");
        console.log(`Movido a ${member.user.tag} a ${mainChannel.name}`);
      }
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


    interaction.client.on("voiceStateUpdate", async (oldState, newState) => {
      if (
        newState.channel &&
        newState.channel.type === "GUILD_VOICE" &&
        newState.channel !== oldState.channel
      ) {

        await newState.member.voice.setChannel(mainChannel);
        console.log(
          `Movido a ${newState.member.user.tag} a ${mainChannel.name}`
        );
      }
    });
  } catch (error) {
    console.error("Error en execute:", error);
    interaction.reply("Hubo un error al ejecutar el comando.");
  }
}
