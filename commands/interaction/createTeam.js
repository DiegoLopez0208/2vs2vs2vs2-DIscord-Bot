import pkg from "discord.js";
const { SlashCommandBuilder  } = pkg;
import { UserSchema } from "../../Schemas/userSchema.js";
import "../../config/dotenv.js";
import { TeamSchema } from "../../Schemas/teamSchema.js";

export const data = new SlashCommandBuilder()
  .setName("create-team")
  .setDescription("Crear equipo!")
  .addUserOption((option) =>
    option.setName("integrante1").setDescription("Tu usuario")
  )
  .addUserOption((option) =>
    option.setName("integrante2").setDescription("El usuario de tu compañero")
  )
  .addStringOption((option) =>
    option.setName("nombre_equipo").setDescription("El nombre de su equipo!")
  )
  .addStringOption((option) =>
    option.setName("imagen_equipo").setDescription("Una foto de su equipo!")
  );
  function getRandomColor() {
  
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
  }
export async function execute(interaction) {
  const integrante1 = interaction.options.getUser("integrante1");
  const integrante2 = interaction.options.getUser("integrante2");
  const name = interaction.options.getString("nombre_equipo");
  const img = interaction.options.getString("imagen_equipo");

  const IMAGE_URL_REGEX = /\.(jpg|jpeg|png|webp)$/i;
  const MIN_TEAM_NAME_LENGTH = 3;
  const MAX_TEAM_NAME_LENGTH = 20;

  if (img && !IMAGE_URL_REGEX.test(img)) {
    return interaction.reply({
      content:
        "❌ El formato de la URL de la imagen no es válido. Asegúrate de que sea una imagen JPG, JPEG, PNG o WEBP.",
      ephemeral: true,
    });
  }

  if (
    !name ||
    name.length < MIN_TEAM_NAME_LENGTH ||
    name.length > MAX_TEAM_NAME_LENGTH
  ) {
    return interaction.reply({
      content: `❌ El nombre del equipo debe tener entre ${MIN_TEAM_NAME_LENGTH} y ${MAX_TEAM_NAME_LENGTH} caracteres.`,
      ephemeral: true,
    });
  }
  if (integrante1.username != interaction.user.username) {
    return interaction.reply({
      content: "¡Tu tienes que ser el primer usuario!",
      ephemeral: true,
    });
  }
  if (integrante1.username == integrante2.username) {
    return interaction.reply({
      content: "No puedes usar el mismo usuario 2 veces!",
      ephemeral: true,
    });
  }
  if (!integrante2) {
    return interaction.reply({
      content: "Por favor, ingresa un usuario valido!",
      ephemeral: true,
    });
  }
  if (!name) {
    return interaction.reply({
      content: "Ingrese un nombre del equipo!",
      ephemeral: true,
    });
  }

  const user1 = await UserSchema.findOne({ discordTag: integrante1.username });
  const user2 = await UserSchema.findOne({ discordTag: integrante2.username });

  await UserSchema.updateOne(
    { discordTag: integrante1.username },
    { teamName: name }
  );
  await UserSchema.updateOne(
    { discordTag: integrante2.username },
    { teamName: name }
  );


  try {
    const randomColor = getRandomColor();
    const role = await interaction.guild.roles.create({
      name: name,
      color: randomColor,
      hoist: true
    });

    // Asignar el rol a los miembros del equipo
    await interaction.guild.members.cache.get(integrante1.id).roles.add(role);
    await interaction.guild.members.cache.get(integrante2.id).roles.add(role);

    const team = new TeamSchema({
      name: name,
      memberName1: user1.discordTag,
      memberName2: user2.discordTag,
      img: img,
    });

    team.save();

    const test = await TeamSchema.find();
    console.log(test);

    interaction.reply({
      content: `El equipo "${name}" fue inscripto correctamente!`,
      ephemeral: true,
    });
  } catch (error) {
    console.error('Error al crear el rol:', error);
    return interaction.reply({
      content: '❌ Hubo un error al crear el rol. Por favor, contacta al administrador.',
      ephemeral: true,
    });
  }
}
