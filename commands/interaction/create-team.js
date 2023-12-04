import pkg from 'discord.js';
const { SlashCommandBuilder } = pkg;
import { TeamSchema } from '../../Schemas/teamSchema.js'
import { UserSchema } from '../../Schemas/userSchema.js';
import "../../config/dotenv.js";

export const data = new SlashCommandBuilder()
  .setName('equipo')
  .setDescription('Crear equipo!')
  .addUserOption(option => option.setName('integrante1').setDescription('Tu usuario'))
  .addUserOption(option => option.setName('integrante2').setDescription('El usuario de tu compañero'))
  .addStringOption(option => option.setName('nombre_equipo').setDescription('El nombre de su equipo!'));


export async function execute(interaction) {
  const integrante1 = interaction.options.getUser('integrante1');
  const integrante2 = interaction.options.getUser('integrante2');
  const name = interaction.options.getString('nombre_equipo');
/*
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
*/

  const user1 = await UserSchema.findOne({discordTag: integrante1.username});
  const user2 = await UserSchema.findOne({discordTag: integrante2.username});
/*
  if(!user1) {
    return interaction.reply({content: '❌ No estas inscripto en el evento! usa /inscription para inscribirte!', ephemeral: true });
  }
  if(!user2) {
    return interaction.reply({content: `❌ El usuario ${integrante2} no esta inscripto al evento! que utilice el comando /inscription para estarlo!`, ephemeral: true});
  }

  const groups = await TeamSchema.find();

  const user1IsInGroup = groups.some(group =>
    user1._id.equals(group.memberid1) || user1._id.equals(group.memberid2)
  );
  
  const user2IsInGroup = groups.some(group =>
    user2._id.equals(group.memberid1) || user2._id.equals(group.memberid2)
  );
  
  if (user1IsInGroup || user2IsInGroup) {
    return interaction.reply({ content: `❌ Uno de los usuarios ya está inscrito en un equipo.`, ephemeral: true });
  }
*/
  const newTeam = new TeamSchema({
    name,
    memberid1: user1,
    memberid2: user2,
    icon: '',
    points: 0
  })

  await newTeam.save();
  interaction.reply({ content: `El equipo "${name}" fue inscripto correctamente!`, ephemeral: true});
}