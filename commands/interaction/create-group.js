import pkg from 'discord.js';
const { SlashCommandBuilder } = pkg;
import { GroupSchema } from '../../Schemas/groupSchema.js'
import { UserSchema } from '../../Schemas/userSchema.js';
import axios from 'axios';
import "../../config/dotenv.js";

export const data = new SlashCommandBuilder()
  .setName('grupo')
  .setDescription('Crear grupo!')
  .addUserOption(option => option.setName('integrante1').setDescription('Tu usuario'))
  .addUserOption(option => option.setName('integrante2').setDescription('El usuario de tu compañero'))
  .addStringOption(option => option.setName('nombre_grupo').setDescription('El nombre de su grupo!'));


export async function execute(interaction) {
  const integrante1 = interaction.options.getUser('integrante1');
  const integrante2 = interaction.options.getUser('integrante2');
  const nombreGrupo = interaction.options.getString('nombre_grupo');
  if (integrante1.username != interaction.user.username) {
    return interaction.reply({ content: '¡Tu tienes que ser el primer usuario!', ephemeral: true});
  }
  if (!integrante2) {
    return interaction.reply({ content: 'Por favor, ingresa un usuario valido!', ephemeral: true});
  }

  const user1 = await UserSchema.findOne({discordTag: integrante1.username});
  const user2 = await UserSchema.findOne({discordTag: integrante2.username});

  if(!user1) {
    return interaction.reply({content: '❌ No estas inscripto en el evento! usa /inscription para inscribirte!', ephemeral: true });
  }
  if(!user2) {
    return interaction.reply({content: `❌ El usuario ${integrante2} no esta inscripto al evento! que utilice el comando /inscription para estarlo!`, ephemeral: true});
  }
  /*
    faltaria que verifique que el usuario no este en un grupo ya pero no se como hacerlo xD
    tambien falta que verifique si el usuario no es tan pelotudo de ponerse 2 veces xD
  
    La verdad tendriamos que hacer una especia de archivo que sea como un handler de errores
    al que le pasemos unos codigos en especifico dependiendo la condicion xd
  */


  const newGroup = new GroupSchema({
    name: nombreGrupo,
    memberid1: user1,
    memberid2: user2,
    icon: '',
    points: 0
  })

  console.log(newGroup);

    

  interaction.reply({ content: '¡uwu!', ephemeral: true});
}