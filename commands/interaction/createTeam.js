import pkg from 'discord.js';
const { SlashCommandBuilder } = pkg;
import { UserSchema } from '../../Schemas/userSchema.js';
import "../../config/dotenv.js";
import { TeamSchema } from '../../Schemas/teamSchema.js';

export const data = new SlashCommandBuilder()
  .setName('equipo')
  .setDescription('Crear equipo!')
  .addUserOption(option => option.setName('integrante1').setDescription('Tu usuario'))
  .addUserOption(option => option.setName('integrante2').setDescription('El usuario de tu compañero'))
  .addStringOption(option => option.setName('nombre_equipo').setDescription('El nombre de su equipo!'))
  .addStringOption(option => option.setName('imagen_equipo').setDescription('Una foto de su equipo!'));


export async function execute(interaction) {
  const integrante1 = interaction.options.getUser('integrante1');
  const integrante2 = interaction.options.getUser('integrante2');
  const name = interaction.options.getString('nombre_equipo');
  const img = interaction.options.getString('imagen_equipo');

  if (integrante1.username != interaction.user.username) {
    return interaction.reply({ content: '¡Tu tienes que ser el primer usuario!', ephemeral: true});
  }
  if (integrante1.username == integrante2.username){
    return interaction.reply({ content: 'No puedes usar el mismo usuario 2 veces!', ephemeral: true});
  }
  if (!integrante2) {
    return interaction.reply({ content: 'Por favor, ingresa un usuario valido!', ephemeral: true});
  }
  if (!name) {
    return interaction.reply({ content: 'Ingrese un nombre del equipo!', ephemeral: true});
  }

  const user1 = await UserSchema.findOne({discordTag: integrante1.username});
  const user2 = await UserSchema.findOne({discordTag: integrante2.username});
/*
  if(!user1) {
    return interaction.reply({content: '❌ No estas inscripto en el evento! usa /inscription para inscribirte!', ephemeral: true });
  }
  if(!user2) {
    return interaction.reply({content: `❌ El usuario ${integrante2} no esta inscripto al evento! que utilice el comando /inscription para estarlo!`, ephemeral: true});
  }
  if(user1.teamName || user2.teamName)
  {
    return interaction.reply({content: '❌ Uno de los usuarios ya se encuentra en un equipo!', ephemeral: true });
  }
*/
  await UserSchema.updateOne({discordTag: integrante1.username}, { teamName: name });
  await UserSchema.updateOne({discordTag: integrante2.username}, { teamName: name });

  const team = new TeamSchema({name: name, memberid1: user1.discordTag, memberid2: user2.discordTag, img: img});

  team.save();

  const test = await TeamSchema.find();
  console.log(test);

  interaction.reply({ content: `El equipo "${name}" fue inscripto correctamente!`, ephemeral: true});
}
