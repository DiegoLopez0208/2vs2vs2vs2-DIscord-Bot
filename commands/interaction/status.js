import pkg from 'discord.js';
const { SlashCommandBuilder } = pkg;
import axios from 'axios';
import "../../config/dotenv.js";

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Comando para verificar estado de la RIOT API.')

export async function execute(interaction) {
  const admin_id_1 = "351907503384166401";
  const admin_id_2 = "281561896841248769";
  
  if (interaction.user.id != admin_id_1 && interaction.user.id != admin_id_2)
  {
    return interaction.reply({content: 'Este comando es solo para admins!', ephemeral: true});
  }

  const {data} = await axios.get(`https://la2.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${process.env.RIOT_KEY}`);

  interaction.reply({content: `${data.freeChampionIds}`, ephemeral: true})
}