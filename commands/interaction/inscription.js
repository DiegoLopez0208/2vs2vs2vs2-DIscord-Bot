import pkg from "discord.js";
const { SlashCommandBuilder } = pkg;
import { UserSchema } from "../../Schemas/userSchema.js";
import axios from "axios";
import "../../config/dotenv.js";

export const data = new SlashCommandBuilder()
  .setName("inscription")
  .setDescription("Inscribete en el evento!")
  .addStringOption((option) =>
    option.setName("nombreriot").setDescription("El nombre de tu cuenta Riot")
  )
  .addStringOption((option) =>
    option.setName("tag").setDescription("El tag de tu cuenta Riot")
  );

export async function execute(interaction) {
  const gameName = interaction.options.getString("nombreriot");
  const tag = interaction.options.getString("tag");
  let errorResponse = false;

  if (!gameName) {
    return interaction.reply({
      content: "¡Por favor, ingresa el nombre de tu Riot ID!",
      ephemeral: true,
    });
  }
  if (!tag) {
    return interaction.reply({
      content: "¡Por favor, ingresa el tag de tu Riot ID!",
      ephemeral: true,
    });
  }

  let user = await UserSchema.findOne({
    discordTag: interaction.user.username,
  });
  if (user) {
    return interaction.reply({
      content: "Ya estas inscripto al evento!",
      ephemeral: true,
    });
  }

  const response = await axios
    .get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}?api_key=${process.env.RIOT_KEY}`
    )
    .catch(() => {
      errorResponse = true;
      return interaction.reply({
        content: "No se pudo encontrar una cuenta de riot con esos valores!",
        ephemeral: true,
      });
    });

  if (!errorResponse) {
    const { data } = response;
    user = new UserSchema({
      riotName: data.gameName,
      riotTag: data.tagLine,
      discordTag: interaction.user.username,
      discordId: interaction.user.id,
      discordAvatarId: interaction.user.avatar,
    });

    await user.save();
    console.log(user);
    await interaction.reply({
      content: `${interaction.user} sido inscripto correctamente!`,
    });
  }
}
