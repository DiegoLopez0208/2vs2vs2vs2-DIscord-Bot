import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import { ClashSchema } from "../../Schemas/clashSchema.js";
import isFinished from "./finish.js";

dotenv.config();
let i = 1;
let primera = true;

export const data = new SlashCommandBuilder()
  .setName("next-match")
  .setDescription("Comando para mostrar la siguiente partida!");

export async function execute(interaction) {
  if (primera || isFinished()) {
    const clash = await ClashSchema.findOneAndUpdate({ played: false }, { played: true, });
    console.log(clash);

    if (!clash) {
      interaction.reply({ content: `No hay mas partidos por jugar!` });
      await ClashSchema.deleteMany({ played: true });
      i = 1;
      return;
    }

    const embed = new EmbedBuilder({
      "title": `Partida ${i}`,
      "url": `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      "color": 0x00FFFF,
      "fields": [
        {
          "name": `Juegan:`,
          "value": `"${clash.plays[0]}" | "${clash.plays[1]}\n${clash.plays[2]}" | "${clash.plays[3]}"`
        },
        {
          "name": `Descansa:`,
          "value": `"${clash.rest}"`
        }
      ],
      "thumbnail": {
        "url": `https://c.tenor.com/Jc9jT66AJRwAAAAd/tenor.gif`,
        "height": 0,
        "width": 0
      },
      "author": { 
        "name": "2V2 BOT", 
        "url": "https://www.youtube.com/watch?v=iSbLHrrqmoM", 
        "icon_url": "https://cdn.discordapp.com/app-icons/1179933147710902422/90ff856fffcdb8ee9eb4d3e3530fafc3.png" 
      },
      "timestamp": new Date(),
    })
    i++;
    primera = false;
    interaction.reply({ embeds: [embed] });
  } 
  else {
    interaction.reply({ content: `Tienes que esperar a que haya terminado el partido para usar este comando!`, ephemeral: true});
    return;
  }
  
  
}