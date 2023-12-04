/* eslint-disable no-undef */
import pkg from 'discord.js';
import fs from 'fs';
const { SlashCommandBuilder } = pkg;
import '../../config/dotenv.js';
import { TeamSchema } from '../../Schemas/teamSchema.js';

export const data = new SlashCommandBuilder()
    .setName('sort')
    .setDescription('Comando para crear los enfrentamientos');

export async function execute(interaction) {
    const teams = await TeamSchema.find();
    const teamsLength = teams.length;

    const clashes = createClashes(teamsLength, teams);
    const jsonString = JSON.stringify(clashes);

    fs.writeFileSync('clashes.json', jsonString);

    await interaction.reply({ content: 'Listo!', ephemeral: true });
}

const randomizeArray = (array, orgArray) => {
    for (let i = 0; i < array.length; i++) {
        const index = Math.floor(Math.random() * (i + 1));

        [array[i], array[index]] = [array[index], array[i]];
    }

    orgArray.forEach((element) => {
        if (orgArray == element) {
            return true;
        }
    });

    return false;
};

const createClashes = (teamsLength, teams) => {
    var clashes = [];
    var actualClash = {
        rest: '',
        plays: [],
    };

    if (teamsLength % 4 == 0) {
        actualClash.rest = null;
        for (let i = 0; i < 4; i++) {
            let status = randomizeArray(teams, actualClash);
            while (status) {
                status = randomizeArray(teams, actualClash);
            }
            teams.forEach((team) => {
                actualClash.plays.push(team.name);
            });
        }
    } else if (teamsLength % 4 == 1) {
        for (let i = teamsLength - 1; i >= 0; i--) {
            actualClash = { rest: '', plays: [] };

            actualClash.rest = teams[i].name;
            for (let j = 0; j < teamsLength; j++) {
                if (i != j) {
                    actualClash.plays.push(teams[j].name);
                }
            }

            clashes.push(actualClash);
        }
    } else {
    }

    return clashes;
};
