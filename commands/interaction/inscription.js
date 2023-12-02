/* eslint-disable no-undef */
import pkg from 'discord.js';
const { SlashCommandBuilder } = pkg;
import { UserSchema } from '../../Schemas/userSchema.js';
import axios from 'axios';
import "../../config/dotenv.js";



export const data = new SlashCommandBuilder()
  .setName('inscription')
  .setDescription('XD')
  .addStringOption(option => option.setName('nombreriot').setDescription('El nombre de tu cuenta Riot'))
  .addStringOption(option => option.setName('tag').setDescription('El tag de tu cuenta Riot'));

export async function execute(interaction) {
  const gameName = interaction.options.getString('nombreriot');
  const tag = interaction.options.getString('tag');
  
  if (!gameName) {


    return interaction.reply('¡Por favor, menciona a un usuario válido!');
  }
  if (!tag) {
    return interaction.reply('Por favor, ingresa un mensaje para mostrar en el embed.');
  }

  const { data } = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}?api_key=${process.env.RIOT_KEY}`);
  console.log(data);
  console.log(interaction.user);

  const nuevoUser = new UserSchema({puuid: data.puuid, discordTag: interaction.user.username});
  

  nuevoUser.save();
}